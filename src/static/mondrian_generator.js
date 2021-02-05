var color_palette = 
[
    "#d24632",
    "#f5e132",
    "#3278aa",
    "#ffffff",
    "#ffffff"
];

let x,y,dim1,dim2, b1, b2, numblocks;
let c1,c2,c3,c4,k,s;
var blocks= []; //array containing the blocks
var sizes = [150,200,250, 300]; // old: [50, 100, 150, 200];
var rnd_color;
var c_;

function setup() 
{
  createCanvas(windowWidth-20, windowHeight-20);
  strokeWeight(10);
  var i = 0;
  var x = 0;
  var y = 0;
  var currWidth = random(sizes);
  var currHeight = random(sizes);
  
  while (y < height) 
  {
    x = 0;
    while (x <= width) 
    {
        // Choose randomly a color from the palette
        rnd_color = random(color_palette);
      
        blocks[i] = new Block(x, y, currWidth, currHeight, rnd_color);
        i+=1;
        x = x + currWidth;
        currWidth = random(sizes);
    }
    y = y + currHeight;
    currHeight = random(sizes);
  }
  
  //still setup bruh
  c1 = color(204, 102, 0); //orange
  c2 = color(0, 102, 153); //blue
  c3 = color(224,175,238);
  c4 = color(155, 155, 155);
  //noLoop();
  k= 0;
  s= 0;
}

function draw() 
{
  for(let i = 0; i < blocks.length; i++)
  {
    blocks[i].display(blocks[i].color);
  }
  
  s = s + 0.1;
  k = cos(s)
  setGradient(s,k);
}

function setGradient(s,k)
{
  push()
  for (i = 0; i<blocks.length; i++)
  {
    if(blocks[i].color == color_palette[0])
    {
      let c_ = color(blocks[i].color);
      let c = lerpColor(c1,c_,k);
      blocks[i].display(c);
    }
  }
  pop()
}  



class Block {
  //constructor
  constructor(x, y, dim_1, dim_2, color)
  {
    this.x= x;
    this.y = y;
    this.dim1 = dim_1;
    this.dim2 = dim_2;
    this.color = color;
  }
  //functionalities
  display(color_pass)
  {
    fill(color_pass)
    rect(this.x,this.y, this.dim1, this.dim2)
  }
  
}