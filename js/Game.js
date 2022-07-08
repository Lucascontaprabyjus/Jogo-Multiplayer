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
    gObstacle = new Group();

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
    this.addSprites(gFuel,7,fuelImg,0.04);
    this.addSprites(gObstacle, obstaclesPositions.length, obstacle1Image, 0.04, obstaclesPositions);
    
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
        players:{},
        CarsAtEnd: 0,
      })
      window.location.reload();
    })
  }

  play(){

    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();

    player.getCarsAtEnd();
  

    if(allPlayers !== undefined){
      image(pistaImg,0,-height*5,width,height*6);

      //inserir o placar!
      this.showLife();

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
     
      //linha de chegada
      const finishLine = -height*6 - 100;

      if(player.positionY > finishLine){
        player.rank +=1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        Gamestate = 2;
        this.showRank();
      }

      drawSprites();
    }
  }

//sweet alert do ranking
showRank(){
  swal({
    title: `Incrível! ${"\n"}Rank${"\n"}${player.rank}`,
    text: "Você alcançou a linha de chegada com sucesso!",
    imageUrl:  "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
    imageSize: "100x100",
    confirmButtonText: "Ok",
  });
}

//mostrar as vidas
showLife(){
  push();
  image(lifeImg,width/2-130, height - player.positionsY - 400, 20,20);
  fill("white");
  rect(width/2-100,height - player.positionsY - 400, 185,20);
  fill("red");
  rect(width/2-100,height - player.positionsY - 400,player.life,20);
  pop();

}

//mostrar combistível 
showFuel(){
  push();
  image(fuelImg,width/2-130, height - player.positionsY - 400, 20,20);
  fill("white");
  rect(width/2-100,height - player.positionsY - 400, 185,20);
  fill("red");
  rect(width/2-100,height - player.positionsY - 400,player.fuel,20);
  pop();

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
addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions=[]){
  for(var i=0; i<numberOfSprites; i++){
    var x,y;
    if(positions.length > 0){
      x = positions[i].x;
      y = positions[i].y;
      spriteImage = positions[i].image;
    }
    else{
      x = random(width/2 - 150, width/2 + 150);
      y = random(-height*4.5, height-400);
    }

    

    var sprite = createSprite(x,y);
    sprite.addImage("sprite", spriteImage);
    sprite.scale = scale;
    spriteGroup.add(sprite);
    }
  }
}
