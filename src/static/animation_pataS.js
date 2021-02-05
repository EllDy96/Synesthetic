//### THIS ANIMATION SIMULATE THE INFAMOUS PATATAP's ANIMATION FOR "S" KEY ###//
let g 
let dim = 120
let n_ritmi = 2;
let r
function setup() {
  createCanvas(720, 400);
  noStroke();
  //Draw all rectangles from their center as opposed to
  // the default upper left corner
  rectMode(CENTER);
  g = height + 25;
  r = height + 25;
}

function draw() {
  background(143);
  push();
  if (n_ritmi>=1){
  if (g >= height/2){
    g = g - 2
    //traslate(0,g);
  }
  if (g < height/2){
    //translate(0,g)
    dim = dim -1;
  } 
  fill('rgb(255,183,255)');
  circle(width/3, g ,dim);
  if(dim==0)
    noLoop();
}
  pop();
  
  push();
  if (n_ritmi>=2){
  if (r >= height/2){
     r = r - 8
    //traslate(0,g);
  }
  if (r < height/2){
    //translate(0,g)
    dim = dim -2;
  } 
  fill('rgb(5,18,255)');
  circle(width-55, r ,dim);
  if(dim==0)
    noLoop();
}
  pop();
  
}