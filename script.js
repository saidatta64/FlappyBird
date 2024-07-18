let board;
let boardWidth = 720;
let boardHeight = 640;
let context;

//bird
let birdWidth = 44;
let birdHeight = 44;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;


let bird ={
    x : birdX,
    y : birdY,
    width : birdWidth,
    height: birdHeight,
}
//pipes
let pipeArray =[];
let pipeWidth =64;
let pipeHeight=512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottommPipeImg;

//phu
let velocityX = -2;
let velocityY = 0;
let gravity = 0.2;

let gameOver = false;
let score = 0;
window.onload = function() {
    board =document.getElementById("board");
    board.height = boardHeight;
    board.width = boardHeight;
    context = board.getContext("2d");//used for drawing board
     //draw bird
     //context.fillstyle = "green";
     //context.fillRect(bird.x,bird.y,bird.width,bird.height);

     //loadimage
     birdImg = new Image();
     birdImg.src = "./flappybird.png";
     birdImg.onload = function() {
        context.drawImage(birdImg,bird.x,bird.y,bird.height,bird.width);
  }
   topPipeImg = new Image();
   topPipeImg.src ="./toppipe.png";
    
   
    bottommPipeImg = new Image();
    bottommPipeImg.src ="./bottompipe.png";


  requestAnimationFrame(update);
  setInterval(placepipe,1350);
  document.addEventListener("keydown",movebird);
}

 function update() {
    requestAnimationFrame(update)
    if(gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird 
    velocityY += gravity;
    //bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY,0);
    context.drawImage(birdImg,bird.x,bird.y,bird.height,bird.width);
    if(bird.y > boardHeight){
        gameOver = true;
    }
    //pipes
    for (let i =0 ; i<pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
            pipe.passed = true;
        }
        if(detectCollision(bird,pipe)){
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length>0 && pipeArray[0].x< -pipeWidth){
        pipeArray.shift();
    }

  //score
  context.fillStyle = "white";
  context.font="50px sans-serif";
  context.fillText(score, 7, 45);

  if(gameOver){
    context.fillText("GAME OVER",7,97)
  }
}
function placepipe(){
   if (gameOver){
    return
   }
    let randomPipeY = pipeY - pipeHeight/3 - Math.random()*(pipeHeight/2) ;
    let openSpace =boardHeight/3.5 ;

    let topPipe ={
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height: pipeHeight,
        passed : false
 }
 pipeArray.push(topPipe)
 let bottommPipe = {
    img : bottommPipeImg,
    x : pipeX,
    y: randomPipeY + pipeHeight +openSpace,
    width : pipeWidth,
    height : pipeHeight,
    passed : false

 }
 pipeArray.push(bottommPipe);
}
function movebird(e){
    if (e.code == "Space" || e.code == "ArrowUp" || e.code =="KeyW");
    //jump
    {
        velocityY =-6;
    }
    if(gameOver){
        bird.y = birdY;
        pipeArray =[];
        score =0;
        gameOver = false;
    }
}

function detectCollision(a,b){
     return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}