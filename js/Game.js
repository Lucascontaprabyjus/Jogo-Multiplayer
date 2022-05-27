class Game {
  constructor() {}

  start() {
    form = new Form();
    form.display();
    player = new Player();
    Playercount = player.getCount();

    car1 = createSprite();
    car1.addImage("carro1", car1Img);
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
    }



    
  }
}
