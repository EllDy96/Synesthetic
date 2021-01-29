/************************************************
 *********** DATA LOADING AND SETUP *************
 ************************************************/ 

// Global variables definition
let mySound;
let rhythmic_content;
let n_windows;
let canvas_height = 400;
let canvas_width = 600;

// Load the audio file and the JSON file
function preload() 
{
  loadJSON('assets/inputRhythms.json', storeJSON);
  mySound = loadSound('assets/testTrack.mp3');
}
function storeJSON(data)
{
  rhythmic_content = data;
  n_windows = rhythmic_content.n_windows;
}

// Initialize the canvas and schedule the addCue calls upon the audio file
function setup() 
{
  // INITIALIZE THE CANVAS
  canvas = createCanvas(canvas_width, canvas_height);
  canvas.background(200);

  // SCHEDULE THE ADDCUE CALLS
  // For each window...
  for (i=0; i<n_windows; i++) 
  {
    let window_timing = rhythmic_content.window_timings[i]; // Start and end values of the i-th window
    let window_start = window_timing.start; // Start of the current window (seconds)
    let window_end = window_timing.end; // End of the current window (seconds)
    let window_len = window_end-window_start; // Length of the window (seconds)
    
    let window_content = rhythmic_content.window_content[i]; // Information about the rhythms in the i-th window
    let n_rhythms = window_content.length; // Number of rhythms present in the i-th window

    console.log("window start: ", window_start, ", window end: ", window_end,
                         ", window length: ", window_len, ", n_rhythms: ", n_rhythms);

    // ... for each rhythm inside the window ...
    for(j in window_content)
    {
      let rhythm = window_content[j];
      let period_len = 60.0/(rhythm.BPM); // Period length of the j-th rhythm (seconds)
      
      // ... schedule the addCue calls for the j-th rhythm inside this window.
      let first_cue = window_start+rhythm.offset; // Position of the first cue for the j-th rhythm in the i-th window
      let last_cue = window_end;

      console.log("BPM: ", rhythm.BPM, " offset: ", rhythm.offset)
      console.log("first cue: ", first_cue)
      console.log("last cue: ", last_cue)
      console.log("period_len: ", period_len)

      // Starting from the first cue, until we reach the end of the i-th window...
      for(current_cue = first_cue; current_cue<last_cue; current_cue+=period_len)
      {
        // ... add the cue. We can also pass many arguments to the callback function.
        console.log("Adding cue marker at position ", current_cue, ", j: ", j)
        let args = {rhythm_index:j, n_rhythms:n_rhythms}
        mySound.addCue(current_cue, tapRhythm, args);
      }
      console.log("\n")
    }
    console.log("\n")
  }
}





/***************************************
 *********** VISUALIZATION *************
 ***************************************/ 

// These functions are quite shitty xD

function tapRhythm(args) 
{
  background(args.rhythm_index*20+100);
  text("TAP", 10, args.rhythm_index*20+50);
}

function drawCircles(args) 
{
  // Decide the position and diameter of the circle based on the number of rhythms
  fill(125, 100, (255/args.n_rhythms)*args.rhythm_index);
  circle(canvas_width/2.0, // x-coordinate
         50+args.rhythm_index*20, // y-coordinate
         20 // diameter
         );
  
}





/***************************************
 ************* CONTROLLER **************
 ***************************************/ 

const btnPlay = document.querySelector("#btn-play");
btnPlay.addEventListener("click", play);

const btnPause = document.querySelector("#btn-pause");
btnPause.addEventListener("click", pause);

function play() 
{
  if (!mySound.isPlaying()) 
  {
    mySound.play();
  }
}

function pause() 
{
  if (mySound.isPlaying()) 
  {
    mySound.pause();
  }
}