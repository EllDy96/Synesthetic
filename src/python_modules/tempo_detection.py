###############################################
############## LIBRARY IMPORT #################
###############################################

import numpy as np
import scipy as sp
import random
import librosa
import os
import matplotlib.pyplot as plt
import sys
from scipy import signal
from skimage.feature import peak_local_max
from scipy.signal import find_peaks
import IPython.display as ipd
import json

###############################################
############# HELPER FUNCTIONS ################
###############################################

## Complex Novelty Function
def warp(x, low, interval):
    return np.remainder(x - low, interval) + low

def princarg(x):
    return warp(x, -np.pi, 2*np.pi)

def compute_novelty_complex(x, Fs, N=512, H=256): 
    X = librosa.stft(x, n_fft=N, hop_length=H, win_length=N, window='hanning')
    Fs_feature = Fs/H
    mag = np.abs(X)
    
    phase = np.angle(X)/(2*np.pi)
    
    unwr_phase = np.zeros_like(X, dtype=float);
    for i in np.arange(X.shape[1]):
        unwr_phase[:,i] = np.unwrap( np.angle(X[:,i]) )
    
    phase_shift = unwr_phase[:,2:] - 2*unwr_phase[:,1:-1] + unwr_phase[:,0:-2]
    phase_shift = princarg(phase_shift)    
    
    
    amp_pred = mag[:,1:-1]
    amp_true = mag[:,2:]
    
    novelty_complex = (amp_pred**2 + amp_true**2 - 2 * amp_pred * amp_true * np.cos(phase_shift))
    
    # Half wave rectification
    novelty_complex[novelty_complex<0]=0
    
    novelty_complex = np.sqrt(novelty_complex)
    
    novelty_complex = np.sum(novelty_complex, axis=0)
    novelty_complex = np.concatenate((novelty_complex, np.array([0, 0])))

    # Normalization
    max_value = max(novelty_complex)
    if max_value > 0:
      novelty_complex = novelty_complex / max_value

    return novelty_complex, Fs_feature

## Smoothing function with normalized output
def smooth(x, win_length=3, win_type='boxcar'):
    if x.ndim != 1:
        raise ValueError('smooth only accepts 1 dimension arrays.')

    if x.size < win_length:
        raise ValueError('Input vector needs to be bigger than window size.')

    if win_length<3:
        return x

    # mirror pad
    s = np.pad(x, int(win_length/2), mode='reflect')    
    # create window
    w = sp.signal.windows.get_window(win_type, win_length)
    # convolve with normalized window
    y = np.convolve(w/w.sum(), s, mode='valid')

    # Normalize
    max_value = max(y)
    if max_value > 0:
      y = y / max_value

    # Make sure that the length of y is the same that the length of x
    if len(y) < len(x):
      # zero pading
      y = np.pad(y, len(x)-len(y))
    if len(y) > len(x):
      # cut
      y = y[:len(x)]

    # return the useful part of y
    return y


## "Circular modulus" function
# Lets us see if a is multiple of b with a symmetrical tolerance
def circ_mod(a, b):
  res = a%b
  if res >= round(b/2):
    res = b - res
  return res

###############################################
########### PERIODICITIES LOOKUP ##############
###############################################

