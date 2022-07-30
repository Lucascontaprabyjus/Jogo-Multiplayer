class Player {
  constructor() {
    this.name = null;
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;
    this.fuel = 185;
    this.life = 185;
    this.rank = 0;
    this.score = 0;
  }

getCount(){
  var playerCountRef = database.ref("Playercount");
  playerCountRef.on("value",function(data){
      Playercount = data.val();
    });
}

updateCount(count){
  database.ref("/").update({
    Playercount: count
  })
}

addPlayer(){
  var playerIndex = "players/player" + this.index;
  if(this.index === 1){
    this.positionX = width/2 - 100;
  }else{
    this.positionX = width/2 + 100;
  }
  database.ref(playerIndex).set({
    name: this.name,
    positionX: this.positionX,
    positionY: this.positionY,
    rank: this.rank,
    score: this.score,
    life: this.life,
    fuel: this.fuel,
  });
}

static getPlayersInfo(){
  var playerInfoRef = database.ref("players");
  playerInfoRef.on("value",data =>{
    allPlayers = data.val();
  });
}

update(){
  var playerIndex = "players/player" + this.index;
  database.ref(playerIndex).update({
    positionX: this.positionX,
    positionY: this.positionY,
    rank: this.rank,
    score: this.score,
    life: this.life,
    fuel: this.fuel,
  });
}

getCarsAtEnd(){
  database.ref("CarsAtEnd").on("value", data =>{
    this.rank = data.val();
  })
}

static updateCarsAtEnd(rank){
        database.ref("/").update({
        CarsAtEnd: rank,
      });
    }


getDistance(){
  var playerDistanceRef = database.ref("players/player"+ this.index);
  playerDistanceRef.on("value", data => {
    var data = data.val();
    this.positionX = data.positionX;
    this.positionY = data.positionY;
  })
}

}

