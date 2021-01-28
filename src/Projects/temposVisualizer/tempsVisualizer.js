//Model
var colorMap = {
  color1: 'blue',
  color2: 'green',
};
var colorOff = 'white';

let song;
let canvas;
let interval;


//Viewer

function preload() {
  song = loadSound('uploadedTracks/testTrack.mp3');
  // return the exact tuccent time of the song, it works in seconds
}

function setup() {
  createCanvas(400, 400);
  background(150);
  volumeSlider = createSlider(0, 1, 0.5, 0.01)
}




function draw() {


  song.setVolume(volumeSlider.value());

  rect1 = rect(200, 150, 75, 75);
  fill(colorMap.color1);

  rect2 = rect(100, 150, 75, 75);
  fill(colorMap.color2);
  //console.log("questo è il colore fuori dalla parentisi" ,color1);
}

//Controller
function play() {
  if (!song.isPlaying()) {
    song.play();
    var interval1= setTempoInColors('color1', 60);
    var interval2 =setTempoInColors('color2', 120);
  }
}

function pause() {
  if (song.isPlaying()) {
    song.pause();
    clearInterval(interval1);
    clearInterval(interval2);
  }
}

function setTempoInColors(colorName, BPM) {
  let frequency = 60 / BPM * 1000;
  const colorOn = colorMap[colorName];
  interval = setInterval(() => {
    if (colorMap[colorName] === colorOn) {
      colorMap[colorName] = colorOff;
    } else {
      colorMap[colorName] = colorOn;
    }
  }, frequency);
}

const btnPlay = document.querySelector("#btn-play");
btnPlay.addEventListener("click", play);

const btnPause = document.querySelector("#btn-pause");
btnPause.addEventListener("click", pause);