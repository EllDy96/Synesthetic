const width=650;
const height=450;
function setup() {
  createCanvas(width,height);
  background(0);
  square1= new squareToCircle();
  square1.init(true);
  
}

function draw() {
  // Draw a square with rounded corners, each having a radius of 20.
    //square(width/3,height/3 , width/4 , 1);
  square1.create();  
  square1.display()
}

class squareToCircle {
  init(on) {
    this.xPos = width/3;
    this.yPos = height/3;
    this.size = width/4;
    this.radius=0
    this.on = true;
  }
  create(){
    square(this.xPos, this.yPos, this.size, this.radius)
  }
  display() {
    if (this.on) {
    fill(0,150,100,25); 
    stroke(50);
  
     this.radius= this.radius+1;
     if(this.radius>= this.size/1.3){
        this.radius=0;
        fill(255,Math.random()*150,25); 
     }
       
    }
    
  }
}