/******************************************************************************************
 ********************************                      ************************************
 ********************************   HELPER FUNCTIONS   ************************************
 ********************************                      ************************************
 ******************************************************************************************/

function getRandomColor(brightness)
{
  // Six levels of brightness from 0 to 5, 0 being the darkest
  rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
  mix = [brightness * 51, brightness * 51, brightness * 51]; //51 => 255/5
  mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function (x) { return Math.round(x / 2.0) })
  return "rgb(" + mixedrgb.join(",") + ")";
}


function shuffle_array(array) //Fisher-Yates Shuffle algorhythm 
{
  currentIndex = array.length, temporaryValue, randomIndex;

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




/************************************************************************************************
 ***********************************                        *************************************
 ***********************************   CLASSES DEFINITION   *************************************
 ***********************************                        ***********************+*************
 ************************************************************************************************/

// The rhythm_properties class contains the up-to-date rhythmic information of the piece.
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

// Building blocks of the mondrian-like composition.
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
  display(_color) //specific for pulsation of color
  {
    fill(_color);
    rect(this.x, this.y, this.dim1, this.dim2);
  }
  display_xy(_x,_y) //specific for jitter
  {
    fill(this.color);
    
    rect(_x+this.dim1*0.025, _y+this.dim2*0.025, this.dim1 - this.dim1*0.05, this.dim2 - this.dim2*0.05);

  }

  display_unique(_x ,_y, _color, _dim1, _dim2, flag_jitter)
  {
    fill(_color)
    if(flag_jitter == false){
      rect(_x, _y, _dim1, _dim2)
    }else{
    rect(_x , _y, _dim1 - _dim1*0.025, _dim2 - _dim2*0.025) //otherwise jitter will cause glitch
    }
  }

}

