PFont roboto;
PImage logo;

int x;
int y;
float outsideRadius = 150;
float insideRadius = 100;

void setup()
{
  x = width/2;
  y = height/2;
  size(400,825); // GooglePixel2XL-
  //DisplayWidth,DisplayHeight
  logo = loadImage("logo.jpg");
  roboto  = createFont("Roboto Regular",64,true);
}

void draw()
{
  background(0,0,0);

  textFont(roboto,72);
  textAlign(CENTER);
  text("HIC\n",width/2,100);
  textFont(roboto,32);
  text("_Hey, I'll Change_",width/2,150);
  textFont(roboto,24);
  text("Hey beauty!",width/2,600);

  text("Do you actually know\nhow beautiful you are?\n\nTo find it out press 'Go' !",width/2,650);
  ///////
  int numPoints = int(map(mouseX, 0, width, 6, 60));
  float angle = 0;
  float angleStep = 180.0/numPoints;
    
  beginShape(TRIANGLE_STRIP); 
  for (int i = 0; i <= numPoints; i++) {
    float px = x + cos(radians(angle)) * outsideRadius;
    float py = y + sin(radians(angle)) * outsideRadius;
    angle += angleStep;
    vertex(px, py);
    px = x + cos(radians(angle)) * insideRadius;
    py = y + sin(radians(angle)) * insideRadius;
    vertex(px, py); 
    angle += angleStep;
  }
  endShape();
  
  /////// 
  
  textFont(roboto,24);
  smooth();
  fill(255);
  ellipse(width/2,height/2,75,75); //xmid, ymid,h,b
  fill(0);
  text("Go",width/2,height/2+10);
  
  
  /**
  *
  Hier ist der 'Launcher Balken der App.
  *
  */
  smooth();
  fill(255); 
  rect(0,800,400,25); // xobereSeite, linkeseitey, breite , höhe
  fill(0); 
  ellipse(width/5,height-12.5,20,20);
  fill(255);
  stroke(0);
  ellipse(width/5*2,height-12.5,20,20);
  ellipse(width/5*3,height-12.5,20,20);
  ellipse(width/5*4,height-12.5,20,20);
                     
  fill(255);
  stroke(0);
  

  //line(width/2,height,width/2,width/2); //   länge,WINKEL,startpunkt,
  //
  tint(255,100);
  //image(logo,width/2,600);
}
