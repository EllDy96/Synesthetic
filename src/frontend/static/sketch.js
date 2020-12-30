function setup() {
  createCanvas(720, 400);
 // noStroke();
}
let x = 0
let y = 0;
let dim = 80.0;

function draw() {
  background(14);
  // Animate by increasing our x value
  x = x - 5;
  // If the shape goes off the canvas, reset the position
  if (x < -dim) {
    x = width;
  }
  translate(x, y);
  
  fill(110);
  rect(0, 0, dim, height);
}
