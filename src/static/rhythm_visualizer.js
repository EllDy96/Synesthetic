/*****************************************************
 *********** HELPER FUNCTIONS DEFINITION *************
 *****************************************************/ 

function getRandomColor(brightness)
{
  // Six levels of brightness from 0 to 5, 0 being the darkest
  var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
  var mix = [brightness*51, brightness*51, brightness*51]; //51 => 255/5
  var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x){ return Math.round(x/2.0)})
  return "rgb(" + mixedrgb.join(",") + ")";
}





/********************************************
 *********** CLASSES DEFINITION *************
 ********************************************/ 

// The draw_properties class contains the up-to-date rhythmic information of the piece.
// The updates are monitored by the loop of the draw() function.
// The updates are scheduled with the Tone.Transport.Schedule() function.
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
    // Update the number of rhythms only if it's a different value
    if(this.n_rhythms != args._n_rhythms)
    {
      this.n_rhythms = args._n_rhythms;
      console.log(this.n_rhythms)
    }
    // Trigger the rhythm which has been struck
    this.rhythm_isStruck[args._struck_rhythm_idx] = true;
  }

  print()
  {
    console.log("n_rhythms: ", this.n_rhythms, " rhythm_isStruck: ", this.rhythm_isStruck);
  }
};





/******************************************
 *********** GLOBAL VARIABLES *************
 ******************************************/ 

let mySound; // Stores the audio track
let rhythmic_content; // Stores the rhythmic content of the audio track, loaded from the JSON file
let n_windows; // Number of windows in mySound, each window contains different tempos
let current_rhythm_properties = new rhythm_properties(); // Instantiation of the rhythm_properties class
let canvas_height = 750;
let canvas_width = 1200;






/************************************************
 *********** DATA LOADING AND SETUP *************
 ************************************************/ 

// Load the audio file and the JSON file
function preload() 
{  
  loadJSON('assets/inputRhythms.json', storeJSON);
  mySound = new Tone.Player("assets/clicktrack.wav").toDestination();  
}
function storeJSON(data)
{
  rhythmic_content = data;
  n_windows = rhythmic_content.n_windows;
}

// Initialize the canvas and schedule the addCue calls upon the audio file
function setup() 
{
  frameRate(60);
  // INITIALIZE THE CANVAS
  canvas = createCanvas(canvas_width, canvas_height);
  canvas.background(0);

  // SCHEDULE THE Tone.Transport CALLS
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
      
      // ... schedule the Tone.Transport calls for the j-th rhythm inside this window.
      let first_cue = window_start+rhythm.offset; // Position of the first cue for the j-th rhythm in the i-th window
      let last_cue = window_end;

      console.log("BPM: ", rhythm.BPM, " offset: ", rhythm.offset)
      console.log("first cue: ", first_cue)
      console.log("last cue: ", last_cue)
      console.log("period_len: ", period_len)

      // Starting from the first cue, until we reach the end of the i-th window...
      for(let current_cue = first_cue; current_cue<last_cue; current_cue+=period_len)
      {
        // ... add the cue. We can also pass many arguments to the callback function.
        console.log("Adding cue marker at position ", current_cue, ", j: ", j)
        let args = {_struck_rhythm_idx:j, _n_rhythms:n_rhythms}
        Tone.Transport.schedule(function(){current_rhythm_properties.update(args)}, current_cue);
        // Fallback code below. Please, leave commented.
        /*Tone.Transport.schedule(function({current_cue, j, n_rhythms})
                                  {
                                    current_rhythm_properties.n_rhythms=n_rhythms;
                                    current_rhythm_properties.rhythm_isStruck[j]=true;
                                    console.log("cue callback at time ", current_cue);
                                  },{current_cue, j, n_rhythms});*/
      }
      console.log("\n")
    }
    console.log("\n")
  }
}






/***************************************
 *********** VISUALIZATION *************
 ***************************************/ 

var diam = 150;
let fill_1 = 0;
let fill_2 = 0;


function draw()
{
  if(current_rhythm_properties.n_rhythms == 0)
  {
    clear();
  }
  // Draw here...
  else
  {
    // ONE RHYTHM
    if(current_rhythm_properties.n_rhythms == 1)
    {
      background(127,0,0);

      // Check if the rhythm has been struck
      if(current_rhythm_properties.rhythm_isStruck[0]==true)
      {
        // Set the flag back to false
        current_rhythm_properties.rhythm_isStruck[0]=false;
        console.log("RHYTHM 1/1 STRUCK");

        // Change the fill (random color or just inverse color)
        //fill_1 = getRandomColor(3);
        fill_1 = 255-fill_1;
          
      }
      // In every case, redraw the ellipse
      fill(fill_1);
      ellipse(width/2,height/2, diam, diam);
    }
    // TWO RHYTHMS
    else if(current_rhythm_properties.n_rhythms == 2)
    {
      background(0,127,0);

      // If both rhythms have been struck at the same time ...
      if(current_rhythm_properties.rhythm_isStruck[0]==true && current_rhythm_properties.rhythm_isStruck[1]==true)
      {
        console.log("RHYTHMS 1/2 AND 2/2 STRUCK")
        fill_1 = fill_2 = 255-fill_1;//getRandomColor(3);
      }
      // If only the first rhythm has been struck ...
      else if(current_rhythm_properties.rhythm_isStruck[0]==true)
      {
        console.log("RHYTHM 1/2 STRUCK")
        current_rhythm_properties.rhythm_isStruck[0]=false;
        fill_1 = 255-fill_1;
        //fill_1 = getRandomColor(3);
      }
      // If only the second rhythm has been struck ...
      else if(current_rhythm_properties.rhythm_isStruck[1]==true)
      {
        console.log("RHYTHM 2/2 STRUCK")
        current_rhythm_properties.rhythm_isStruck[1]=false;
        fill_2 = 255-fill_2;
        //fill_2 = getRandomColor(3);
      }

      fill(fill_1);
      ellipse(width/3,height/2, diam, diam);

      fill(fill_2);
      ellipse(2*width/3,height/2, diam, diam);
    }
    // THREE RHYTHMS
    else if(current_rhythm_properties.n_rhythms == 3)
    {
      background(0,0,127);

      ellipse(width/4,height/2, diam, diam); 
      ellipse(2*width/4,height/2, diam, diam); 
      ellipse(3*width/4,height/2, diam, diam);
    }
    // FOUR RHYTHMS
    else if(current_rhythm_properties.n_rhythms == 4)
    {
      background(127,127,0);

      ellipse(width/5,height/2, diam, diam); 
      ellipse(2*width/5,height/2, diam, diam); 
      ellipse(3*width/5,height/2, diam, diam);
      ellipse(4*width/5,height/2, diam, diam); 
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

const btnStop = document.querySelector("#btn-stop");
btnStop.addEventListener("click", stop);

function play() 
{
  mySound.start();
  Tone.Transport.start();
}

function stop() 
{
  mySound.stop();
  Tone.Transport.stop();
}