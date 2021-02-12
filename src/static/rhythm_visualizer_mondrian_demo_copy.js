/*****************************************************
 *****************************************************
 *********** HELPER FUNCTIONS DEFINITION *************
 *****************************************************
 *****************************************************/

function getRandomColor(brightness)
{
  // Six levels of brightness from 0 to 5, 0 being the darkest
  warmrgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
  warmmix = [brightness * 51, brightness * 51, brightness * 51]; //51 => 255/5
  warmmixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function (x) { return Math.round(x / 2.0) })
  return "rgb(" + mixedrgb.join(",") + ")";
}



function shuffle_array(array) //Fisher-Yates Shuffle algorhythm 
{
  warmcurrentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex)
  {

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




/********************************************
 ********************************************
 *********** CLASSES DEFINITION *************
 ********************************************
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
    this.rhythm_colors =
      [
        "ffffff", "ffffff", "ffffff", "ffffff", // Array containing the color associated to each rhythm.
        "ffffff", "ffffff", "ffffff", "ffffff",
        "ffffff", "ffffff", "ffffff", "ffffff",
        "ffffff", "ffffff", "ffffff", "ffffff",
      ];
    this.rhythm_isFast =
      [
        false, false, false, false, // Array containing a boolean for each rhythm.
        false, false, false, false, // Each flag tells us if rhythm is fast, i.e. above a certain BPM threshold.
        false, false, false, false,
        false, false, false, false,
      ];

  }

  bind_rhythms_to_colors(palette_cold, palette_warm)
  {
    for(i in this.n_rhythms)
    {
      if(this.rhythm_isFast[i])
      {
        this.rhythm_colors[i] = palette_cold[i];
      }
      else
      {
        this.rhythm_colors[i] = palette_warm[i];
      }      
    }
  }

  update(args)
  {
    // Update the number of rhythms only if it's a different value
    if (this.n_rhythms != args._n_rhythms)
    {
      this.n_rhythms = args._n_rhythms;
      console.log(this.n_rhythms)
    }
    // Trigger the rhythm which has been struck
    this.rhythm_isStruck[args._struck_rhythm_idx] = true;
  }

  reset_flags()
  {
    this.rhythm_isStruck =
      [
        false, false, false, false, // Array containing a boolean for each rhythm. Each element is always false,
        false, false, false, false, // except in the instant when the corresponding rhythm is struck.
        false, false, false, false,
        false, false, false, false,
      ];
  }

  print()
  {
    console.log("n_rhythms: ", this.n_rhythms, " rhythm_isStruck: ", this.rhythm_isStruck);
  }
};

class Block
{
  constructor(x, y, dim_1, dim_2, color)
  {
    this.x = x;
    this.y = y;
    this.dim1 = dim_1;
    this.dim2 = dim_2;
    this.color = color;
    this.area = (this.dim1 * this.dim2);
  }
  display(_color)
  {
    fill(_color);
    rect(this.x, this.y, this.dim1, this.dim2);
  }


}

class MondrianBlocks
{
  constructor(stroke_dim, height, width, sizes, color_palette_warm, color_palette_cold)
  {
    this.blocks = [];
    this.stroke_dim = stroke_dim;
    this.width = width;
    this.height = height;
    this.sizes = sizes;
    this.color_palette_warm = color_palette_warm;
    this.color_palette_cold = color_palette_cold;
  }

  color_assignment()
  {
    let tot_area = 0;
    for (let i = 0; i < this.blocks.length; i++)
    {
      tot_area += this.blocks[i].area;
    }
    let avg_area = tot_area / this.blocks.length;

    for (let i = 0; i < this.blocks.length; i++)
    {
      if (this.blocks[i].area < avg_area)
      { //small blocks <-> cold colors
        this.blocks[i].color = random(this.color_palette_cold)
      } 
      else
      {  //big blocks <-> warm colors
        this.blocks[i].color = random(this.color_palette_warm)
      }
    }
  }

  update_color(passed_color, pulse_var)
  {
    //console.log("IM HERE")
    for (let i = 0; i < this.blocks.length; i++)
    {
      //console.log("comparing ", this.blocks[i].color, " with ", passed_color)
      if (this.blocks[i].color == passed_color)
      {        
        //push()
        let color_pulse_from = color(this.blocks[i].color);
        let next_color = lerpColor(color_pulse_from, color(color_pulse_to), pulse_var); //pulse warmis just a parameter btw 0 : 1
        this.blocks[i].display(next_color);
        //pop()
      }
      else
      {
        this.blocks[i].display(this.blocks[i].color);
      }
    }
  }

  draw_mondrian()
  {
    for(let i in this.blocks)
    {
      this.blocks[i].display(this.blocks[i].color);
    }
  }

  generate_mondrian()
  {
    strokeWeight(this.stroke_dim);
    let i = 0;
    let x = 0;
    let y = 0;
    let currWidth = random(this.sizes);
    let currHeight = random(this.sizes);

    if (Math.random() < 0.5)
    { //two methods for creating the mondrian, randomly one of them will be executed for the current generation
      while (y + currHeight < this.height)
      {
        this.fillOnRows(y, currHeight)
        y = y + currHeight;
        currHeight = random(this.sizes);
      }
      this.fillOnRows(y, this.height - y)
    } 
    else
    {
      while (x + currWidth < this.width)
      {
        this.fillOnColumns(x, currWidth)
        x = x + currWidth;
        currWidth = random(this.sizes)
      }
      this.fillOnColumns(x, this.width - x)
    }
  }

  pulsate_blocks(pulse_var, num_rhythms, color_pulse_to)
  {
    let j = 0;
    while (j < num_rhythms) //ad ogni ritmo associo un colore
    {
      for (i = 0; i < blocks.length; i++)
      {
        //primi due ritmi associati ai colori freddi, terzo e quarto associato a colori caldi;
        if (blocks[i].color == color_palette_merged[j])
        {
          //push()
          let color_pulse_from = color(blocks[i].color);
          let c = lerpColor(color_pulse_to, color_pulse_from, pulse_var); //pulse warmis just a parameter btw 0 : 1
          blocks[i].display(c);
          //pop()
        }
      }
      j += 1;
    }
  }

  // Helper methods called by generate_mondrian()
  fillOnRows(y, currHeight)
  {
    let currWidth = random(this.sizes);
    let curr_block;
    x = 0;

    while (x + currWidth + this.stroke_dim < this.width)
    {
      //rnd_color = random(color_palette);
      curr_block = new Block(x, y, currWidth, currHeight);
      this.blocks.push(curr_block);
      x = x + currWidth;
      currWidth = random(this.sizes);
    }

    curr_block = new Block(x, y, width - x, currHeight);
    this.blocks.push(curr_block)
  }

  fillOnColumns(x, currWidth)
  {
    let currHeight = random(this.sizes);
    let curr_block;
    y = 0;

    while (y + currHeight + this.stroke_dim < this.height)
    {
      //rnd_color = random(color_palette);
      curr_block = new Block(x, y, currWidth, currHeight);
      this.blocks.push(curr_block)
      y = y + currHeight;
      currHeight = random(this.sizes);
    }

    curr_block = new Block(x, y, currWidth, this.height - y);
    this.blocks.push(curr_block)
  }
}



/******************************************
 ******************************************
 *********** GLOBAL VARIABLES *************
 ******************************************
 ******************************************/

let mySound; // Stores the audio track
let rhythmic_content; // Stores the rhythmic content of the audio track, loaded from the JSON file
let n_windows; // Number of windows in mySound, each window contains different tempos
let current_rhythm_properties = new rhythm_properties(); // Instantiation of the rhythm_properties class
let canvas_height = 750;
let canvas_width = 1200;
const color_palette_warm =
  [
    "#d24632", //rosso
    "#ffd700", //oro
    //"#ff9900", //arancione
    //"#500000", //rosso sangue
  ];
const color_palette_cold =
  [
    "#0096b9", //blu bondi
    "#7fffd4", //acquamarina
    //"#3278aa", //blu
    //"#40826d", //verde veronese
  ];
const color_pulse_to = "#ffffff";
let x, y, dim1, dim2, b1, b2, numblocks;
let pulse_warm= 0;
let s = 0;
const sizes = [50, 100, 100, 150, 150, 200, 250, 300, 350, 400]; // old: [50, 100, 150, 200];
let flag_animation = true;
let flag_pulsation = false;
let mondrian_blocks;




/************************************************
 ************************************************
 *********** DATA LOADING AND SETUP *************
 ************************************************
 ************************************************/

// Load the audio file and the JSON file
function preload()
{
  loadJSON('assets/inputRhythms_incremental.json', storeJSON);
  mySound = new Tone.Player("assets/muzak_drums.wav").toDestination();
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
  mondrian_blocks = new MondrianBlocks(10, height, width, sizes, color_palette_warm, color_palette_cold);
  mondrian_blocks.generate_mondrian(); // generates the blocks
  mondrian_blocks.color_assignment(); // assigns a color to every block
  mondrian_blocks.draw_mondrian(); // draws the blocks
  

  // SCHEDULE THE Tone.Transport CALLS
  // For each window...
  for (i = 0; i < n_windows; i++)
  {
    let window_timing = rhythmic_content.window_timings[i]; // Start and end values of the i-th window
    let window_start = window_timing.start; // Start of the current window (seconds)
    let window_end = window_timing.end; // End of the current window (seconds)
    let window_len = window_end - window_start; // Length of the window (seconds)

    let window_content = rhythmic_content.window_content[i]; // Information about the rhythms in the i-th window
    let n_rhythms = window_content.length; // Number of rhythms present in the i-th window

    console.log("window start: ", window_start, ", window end: ", window_end,
      ", window length: ", window_len, ", n_rhythms: ", n_rhythms);

    // ... for each rhythm inside the window ...
    for (j in window_content)
    {
      let rhythm = window_content[j];
      let period_len = 60.0 / (rhythm.BPM); // Period length of the j-th rhythm (seconds)

      // ... schedule the Tone.Transport calls for the j-th rhythm inside this window.
      let first_cue = window_start + rhythm.offset; // Position of the first cue for the j-th rhythm in the i-th window
      let last_cue = window_end;

      console.log("BPM: ", rhythm.BPM, " offset: ", rhythm.offset)
      console.log("first cue: ", first_cue)
      console.log("last cue: ", last_cue)
      console.log("period_len: ", period_len)

      // Starting from the first cue, until we reach the end of the i-th window...
      for (let current_cue = first_cue; current_cue < last_cue; current_cue += period_len)
      {
        // ... add the cue. We can also pass many arguments to the callback function.
        console.log("Adding cue marker at position ", current_cue, ", j: ", j)
        let args = { _struck_rhythm_idx: j, _n_rhythms: n_rhythms }
        Tone.Transport.schedule(function () { current_rhythm_properties.update(args) }, current_cue);
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



function draw()
{
  let pulse_var = sin(s)*sin(s) //variable that is passed to lerpColor, defines the color variation aka pulsation
  if (current_rhythm_properties.n_rhythms == 0)
  {
    //clear();
  }
  // Draw here...
  else
  {
    // ONE RHYTHM
    if (current_rhythm_properties.n_rhythms == 1)
    {
      // Check if the rhythm has been struck
      if (current_rhythm_properties.rhythm_isStruck[0] == true)
      {
        // Set the flag back to false
        //current_rhythm_properties.rhythm_isStruck[0] = false;
        console.log("RHYTHM 1/1 STRUCK");
        //one shot pulsation
        if(flag_pulsation == false && pulse_var> 0.5)
        {
          flag_pulsation = true;
          flag_animation = true;
        }
        else if(flag_pulsation == true && pulse_var< 0.1)
        {
          console.log("terminating animation")
          flag_animation = false;
          current_rhythm_properties.rhythm_isStruck[0] = false;
        }
        if(flag_animation==true)
        {
          console.log("changing color ", color_palette_warm[0]);
          mondrian_blocks.update_color(color_palette_warm[0], pulse_var);
          s = s + 0.3;
        }
        else
        {
          flag_animation = true;
          flag_pulsation = false;
          s = 0;
        }
      }
      
    }

    // TWO RHYTHMS
    else if (current_rhythm_properties.n_rhythms == 2)
    {
      for (let i = 0; i < blocks.length; i++)
      {
        blocks[i].display(color(blocks[i].color));
      }
      // If both rhythms have been struck at the same time ...
      if (current_rhythm_properties.rhythm_isStruck[0] == true && current_rhythm_properties.rhythm_isStruck[1] == true)
      {
        console.log("RHYTHMS 1/2 AND 2/2 STRUCK")
        current_rhythm_properties.rhythm_isStruck[0] = false;
        current_rhythm_properties.rhythm_isStruck[1] = false;
        if(flag_pulsation == false && pulse_warm> 0.5){
          flag_pulsation = true;
          flag_animation = true;
        }else if(flag_pulsation == true && pulse_warm< 0.1){
          flag_animation = false;
        }
        if(flag_animation==true){
          pulsation(pulse_var, 1, 1)
          s = s + 0.5;
        }
     
        pulsation(pulse_var, 2, 2)
      }
      // If only the first rhythm has been struck ...
      else if (current_rhythm_properties.rhythm_isStruck[0] == true)
      {
        console.log("RHYTHM 1/2 STRUCK")
        current_rhythm_properties.rhythm_isStruck[0] = false;
        pulsation(pulse_var, 2, 1);
        //fill_1 = getRandomColor(3);
      }
      // If only the second rhythm has been struck ...
      else if (current_rhythm_properties.rhythm_isStruck[1] == true)
      {
        console.log("RHYTHM 2/2 STRUCK")
        current_rhythm_properties.rhythm_isStruck[1] = false;
        pulsation(pulse_var, 1);
        //fill_2 = getRandomColor(3);
      }
    }
    // THREE RHYTHMS
    else if (current_rhythm_properties.n_rhythms == 3)
    {
      for (let i = 0; i < blocks.length; i++)
      {
        blocks[i].display(color(blocks[i].color));
      }
      pulsation(pulse_var, 3);

    }
    // FOUR RHYTHMS
    else if (current_rhythm_properties.n_rhythms == 4)
    {
      for (let i = 0; i < blocks.length; i++)
      {
        blocks[i].display(color(blocks[i].color));
      }
      pulsation(pulse_var, 4);
      current_rhythm_properties.reset_flags();
    }
    else
    {
      background(127, 127, 127);
      window.alert("Too many rhythms, can't display");
    }
  }
}





/***************************************
 ***************************************
 ************* CONTROLLER **************
 ***************************************
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