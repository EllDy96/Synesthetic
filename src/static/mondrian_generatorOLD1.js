var color_palette = 
[
    "#d24632",
    "#f5e132",
    "#3278aa",
    "#ffffff",
];

let x,y,dim1,dim2, b1, b2, numblocks;
let c1,c2,c3,c4,pulse_var,s;
var blocks= []; //array containing the blocks
var sizes = [50, 100, 100, 150, 150, 200, 250, 300, 350, 400]; // old: [50, 100, 150, 200];
var rnd_color;
var color_pulse, n_colors;
var curr_block;
var stroke_dim;
var exceed_elem;

function setup() 
{
  createCanvas(windowHeight, windowHeight);
  stroke_dim = 10;
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
  //random-proportioned color assignment
  n_colors = floor(blocks.length / color_palette.length);
  exceed_elem = blocks.length % color_palette.length;
  print (exceed_elem)
  blocks = shuffle_array(blocks);
  color_palette = shuffle_array(color_palette);
  var j = 0;
  while(j<color_palette.length){
    for(;i<n_colors*(j+1); i++){
      blocks[i].color = color_palette[j]
    }
    j+=1;
  }
  if(exceed_elem != 0){
    for(var i=blocks.length-1; i>blocks.length-exceed_elem-1; i--){
      blocks[i].color = color_palette[j-1];
    }
  }
  c1 = color(204, 102, 0); //orange
  c2 = color(0, 102, 153); //blue
  c3 = color(224, 175, 238);
  c4 = color(155, 155, 155);
  pulse_var= 0;
  s= 0;
}

function draw() 
{
  background(125)
  for(let i = 0; i < blocks.length; i++)
  {

    blocks[i].display(color(blocks[i].color));
  }

  s = s + 0.1;
  pulse_var = cos(s)
  pulsation(pulse_var);
}

function pulsation(pulse_var)
{
  push()
  for (i = 0; i<blocks.length; i++)
  {
    if(blocks[i].color == color_palette[0])
    {
      let color_pulse = color(blocks[i].color);
      let c = lerpColor(c3,color_pulse, pulse_var);
      blocks[i].display(c);
    }
  }
  pop()
}



class Block {
  //constructor
  constructor(x, y, dim_1, dim_2, color) {
    this.x = x;
    this.y = y;
    this.dim1 = dim_1;
    this.dim2 = dim_2;
    this.color = color;
    this.area = (this.dim1 * this.dim2);

  }
  //functionalities
  display(color_pass) {
    fill(color_pass)
    rect(this.x, this.y, this.dim1, this.dim2)
  }

}

function fillOnRows(y, currHeight) {
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

function fillOnColumns(x, currWidth) {
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
