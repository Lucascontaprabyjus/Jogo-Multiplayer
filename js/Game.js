class Game {
  constructor() {}

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
    cars=[car1, car2]
    
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
  }

  play(){

    this.handleElements();

    Player.getPlayersInfo();

    if(allPlayers !== undefined){
      image(pistaImg,0,-height*5,width,height*6);
      

        this.playerControl();
      drawSprites();
    }



    
  }

//função para controlar os jogadores
playerControl(){
if(keyIsDown(UP_ARROW)){
player.positionY += 10
//player.Update();
}


}

}
