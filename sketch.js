let SCALE = 8;
let SCREEN_SIZE = 80

let snowman, platform;
let snowmanImg, platformImg;

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

    snowman = new Snowman([snowmanImg], SCREEN_SIZE/2, SCREEN_SIZE/2-2, 32, 32);
    platform = new Sprite([platformImg], SCREEN_SIZE/2, SCREEN_SIZE/2+4, 32, 32);
    mainScene = new Scene([platform, snowman], color(0, 255, 255));

    activeScene = mainScene;
}

function draw()
{
    activeScene.draw();
}