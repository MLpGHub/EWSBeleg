PImage bkg1,bkg2;
int click=0;
void setup()
{
  
  size(400,825);
  orientation(PORTRAIT);
  bkg1 = loadImage("BKGBlack_400x825.jpg");
  bkg2 = loadImage("BKGGrey_400x825.jpg");
  imageMode(CENTER);
  textSize(height/11);
}

void draw()
{
  if(click%2 == 0)
  image(bkg1, width/2,height/2,width,height);
  else
  image(bkg2, width/2,height/2,width,height);
}
void mousePressed()
{
 click+=1;
  
} 
