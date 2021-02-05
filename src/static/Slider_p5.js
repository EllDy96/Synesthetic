// Constants

let   c1, c2, kk, ss, s;

function setup() {
  createCanvas(710, 400);
 // Define colors
  background(155)
  c1 = color(204, 102, 0); //orange
  c2 = color(0, 102, 153); //blue
  c3 = color(224,175,238);
  c4 = color(155, 155, 155);
  //noLoop();
  kk= 0;
  s = 0;
}

function draw() {
  // Background
  // Foreground
  s = s + 0.03
  tt = cos(s)*cos(s)
  kk = cos(s)
  ss = sin(s) 
  setGradient(100,190, 540, 80, c2, c1, kk, ss, tt);
}
function first(i,x){
  if(i<x+50)
    return 
}

function setGradient(x, y, w, h, c1, c2, kk, ss,tt) {
  //noFill(); 

  push()
    // Top animation
    for (let i = x; i <= x + w; i++) {
      //let inter = map(i, x, x + w, first(i,x), last(i,x));
      let c = lerpColor(c1, c4,tt);
      stroke(c);
      line(i, 150, i, 70);
     }
    pop()
  //middle animation
    push()
     for (let q = x+w; q>=x; q--){
      let inter = map(q, x, x+w, kk, ss);
      let c = lerpColor(c1, c3,inter);
      stroke(c);
      line(q, y-h+66,q,y+66);   
    }
  pop()
 //bottom animation
  push()
   for (let j = x; j<=x+w; j++){
     
     if(j<x+w*s){
      let inter = map(j,x,x + w*s, 0, 0.9);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(j,280,j,360);
     }
     else {
      let inter = map(j, x+w*s ,x+w , 0.9, 0);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(j, 280,j,360);
     }
       
    }
  pop()
  
}