var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var Playercount, Gamestate;
var pistaImg;
var allPlayers;
var car1, car2, cars = [], car1Img, car2Img;

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  pistaImg = loadImage("assets/track.jpg");
  car1Img = loadImage("assets/car1.png");
  car2Img = loadImage("assets/car2.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

}

function draw() {

  background(backgroundImage);
  //Atualizando os valores
  if(Playercount == 2){
  game.updateState(1)
}

if(Gamestate == 1){

game.play();

}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


