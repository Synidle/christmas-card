let SCALE = 8;
let SCREEN_SIZE = 80

let FRAMERATE = 12;

let BUTTON_WIDTH = 12;
let BUTTON_HEIGHT = 6;

let snowman, snowmanImg;
let platform, platformImg;
let snowBG, snowBGImg;

let snowSprites = [];

let buttons = [];
let wardrobeButton;

let mainScene;
let activeScene;

class Scene
{
    #sprites;
    #fillColour;

    /**
     * 
     * @param {Sprite[]} sprites 
     * @param {Color} fillColour
     */
    constructor(sprites, fillColour)
    {
        this.#sprites = sprites;
        this.#fillColour = fillColour;
    }

    draw()
    {
        background(this.#fillColour);

        for (let s of this.#sprites)
        {
            s.draw();
        }
    }
}

class Button
{
    #label;
    #x; #y;
    #width; #height;
    #onClick;

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {String} label 
     * @param {Function} onClick 
     */
    constructor(x, y, width, height, label, onClick)
    {
        this.#x = x * SCALE;
        this.#y = y * SCALE;
        this.#width = width * SCALE;
        this.#height = height * SCALE;
        this.#label = label;
        this.#onClick = onClick;
    }

    draw()
    {
        fill( this.isMouseOver() ? color(100, 0, 0) : color(255, 0, 0) );
        rect(this.#x, this.#y, this.#width, this.#height);
        fill(255, 255, 255);
        text(this.#label, this.#x+this.#width/2, this.#y+this.#height/2);
    }

    click()
    {
        this.#onClick();
    }

    isMouseOver()
    {
        return (
            mouseX > this.#x && mouseX < this.#x + this.#width &&
            mouseY > this.#y && mouseY < this.#y + this.#height
        );
    }
}

class Sprite
{
    #imgs;
    #currentImage;
    #x; #y;
    #width; #height;

    /**
     * 
     * @param {Image[]} imgs 
     */
    constructor(imgs, x, y, width, height)
    {
        this.#currentImage = imgs[0];
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
    }

    draw()
    {
        image(this.#currentImage, this.#x*SCALE, this.#y*SCALE,
            this.#width*SCALE, this.#height*SCALE);
    }
}

class Snowman extends Sprite
{
    constructor(img, x, y, width, height)
    {
        super(img, x, y, width, height);
    }
}

class SnowSprite
{
    #x; #y;
    #speed;

    constructor()
    {
        this.#x = random(SCREEN_SIZE) * SCALE;
        this.#y = 0;
        this.#speed = 1;
    }

    move()
    {
        this.#y += this.#speed * SCALE;
    }

    draw()
    {
        fill(255, 255, 255);
        square(this.#x, this.#y, SCALE);
    }
}

function preload()
{
    snowmanImg = loadImage("assets/snowman.png");
    platformImg = loadImage("assets/platform.png");
    snowBGImg = loadImage("assets/snowbg.png");
}

function setup()
{
    createCanvas(640, 640);
    noStroke();
    imageMode(CENTER);
    textAlign(CENTER, CENTER);
    textSize(18);
    frameRate(FRAMERATE);

    snowman = new Snowman([snowmanImg], SCREEN_SIZE/2, SCREEN_SIZE/2-2, 32, 32);
    platform = new Sprite([platformImg], SCREEN_SIZE/2, SCREEN_SIZE/2+4, 32, 32);
    snowBG = new Sprite([snowBGImg], SCREEN_SIZE/2, SCREEN_SIZE/2, 80, 80);
    
    homeButton = new Button(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, "Home", goHome);
    wardrobeButton = new Button(BUTTON_WIDTH, 0, BUTTON_WIDTH, BUTTON_HEIGHT, "Wardrobe", openWardrobe);
    
    mainScene = new Scene([snowBG, platform, snowman], color(0, 255, 255));
    wardrobeScene = new Scene([], color(204, 102, 0));    

    activeScene = mainScene;
    buttons.push(wardrobeButton, homeButton);
}

function draw()
{
    activeScene.draw();

    for (let b of buttons)
        b.draw();

    drawSnow();
}

function mouseClicked()
{
    for (let b of buttons)
    {
        if (b.isMouseOver())
            b.click();
    }
}

/**
 * 
 * @param {Scene} scene 
 */
function loadScene(scene)
{
    activeScene = scene;
}

function openWardrobe()
{
    loadScene(wardrobeScene);
}

function goHome()
{
    loadScene(mainScene);
}

function buttonFunction()
{
    console.log("PRESSED BUTTON");
}

function drawSnow()
{
    for (let i = 0; i < snowSprites.length-1; i++)
    {
        snowSprites[i] = snowSprites[i+1];
        snowSprites[i].draw();
        snowSprites[i].move();
    }
    snowSprites.push(new SnowSprite());

    /*for (let s of snowSprites)
    {
        s.draw();
        s.move();
    }*/
}