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

class Block {
  //constructor
  constructor(x, y, dim_1, dim_2, color)
  {
    this.x= x;
    this.y = y;
    this.dim1 = dim_1;
    this.dim2 = dim_2;
    this.color = color;
    this.area = (this.dim1*this.dim2);
  }
  //functionalities
  display(color_pass)
  {
    fill(color_pass)
    rect(this.x,this.y, this.dim1, this.dim2)
  }
  
}



/******************************************
 *********** GLOBAL VARIABLES *************
 ******************************************/ 

let mySound; // Stores the audio track
let rhythmic_content; // Stores the rhythmic content of the audio track, loaded from the JSON file
let n_windows; // Number of windows in mySound, each window contains different tempos
let current_rhythm_properties = new rhythm_properties(); // Instantiation of the rhythm_properties class
let canvas_height = 750;
let canvas_width = 1200;
var color_palette_hot = 
[
    "#d24632", //rosso
    "#ffd700", //oro
    //"#f5e132", //giallo
    //"#3278aa", //blu
    //"#ff9900", //arancione
    //"#500000", //rosso sangue
    //"#7fffd4", //acquamarina
    //"#40826d", //verde veronese
];

var color_palette_cold = 
[
    "#0096b9", //blu bondi
    "#7fffd4", //acquamarina
    //"#ff9900", //arancione
    //"#500000", //rosso sangue
    //"#7fffd4", //acquamarina
    //"#40826d", //verde veronese
];
var color_palette_merged = color_palette_cold.concat(color_palette_hot);
let x,y,dim1,dim2, b1, b2, numblocks;
let c1,c2,c3,c4,pulse_var,s;
var blocks= []; //array containing the blocks
var sizes = [50, 100, 100, 150, 150, 200, 250, 300, 350, 400]; // old: [50, 100, 150, 200];
var rnd_color;
var color_pulse, n_colors;
var curr_block;
var stroke_dim;
var exceed_elem;





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
  createCanvas(windowHeight, windowHeight);
  stroke_dim = 10;
  background(155);

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

  //     [][  ][]     //
  //*****MONDRIAN*****//
  //     []____[]     //

  strokeWeight(stroke_dim);
  var i = 0;
  var x = 0;
  var y = 0;
  var currWidth = random(sizes);
  var currHeight = random(sizes);

  if(Math.random()<0.5){ //two methods for creating the mondrian, randomly one of them will be executed for the current generation
  while (y + currHeight < height) 
  {
    fillOnRows(y, currHeight)
    y = y + currHeight;
    currHeight = random(sizes);
  }
  fillOnRows(y, height-y)
  }else
  {
  while (x + currWidth < width)
  {
   fillOnColumns(x, currWidth)
   x = x + currWidth;
   currWidth = random(sizes)
  }
  fillOnColumns(x, width-x)
  }
  // palette_length = color_palette_hot.length + color_palette_cold.length;
  // n_colors = floor(blocks.length / palette_length);
  var tot_area = 0;
  for(var i = 0; i<blocks.length; i++){
    tot_area+=blocks[i].area;
  }
  var avg_area = tot_area / blocks.length;
  
  for(var i = 0; i < blocks.length; i++){
    if(blocks[i].area < avg_area){ //small blocks <-> cold colors
      blocks[i].color=random(color_palette_cold)
    }else{  //big blocks <-> hot colors
      blocks[i].color=random(color_palette_hot)
    }

  }
  c_pulse = color("#ffffff"); //bianco 
  c1 = color("#ff9900"); //orange
  c2 = color("#7fffd4"); //acquamarina
  c3 = color(224,175,238);
  c4 = color(155, 155, 155);
  pulse_var= 0;
  s= 0;
  var num_rhythms_strucked;
}



