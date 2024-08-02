var scl = 60;
var cols, rows;
var snake;
var food;
var isGamePaused = false;

function setup() {
  createCanvas(600, 600);
  cols = floor(width / scl);
  rows = floor(height / scl);

  // Initialize the snake
  snake = new Snake();

  // Initialize food location
  pickLocation();

  frameRate(3); // Control the speed of the game
}

function draw() {
  background(51);
  drawGrid();
  if (!isGamePaused) {
    var successEat = snake.eat(food);
    if (successEat) {
      pickLocation();
    }
    snake.death();
    snake.update(successEat);
  }
  snake.show();

  // Drawing snake food
  fill(255, 0, 100);
  rect(food.x, food.y, scl, scl);
  // Display pause status
  textAlign(CENTER);

  fill(255);
  if (isGamePaused) {
    textSize(50);
    text("PAUSED", width / 2, height / 2);
  } else {
    textSize(20);
    text("RUNNING", width / 2, 10);
  }
}

function drawGrid() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(12);

  // Loop through the grid array to draw each cell
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * scl;
      let y = j * scl;
      stroke(255);
      noFill();
      rect(x, y, scl, scl);
      fill(255);
      noStroke();
      // text(`(${i}, ${j})`, x + scl / 2, y + scl / 2);
    }
  }
}

// Function to pick a new food location
function pickLocation() {
  var cols = floor(width / scl);
  var rows = floor(height / scl);
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(scl); // Expand it back out to grid scale
}

function keyPressed() {
  if (keyCode === 32) {
    // 32 is the keyCode for spacebar
    isGamePaused = !isGamePaused; // Toggle pause state
    return false; // Prevent default behavior
  }

  if (!isGamePaused) {
    // Only allow direction changes when the game is not paused
    if (keyCode === UP_ARROW) {
      snake.dir(0, -1);
    } else if (keyCode === DOWN_ARROW) {
      snake.dir(0, 1);
    } else if (keyCode === RIGHT_ARROW) {
      snake.dir(1, 0);
    } else if (keyCode === LEFT_ARROW) {
      snake.dir(-1, 0);
    }
  }
  return false; // Prevent default behavior
}

// Snake class to handle movement, eating, and death
class Snake {
  constructor() {
    this.x = 0; // head x position of snake
    this.y = 0; // head y position of snake
    this.xspeed = 1;
    this.yspeed = 0;
    this.total = 0; // Track the length of the snake tail
    this.tail = []; // Array to store the tail
  }

  // Function to set direction
  dir(x, y) {
    this.xspeed = x;
    this.yspeed = y;
  }

  // Function to check if the snake eats the food
  eat(pos) {
    var d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
      this.total = this.total + 1;
      return true;
    } else {
      return false;
    }
  }

  // Function to update snake's position
  update(successEat) {
    // if no success eat
    if (!successEat) {
      if (this.total > 0) {
        // Move all tail segments
        for (var i = 0; i < this.tail.length - 1; i++) {
          this.tail[i] = this.tail[i + 1];
        }
        this.tail[this.total - 1] = createVector(this.x, this.y);
      }
    }

    // if eats an apple
    if (successEat) {
      this.tail.push(createVector(this.x, this.y));
    }

    this.x = this.x + this.xspeed * scl;
    this.y = this.y + this.yspeed * scl;

    // Constrain snake to stay within the grid
    this.x = constrain(this.x, 0, width - scl);
    this.y = constrain(this.y, 0, height - scl);
  }

  // Function to check if the snake hits itself
  death() {
    for (var i = 0; i < this.tail.length; i++) {
      var pos = this.tail[i];
      var d = dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) {
        this.total = 0;
        this.tail = [];
        this.tailIndices = []; // Reset tail indices
      }
    }
  }

  show() {
    fill(255);
    for (var i = 0; i < this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, scl, scl);

      // Display index in the center of each tail segment
      fill(0); // Black text
      textAlign(CENTER, CENTER);
      textSize(scl / 3); // Adjust text size as needed
      text(i, this.tail[i].x + scl / 2, this.tail[i].y + scl / 2);
      fill(255); // Reset fill color for the next rectangle
    }

    // Show head
    fill(0, 255, 0);
    rect(this.x, this.y, scl, scl);

    // Display 'H' for head
    fill(0); // Black text
    textAlign(CENTER, CENTER);
    textSize(scl / 2); // Slightly larger text for the head
    text("H", this.x + scl / 2, this.y + scl / 2);
  }
}
