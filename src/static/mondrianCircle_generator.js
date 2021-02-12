/*
 *****************************MODEL*******************************************************************************************
 */
// toggleCircle= !toggleCircle // toggle of the variable that control the squareToCircle animation
//         for(let block of blocks){
//           block.toggleCircleAnimation(toggleCircle);
//         } 
var color_palette = 
[
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
let toggleCirle = false;

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
    // blocks[i].toggleCircleAnimation(toggleCirle);  
    blocks[i].toggleCircleAnimation(toggleCirle);
    blocks[i].display(blocks[i].color);


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
      blocks[i].display(c);

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
    this.angularRadius = 0;
    this.maxRadius = this.dim1;
    this.radiusOffset = 0;
    this.speed = 0.03;

  }
  //functionalities
  display(color_pass) {
    fill(color_pass)
    rect(this.x, this.y, this.dim1, this.dim2, this.angularRadius);
  }
  toggleCircleAnimation(toggle) {
    if (toggle) {
      this.squareToCircle();
    }

    if (!toggle) {
      this.circleToSquare();
    }

  }

  squareToCircle() {
    if (this.radiusOffset < 1) {
      this.radiusOffset += this.speed;
      console.log("this is radisOffset: ", this.radiusOffset, " and angularRadius: ", this.angularRadius)
      this.angularRadius = this.radiusOffset * this.maxRadius;
    } else {
      this.radiusOffset = 1;
    }
  }
  circleToSquare() {
    if (this.radiusOffset > 0.01) {
      this.radiusOffset -= this.speed;
      console.log("this is radisOffset: ", this.radiusOffset, " and angularRadius: ", this.angularRadius)
      this.angularRadius = this.radiusOffset * this.maxRadius;
    } else {
      this.radiusOffset = 0;
    }
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