function draw()
{
  for(let i = 0; i < blocks.length; i++)
  {
    blocks[i].display(color(blocks[i].color));
  }
  s = s + 0.1;
  pulse_var = cos(s)
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
      for(let i = 0; i < blocks.length; i++)
      {
      blocks[i].display(color(blocks[i].color));
      }
      // Check if the rhythm has been struck
      if(current_rhythm_properties.rhythm_isStruck[0]==true)
      {
        num_rhythms_strucked = 1;
        // Set the flag back to false
        current_rhythm_properties.rhythm_isStruck[0]=false;
        console.log("RHYTHM 1/1 STRUCK");

        // Change the fill (random color or just inverse color)
        //fill_1 = getRandomColor(3);
        //fill_1 = 255-fill_1;
        pulsation(pulse_var, num_rhythms_strucked)
          
      }
    //   // In every case, redraw the ellipse
    //   fill(fill_1);
    //   ellipse(width/2,height/2, diam, diam);
    // 
    }
    // TWO RHYTHMS
    else if(current_rhythm_properties.n_rhythms = 2)
    {
      background(0,127,0);
      for(let i = 0; i < blocks.length; i++)
      {
      blocks[i].display(color(blocks[i].color));
      }
      // If both rhythms have been struck at the same time ...
      if(current_rhythm_properties.rhythm_isStruck[0]==true && current_rhythm_properties.rhythm_isStruck[1]==true)
      {
        num_rhythms_strucked = 2;
        console.log("RHYTHMS 1/2 AND 2/2 STRUCK")
        pulsation(pulse_var, num_rhythms_strucked)
      }
      // If only the first rhythm has been struck ...
      else if(current_rhythm_properties.rhythm_isStruck[0]==true)
      {
        num_rhythms_strucked = 1;
        console.log("RHYTHM 1/2 STRUCK")
        current_rhythm_properties.rhythm_isStruck[0]=false;
        pulsation(pulse_var, num_rhythms_strucked);
        //fill_1 = getRandomColor(3);
      }
      // If only the second rhythm has been struck ...
      else if(current_rhythm_properties.rhythm_isStruck[1]==true)
      {
        console.log("RHYTHM 2/2 STRUCK")
        num_rhythms_strucked = 1;
        current_rhythm_properties.rhythm_isStruck[1]=false;
        pulsation(pulse_var, num_rhythms_strucked);
        //fill_2 = getRandomColor(3);
      }
    }
    // THREE RHYTHMS
    else if(current_rhythm_properties.n_rhythms = 3)
    {
      background(0,0,127);
      for(let i = 0; i < blocks.length; i++)
      {
      blocks[i].display(color(blocks[i].color));
      }
      pulsation(pulse_var, current_rhythm_properties.n_rhythms);

    }
    // FOUR RHYTHMS
    else if(current_rhythm_properties.n_rhythms = 4)
    {
      background(127,127,0);
      for(let i = 0; i < blocks.length; i++)
      {
      blocks[i].display(color(blocks[i].color));
      }
      pulsation(pulse_var, current_rhythm_properties.n_rhythms);
    }
    else
    {
      background(127,127,127);
      window.alert("Too many rhythms, can't display");
    }    
  }
}

function pulsation(pulse_var, num_rhythms)
{
  var j = 0;
  while(j<num_rhythms){
    for (i = 0; i<blocks.length; i++)
    {
      //primi due ritmi associati ai colori freddi, terzo e quarto associato a colori caldi;
      if(blocks[i].color == color_palette_merged[j])
      {
        push()
        let color_pulse = color(blocks[i].color);
        let c = lerpColor(c_pulse,color_pulse, pulse_var);
        blocks[i].display(c);
        pop()
      }
    }
    j+=1;      
  }
}



function fillOnRows(y, currHeight)
{
  currWidth = random(sizes);
  x = 0;
  while (x + currWidth + stroke_dim < width) 
  {
      //rnd_color = random(color_palette);
      curr_block = new Block(x, y, currWidth, currHeight);
      blocks.push(curr_block)
      x = x + currWidth;
      currWidth = random(sizes);
  }
 
  curr_block = new Block(x, y, width - x, currHeight);
  blocks.push(curr_block)
  
}
function fillOnColumns(x, currWidth)
{
  currHeight = random(sizes);
  y = 0;
  while (y + currHeight + stroke_dim < height) 
  {
      //rnd_color = random(color_palette);
      curr_block = new Block(x, y, currWidth, currHeight);
      blocks.push(curr_block)
      y = y + currHeight;
      currHeight = random(sizes);
  }
 
  curr_block = new Block(x, y, currWidth, height - y);
  blocks.push(curr_block)
  
}
function shuffle_array(array) //Fisher-Yates Shuffle algorhythm 
{ 
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
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