# Detects all the periodicities in input_signal
def periodicities_lookup(input_signal, peak_threshold=0.3, EPS=2, verbose=False):
  if verbose == True:
    print("******************************************")
    print("****** Looking for periodicities... ******")
    print("******************************************")


  # Get the indices of the peaks
  #peak_positions = np.where(input_signal == 1)[0] # JUST FOR NOW
  peak_positions = find_peaks(input_signal,
                              height=peak_threshold,
                              distance=5
                              )[0]
  if verbose == True:
    print("Detected peak positions:%s\n" % (peak_positions))

  # Initialize a list of periodicities. Each periodicity has its period and start position
  periodicities = []

  # For every peak position except the last one ...
  i = 0 # index for curr_peak_pos
  j = 0 # index for next_peak_pos
  while i < len(peak_positions)-2:
    if j >= len(peak_positions)-2:
      i = i+1
      j = i+1
    else:
      j = j+1

    # 1) memorize the position of the current peak as curr_peak_pos
    curr_peak_pos = peak_positions[i]
    if verbose == True: print("curr_peak_pos:", curr_peak_pos)
    # 2) memorize  the  position of the next  peak as next_peak_pos
    next_peak_pos = peak_positions[j]
    if verbose == True: print("next_peak_pos:", next_peak_pos)
    # 3) memorize the difference between the peak positions as current_periodicity
    current_periodicity_len = next_peak_pos - curr_peak_pos
    if verbose == True: print("current_periodicity_len:%s" % (current_periodicity_len))

    # 4) check if we have already detected this periodicity in this position
    #    or if it's a multiple of a periodicity we already detected
    look_for_current_periodicity_consecutive_counts = True
    if periodicities: # if the list isn't empty
      periods = np.asarray(periodicities) # recast it into an array
      for period in periods:
        length = period[0]
        pos = period[1]
        cts = period[2]
        # same or multiple periodicity length      AND       same offset
        #if (current_periodicity_len % length == 0) and ( ((curr_peak_pos-pos) % length == 0) ):  # or (curr_peak_pos == pos) ): ########### W/OUT TOLERANCE #############
        if circ_mod(current_periodicity_len, length) <= EPS and circ_mod(curr_peak_pos-pos, length) <= EPS: ############ W/ TOLERANCE ############
          look_for_current_periodicity_consecutive_counts = False

    if look_for_current_periodicity_consecutive_counts == False:
      if verbose == True: print("periodicity is being skipped (duplicate)")
    if look_for_current_periodicity_consecutive_counts == True:
      # Now we have to find out whether current_periodicity is CONSECUTIVELY RECURRENT inside our signal.
      # Starting from the position idx_next_peak, we slide through the input_signal and find out
      # what is the MAXIMUM NUMBER OF TIMES that current_periodicity repeats CONSECUTIVELY.
      current_periodicity_consecutive_counts = 1
      k = j
      while k < (len(peak_positions)-1):
        expected_peak_pos = peak_positions[k]+current_periodicity_len
        if verbose == True: print("expected_peak_pos:%i" % (expected_peak_pos))
        #if (expected_peak_pos) in peak_positions: ########### W/OUT TOLERANCE #############
        if (np.any(np.isclose(expected_peak_pos, peak_positions, atol=EPS))): ############ W/ TOLERANCE ############
          current_periodicity_consecutive_counts += 1
          if verbose == True: print("current_periodicity_consecutive_counts:%i" % (current_periodicity_consecutive_counts))
          k = np.where(np.isclose(peak_positions, expected_peak_pos, atol=EPS))[0][0] # index of element expected_peak_pos inside peak_positions ########### W/ TOLERANCE #############
          if verbose == True: print("k: %i, peak_positions[k]: %i" %(k, peak_positions[k])) 
        else:
          #current_periodicity_consecutive_counts = 1
          if verbose: print("expected_peak was NOT found in position %i\n" % (expected_peak_pos))
          break
        if verbose == True: print("\n")

      

      # Append the current periodicity: length and current_periodicity_consecutive_counts
      append = True
      if current_periodicity_consecutive_counts <= 3:
        append = False
      
      #if current_periodicity_len not in periods[:,0] and current_periodicity_len-current_periodicity_offset not in periods[:,1]:
      if append == True:
        current_periodicity_offset = peak_positions[i] # with respect to input_signal
        if verbose == True: print("appending periodicity_len", current_periodicity_len)
        periodicities.append(np.array([current_periodicity_len, 
                                      current_periodicity_offset, 
                                      current_periodicity_consecutive_counts]))
    
    
  periodicities = np.asarray(periodicities)

  # Sort the periodicities based on their consecutive counts
  ranked = periodicities[:,-1].argsort()
  largest_indices = ranked[::-1][:len(periodicities)]
  periodicities = periodicities[largest_indices]

  # Starting from the periodicity with most consecutive counts, remove all of its values in the pulses array.
  # Iterate until pulses is all equal to zero.
  # This will tell us how many of the periodicities do we need to explain the entire content of pulses.
  peak_stem = np.zeros(len(input_signal))
  for i in range(0, len(peak_positions)):
    peak_stem[peak_positions[i]] = 1

  pulses_copy = np.array(peak_stem, copy=True)
  w = 0
  while not (pulses_copy <= peak_threshold).all() and w < len(periodicities): # until all values in pulses aren't zeros ########### INSERT TOLERANCE #############
    pulses_copy[np.arange(periodicities[w][1], len(pulses_copy), periodicities[w][0])] = 0
    w = w+1
  if verbose == True: 
    print(pulses_copy)

  return periodicities[0:w]

################################
####### DRIVER FUNCTION ########
################################

# Reads the audio from audio_filename and writes out the information at json_filename
def driver_function(audio_filename, json_filename, window_len_seconds=10, verbose=False):
  # Load the audio track and compute the novelty
  y, Fs = librosa.core.load(audio_filename)
  nov_y, Fs_nov_y = compute_novelty_complex(y, Fs=Fs)

  # Define the empty data structure of the JSON
  rhythmDict =	{"n_windows": 0, "window_timings": [], "window_content": []}

  # Populate the data structure
  hop_factor = round(window_len_seconds*Fs/(Fs/Fs_nov_y))
  window_start = -hop_factor
  window_end = 0
  window_ctr = -1
  # For each non-overlapping 10-seconds window of the novelty function:
  while window_end < (len(nov_y)-hop_factor*2):
    # Set the current window
    window_start += hop_factor
    window_end += hop_factor
    window_ctr += 1

    if verbose == True: print("window_start: %i, window_end: %i, len(nov_y): %i" %(window_start, window_end, len(nov_y)))
    rhythmDict["window_timings"].append({"start":window_start*(Fs/Fs_nov_y)/Fs, "end":window_end*(Fs/Fs_nov_y)/Fs})
    rhythmDict["window_content"].append([])

    # Find the periodicities in the current window
    periods = periodicities_lookup(nov_y[window_start:window_end], peak_threshold=0.1, EPS=10, verbose=False)

    # Append them to the data structure
    if verbose == True: print("Number of periodicities found in window [%i]: %i" %(window_ctr, len(periods)) )
    for period in periods[0:4]:
      if verbose == True: print("periodicity_len: %i, periodicity_offset: %i, periodicity_consecutive_counts: %i" % (period[0], period[1], period[2]) )
      current_periodicity_BPM = 60/((period[0]*(Fs/Fs_nov_y))/Fs)
      current_periodicity_offset_sec = (period[1]*(Fs/Fs_nov_y))/Fs
      rhythmDict["window_content"][window_ctr].append({"BPM":current_periodicity_BPM, "offset":current_periodicity_offset_sec})
    if verbose == True: print("\n")

  rhythmDict["n_windows"] = window_ctr+1

  # Write the data structure to the json file
  with open(json_filename, 'w') as outfile:
    json.dump(rhythmDict, outfile)


###############################
######## EXAMPLE USAGE ########
###############################

driver_function("templates/assets/muzak_drums.wav", # Path to audio file
                "templates/assets/inputRhythms.json" # Path to JSON where the rhythm analysis is stored
                )