// Imported to : https://cdnjs.com/libraries/p5.js

let song;
let canvas;
let showCircle = 0;
let beatsPerBar = 4;
let BPM = 60;
let frequency = 60 / BPM * 1000;
let interval;
let len;
var currentTime;
var volumeSlider; // to manually control the output volume 
const colors = ['blue', 'green', 'yellow', 'pink', 'purple', 'red'];


// we have to preload the data before using it with the function preload()
function preload() {
  song = loadSound('uploadedTracks/testTrack.mp3');
 
}


function setup() {
  canvas = createCanvas(800, 400);
  
  len = song.duration();
  console.log('duration of the song in minutes: ' + (len / 60)); // Return the duration of the song in seoconds
  currentTime = song.currentTime();
  volumeSlider = createSlider(0, 1, 0.5, 0.01); // creating a volumeSlider to costomly modify the volume
  
}

// The function draw() in p5 is made as an infinite loop that keep drawing
function draw() {
  background(200);
  song.setVolume(volumeSlider.value());
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
      console.log('showCircle ', showCircle, frequency)
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





// let BPM = 60;
// let fqr = 60 / BPM * 1000;
// const colors = ['blue', 'green', 'yellow', 'pink', 'purple', 'red'];
// const colorsLength= colors.length;

// var rect1;
// var rect2;
// var color1;



// function setup() {
//   createCanvas(400, 400);
//   background(150);
// }



// function draw() {
  
//   rect1= rect(200,150,75,75); 
  
  
// }

// let i=1;

// setInterval(()=>{
  
//   var index = i % colorsLength; 
//   console.log("valore dell'indice "+index);
//   i++;
//   fill(colors[index]);
//   },fqr);
//   console.log( "questo è il colore" ,colors[index]);