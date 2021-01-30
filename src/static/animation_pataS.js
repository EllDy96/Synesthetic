let g 
let dim = 120

function setup() {
  createCanvas(720, 400);
  noStroke();
  //Draw all rectangles from their center as opposed to
  // the default upper left corner
  rectMode(CENTER);
  g = height + 25;
}

function draw() {
  background(143);
  //a = a + 0.05;
  //s = 2 * cos(a);
  if (g >= height/2){
    g = g - 5 
    translate(width/3, g)
  // vorrei far partire scale(s) solo dopo che g < heigth/2;
  // fill('rgb(255,183,255)');
  //  x = circle(0, 0, dim);
  }
  if (g < height/2){
    translate(width/3, g)
    dim = dim -4;
    if (dim == 0)
      noLoop();
  } 
  fill('rgb(255,183,255)');
  circle(0, 0, dim);  
}