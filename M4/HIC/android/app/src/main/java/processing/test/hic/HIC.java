package processing.test.hic;

import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class HIC extends PApplet {

PImage bkg1,bkg2;
int click = 0;

public void setup(){

bkg1=loadImage("BKGGrey_400x825");
bkg2=loadImage("BKGBlack_400x825");
}

public void draw(){
  if(click%2==0){
  image(bkg1,0,0,width,height);}
  else {image(bkg2,0,0,width,height); }
}


public void mousePressed(){
click+=1;
}
  public void settings() { 
size(displayWidth,displayHeight); }
}
