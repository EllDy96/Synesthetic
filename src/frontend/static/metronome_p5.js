function setup() {
    createCanvas(400, 350);
    frameRate(60);
}

function draw() {
    clear();

//const theta = map(frameCount, 0, 60, 0, 2 * PI); //frame based animation
    const theta = map(millis(), 0, 1000, 0, 2 * PI); //ms based animation
    const pendulumAngle = sin(theta) * 0.5;
    metronome(200, 325, 3, pendulumAngle);
    // % operator loops the values btw 0 and 500
    const red = map((millis() % 500), 0, 300, 255, 0);
    noStroke();
    fill(red, 0, 0);
    ellipse(200, 290, 50, 50);
}

function metronome(x, y, size, pendulumAngle) {
    push();
    noStroke();
    translate(x, y);
    scale(size);

    // body
    fill(220, 200, 200);
    quad(-10, -100, 10, -100, 40, 0, -40, 0);

    // pendulum
    push();
    rotate(pendulumAngle);
    fill(50, 100, 100);
    rect(-3, -90, 6, 80);
    ellipse(0, -70, 20, 20);
    pop();

    // bottom
    fill(180, 160, 160);
    arc(0, 0, 50, 50, PI, 0);
    pop();
}