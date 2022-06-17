class Game {
  constructor() {

    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    Playercount = player.getCount();

    //criando carros
  car1 = createSprite(width/2-100, height-100);
  car1.addImage("carro1", car1Img);
  car1.scale=0.1

  car2 = createSprite(width/2+100, height-100);
  car2.addImage("carro2", car2Img);
  car2.scale=0.1

    //adicionanado a matriz
  cars=[car1, car2];

    //criando grupos
    gCoin = new Group();
    gFuel = new Group();

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];

    this.addSprites(gCoin,20,coinImg,0.1);
    this.addSprites(gFuel,7,fuelImg,0.1);
    
  }

  getState(){
    var gameStateRef = database.ref("Gamestate");
    gameStateRef.on("value",function(data){
      Gamestate = data.val();
    });

    
  }
  updateState(state){
    database.ref("/").update({
      Gamestate: state
    })
  }

  handleElements(){
    form.hide();
    form.titleImg.position(40,50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("Reiniciar Jogo");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width/2 + 200,40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width/2 + 230,100);
  }

  //botão de reset
  handleResetButton(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        Gamestate: 0,
        Playercount: 0,
        players:{}
      })
      window.location.reload();
    })
  }

  play(){

    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
  

    if(allPlayers !== undefined){
      image(pistaImg,0,-height*5,width,height*6);

      var index = 0;
      for(var plr in allPlayers){
        index = index + 1;

        //posição dos jogadores
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index-1].position.x = x;
        cars[index-1].position.y = y;

        if(index === player.index){
          stroke(10);
          fill("red");
          ellipse(x,y,80,80);
          camera.position.y= cars[index-1].position.y
        }
      }
      this.playerControl();
      drawSprites();
    }
  }

//função para controlar os jogadores
playerControl(){
if(keyIsDown(UP_ARROW)){
player.positionY += 10;
player.update();
}
if(keyIsDown(LEFT_ARROW)){
player.positionX -= 10;
player.update();
}
if(keyIsDown(RIGHT_ARROW)){
player.positionX += 10;
player.update();
 }
}

//adiciona os sprites no jogo
addSprites(spriteGroup, numberOfSprites, spriteImage, scale){
  for(var i=0; i<numberOfSprites; i++){
    var x,y;

    x = random(width/2 - 150, width/2 + 150);
    y = random(-height*4.5, height-400);

    var sprite = createSprite(x,y);
    sprite.addImage("sprite", spriteImage);
    sprite.scale = scale;
    spriteGroup.add(sprite);
    }
  }
}
