// reference :https://medium.com/@nishancw/audio-visualization-in-javascript-with-p5-js-cf3bc7f1be07

function preload() {
  song = loadSound('testTrack.mp3');
}

function setup() {
  canvas = createCanvas(400, 400);
  amp = new p5.Amplitude();
  song.play();
  canvas.onclick = function () {
    if (!song.isPlaying()) {
      // .isPlaying() returns a boolean
      song.play();
    } else {
      song.pause();
    }
  }
  amp = new p5.Amplitude();
}

function draw() {
  background(0);
  let vol = amp.getLevel();
  ellipse(height / 2, width / 2, vol * 500, vol * 500);
  console.log('volume', vol);
}

// function mousePressed() 
// {
//   if (song.isPlaying()) {
//     // .isPlaying() returns a boolean
//     song.pause();

//   } 
//   else if(song.isPoused()){
//     song.resume();
//   }

//   else  
//   {
//     song.play();
//   }
// }