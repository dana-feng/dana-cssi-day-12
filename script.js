// Be sure to name any p5.js functions we use in the global so Glitch can recognize them.
// Add to this list as you consult the p5.js documentation for other functions.
/* global createCanvas, colorMode, HSB, width, height, random, background, fill, noFill, color, random,
          rect, ellipse, stroke, image, loadImage, frameRate, collideCircleCircle, collideRectCircle, text, 
          mouseX, mouseY, strokeWeight, line, mouseIsPressed, windowWidth, windowHeight, noStroke, 
          keyCode, UP_ARROW, collideRectRect, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, textSize, noLoop, loop */

let backgroundColor, playerSnake, currentApple, score, frame, life 

function setup() {
  // Canvas & color settings
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 95;
  frame = 5;
  
  playerSnake = new Snake();
  currentApple = new Apple();
  score = 0;
  life = 3;
}

function draw() {
  background(backgroundColor);
  frameRate(frame);
  // The snake performs the following four methods:
  playerSnake.moveSelf();
  playerSnake.showSelf();
  playerSnake.checkCollisions();
  playerSnake.checkApples();
  playerSnake.checkWall();
  // The apple needs fewer methods to show up on screen.
  currentApple.showSelf();
  // We put the score in its own function for readability.
  displayScore();
}

function displayScore() {
  fill(0);
  text(`Score: ${score}`, 20, 20);
  text(`Lives Left: ${life}`, 20, 40);
}

class Snake {
  constructor() {
    this.size = 10;
    this.x = width / 2;
    this.y = height - 10;
    this.direction = "N";
    this.speed = 12;
    this.tail = [];
    this.tail.unshift(new TailSegment(this.x, this.y));
  }

  moveSelf() {
    if (this.direction === "N") {
      this.y -= this.speed;
    } else if (this.direction === "S") {
      this.y += this.speed;
    } else if (this.direction === "E") {
      this.x += this.speed;
    } else if (this.direction === "W") {
      this.x -= this.speed;
    } else {
      console.log("Error: invalid direction");
    }
    this.tail.unshift(new TailSegment(this.x, this.y));
    this.tail.pop();
  }

  showSelf() {
    stroke(240, 100, 100);
    noFill();
    rect(this.x, this.y, this.size, this.size);
    noStroke();
    for (let i = 0; i < this.tail.length; i++){
      this.tail[i].showSelf();
      
      
    }
  }

  checkApples() {
    //if the head of the snake collides with the apple...
    if (
      collideRectRect(
        this.x,
        this.y,
        this.size,
        this.size,
        currentApple.x,
        currentApple.y,
        currentApple.size,
        currentApple.size
      )
    ) {
      //Make a new apple and increment score
      score++;
      currentApple = new Apple();
      this.extendTail();
      frame ++;
    }
  }

  checkCollisions() {
    //If there is only one tail segment, no need to check 
    if (life === 0){
      gameOver();
    }
    if (this.tail.length <= 2){
      return;
    }
    else{
      for(let i =1; i < this.tail.length; i++) {
        if (this.x == this.tail[i].x && this.y == this.tail[i].y){
          gameOver();
        }
      }
    }
  }

  extendTail() {
    let lastTailSegment = this.tail[this.tail.length-1]
    this.tail.push(new TailSegment(lastTailSegment.x, lastTailSegment.y));
  }
  checkWall(){
    if (this.y > height || this.y <0 || this.x > width || this.x < 0){
      life --;
    }
  }
}

class TailSegment {
  constructor(x, y) {
    this.size = 10;
    this.x = x;
    this.y = y;
  }
  showSelf() {
    stroke(240, 100, 100);
    rect(this.x, this.y, this.size, this.size);
  }
}

class Apple {
  constructor() {
    this.size = 10;
    this.x = random(10, width - 10);
    this.y = random(10, height - 10);
  }

  showSelf() {
    stroke(240, 100, 100);
    noFill();
    rect(this.x, this.y, this.size, this.size);
    noStroke();
  }
}

function keyPressed() {
  console.log("key pressed: ", keyCode);
  if (keyCode === UP_ARROW && playerSnake.direction != "S") {
    playerSnake.direction = "N";
  } else if (keyCode === DOWN_ARROW && playerSnake.direction != "N") {
    playerSnake.direction = "S";
  } else if (keyCode === RIGHT_ARROW && playerSnake.direction != "W") {
    playerSnake.direction = "E";
  } else if (keyCode === LEFT_ARROW && playerSnake.direction != "E") {
    playerSnake.direction = "W";
  } else if (keyCode == 32){
    restartGame();
  }
  else {
    console.log("wrong key");
  }
}

function restartGame() {
  score = 0;
  playerSnake = new Snake();
  currentApple = new Apple();
  loop();
}

function gameOver() {
  stroke(0);
  fill(0);
  
  text("GAME OVER", 100, 50);
  noLoop();
}
