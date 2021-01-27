import os
from python_modules import periodicity_finder as pf
from python_modules import tempodetection as td
from flask import Flask, render_template, request, redirect, url_for, abort, send_from_directory
from werkzeug.utils import secure_filename
import librosa 

#template_dir = os.path.relpath('./templates') #reference template, in case you want to change the standard path
app= Flask(__name__)#, template_folder=template_dir)
app.config['MAX_CONTENT_LENGTH']=20*1024*1024 #fix the max size of the uploaded files at 20MB
app.config['UPLOAD_EXTENSIONS']=['.mp3', '.wav', '.flac']
app.config['UPLOAD_PATH']='uploaded_tracks'

@app.route('/')         #collegamento tra ('percorso url') e ...                        
def upload():           #... funzione view
   return render_template('upload.html')
	
@app.route('/', methods = ['POST'])
def upload_file():
   uploaded_file = request.files['file'] 
   filename = secure_filename(uploaded_file.filename) #secured version of the filename of the track uploaded by the user
   if filename != '':
      file_ext=os.path.splitext(filename)[1] #restituisce l'estensione del file
      if file_ext not in app.config['UPLOAD_EXTENSIONS']:
         abort(400)
      uploaded_file.save(os.path.join(app.config['UPLOAD_PATH'], filename)) #salva il file nel path specificato in app.config (deve esistere una cartella con quel nome)
 #  x = pf.name_track(filename)
 #  print("just an index,", x)
   pulses = td.generate_polyrhythm_impulse_train()
   #track_path = os.path.join(app.config['UPLOAD_PATH'], filename)
   #[x, Fs]=librosa.load(track_path, sr=None)
   #[nov_x, Fs_nov] = td.compute_novelty_complex(x, Fs, N=512, H=256)
   periods = td.periodicities_lookup(pulses, verbose=False)
   print("Number of periodicities found in the signal:", len(periods))
   for period in periods:
      print("periodicity_len: %i, periodicity_offset: %i, periodicity_consecutive_counts: %i" % (period[0], period[1], period[2]) )
   return render_template('oscilloscope.html', song_name=filename)

@app.route('/ <filename>')      #new method returns the track (uploaded in 'uploaded_tracks' folder)
def send_track(filename):
   return send_from_directory("uploaded_tracks", filename)

@app.route('/metronome')
def canvas():
   return render_template ('metronome.html')   

#@app.route('/admin')            #just an example on how redirecting works in Flask(un utente non può finire su pagina /admin)
#def admin():
#    return redirect(url_for("home"))

#@app.route('/<name>')           #just a simple example of extracting url stuff and write it into web page
#def user(name):
#    return f"Hello {name}!"

#@app.route('/<name>')            #render an html template. In order to do that, create a "template" folder in the same directory of the current flask.py file
#def page(name):                  #passing html template a list, then use python inside html
#    return render_template("index.html", content=["Francesco Bruschi","Mauro Molinari", "Vincenzo Rana"], title=name) 
