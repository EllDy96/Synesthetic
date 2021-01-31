/************************************************
 *********** DATA LOADING AND SETUP *************
 ************************************************/ 

// CLASSES DEFINITION

// The draw_properties object contains the up-to-date rhythmic information of the piece.
// The updates are monitored by the loop of the draw() function.
// The updates are scheduled with the addCue() function.
class rhythm_properties
{
  constructor()
  {
    this.n_rhythms = 0;
    this.rhythm_isStruck =
      [
        false, false, false, false, // Array containing a boolean for each rhythm. Each element is always false,
        false, false, false, false, // except in the instant when the corresponding rhythm is struck.
        false, false, false, false,
        false, false, false, false,
      ];
  }

  update(args)
  {
    //if(this.n_rhythms != args._n_rhythms)
    //{
      this.n_rhythms = args._n_rhythms;
      console.log(this.n_rhythms)
    //}    
    // The property has to keep the value "true" only for an instant,
    // so that the toggle is detected by the draw() loop, which monitors the array.
    if(this.n_rhythms != 0)
    {
      this.rhythm_isStruck = []
      for (let i=0; i<this.n_rhythms; i++)
      {
        this.rhythm_isStruck[i] = false;
      }
      this.rhythm_isStruck[args._struck_rhythm_idx] = true;
    }
  }

  update2()
  {
    this.n_rhythms
  }

  print()
  {
    console.log("n_rhythms: ", this.n_rhythms, " rhythm_isStruck: ", this.rhythm_isStruck);
  }
};

// GLOBAL VARIABLES DEFINITION
let mySound;
let rhythmic_content;
let n_windows;
let canvas_height = 400;
let canvas_width = 800;
var current_rhythm_properties = new rhythm_properties();


// Load the audio file and the JSON file
function preload() 
{
  loadJSON('assets/inputRhythms.json', storeJSON);
  mySound = createAudio('assets/testTrack.mp3');
}
function storeJSON(data)
{
  rhythmic_content = data;
  n_windows = rhythmic_content.n_windows;
}
function update_data(time)
                       {
                         current_rhythm_properties.n_rhythms=n_rhythms;
                         console.log("cue callback at time ", time);
                       }

// Initialize the canvas and schedule the addCue calls upon the audio file
function setup() 
{
  // INITIALIZE THE CANVAS
  canvas = createCanvas(canvas_width, canvas_height);
  canvas.background(200);
  //mySound.showControls();

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
      let current_cue = first_cue;
      for(current_cue = first_cue; current_cue<last_cue; current_cue+=period_len)
      {
        // ... add the cue. We can also pass many arguments to the callback function.
        console.log("Adding cue marker at position ", current_cue, ", j: ", j)
        /*let args = {_struck_rhythm_idx:j, _n_rhythms:n_rhythms}
        mySound.addCue(current_cue, 
                       current_rhythm_properties.update,
                       args);*/
        mySound.addCue(current_cue,
                       function(time)
                       {
                         current_rhythm_properties.n_rhythms=n_rhythms;
                         console.log("cue callback at time ", time);
                       },current_cue);
      }
      console.log("\n")
    }
    console.log("\n")
  }
}





/***************************************
 *********** VISUALIZATION *************
 ***************************************/ 
var maxDiameter = 50; 
var theta = 0; 

function draw()
{
  if(current_rhythm_properties.n_rhythms == 0)
  {
    clear();
    //noLoop();
  }
  // Draw here...
  else
  {
    // ONE RHYTHM
    if(current_rhythm_properties.n_rhythms == 1)
    {
      background(127,0,0); 

      // calculate the diameter of the circle 
      //height/2 + sin(theta) * amplitude; 

      var diam = 100 + sin(theta) * maxDiameter ;

      // draw the circle 
      ellipse(width/2,height/2, diam, diam); 

      // make theta keep getting bigger
      // you can play with this number to change the speed
      theta += .1; 
    }
    // TWO RHYTHMS
    else if(current_rhythm_properties.n_rhythms == 2)
    {
      background(0,127,0);

      var diam = 100 + sin(theta) * maxDiameter ;

      ellipse(width/3,height/2, diam, diam); 
      ellipse(2*width/3,height/2, diam, diam);

      theta += .1; 
    }
    // THREE RHYTHMS
    else if(current_rhythm_properties.n_rhythms == 3)
    {
      background(0,0,127);

      var diam = 100 + sin(theta) * maxDiameter ;

      ellipse(width/4,height/2, diam, diam); 
      ellipse(2*width/4,height/2, diam, diam); 
      ellipse(3*width/4,height/2, diam, diam); 
      
      theta += .1; 
    }
    // FOUR RHYTHMS
    else if(current_rhythm_properties.n_rhythms == 4)
    {
      background(127,127,0);

      var diam = 100 + sin(theta) * maxDiameter ;

      ellipse(width/5,height/2, diam, diam); 
      ellipse(2*width/5,height/2, diam, diam); 
      ellipse(3*width/5,height/2, diam, diam);
      ellipse(4*width/5,height/2, diam, diam); 
      
      theta += .1; 
    }
    else
    {
      background(127,127,127);
      window.alert("Too many rhythms, can't display");
    }    
  }
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
    mySound.play();
}

function pause() 
{
    mySound.pause();
}