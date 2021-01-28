let song;
let canvas;
let amp;
let showCircle = 0;
let beatsPerBar = 4;
let BPM = 60;
let frequency = 60 / BPM * 1000;
let interval;
var volumeSlider; // to manually control the output volume 
const colors = ['blue', 'green', 'yellow', 'pink', 'purple', 'red'];
// we have to preload the data before using it with the function preload()
function preload() {
  song = loadSound('uploadedTracks/testTrack.mp3');
}

function setup() {
  canvas = createCanvas(800, 400);
  song.addCue(2 ,changeBackground);
  volumeSlider = createSlider(0, 1, 0.5, 0.01); // creating a volumeSlider to costomly modify the volume
  
}

// The function draw() in p5 is made as an infinite loop that keep drawing
function draw() {
  background(50);
  song.setVolume(volumeSlider.value());
  drawCircles(beatsPerBar);
}

function changeBackground(){
  // background(255);
  loop(background(150));
}

function drawCircles() {
  for (let i = 0; i < beatsPerBar; i++) {
    drawCircle(120 * (i + 1), 175, showCircle === i)
    fill(colors[i]);
  }
}

function drawCircle(x, y, show) {
  circle(x, y, show ? 100 : 0);
}


function play() {
  if (!song.isPlaying()) {
    song.play();
    interval = setInterval(() => {
      console.log('showCircle', showCircle, frequency)
      showCircle = (showCircle + 1) % beatsPerBar;
    }, frequency);
  }
}

function pause() {
  if (song.isPlaying()) {
    song.pause();
    clearInterval(interval);
  }
}

const btnPlay = document.querySelector("#btn-play");
btnPlay.addEventListener("click", play);

const btnPause = document.querySelector("#btn-pause");
btnPause.addEventListener("click", pause);