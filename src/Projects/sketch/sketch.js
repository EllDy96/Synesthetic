// reference :https://medium.com/@nishancw/audio-visualization-in-javascript-with-p5-js-cf3bc7f1be07
let song;
let canvas;
let amp;

function preload() {
  song = loadSound('testTrack.mp3');
}

function setup() {
  canvas1 = createCanvas(400, 400);
  canvas2 = createCanvas(200,200);
  
}

function draw() {
  background(0);
  if (amp) {
    let vol = amp.getLevel();
    ellipse(height / 2, width / 2, vol * 500, vol * 500,200);
  }
}

function play() {
  song.play();
  amp = new p5.Amplitude();
} 

function pause(){
  song.pause();
} 

const btnPlay = document.querySelector("#btn-play");
btnPlay.addEventListener("click", play);

const btnPause = document.querySelector("#btn-pause");
btnPause.addEventListener("click", pause);