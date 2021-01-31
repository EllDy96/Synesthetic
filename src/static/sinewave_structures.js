function setup(){
    createCanvas(400, 400, WEBGL)
    angleMode(DEGREES)
}

function draw(){
    background(30)

    rotateX(90) //rotate x axis of the shape(?) by 60 degrees

    noFill()    //rendering only the shape lines, not the inner part  (white lines vs backround)
    stroke(255)

    for (var i=0; i<20; i++){
        //COLOR
        var r = map(sin(frameCount / 2), -1, 1, 100, 200)
        var g = map(i, 0, 20, 100, 200)
        var b = map(cos(frameCount), -1, 1, 200, 100)

        stroke(r,g,b)

        //MOTION
        beginShape()     // beginShape + endShape creates a figure connecting a series of veritces
        for (var j = 0; j < 360; j+=10) {
            var rad = i* 3;
            var x = rad * cos(j)
            var y = rad * sin(j)
            var z = sin(frameCount  + i * 10)*50

            vertex(x,y,z) //specify to beginShape the vertices (x,y,z) of the figure
        }
        endShape(CLOSE)
    }
}