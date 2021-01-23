// reference :https://medium.com/@nishancw/audio-visualization-in-javascript-with-p5-js-cf3bc7f1be07
let song;
let canvas;
let amp;
let showCircle = 0;
let beatsPerBar = 4;
let BPM = 60;
let frequency = 60 / BPM * 1000;
let interval;
const colors = ['blue', 'green', 'yellow', 'pink', 'purple', 'red'];

function preload() {
  song = loadSound('testTrack.mp3');
}

function setup() {
  canvas = createCanvas(1000, 400);
}

function draw() {
  background(0);
  drawCircles(beatsPerBar);
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

function pause(){
  if (song.isPlaying()) {
    song.pause();
    clearInterval(interval);
  }
} 

const btnPlay = document.querySelector("#btn-play");
btnPlay.addEventListener("click", play);

const btnPause = document.querySelector("#btn-pause");
btnPause.addEventListener("click", pause);