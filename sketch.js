//#region globals

//#region constants
let SCALE = 8;
let SCREEN_SIZE = 80

let FRAMERATE = 12;

let HOUR_RATE = 60;

let BUTTON_WIDTH = 12;
let BUTTON_HEIGHT = 6;
//#endregion

let bgm;

//#region important values
let saveData;
let timeElapsed = 0;

let money = 0;
let temperature = -5;
let insulation = 0;
let health = 100;
let hours = 0;
//#endregion

//#region sprite stuff
let snowman, snowmanImg;
let platform, platformImg;
let snowBG, snowBGImg;

let woolyhat, tophat, vikinghelmet;
let shirtbuttons, tshirt, jacket;
let glasses, necktie, moustache;

let woolyhatImg, tophatImg, vikinghelmetImg;
let shirtbuttonsImg, tshirtImg, jacketImg;
let glassesImg, necktieImg, moustacheImg;

let clothesHats = [];
let clothesAccessories = [];

let snowSprites = [];
//#endregion

//#region UI elements
let permanentButtons = [];
let buttons = [];
let labels = [];
let wardrobeButton, equipmentButton, minigameButton, bgmButton;
let moneyLabel, temperatureLabel, insulationLabel, healthLabel, hoursLabel;

let woolyhatButton, tophatButton, vikinghelmetButton;
let shirtbuttonsButton, tshirtButton, jacketButton;
let glassesButton, necktieButton, moustacheButton;
//#endregion

//#region scenes
let mainScene, wardrobeScene, equipmentScene;
let activeScene;
//#endregion

//#endregion

//#region classes

class Scene
{
    #sprites;
    #fillColour;
    #buttons;

