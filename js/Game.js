class Game {
  constructor() {}

  start() {
    form = new Form();
    form.display();
    player = new Player();
    Playercount = player.getCount();
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

  play(){


    
  }
}
