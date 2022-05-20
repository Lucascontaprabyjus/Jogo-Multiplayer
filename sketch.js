var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var Playercount, Gamestate;

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
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
  game.UpdateState(1)
}

if(Gamestate == 1){

game.play();

}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


