var color_palette = 
[
    "#d24632",
    "#f5e132",
    "#3278aa",
    "#ffffff",
    "#ffffff"
];
var sizes = [50, 100, 150, 200];
var rectangles = [];

function setup() 
{
    createCanvas(windowWidth-20, windowHeight-20);
    background(255);

    strokeWeight(10); // make lines really thick

    var y = 0;
    var x = 0;

    var currHeight = random(sizes);
    var currWidth = random(sizes);

    while (y < height) 
    {
        x = 0;
        while (x < width) 
        {
            // Choose randomly a color from the palette
            rnd_color = random(color_palette);
            fill(color(rnd_color));

            // Draw the rectangle and save it for later manipulation
            curr_rect = rect(x, y, currWidth, currHeight);
            rectangles.push(curr_rect);

            x = x + currWidth;
            currWidth = random(sizes);
        }
        y = y + currHeight;
        currHeight = random(sizes);
    }

}

function draw() 
{

}