let SCALE = 8;
let SCREEN_SIZE = 80

let FRAMERATE = 12;

let BUTTON_WIDTH = 12;
let BUTTON_HEIGHT = 6;

let money = 10;
let temperature = -5;
let insulation = 0;
let health = 100;

let snowman, snowmanImg;
let platform, platformImg;
let snowBG, snowBGImg;
let tophat, tophatImg;
let necktie, necktieImg;

let clothesHats = [];
let clothesAccessories = [];

let snowSprites = [];

let buttons = [];
let labels = [];
let wardrobeButton, equipmentButton;
let moneyLabel, temperatureLabel, insulationLabel, healthLabel;

let tophatButton, necktieButton;

let mainScene, wardrobeScene, equipmentScene;
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

class Label
{
    _label;
    _x; _y;
    _width; _height;

    constructor(x, y, label)
    {
        this._x = x * SCALE;
        this._y = y * SCALE;
        this._width = BUTTON_WIDTH * SCALE;
        this._height = BUTTON_HEIGHT * SCALE;
        this._label = label;
    }

    draw()
    {
        fill(color(255, 150, 150));
        rect(this._x, this._y, this._width, this._height);
        fill(255, 255, 255);
        text(this._label, this._x+this._width/2, this._y+this._height/2);
    }
}

class Button extends Label
{
    #onClick;

    constructor(x, y, label, onClick)
    {
        super(x, y, label);
        this.#onClick = onClick;
    }

    draw()
    {
        fill( this.isMouseOver() ? color(100, 0, 0) : color(255, 0, 0) );
        rect(this._x, this._y, this._width, this._height);
        fill(255, 255, 255);
        text(this._label, this._x+this._width/2, this._y+this._height/2);
    }

    click()
    {
        this.#onClick();
    }

    isMouseOver()
    {
        return (
            mouseX > this._x && mouseX < this._x + this._width &&
            mouseY > this._y && mouseY < this._y + this._height
        );
    }
}

class ItemButton extends Button
{
    #item;

    get item() { return this.#item; }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {Item} item 
     */
    constructor (x, y, item)
    {
        super(x, y, item.name, selectItem);
        this.#item = item;
    }
}

class Sprite
{
    #imgs = [];
    #currentImage;
    #x; #y;
    #width; #height;

    get currentImage() { return this.#currentImage; }

    /**
     * 
     * @param {Image[]} imgs 
     */
    constructor(imgs, x, y, width, height)
    {
        this.#imgs = imgs;
        this.#currentImage = this.#imgs[0];
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
    #clothesSprites = [null, null];
    #clothesItems = [null, null];

    get insulation()
    {
        let i = 0;
        for (let c of this.#clothesItems)
            if (c != null)
                i += c.insulation;
        return i;
    }

    constructor(img, x, y, width, height)
    {
        super(img, x, y, width, height);
    }

    /**
     * 
     * @param {ClothingItem} clothing hat, accessory
     */
    wearClothing(clothing)
    {
        switch(clothing.type)
        {
            case "hat":
                if (this.#clothesItems[0] == clothing)
                {
                    this.#clothesItems[0] = null;
                    this.#clothesSprites[0] = null;
                }
                else
                {
                    this.#clothesItems[0] = clothing;
                    this.#clothesSprites[0] = new ClothingSprite(clothing);
                }
                break;
            case "accessory":
                if (this.#clothesItems[1] == clothing)
                {
                    this.#clothesItems[1] = null;
                    this.#clothesSprites[1] = null;
                }
                else
                {
                    this.#clothesItems[1] = clothing;
                    this.#clothesSprites[1] = new ClothingSprite(clothing);
                }
                break;
        }
    }

    draw()
    {
        super.draw();
        
        for (let c of this.#clothesSprites)
            if (c != null)
                c.draw();
    }
}

class ClothingSprite extends Sprite
{
    #item;

    constructor(item)
    {
        super(item.imgs, SCREEN_SIZE/2, SCREEN_SIZE/2-2, 32, 48);
        this.#item = item;
    }
}

class Item
{
    #name;
    #price;
    #imgs;

    get imgs() { return this.#imgs; }
    get name() { return this.#name; }

    /**
     * 
     * @param {String} name 
     * @param {number} price 
     * @param {Image[]} imgs 
     */
    constructor(name, price, imgs)
    {
        this.#name = name;
        this.#price = price;
        this.#imgs = imgs;
    }
}

class ClothingItem extends Item
{
    #type;
    #insulation;

    get type() { return this.#type }
    get insulation() { return this.#insulation; }

    constructor(name, type, price, insulation, imgs)
    {
        super(name, price, imgs);
        this.#type = type;
        this.#insulation = insulation;
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
    tophatImg = loadImage("assets/tophat.png");
    necktieImg = loadImage("assets/tie.png");
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

    tophat = new ClothingItem("Top Hat", "hat", 100, 5, [tophatImg]);
    necktie = new ClothingItem("Tie", "accessory", 20, 1, [necktieImg]);

    tophatSprite = new ClothingSprite(tophat);
    necktieSprite = new ClothingSprite(necktie);

    insulation = snowman.insulation;
    
    homeButton = new Button(0, 0, "Home", goHome);
    wardrobeButton = new Button(BUTTON_WIDTH, 0, "Wardrobe", openWardrobe);
    equipmentButton = new Button(BUTTON_WIDTH*2, 0, "Equipment", openEquipment);
    moneyLabel = new Label(0, SCREEN_SIZE-BUTTON_HEIGHT, `£ ${money}`);
    temperatureLabel = new Label(BUTTON_WIDTH, SCREEN_SIZE-BUTTON_HEIGHT, `${temperature} ℃`);
    insulationLabel = new Label(BUTTON_WIDTH*2, SCREEN_SIZE-BUTTON_HEIGHT, `Ins: ${insulation}`);
    healthLabel = new Label(BUTTON_WIDTH*3, SCREEN_SIZE-BUTTON_HEIGHT, `${health} HP`);
    
    tophatButton = new ItemButton(10, 20, tophat);
    necktieButton = new ItemButton(10, 30, necktie);


    mainScene = new Scene([snowBG, platform, snowman], color(0, 255, 255));
    wardrobeScene = new Scene([], color(204, 102, 0));   
    equipmentScene = new Scene([], color(255, 0, 255)); 

    activeScene = mainScene;
    buttons.push(wardrobeButton, homeButton, equipmentButton, tophatButton, necktieButton);
    labels.push(moneyLabel, temperatureLabel, insulationLabel, healthLabel);
}

function draw()
{
    activeScene.draw();

    if (activeScene == mainScene)
        drawSnow();

    for (let b of buttons)
        b.draw();
    for (let l of labels)
        l.draw();

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

function openEquipment()
{
    loadScene(equipmentScene);
}

/**
 * Event function called by ItemButton
 */
function selectItem()
{
    snowman.wearClothing(this.item);
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
}