// The MondrianBlocks class is responsible for the mondrian-like composition.

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

  // Assigns a color to every block of the composition
  assign_colors_to_blocks()
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

  // REASSIGN
  // REASSIGNS a color to every block of the composition
  reassign_colors_to_blocks()
  {
    let tot_area = 0;
    for (let i = 0; i < this.blocks.length; i++)
    {
      tot_area += this.blocks[i].area;
    }
    let avg_area = tot_area / this.blocks.length;

    for (let i = 0; i < this.blocks.length; i++)
    {
      if (this.blocks[i].area > avg_area)
      { //big blocks <-> cold colors
        this.blocks[i].color = random(this.color_palette_cold)
      } 
      else
      {  //small blocks <-> warm colors
        this.blocks[i].color = random(this.color_palette_warm)
      }
    }
  }

  // Temporarily (!) shifts the color of the blocks which have color==passed_color.
  // The color of those blocks is shifted towards color color_pulse_to based on the factor color_shift_coefficient.
  // color_shift_coefficient is a parameter in range [0,1]
  shift_color(passed_color, color_shift_coefficient)
  {
    for (let i in this.blocks)
    {
      //console.log("comparing ", this.blocks[i].color, " with ", passed_color)
      if (this.blocks[i].color == passed_color)
      {        
        //push()
        let color_pulse_from = color(this.blocks[i].color);
        let next_color = lerpColor(color_pulse_from, color(color_pulse_to), color_shift_coefficient);
        this.blocks[i].display_unique(this.blocks[i].x, this.blocks[i].y, next_color, this.blocks[i].dim1, this.blocks[i].dim2, false);
        //pop()
      }
      /*else
      {
        this.blocks[i].display(this.blocks[i].color);
      }*/
    }
  }

  shift_dimension(passed_color, dimension_shift_coefficient)
  {
    for(let i in this.blocks)
    {
      if (this.blocks[i].color == passed_color)
      {
        dim1_shift = this.blocks[i].dim1 - dimension_shift_coefficient*(this.blocks[i].dim1 / 2);
        dim2_shift = this.blocks[i].dim2 - dimension_shift_coefficient*(this.blocks[i].dim2 / 2);
        this.blocks[i].display_unique(this.blocks[i].x, this.blocks[i].y, this.blocks[i].color, dim1_shift, dim2_shift, false)
      }
    }
  }

  jitter_mondrian(passed_color, jitter_value_x, jitter_value_y) //color associated to the rhythm that is stroked right now
  {
    for(let i in this.blocks)
    {
      if(this.blocks[i].color == passed_color)
      {
        x_jit = this.blocks[i].x + jitter_value_x;
        y_jit = this.blocks[i].y + jitter_value_y;
        this.blocks[i].display_unique(x_jit, y_jit, this.blocks[i].color, this.blocks[i].dim1, this.blocks[i].dim2, true);
      }
    }
  }

  jitter_shift_color_combo(passed_color, jitter_value_x, jitter_value_y, color_shift_coefficient)
  {
    for(let i in this.blocks)
    {
      if(this.blocks[i].color == passed_color)
      {
        x_jit = this.blocks[i].x + jitter_value_x;
        y_jit = this.blocks[i].y + jitter_value_y;
        let color_pulse_from = color(this.blocks[i].color);
        let next_color = lerpColor(color_pulse_from, color(color_pulse_to), color_shift_coefficient);
        this.blocks[i].display_unique(x_jit, y_jit, next_color, this.blocks[i].dim1, this.blocks[i].dim2, true);


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

  generate_mondrian_from_center()
  {
    x_tlc = 0;
    y_tlc = 0;
    strokeWeight(this.stroke_dim);
    let currWidth = random(this.sizes);
    let currHeight = random(this.sizes);
    let x = x_tlc + (currWidth / 2);
    let y = y_tlc + (currHeight / 2);
    if (Math.random() < 0.5)
    { //two methods for creating the mondrian, randomly one of them will be executed for the current generation
      while (y_tlc + currHeight < this.height)
      {
        this.fillOnRows(y, currHeight)
        y_tlc += currHeight;
        let oldHeight = currHeight;
        currHeight = random(this.sizes);
        y = y +currHeight/2 + oldHeight/2;
      }
      y = y_tlc + (this.height - y_tlc) / 2
      this.fillOnRows(y, (this.height - y_tlc))
   } 
    else
    {
      while (x_tlc + currWidth < this.width)
      {
        this.fillOnColumns(x, currWidth)
        x_tlc += currWidth;
        let oldWidth = currWidth;
        currWidth = random(this.sizes)
        x = x + currWidth/2 + oldWidth/2;
      }
      x = x_tlc + (this.width - x_tlc) / 2
      this.fillOnColumns(x, (this.width - x_tlc))
    }

  }

  // Private-like methods
  fillOnRows(y, currHeight)
  {
    let currWidth = random(this.sizes);
    let oldWidth = 0;
    let curr_block;
    let x_tlc = 0;
    let x = x_tlc + currWidth/2 + oldWidth/2;

    while (x_tlc + currWidth + this.stroke_dim < this.width)
    {
      curr_block = new Block(x, y, currWidth, currHeight);
      this.blocks.push(curr_block);
      x_tlc += currWidth;
      oldWidth = currWidth;
      currWidth = random(this.sizes);
      x = x + currWidth/2 + oldWidth/2;
    }
    currWidth = this.width - x_tlc;
    x = x_tlc + currWidth/2 
    curr_block = new Block(x, y, currWidth, currHeight);
    this.blocks.push(curr_block)
  }

  fillOnColumns(x, currWidth)
  {
    let currHeight = random(this.sizes);
    let oldHeight = 0;
    let curr_block;
    let y_tlc = 0;
    let y = y_tlc + oldHeight/2 + currHeight/2;

    while (y_tlc + currHeight + this.stroke_dim < this.height)
    {
      curr_block = new Block(x, y, currWidth, currHeight);
      this.blocks.push(curr_block)
      y_tlc += currHeight;
      oldHeight = currHeight;
      currHeight = random(this.sizes);
      y = y + currHeight/2 + oldHeight/2;
    }
    currHeight = this.height - y_tlc;
    y = y_tlc + currHeight / 2;
    curr_block = new Block(x, y, currWidth, currHeight);
    this.blocks.push(curr_block)
  }
}



/************************************************************************************************
 ************************************                      **************************************
 ************************************   GLOBAL VARIABLES   **************************************
 ************************************                      **************************************
 ************************************************************************************************/

let mySound; // Stores the audio track
let rhythmic_content; // Stores the rhythmic content of the audio track, loaded from the JSON file
let n_windows; // Number of windows in mySound, each window contains different tempos
let current_rhythm_properties = new rhythm_properties(); // Instantiation of the rhythm_properties class
let pulse_speed = 0.1;
let jitter_speed = 1;
let jitter_value_x = 0;
let jitter_value_y = 0;
let x_jit, y_jit;
let flag_jitter;
let dim1_shift, dim2_shift, x_center, y_center;
let x_tlc, y_tlc;
let switch_pulse = false;
let switch_pulse_1 = false;
let pulse_speed_d = 0.05
let kick, snare, hihat, oh;

const color_pulse_to = "#ffffff"; // Target color of the pulse animation
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

const sizes = [50, 100, 100, 150, 150, 250, 300]; // Sizes of the block comprising the mondrian-like composition
let mondrian_blocks;

// For rhythm 0
let color_shift_coefficient = 0;
let s = 0;
let flag_animation = true;
let flag_pulsation = false;

// For rhythm 1
let color_shift_coefficient1 = 0;
let s1 = 0;
let flag_animation1 = true;
let flag_pulsation1 = false;

// For rhythm 2
let color_shift_coefficient2 = 0;
let s2 = 0;
let flag_animation2 = true;
let flag_pulsation2 = false;

// For rhythm 3
let color_shift_coefficient3 = 0;
let s3 = 0;
let flag_animation3 = true;
let flag_pulsation3 = false;






/************************************************************************************************
 ********************************                            ************************************
 ********************************   DATA LOADING AND SETUP   ************************************
 ********************************                            ************************************
 ************************************************************************************************/

// Load the audio file and the JSON file
function preload()
{
  loadJSON('static/assets/rhythm_file.json', storeJSON);
  mySound = new Tone.Player("static/assets/muzak_drums.wav").toDestination();
  //upload drum sounds
  kick = new Tone.Player("static/assets/Synesthetic_drums/kick_DM.wav").toDestination();
  snare = new Tone.Player('static/assets/Synesthetic_drums/snare.wav').toDestination();
  hihat = new Tone.Player('static/assets/Synesthetic_drums/hihat.wav').toDestination();
  oh = new Tone.Player('static/assets/Synesthetic_drums/oh.wav').toDestination();
}
function storeJSON(data)
{
  rhythmic_content = data;
  n_windows = rhythmic_content.n_windows;
}

// Initialize the canvas and schedule the addCue calls upon the audio file
function setup()
{
  // SET THE TARGET FPS
  frameRate(60);
  // INITIALIZE THE CANVAS
  createCanvas(windowHeight, windowHeight);
  background(255)
  rectMode(CENTER)
  mondrian_blocks = new MondrianBlocks(10, height, width, sizes, color_palette_warm, color_palette_cold);
  mondrian_blocks.generate_mondrian_from_center(); // generate the blocks
  mondrian_blocks.assign_colors_to_blocks(); // assign a color to every block
  mondrian_blocks.draw_mondrian(); // draw the blocks
  console.log("nel setup")


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




/************************************************************************************************
 *************************************                   ****************************************
 *************************************   VISUALIZATION   ****************************************
 *************************************                   ****************************************
 ************************************************************************************************/

function draw()
{
  // Recalculate the coefficients
  color_shift_coefficient = sin(s)*sin(s) //variable that is passed to lerpColor, defines the color variation aka pulsation
  color_shift_coefficient1 = sin(s1)*sin(s1)
  color_shift_coefficient2 = sin(s2)*sin(s2)
  color_shift_coefficient3 = sin(s3)*sin(s3)
  jitter_value_x = random(-jitter_speed, jitter_speed)
  jitter_value_y = random(-jitter_speed, jitter_speed)

  if(keyIsPressed == true && key == 'p' && mySound.state=="stopped")
  {
    play();
  }

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
        // One-shot pulsation
        if(flag_pulsation == false && color_shift_coefficient> 0.5)
        {
          flag_pulsation = true;
          flag_animation = true;
        }
        else if(flag_pulsation == true && color_shift_coefficient< 0.1)
        {
          console.log("terminating animation")
          flag_animation = false;
          current_rhythm_properties.rhythm_isStruck[0] = false;
        }
        if(flag_animation==true)
        {
          console.log("changing color ", color_palette_warm[0]);
          mondrian_blocks.shift_color(color_palette_warm[0], color_shift_coefficient);
          s = s + pulse_speed;
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
      // If only the first rhythm has been struck ...
      if (current_rhythm_properties.rhythm_isStruck[0] == true)
      {
        console.log("RHYTHM 1/2 STRUCK")
        if(flag_pulsation == false && color_shift_coefficient> 0.5)
        {
          flag_pulsation = true;
          flag_animation = true;
        }
        else if(flag_pulsation == true && color_shift_coefficient< 0.1)
        {
          console.log("terminating animation")
          flag_animation = false;
          current_rhythm_properties.rhythm_isStruck[0] = false;
        }
        if(flag_animation==true)
        {
          console.log("changing color ", color_palette_warm[0]);
          mondrian_blocks.shift_color(color_palette_warm[0], color_shift_coefficient);
          s = s + pulse_speed;
        }
        else
        {
          flag_animation = true;
          flag_pulsation = false;
          s = 0;
        }
      }
      // If only the second rhythm has been struck ...
      if (current_rhythm_properties.rhythm_isStruck[1] == true)
      {
        console.log("RHYTHM 2/2 STRUCK")
        if(flag_pulsation1 == false && color_shift_coefficient1> 0.5)
        {
          flag_pulsation1 = true;
          flag_animation1 = true;
        }
        else if(flag_pulsation1 == true && color_shift_coefficient1< 0.1)
        {
          console.log("terminating animation")
          flag_animation1 = false;
          current_rhythm_properties.rhythm_isStruck[1] = false;
        }
        if(flag_animation1==true)
        {
          console.log("changing color ", color_palette_warm[1]);
          mondrian_blocks.shift_color(color_palette_warm[1], color_shift_coefficient1);
          s1 = s1 + pulse_speed;
        }
        else
        {
          flag_animation1 = true;
          flag_pulsation1 = false;
          s1 = 0;
        }
      }
    }

    // THREE RHYTHMS
    else if (current_rhythm_properties.n_rhythms == 3)
    {
      // If only the first rhythm has been struck ...
      if (current_rhythm_properties.rhythm_isStruck[0] == true)
      {
        console.log("RHYTHM 1/3 STRUCK")
        if(flag_pulsation == false && color_shift_coefficient> 0.5)
        {
          flag_pulsation = true;
          flag_animation = true;
        }
        else if(flag_pulsation == true && color_shift_coefficient< 0.1)
        {
          console.log("terminating animation")
          flag_animation = false;
          current_rhythm_properties.rhythm_isStruck[0] = false;
        }
        if(flag_animation==true)
        {
          console.log("changing color ", color_palette_warm[0]);
          mondrian_blocks.shift_color(color_palette_warm[0], color_shift_coefficient);
          s = s + pulse_speed;
        }
        else
        {
          flag_animation = true;
          flag_pulsation = false;
          s = 0;
        }
      }
      // If only the second rhythm has been struck ...
      if (current_rhythm_properties.rhythm_isStruck[1] == true)
      {
        console.log("RHYTHM 2/3 STRUCK")
        if(flag_pulsation1 == false && color_shift_coefficient1> 0.5)
        {
          flag_pulsation1 = true;
          flag_animation1 = true;
        }
        else if(flag_pulsation1 == true && color_shift_coefficient1< 0.1)
        {
          console.log("terminating animation")
          flag_animation1 = false;
          current_rhythm_properties.rhythm_isStruck[1] = false;
        }
        if(flag_animation1==true)
        {
          console.log("changing color ", color_palette_warm[1]);
          mondrian_blocks.shift_color(color_palette_warm[1], color_shift_coefficient1);
          s1 = s1 + pulse_speed;
        }
        else
        {
          flag_animation1 = true;
          flag_pulsation1 = false;
          s1 = 0;
        }
      }
      // If only the third rhythm has been struck...
      if (current_rhythm_properties.rhythm_isStruck[2] == true)
      {
        console.log("RHYTHM 3/3 STRUCK")
        if(flag_pulsation2 == false && color_shift_coefficient2> 0.5)
        {
          flag_pulsation2 = true;
          flag_animation2 = true;
        }
        else if(flag_pulsation2 == true && color_shift_coefficient2< 0.1)
        {
          console.log("terminating animation")
          flag_animation2 = false;
          current_rhythm_properties.rhythm_isStruck[2] = false;
        }
        if(flag_animation2==true)
        {
          console.log("changing color ", color_palette_cold[0]);
          mondrian_blocks.shift_color(color_palette_cold[0], color_shift_coefficient2);
          s2 = s2 + pulse_speed;
        }
        else
        {
          flag_animation2 = true;
          flag_pulsation2 = false;
          s2 = 0;
        }
      }
    }


    // FOUR RHYTHMS
    else if (current_rhythm_properties.n_rhythms == 4)
    {
      
      if(keyIsPressed == true && key == 'a' && kick.state=="stopped")
      {
        current_rhythm_properties.rhythm_isStruck[0] = true;
        kick.start();
      }
      if(keyIsPressed == true && key == 's' && snare.state=="stopped")
      {
        current_rhythm_properties.rhythm_isStruck[1] = true;
        snare.start();
      }
      if(keyIsPressed == true && key == 'd' && hihat.state=="stopped")
      {
        current_rhythm_properties.rhythm_isStruck[2] = true;
        hihat.start();
      }
      if(keyIsPressed == true && key == 'w' && oh.state=="stopped")
      {
        current_rhythm_properties.rhythm_isStruck[3] = true;
        oh.start();
      }

      // If only the first rhythm has been struck ...
      if (current_rhythm_properties.rhythm_isStruck[0] == true && switch_pulse == false)
      {
        console.log("RHYTHM 1/4 STRUCK")
        if(flag_pulsation == false && color_shift_coefficient > 0.99) // this way color shift_coefficient goes from 0 to 1
        {
          flag_pulsation = true;
          flag_animation = true;
        }
        else if(flag_pulsation == true) // && color_shift_coefficient< 0.1)
        {
          console.log("terminating animation")
          flag_animation = false;
          current_rhythm_properties.rhythm_isStruck[0] = false;
        }
        if(flag_animation==true)
        {
          //mondrian_blocks.jitter_mondrian(color_palette_warm[0], jitter_value_x, jitter_value_y); // jitter response
          console.log("changing color ", color_palette_warm[0]);
          //mondrian_blocks.shift_color(color_palette_warm[0], color_shift_coefficient); // pulsation response
          mondrian_blocks.jitter_shift_color_combo(color_palette_warm[0], jitter_value_x, jitter_value_y, color_shift_coefficient) //pulsation + jitter response

          s = s + pulse_speed_d;
        }
        else
        {
          flag_animation = true;
          flag_pulsation = false;
          switch_pulse = true;
          //s = 0 -- now i have color_shift _coefficient ~= 1
          jitter_value_x = 0;
          jitter_value_y = 0;
        }
      }else if(current_rhythm_properties.rhythm_isStruck[0] == true && switch_pulse == true)
      {
        if(flag_pulsation == false && color_shift_coefficient < 0.01) // this way color shift_coefficient goes from 1 to 0
        {
          flag_pulsation = true;
          flag_animation = true;
        }
        else if(flag_pulsation == true) // && color_shift_coefficient< 0.1)
        {
          console.log("terminating animation")
          flag_animation = false;
          current_rhythm_properties.rhythm_isStruck[0] = false;
        }
        if(flag_animation==true)
        {
          //mondrian_blocks.jitter_mondrian(color_palette_warm[0], jitter_value_x, jitter_value_y); // jitter response
          console.log("changing color ", color_palette_warm[0]);
          //mondrian_blocks.shift_color(color_palette_warm[0], color_shift_coefficient); // pulsation response
          mondrian_blocks.jitter_shift_color_combo(color_palette_warm[0], jitter_value_x, jitter_value_y, color_shift_coefficient) //pulsation + jitter response

          s = s + pulse_speed_d;
        }
        else
        {
          switch_pulse = false;
          flag_animation = true;
          flag_pulsation = false;
          //s = 0 
          jitter_value_x = 0;
          jitter_value_y = 0;
        }
      }
      // If only the second rhythm has been struck ...
      if (current_rhythm_properties.rhythm_isStruck[1] == true)
      {
        console.log("RHYTHM 2/4 STRUCK")
        if(flag_pulsation1 == false && color_shift_coefficient1> 0.8)
        {
          flag_pulsation1 = true;
          flag_animation1 = true;
        }
        else if(flag_pulsation1 == true) // && color_shift_coefficient1< 0.1)
        {
          console.log("terminating animation")
          flag_animation1 = false;
          current_rhythm_properties.rhythm_isStruck[1] = false;
        }
        if(flag_animation1==true)
        {
          jitter_value_x = random(-jitter_speed, jitter_speed);
          jitter_value_y = random(-jitter_speed, jitter_speed);
          console.log("changing color ", color_palette_warm[1]);
          //mondrian_blocks.shift_color(color_palette_warm[1], color_shift_coefficient1);
          mondrian_blocks.jitter_mondrian(color_palette_warm[1], jitter_value_x, jitter_value_y)
          
          s1 = s1 + pulse_speed;
        }
        else
        {
          jitter_value_x = 0;
          jitter_value_y = 0;
          flag_animation1 = true;
          flag_pulsation1 = false;
          s1 = 0;
        }
      }
      // If only the third rhythm has been struck...
      if (current_rhythm_properties.rhythm_isStruck[2] == true && switch_pulse_1 == false)
      {
        console.log("RHYTHM 3/4 STRUCK")
        if(flag_pulsation2 == false && color_shift_coefficient2 > 0.99) // this way color shift_coefficient goes from 0 to 1
        {
          flag_pulsation2 = true;
          flag_animation2 = true;
        }
        else if(flag_pulsation2 == true) // && color_shift_coefficient< 0.1)
        {
          console.log("terminating animation")
          flag_animation2 = false;
          current_rhythm_properties.rhythm_isStruck[2] = false;
        }
        if(flag_animation2==true)
        {
          //mondrian_blocks.jitter_mondrian(color_palette_warm[0], jitter_value_x, jitter_value_y); // jitter response
          console.log("changing color ", color_palette_cold[0]);
          //mondrian_blocks.shift_color(color_palette_warm[0], color_shift_coefficient); // pulsation response
          mondrian_blocks.shift_color(color_palette_cold[0], color_shift_coefficient2) //pulsation + jitter response

          s2 = s2 + pulse_speed_d;
        }
        else
        {
          flag_animation2 = true;
          flag_pulsation2 = false;
          switch_pulse_1 = true;
          //s = 0 -- now i have color_shift _coefficient ~= 1
        }
      }else if(current_rhythm_properties.rhythm_isStruck[2] == true && switch_pulse_1 == true)
      {
        if(flag_pulsation2 == false && color_shift_coefficient2 < 0.01) // this way color shift_coefficient goes from 1 to 0
        {
          flag_pulsation2 = true;
          flag_animation2 = true;
        }
        else if(flag_pulsation2 == true) // && color_shift_coefficient< 0.1)
        {
          console.log("terminating animation")
          flag_animation2 = false;
          current_rhythm_properties.rhythm_isStruck[2] = false;
        }
        if(flag_animation2==true)
        {
          //mondrian_blocks.jitter_mondrian(color_palette_warm[0], jitter_value_x, jitter_value_y); // jitter response
          console.log("changing color ", color_palette_cold[0]);
          //mondrian_blocks.shift_color(color_palette_warm[0], color_shift_coefficient); // pulsation response
          mondrian_blocks.shift_color(color_palette_cold[0], color_shift_coefficient2) //pulsation + jitter response

          s2 = s2 + pulse_speed_d;
        }
        else
        {
          switch_pulse_1 = false;
          flag_animation2 = true;
          flag_pulsation2 = false;
          //s = 0 
        }
      }
      // if (current_rhythm_properties.rhythm_isStruck[2] == true)
      // {
      //   console.log("RHYTHM 3/4 STRUCK")
      //   if(flag_pulsation2 == false && color_shift_coefficient2> 0.5)
      //   {
      //     flag_pulsation2 = true;
      //     flag_animation2 = true;
      //   }
      //   else if(flag_pulsation2 == true && color_shift_coefficient2< 0.1)
      //   {
      //     console.log("terminating animation")
      //     flag_animation2 = false;
      //     current_rhythm_properties.rhythm_isStruck[2] = false;
      //   }
      //   if(flag_animation2==true)
      //   {
      //     console.log("changing color ", color_palette_cold[0]);
      //     mondrian_blocks.shift_dimension(color_palette_cold[0], color_shift_coefficient2);
      //    // mondrian_blocks.shift_color(color_palette_cold[0], color_shift_coefficient2);
          
      //     s2 = s2 + pulse_speed;
      //   }
      //   else
      //   {
         
      //     flag_animation2 = true;
      //     flag_pulsation2 = false;
      //     s2 = 0;
      //   }
      // }

      // If only the fourth rhythm has been struck...
      if (current_rhythm_properties.rhythm_isStruck[3] == true)
      {
        console.log("RHYTHM 4/4 STRUCK")
        if(flag_pulsation3 == false && color_shift_coefficient3> 0.5)
        {
          flag_pulsation3 = true;
          flag_animation3 = true;
        }
        else if(flag_pulsation3 == true && color_shift_coefficient3< 0.1)
        {
          console.log("terminating animation")
          flag_animation3 = false;
          current_rhythm_properties.rhythm_isStruck[3] = false;
        }
        if(flag_animation3==true)
        {
          console.log("changing color ", color_palette_cold[1]);
          //mondrian_blocks.jitter_mondrian(color_palette_cold[1], jitter_value_x, jitter_value_y)
          mondrian_blocks.shift_color(color_palette_cold[1], color_shift_coefficient3);
          
          s3 = s3 + pulse_speed;
        }
        else
        {
          flag_animation3 = true;
          flag_pulsation3 = false;
          s3 = 0;
          //jitter_value_x = 0;
          //jitter_value_y = 0;
        }
      }
    }
    else
    {
      background(127, 127, 127);
      window.alert("Too many rhythms, can't display");
    }
  }
}





/************************************************************************************************
 *************************************                *******************************************
 *************************************   CONTROLLER   *******************************************
 *************************************                *******************************************
 ************************************************************************************************/

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