    get buttons() { return this.#buttons; }

    /**
     * 
     * @param {Sprite[]} sprites 
     * @param {Color} fillColour
     * @param {Button[]} buttons
     */
    constructor(sprites, fillColour, buttons = [])
    {
        this.#sprites = sprites;
        this.#fillColour = fillColour;
        this.#buttons = buttons;
    }

    draw()
    {
        background(this.#fillColour);

        for (let s of this.#sprites)
            s.draw();
    }
}

class Label
{
    _label;
    _x; _y;
    _width; _height;

    constructor(x, y, label = " ")
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

    update(label)
    {
        if (label != null)
            this._label = label;
    }
}

class Button extends Label
{
    #onClick;
    #selected;

    constructor(x, y, label, onClick)
    {
        super(x, y, label);
        this.#onClick = onClick;
    }

    draw()
    {
        fill( this.isMouseOver() || this.#selected ? color(100, 0, 0) : color(255, 0, 0) );
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

    select()
    {
        this.#selected = true;
    }

    unselect()
    {
        this.#selected = false;
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

    update()
    {
        if (this.#item.purchased)
            this._label = this.#item.name;
        else
            super.update(this.#item.name + ` £${this.#item.price}`);

        if (!this.#item.equipped)
            this.unselect();
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
    #clothesSprites = [null, null, null];
    #clothesItems = [null, null, null];

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

    #equipSlot(i, clothing)
    {
        if (this.#clothesItems[i] == clothing)
        {
            this.#clothesItems[i] = null;
            this.#clothesSprites[i] = null;
            clothing.unequip();
        }
        else
        {
            this.#clothesItems[i] = clothing;
            this.#clothesSprites[i] = new ClothingSprite(clothing);
            clothing.equip();
        }
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
                this.#equipSlot(0, clothing);
                break;
            case "torso":
                this.#equipSlot(1, clothing);
                break;
            case "accessory":
                this.#equipSlot(2, clothing);
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
    #purchased = false;
    #equipped = false;

    get imgs() { return this.#imgs; }
    get name() { return this.#name; }
    get price() { return this.#price; }
    get purchased() { return this.#purchased; }
    get equipped() { return this.#equipped; }

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

    purchase()
    {
        if (!this.#purchased)
            if (this.#price <= money)
            {
                this.#purchased = true;
                money -= this.#price;
            }
    }

    equip() { this.#equipped = true; }
    unequip() { this.#equipped = false; }
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

//#endregion

//#region functions

//#region p5.js functions

function preload()
{
    saveData = loadJSON("save.json", loadData);

    bgm = loadSound("assets/bgm.wav");

    snowmanImg = loadImage("assets/snowman.png");
    platformImg = loadImage("assets/platform.png");
    snowBGImg = loadImage("assets/snowbg.png");

    woolyhatImg = loadImage("assets/woolyhat.png");
    tophatImg = loadImage("assets/tophat.png");
    vikinghelmetImg = loadImage("assets/vikinghelmet.png");
    shirtbuttonsImg = loadImage("assets/shirtbuttons.png");
    tshirtImg = loadImage("assets/tshirt.png");
    jacketImg = loadImage("assets/jacket.png");
    glassesImg = loadImage("assets/glasses.png");
    necktieImg = loadImage("assets/tie.png");
    moustacheImg = loadImage("assets/moustache.png");
}

function setup()
{
    //#region p5js setup
    createCanvas(640, 640);
    noStroke();
    imageMode(CENTER);
    textAlign(CENTER, CENTER);
    textSize(18);
    frameRate(FRAMERATE);
    //#endregion

    //#region sprites
    snowman = new Snowman([snowmanImg], SCREEN_SIZE/2, SCREEN_SIZE/2-2, 32, 32);
    platform = new Sprite([platformImg], SCREEN_SIZE/2, SCREEN_SIZE/2+4, 32, 32);
    snowBG = new Sprite([snowBGImg], SCREEN_SIZE/2, SCREEN_SIZE/2, 80, 80);
    //#endregion

    //#region items
    woolyhat = new ClothingItem("WlyHt", "hat", 30, 3, [woolyhatImg]);
    tophat = new ClothingItem("TopHt", "hat", 100, 5, [tophatImg]);
    vikinghelmet = new ClothingItem("VHlm", "hat", 500, 10, [vikinghelmetImg]);
    shirtbuttons = new ClothingItem("Btns", "torso", 5, 1, [shirtbuttonsImg]);
    tshirt = new ClothingItem("Tshirt", "torso", 30, 10, [tshirtImg]);
    jacket = new ClothingItem("Jkt", "torso", 300, 20, [jacketImg]); 
    glasses = new ClothingItem("Gls", "accessory", 10, 1, [glassesImg]);
    necktie = new ClothingItem("Tie", "accessory", 20, 10, [necktieImg]);
    moustache = new ClothingItem("Tash", "accessory", 90, 6, [moustacheImg]);
    //#endregion

    insulation = snowman.insulation;
    
    //#region UI elements
    homeButton = new Button(0, 0, "Home", goHome);
    wardrobeButton = new Button(BUTTON_WIDTH, 0, "Wardrobe", openWardrobe);
    equipmentButton = new Button(BUTTON_WIDTH*2, 0, "Equipment", openEquipment);
    minigameButton = new Button(BUTTON_WIDTH*3, 0, "Minigame", startMinigame);
    bgmButton = new Button(SCREEN_SIZE-BUTTON_WIDTH, 0, "BGM", playBGM);

    moneyLabel = new Label(0, SCREEN_SIZE-BUTTON_HEIGHT);
    temperatureLabel = new Label(BUTTON_WIDTH, SCREEN_SIZE-BUTTON_HEIGHT);
    insulationLabel = new Label(BUTTON_WIDTH*2, SCREEN_SIZE-BUTTON_HEIGHT);
    healthLabel = new Label(BUTTON_WIDTH*3, SCREEN_SIZE-BUTTON_HEIGHT);
    hoursLabel = new Label(SCREEN_SIZE-BUTTON_WIDTH, SCREEN_SIZE-BUTTON_HEIGHT);

    woolyhatButton = new ItemButton(5, 15, woolyhat);
    tophatButton = new ItemButton(5+BUTTON_WIDTH, 15, tophat);
    vikinghelmetButton = new ItemButton(5+2*BUTTON_WIDTH, 15, vikinghelmet);
    shirtbuttonsButton = new ItemButton(5, 25, shirtbuttons);
    tshirtButton = new ItemButton(5+BUTTON_WIDTH, 25, tshirt);
    jacketButton = new ItemButton(5+2*BUTTON_WIDTH, 25, jacket);
    glassesButton = new ItemButton(5, 35, glasses);
    necktieButton = new ItemButton(5+BUTTON_WIDTH, 35, necktie);
    moustacheButton = new ItemButton(5+2*BUTTON_WIDTH, 35, moustache);
    //#endregion

    //#region scenes
    mainScene = new Scene([snowBG, platform, snowman], color(0, 255, 255));
    wardrobeScene = new Scene([], color(204, 102, 0), [
        woolyhatButton, tophatButton, vikinghelmetButton, 
        shirtbuttonsButton, tshirtButton, jacketButton,
        glassesButton, necktieButton, moustacheButton]);   
    equipmentScene = new Scene([], color(255, 0, 255)); 
    //#endregion

    activeScene = mainScene;
    permanentButtons.push(wardrobeButton, homeButton, equipmentButton, minigameButton, bgmButton);
    buttons = permanentButtons;
    labels.push(moneyLabel, temperatureLabel, insulationLabel, healthLabel, hoursLabel);
}

function draw()
{
    activeScene.draw();

    if (activeScene == mainScene)
        drawSnow();

    updateLabels();

    for (let b of buttons)
        b.draw();
    for (let l of labels)
        l.draw();

    timeElapsed ++;
    hours = timeElapsed % HOUR_RATE == 0 ? hours+1 : hours;
}

function mouseClicked()
{
    for (let b of buttons)
        if (b.isMouseOver())
            b.click();
}

//#endregion

//#region bespoke functions

function loadData()
{
    money = saveData["money"];
}

/**
 * 
 * @param {Scene} scene 
 */
function loadScene(scene)
{
    buttons = permanentButtons.concat(scene.buttons);
    for (let b of buttons)
    {
        b.update();
    }
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

function startMinigame()
{
    let win = window.open("minigame.html");
}

/**
 * Event function called by ItemButton
 */
function selectItem()
{
    this.item.purchase(money)
    if (this.item.purchased)
    {
        this.select();
        snowman.wearClothing(this.item);
        insulation = snowman.insulation;
    }
    this.update();
}

function updateLabels()
{
    moneyLabel.update(`£ ${money}`);
    temperatureLabel.update(`${temperature} ℃`);
    insulationLabel.update(`Ins: ${insulation}`);
    healthLabel.update(`${health} HP`);
    hoursLabel.update(`${hours} h`);
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

function playBGM()
{
    if (bgm.isPlaying())
        bgm.stop()
    else
    {
        bgm.play();
        bgm.loop();
    }
}

//#endregion

//#endregion