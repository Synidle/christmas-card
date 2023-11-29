let SCALE = 8;
let SCREEN_SIZE = 80

let snowman, platform;
let snowmanImg, platformImg;
let buttons = [];

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
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
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

function preload()
{
    snowmanImg = loadImage("assets/snowman.png");
    platformImg = loadImage("assets/platform.png");
}

function setup()
{
    createCanvas(640, 640);
    imageMode(CENTER);
    textAlign(CENTER, CENTER);
    textSize(18);

    snowman = new Snowman([snowmanImg], SCREEN_SIZE/2, SCREEN_SIZE/2-2, 32, 32);
    platform = new Sprite([platformImg], SCREEN_SIZE/2, SCREEN_SIZE/2+4, 32, 32);
    mainScene = new Scene([platform, snowman], color(0, 255, 255));
    button = new Button(0, 0, 100, 50, "Button 1", buttonFunction);

    activeScene = mainScene;
    buttons.push(button);
}

function draw()
{
    activeScene.draw();

    button.draw();
}

function mouseClicked()
{
    for (let b of buttons)
    {
        if (b.isMouseOver())
            b.click();
    }
}

function buttonFunction()
{
    console.log("PRESSED BUTTON");
}