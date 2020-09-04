var dog, doghappy, dogImg2, sadDog;
var foodS = 0;
var milk, milkImg;
var fedTime, lastFed;

var gameState = 0;
var foodObj;
var foodStock;
var form;
var lastFed;
var currentTime;

var nameval;
function preload() {
  dogImg2 = loadImage("images/dogImg.png");
  doghappy = loadImage("images/dogImg1.png");
  sadDog = loadImage("images/deadDog.png");

}

function setup() {

  createCanvas(700, 700);
  database = firebase.database();
  dog = createSprite(550, 250, 10, 10);


  readState = database.ref('gameState');
  readState.on("value", function (data) {

    gameState = data.val();

  });

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data) {

    lastFed = data.val();

  });



  dog.addImage("dog_original", dogImg2);
  dog.addImage("happy", doghappy);
  dog.scale = 0.2;

  
  dog.addImage("saddog", sadDog);


  foodObj = new Food();

  feed = createButton("Feed your dog");
  feed.position(400, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(750, 95);
  addFood.mousePressed(addMilk);


  namedog = createInput("Name your dog");
  namedog.position(850, 550);
  doggyname = this.namedog.value();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);


}


function draw() {


  background(46, 200, 87);
  textSize(20);




  if (lastFed >= 12) {
    text("Last feed : " + lastFed % 12 + " PM", 450, 30);
  }
  else if (lastFed === 0) {
    text("Last feed : 12 AM", 450, 30);
  }
  else {
    text("Last feed : " + lastFed + " AM", 450, 30);
  }


  if (gameState != "Hungry") {
    feed.hide();
    addFood.hide();
    namedog.hide();
    // doggyname.hide();
    // foodObj.hide();
    
    dog.remove();
  }
  else {
    feed.show();
    addFood.show();  
    text("Food left : " + foodS, 490, 400);
    dog.addImage(sadDog);
    text("Name : " + nameval, 490, 350);

    foodObj.display();
  }



  currentTime = hour();
  if (currentTime === (lastFed + 1)){
    update("Playing");
    foodObj.Garden();
  }
  else if (currentTime == (lastFed + 2)){
    update("Sleeping");
    foodObj.Bedroom();
  }else if (currentTime > (lastFed + 2) && currentTime <=(lastFed + 4)){
    update("Bathing");
    foodObj.Washroom();
  }else {
    update("Hungry");
    foodObj.display();
  }

  doggyname = this.namedog.value();
  nameval = doggyname;




  drawSprites();

}

function readStock(data) {
  foodS = data.val();
  console.log(foodS);
}

function writeStock(x) {

  if (x <= 0) {
    x = 0;
  }
  else {
    x = x - 1;
    database.ref('/').update({
      Food: x
    })
  }
}
function feedDog() {
  dog.addImage(doghappy);
  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
  namedog.hide();
}


function addMilk() {
  dog.addImage(doghappy);

  foodObj.updateFoodStock(foodObj.getFoodStock() + 1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
  namedog.hide();

}

function update(state) {

  database.ref('/').update({
    gameState: state
  });
}