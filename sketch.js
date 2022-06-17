var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var Playercount, Gamestate;
var pistaImg, fuelImg, coinImg;
var allPlayers;
var car1, car2, cars = [], car1Img, car2Img;
var gCoin, gFuel, gObstacle;
var obstacle1Image, obstacle2Image;

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  pistaImg = loadImage("assets/track.jpg");
  car1Img = loadImage("assets/car1.png");
  car2Img = loadImage("assets/car2.png");
  fuelImg = loadImage("assets/fuel.png");
  coinImg = loadImage("assets/goldCoin.png");
  obstacle1Image = loadImage("assets/obstacle1.png");
  obstacle2Image = loadImage("assets/obstacle2.png");
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


