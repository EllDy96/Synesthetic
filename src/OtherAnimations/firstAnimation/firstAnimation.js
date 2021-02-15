//Model
let song;
let canvas;
let interval;
let width = 650;
let heigth = 400;
let n = 0
let r = 0;
let theta = 0
var speed = 0.1;
var ring1, ring2;

var col = {
  r: 255,
  g: 0,
  b: 0
};

//Viewer

function preload() {
  song = createAudio('uploadedTracks/testTrack.mp3');

}

var ring1, ring2;

function setup() {
  createCanvas(width, heigth);

  volumeSlider = createSlider(0, 1, 0.5, 0.01);
  //song.showControls();
  background(10,238,35)
  ring1 = new Ring();
  ring1.start(true);
  spirale1= new Spirale();
  spirale1.start(true);
}

function draw() {
   spirale1.display();
   ring1.grow();
   
   ring1.display();
   

}

class Spirale {
  start(onOf) {
    this.r = 0.1;
    this.theta = 0;
    this.speed = 0.08;
    this.on = onOf;
  };

  display() {
    if (this.on) {
      // Create an alpha blended background
      noStroke();
      fill(0, 10);
      rect(0, 0, width, height);
      translate(width / 2, height / 2);

      var y = this.r * (sin(this.theta) * 15);
      var x = (this.r * cos(this.theta) * 15);
      // Get a noise value based on xoff and scale
      // it accothis.rding to the window's width
      //let n = noise(xoff) * width;
      // Draw the ellipse at the value poduced by perlin noise
      fill(2, 250, 250);
      ellipse(x, y, width/5, heigth/4);
      this.theta += this.speed;
      this.r += this.speed;
      if (this.r > 27) {
        this.r = 0;
      }
    }
  }

}
class Ring {
  start(onOf) {
    this.x = 0;
    this.y = 0;
    this.on = onOf;
    this.diameter = height - 10;
    this.angle = 5;
  };

  grow() {
    if (this.on == true) {
      this.diameter =(width / 4 + (sin(this.angle) * this.diameter) / 4 + this.diameter / 4);
      if (this.diameter > width/2 ) {
        this.diameter = 0.0;
      }
    }
  }

  display() {
    if (this.on == true) {
      //Fill(0, 10);
      
      // strokeWeight(2);
      // stroke(155, 153);
      ellipseMode(CENTER);
      ellipse(this.x, this.y, this.diameter, this.diameter);
      this.angle += 0.08;
    }
  }
}
//Controller
function play() {

  song.play();

}

function pause() {

  song.pause();

}



const btnPlay = document.querySelector("#btn-play");
btnPlay.addEventListener("click", play);

const btnPause = document.querySelector("#btn-pause");
btnPause.addEventListener("click", pause);