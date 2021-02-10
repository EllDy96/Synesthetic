const width = 650;
const height = 450;
var displayCircle = false;

function setup() {
  createCanvas(width, height);
  background(0);
  square1 = new squareToCircle();
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
    this.xPos = width / 3;
    this.yPos = height / 3;
    this.heigthSize = width / 3;
    this.widthSize = width / 4;
    this.radius = 0
    this.theta = 0
    this.maxDiameter = 50
    this.on = on;
  }
  create() {
    rect(this.xPos, this.yPos, this.widthSize, this.heigthSize, this.radius)
  }
  display() {
    if (this.on) {
      fill(150, 100, 25);
      
      this.radius = this.widthSize + sin(this.theta) * this.widthSize;
      
      

      //this.radius+= sin(this.theta)
      
      
      

    }

  }

}