 
/* referance: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API */

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();



c = new AudioContext(); 
o = c.createOscillator(); 
canvas = document.querySelector("canvas"); 
var ctx = canvas.getContext("2d"); 
a = c.createAnalyser(); 



var audioElement = document.querySelector("audio");
audioElement.crossOrigin = "anonymous";
var source = c.createMediaElementSource(audioElement);
// connecting the source to the AudioC. destination  just to play it 

//source.connect(c.destination);

// select our play button
const playButton = document.querySelector('button');
// Toggling the button state accordingly to the play or pause state
playButton.addEventListener('click', function() {

    // check if context is in suspended state (autoplay policy)
    if (c.state === 'suspended') {
        c.resume();
    }

    // play or pause track depending on state
    if (this.dataset.playing === 'false') {
        audioElement.play();
        this.dataset.playing = 'true';
    } else if (this.dataset.playing === 'true') {
        audioElement.pause();
        this.dataset.playing = 'false';
    }

}, false);

// we have to check when the audioElement is finished and switch the button state again
audioElement.addEventListener('ended', () => {
  playButton.dataset.playing = 'false';
}, false);
// o.connect(source);
// o.start();

// To extract data from your audio source, you need an AnalyserNode
var analyser = c.createAnalyser();
// i have to connet this node to the source
source.connect(analyser);
// and then connect my analyser to the Audio destination
analyser.connect(c.destination);

// to capture frequency data of the audio source
analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength); // Float32Array
//void analyser.getFloatFrequencyData(dataArray); // fill the Float32Array with data returned from getFloatFrequencyData()
//The getFloatFrequencyData() method of the AnalyserNode Interface copies the current frequency data into a Float32Array array passed into it.Each item in the array represents the decibel value for a specific frequency.

// cleaning the canvas
ctx.clearRect(0, 0, 1000, 350);

function draw() {
  // to keep repeating the drawing function once it has been started
  var drawVisual = requestAnimationFrame(draw);
  // get the time domain data and copy to the array
  analyser.getByteTimeDomainData(dataArray);
  //fill the canvas with a starting color
  ctx.fillStyle = "rgb(250,250,200)";
  ctx.fillRect(0, 0, 1000, 350);

  // seting some parameters of the line to draw
  ctx.lineWight = 3;
  ctx.strokeStyle = "rgb(0,0,0)";
  ctx.beginPath();
  //Determine the width of each segment of the line to be drawn by dividing the canvas width by the array length
  var sliceWidth = (1000 * 1.0) / bufferLength;
  var x = 0; 

  //Now we run through a loop, defining the position of a small segment of the wave for each point in the buffer at a certain height based on the data point value form the array, then moving the line across to the place where the next wave segment should be drawn:
  for (var i = 0; i < bufferLength; i++) {
    var v = dataArray[i] / 128.0;
    var y = (v * 350) / 2;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    x += sliceWidth;
  }
  ctx.lineTo(canvas.width, canvas.height / 2);
  //draw the stroke we've defined
  ctx.stroke();
}

draw();
