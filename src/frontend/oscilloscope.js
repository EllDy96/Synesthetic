c = new AudioContext();
o = c.createOscillator();
canvas = document.querySelector("canvas");
ctx = canvas.getContext("2d");
a = c.createAnalyser();

var myAudio = document.querySelector("audio");
var source = c.createMediaElementSource(myAudio);
// o.connect(source);
// o.start();

// To extract data from your audio source, you need an AnalyserNode
var analyser = c.createAnalyser();
// i have to connet this node to the source
source.connect(analyser);
// and then connect my analyser to the Audio destination
analyser.connect(c.destination);

// to capture frequency data of the audio source
var bufferLength = analyser.frequencyBinCount;
var dataFreqsArray = new Float32Array(bufferLength); // Float32Array
void analyser.getFloatFrequencyData(dataFreqsArray); // fill the Float32Array with data returned from getFloatFrequencyData()
//The getFloatFrequencyData() method of the AnalyserNode Interface copies the current frequency data into a Float32Array array passed into it.Each item in the array represents the decibel value for a specific frequency.

// create the canvas
ctx.clearRect(0, 0, 100, 100);

function draw() {
  // to keep repeating the drawing function once it has been started
  var drawVisual = requestAnimationFrame(draw);
  // get the time domain data and copy to the array
  analyser.getByteTimeDomainData(dataFreqsArray);
  //fill the canvas with a starting color
  ctx.fillStyle = "rgb(200,200,200)";
  ctx.fillRect(0, 0, width, height);

  // seting some parameters of the line to draw
  ctx.lineWight = 2;
  ctx.strokeStyle = "rgb(0,0,0)";
  ctx.beginPath();
  //Determine the width of each segment of the line to be drawn by dividing the canvas width by the array length
  var sliceWidth = (width * 1.0) / bufferLength;
  var x = 0;

  //Now we run through a loop, defining the position of a small segment of the wave for each point in the buffer at a certain height based on the data point value form the array, then moving the line across to the place where the next wave segment should be drawn:
  for (var i = 0; i < bufferLength; i++) {
    var v = dataArray[i] / 128.0;
    var y = (v * HEIGHT) / 2;

    if (i === 0) {
      cx.moveTo(x, y);
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
