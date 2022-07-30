class Game {
  constructor() {

    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leaderboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2= createElement("h2");

    this.playerMoving = false;

    this.leftKeyActive = false;

    this.blast = false;
  
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    Playercount = player.getCount();

    //criando carros
  car1 = createSprite(width/2-100, height-100);
  car1.addImage("carro1", car1Img);
  car1.addImage ("explosão", blastImg)
  car1.scale=0.1

  car2 = createSprite(width/2+100, height-100);
  car2.addImage("carro2", car2Img);
  car2.addImage ("explosão", blastImg)
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

    this.leaderboardTitle.html("Placar");
    this.leaderboardTitle.class("resetText");
    this.leaderboardTitle.position(width/3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width/3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width/3 - 50, 130);
  }

  //placar
  showLeaderboard(){
    var leader1, leader2;
    var players = Object.values(allPlayers);

    if((players[0].rank === 0 && players[1].rank === 0) || players[0].rank == 1){
      leader1 = 
      players[0].rank +
      "&emsp;" + //4 espaços
      players[0].name +
      "&emsp;" + //4 espaços
      players[0].score

      leader2 = 
      players[1].rank +
      "&emsp;" + //4 espaços
      players[1].name +
      "&emsp;" + //4 espaços
      players[1].score
    }

    if(players[1].rank === 1){
      leader1 = 
      players[1].rank +
      "&emsp;" + //4 espaços
      players[1].name +
      "&emsp;" + //4 espaços
      players[1].score

      leader2 = 
      players[0].rank +
      "&emsp;" + //4 espaços
      players[0].name +
      "&emsp;" + //4 espaços
      players[0].score
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
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

      //placar
      this.showLeaderboard();
      //barra de vida
      this.showLife();
      this.showFuel();


      var index = 0;
      for(var plr in allPlayers){
        index = index + 1;

        //posição dos jogadores
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;
        cars[index-1].position.x = x;
        cars[index-1].position.y = y;

        var hp = allPlayers[plr].life
      if(hp <= 0){
        cars[index - 1].changeImage("explosão");
        cars[index - 1].scale = 0.1;
        this.blast = true;
        this.playerMoving = false;
      }
        if(index === player.index){
          stroke(10);
          fill("red");
          ellipse(x,y,80,80);
          camera.position.y= cars[index-1].position.y

          this.handleFuel(index);
          this.handleCoins(index);
          this.obstaclesCollision(index);
          this.carsCollision(index);
        }
      }
      //vida dos jogadores
      if(player.life <= 0){
        setTimeout(()=>{
          this.gameOver();
        }, 2000);

      }
      this.playerControl();
     
      //linha de chegada
      const finishLine = height*6 - 100;

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

  //pegar combustível
  handleFuel(index){
    cars[index-1].overlap(gFuel, function(collector,collected){
      player.fuel = 185;
      collected.remove();
    });

    if(player.fuel > 0 && this.playerMoving){
      player.fuel -= 0.3;
    }

    if(player.fuel <=0){
      Gamestate = 2;
      this.gameOver();
    }
  }
  //pegar moeda
  handleCoins(index){
    cars[index-1].overlap(gCoin, function(collector,collected){
      player.score += 1;
      player.update();
      collected.remove();
    });
  }

  //colisão com obstáculos
  obstaclesCollision(index){
    if(cars[index-1].collide(gObstacle)){
      if(this.leftKeyActive){
        player.positionX +=100;
      }
      else{
        player.positionX -=100;
      }

      if(player.life > 0){
        player.life -= 185/4;
      }

      player.update();
    }
  }

  //colisão com carros
  carsCollision(index){
    if(index == 1){
      if(cars[index-1].collide(cars[1])){
      if(this.leftKeyActive){
        player.positionX +=100;
      }
      else{
        player.positionX -=100;
      }

      if(player.life > 0){
        player.life -= 185/4;
      }

      player.update();
    } 

    }
    if(index == 2){
      if(cars[index-1].collide(cars[0])){
      if(this.leftKeyActive){
        player.positionX +=100;
      }
      else{
        player.positionX -=100;
      }

      if(player.life > 0){
        player.life -= 185/4;
      }

      player.update();
    } 

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

//sweet alert game over
gameOver(){
  swal({
    title: `Game Over! ${"\n"}Rank${"\n"}${player.rank}`,
    text: "Você perdeu",
    imageUrl:  "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
    imageSize: "100x100",
    confirmButtonText: "Ok",
  });
}

//mostrar as vidas
showLife(){
  push();
  image(lifeImg,width/2-130, height - player.positionY - 400, 20,20);
  fill("white");
  rect(width/2-100,height - player.positionY - 400, 185,20);
  fill("red");
  rect(width/2-100,height - player.positionY - 400,player.life,20);
  pop();
}

//mostrar o combustível
showFuel(){
push();
  image(fuelImg,width/2-130, height - player.positionY - 360, 20,20);
  fill("white");
  rect(width/2-100,height - player.positionY - 360, 185,20);
  fill("brown");
  rect(width/2-100,height - player.positionY - 360,player.fuel,20);
  pop();
}

//função para controlar os jogadores
playerControl(){
if(keyIsDown(UP_ARROW) && !this.blast){
player.positionY += 10;
this.playerMoving = true;
player.update();
}
else{
  this.playerMoving = false;
 }
if(keyIsDown(LEFT_ARROW) && !this.blast){
this.leftKeyActive = true;
player.positionX -= 10;
this.playerMoving = true;
player.update();
}
 else{
  this.playerMoving = false;
 }
if(keyIsDown(RIGHT_ARROW)  && !this.blast){
this.leftKeyActive = false;
player.positionX += 10;
this.playerMoving = true;
player.update();
 }
 else{
  this.playerMoving = false;
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
