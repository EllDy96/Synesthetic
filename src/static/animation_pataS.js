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
  if (g >= height/2){
    g = g - 8
    //traslate(0,g);
  }
  if (g < height/2){
    //translate(0,g)
    dim = dim -4;
  } 
  fill('rgb(255,183,255)');
  circle(width/3, g ,dim);
  if(dim==0)
    noLoop();
}