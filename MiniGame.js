const GRID_SIZE = 50;
let headX = 1; // Head Coordinates 
let headY = 1;
let foodX; // Food Coordinates
let foodY;
let speedY = 0; // Speed Variables
let speedX = 1;
let counter = 1;
let pauseCounter = 0;
let speedXStore; // Stored speed variables for pause()
let speedYStore;
let preX = []; // Previous X & Y Coordinates stored into an array
let preY = [];
let ended = 0;
let pieFace, fatherChristFace, fatherChristBelly;

function preload() {
    pieFace = loadImage('assets/mincepieFace.png');
    fatherChristFace = loadImage('assets/santaFace.jpeg');
    fatherChristBelly = loadImage('assets/santaBelly.jpeg')

}

function setup() {
    createCanvas(600, 650); 
    foodRandomiser();
    frameRate(5);
}

function draw() {
    background(0);
    image(pieFace, ((foodX * GRID_SIZE)), ((foodY * GRID_SIZE)), GRID_SIZE, GRID_SIZE); // Creates the food
    for (let i = 0; i < preX.length; i++) { // Creates the body, equal to the size of the array
        image(fatherChristBelly, (preX[i] * GRID_SIZE),(preY[i] * GRID_SIZE), GRID_SIZE, GRID_SIZE);
    }
    image(fatherChristFace, (headX * GRID_SIZE), ((headY * GRID_SIZE)), GRID_SIZE, GRID_SIZE); // Creates the body / head square
    move();
    if (headX === foodX && headY === foodY) { // Changes location of the food when eaten / Increases score counter
        counter++;
        foodRandomiser();
        
    }
    scoreCounter();
    if (counter >= preX.length) { // Adds the last coordinates of the head square to an array
        preX.unshift(headX);
        preY.unshift(headY);
    }
    if (counter < preX.length) { // Removes the last square of the snake from the array depending of the score
        preX.pop();
        preY.pop();
    }
    if ((headX < -1 || headX > 12) || (headY < -1 || headY > 12)) { // Calculates when the snake is out of bounds
        gameOver();
        ended = 1;
        console.log("Game Over");
    }
    if (ended === 1) { // Stops the player from playing the game when out of bounds
        gameOver();
    }
}

function gameOver() { // Game over scene Script
    removeElements();
    createCanvas(600, 650);
    rectMode(CENTER);
    textSize(64);
    gameOverText = text('Game Over!', 125, 315);
    counterTextEnd = text('Score: ' + (counter - 1), 180, 385);
}

function keyTyped() {
    // Manages direction of movement
    if (key === 'w') {
        speedX = 0;
        speedY = -1;
    }
    else if (key === 's') {
        speedX = 0;
        speedY = 1;
    }
    else if (key == 'a') {
        speedY = 0;
        speedX = -1;
    }
    else if (key === 'd') {
        speedY = 0;
        speedX = 1;
    }
    else if (key === 'p') {
        pauseCounter = pauseCounter + 1;
        pause()
        console.log("PauseCounter: " + pauseCounter);
    }
}

function pause() {
    if (pauseCounter % 2 === 1) {
        speedXStore = speedX;
        speedYStore = speedY;
        speedX = 0;
        speedY = 0;
    }
    else if (speedX != 0 || speedY != 0) {
        pauseCounter = 1;
        speedXStore = speedX;
        speedYStore = speedY;
        speedX = 0;
        speedY = 0;
    }
    else if (pauseCounter % 2 === 0) {
        pauseCounter = 0;
        speedX = speedXStore;
        speedY = speedYStore;
    }
}

function foodRandomiser() { // Randomises coordinates of food
    foodX = floor(random(1, 11));
    foodY = floor(random(1, 11));
}

function move() { // Moves head square in accordence with the speed
    headX += (1 * speedX);
    headY += (1 * speedY);
}

function scoreCounter() { // Manages the score counter at the bottom
    rect(0, 600, 600, 50);
    textSize(32);
    counterText = text('Mince Pies: ' + (counter - 1), 10, 635);
}