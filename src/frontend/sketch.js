// reference :https://medium.com/@nishancw/audio-visualization-in-javascript-with-p5-js-cf3bc7f1be07

function preload() {  
  song = loadSound('\La_La_Land_City_of_Stars_Lofi_Hip_Hop_Version.mp3');
}
function setup() {
  createCanvas(400, 400);
  song.play();
  amp= new p5.Amplitude();
}


function draw() {
  background(0);
  let vol= amp.getLevel();
  ellipse(height/2, width/2, vol*500, vol*500);
  console.log('volume', vol);
}