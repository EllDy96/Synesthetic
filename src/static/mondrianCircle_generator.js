/*
 *****************************MODEL*******************************************************************************************
 */


var color_palette = [
  "#d24632",
  "#f5e132",
  "#3278aa",
  "#ffffff",
  "#ffffff"
];

let x, y, dim1, dim2, b1, b2, numblocks;
let c1, c2, c3, c4, k, s;
var blocks = []; //array containing the blocks
var sizes = [50, 150, 200, 250, 300, 350, 400]; // old: [50, 100, 150, 200];
var rnd_color;
var c_;
var curr_block;
var displayCircles = false;
/*
 *****************************VIEW*******************************************************************************************
 */
function setup() {
  //createCanvas(windowWidth-20, windowHeight-20);
  createCanvas(800, 800);
  background(0);
  strokeWeight(10);
  var i = 0;
  var x = 0;
  var y = 0;
  var currWidth = random(sizes);
  var currHeight = random(sizes);

  if (Math.random() < 0.5) {
    while (y + currHeight < height) {
      fillOnRows(y, currHeight)
      y = y + currHeight;
      currHeight = random(sizes);
    }
    fillOnRows(y, height - y)
  } else {
    while (x + currWidth < width) {
      fillOnColumns(x, currWidth)
      x = x + currWidth;
      currWidth = random(sizes)
    }
    fillOnColumns(x, width - x)
  }

  //diagonale principale ->primi n mondrian con dimensioni random
  // for (i=0; x<width && y<height; i++){
  //   rnd_color = random(color_palette);
  //   blocks[i] = new Block(x,y, currWidth, currHeight, rnd_color);
  //   x = x + currWidth;
  //   y = y + currHeight;
  //   currWidth=random(sizes);
  //   currHeight=random(sizes);
  // }
  //still setup bruh
  c1 = color(204, 102, 0); //orange
  c2 = color(0, 102, 153); //blue
  c3 = color(224, 175, 238);
  c4 = color(155, 155, 155);
  //noLoop();
  k = 0;
  s = 0;
}

function draw() {
  for (let i = 0; i < blocks.length; i++) {
    // displayCircle is the variable to check if we want to draw cirle of rectangle 
    if (!displayCircles) {
      blocks[i].displayRect(blocks[i].color);
    } else {
      blocks[i].displayCircle(blocks[i].color);
    }

    //blocks[i].display(blocks[i].color);
  }

  s = s + 0.1;
  k = cos(s)
  setGradient(s, k);
}

function setGradient(s, k) {
  push()
  for (i = 0; i < blocks.length; i++) {
    if (blocks[i].color == color_palette[0]) {
      let c_ = color(blocks[i].color);
      let c = lerpColor(c1, c_, k);
      if (!displayCircles) {
        blocks[i].displayRect(c);
      } else {
        blocks[i].displayCircle(c);
      }
    }
  }
  pop()
}

/*
 *****************************CONTROLLER*******************************************************************************************
 */

class Block {
  //constructor
  constructor(x, y, dim_1, dim_2, color) {
    this.x = x;
    this.y = y;
    this.dim1 = dim_1;
    this.dim2 = dim_2;
    this.color = color;
    this.area = (this.dim1 * this.dim2);
    this.radius = 0;
  }
  //functionalities

  displayCircle(color_pass) {
    fill(color_pass)
    square(this.x, this.y,this.dim2, this.radius);
    this.radius+=3;
  }
  displayRect(color_pass) {
    this.radius = 0;
    fill(color_pass)
    rect(this.x, this.y, this.dim1, this.dim2);
  }
}

function fillOnRows(y, currHeight) {
  currWidth = random(sizes);
  x = 0;
  while (x + currWidth < width) {
    rnd_color = random(color_palette);
    curr_block = new Block(x, y, currWidth, currHeight, rnd_color);
    blocks.push(curr_block)
    x = x + currWidth;
    currWidth = random(sizes);
  }

  curr_block = new Block(x, y, width - x, currHeight, rnd_color);
  blocks.push(curr_block)

}

function fillOnColumns(x, currWidth) {
  currHeight = random(sizes);
  y = 0;
  while (y + currHeight < height) {
    rnd_color = random(color_palette);
    curr_block = new Block(x, y, currWidth, currHeight, rnd_color);
    blocks.push(curr_block)
    y = y + currHeight;
    currHeight = random(sizes);
  }

  curr_block = new Block(x, y, currWidth, height - y, rnd_color);
  blocks.push(curr_block)

}