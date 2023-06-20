import {Actor, Engine, Vector, Color, Debug, Physics, Input, Axis, CollisionType, Shape, vec} from "excalibur";
import {Scene} from "excalibur";
import {Tower} from "./tower.js";
import {Resources, ResourceLoader} from "./resources.js";
import {Range} from "./range.js";
import {Bami} from "./towers/bami.js";
import {Spider} from "./enemies/spider.js";
import {Wall} from "./hitbox.js";

let placing = false;
let placingSprite;
let int = 0;
let placinge = false;
let placingSpritee = new Range();
let activetower;
let path = "";
let engine;
let route = [];
let mapping = false;
let running = false;
let levels = [
    "100*0,10*1, 10*0, 2000*1"
]
let waveItem = 0;
let order = [];

let parsedResult = levels[0].split(",");
parsedResult.forEach(item => {
    item = item.split("*")
    for(let i=0; i < Number(item[0]); i++) {
        order.push(Number(item[1]));
    }
})
export class Park extends Scene {
    constructor() {
        super();
    }

    music = Resources.BackgroundMusic;
    spiderSpawner = 0
    spiderSpawner = 0;
    isLegal = true;
    string = "";

    onActivate(_context) {
        this.engine.backgroundColor = new Color(239, 255, 228);
        this.music.stop();
        this.music.volume = 0.5;
        this.music.loop = true;
        this.music.play().then(r => console.log(r));
    }

    onInitialize(_engine) {

        placingSprite = new Bami();
        this.engine.input.pointers.primary.on("down", () => this.mouseInput());
        engine = _engine;

        let hitboxPoints = [1104,49,1100,188,1087,318,1064,366,983,450,912,443,850,433,821,421,787,407,733,407,737,371,702,291,676,255,657,229,612,197,515,165,462,165,387,179,327,214,261,267,214,347,213,503,223,551,256,606,250,626,185,668,129,806,182,805,203,743,249,700,306,650,357,693,414,702,425,715,554,720,630,686,711,605,744,530,748,472,1017,508,1082,560,1074,801,1112,799,1120,606,1319,804,1376,780,1055,470,1144,333,1151,44, 1151,44];

        for (let i = 0; i < hitboxPoints.length; i += 2) {

            console.log(`${hitboxPoints[i]} ${hitboxPoints[i + 1]} ${hitboxPoints[i + 2]} ${hitboxPoints[i + 3]}`)

            let offsetX = 0
            let offsetY = 0

            let wall = new Wall((hitboxPoints[i]) + offsetX, (hitboxPoints[i + 1]) + offsetY, (hitboxPoints[i + 2]) + offsetX, (hitboxPoints[i + 3]) + offsetY);
            wall.on("collisionstart", (event) => {
                if(event.other instanceof Bami)
                    this.isLegal = false;
            })
            wall.on("collisionend", (event) => {
                if(event.other instanceof Bami)
                    this.isLegal = true;
            })
            this.add(wall);
        }

        let mapFloor = new Actor();
        mapFloor.graphics.use(Resources.Map1Ground.toSprite());
        mapFloor.scale = new Vector(5.5, 5.5);
        mapFloor.pos = new Vector(745, 425);
        this.add(mapFloor);
        let mapTop = new Actor();
        mapTop.graphics.use(Resources.Map1Top.toSprite());
        mapTop.scale = new Vector(5.5, 5.5);
        mapTop.pos = new Vector(745, 425);
        mapTop.z = 9999
        this.add(mapTop);

        let settingsButton = new Actor();
       settingsButton.graphics.use(Resources.SettingsButton.toSprite());
        settingsButton.pos = new Vector(50,105);
        settingsButton.scale = new Vector(0.7, 0.7)
        settingsButton.z = 9999;
        settingsButton.enableCapturePointer = true;
        settingsButton.pointer.useGraphicsBounds = true;
        settingsButton.on("pointerup", (event) => this.goToSettings());
        this.add(settingsButton);

        //sidebutton
        this.sideButton = new Actor();
        this.sideButton.graphics.use(Resources.SideButton.toSprite());
        this.sideButton.pos = new Vector(1400,450);
        this.sideButton.scale = new Vector(0.7, 0.7)
        this.sideButton.z = 9999;
        this.sideButton.enableCapturePointer = true;
        this.sideButton.pointer.useGraphicsBounds = true;
        this.sideButton.on("pointerup", (event) => this.drawBuyMenu());
        this.add(this.sideButton);
    }

    drawBuyMenu() {
        this.buyMenu = new Actor();
        this.buyMenu.graphics.use(Resources.BuyMenu.toSprite());
        this.buyMenu.pos = new Vector(1500, 450);
        this.buyMenu.actions.moveTo(new Vector(1400, 450), 750);
        this.buyMenu.scale = new Vector(2, 0.9)
        this.buyMenu.z = 9998;
        this.buyMenu.enableCapturePointer = true;
        this.buyMenu.pointer.useGraphicsBounds = true;
        this.buyMenu.on("pointerup", (event) => console.log("drawMenuBar"));
        this.add(this.buyMenu);

        this.sideButton.kill()
    }

    undoDrawBuyMenu() {
        this.buyMenu.actions.moveTo(new Vector(1400, 450), 750);
        this.buyMenu.kill()
        this.sideButton.pos = new Vector(1500, 450);
        this.add(this.sideButton);
    }

    goToSettings() {
        console.log("goToSettings")
        this.game = engine;
        this.engine.goToScene('settings');
    }

    checkIfLegal(event) {
        if (event.other instanceof Bami) {
            console.log("e");
            this.isLegal = true
        }
    }

    mouseInput() {
        console.log(this.isLegal)
        if (placing && this.isLegal) {
            let newClone = new Tower(this);
            newClone.pos = placingSprite.pos;
            this.add(newClone);
            newClone.checkSelf(int);
            this.activetower = newClone;
        } else if (mapping) {
            let pos = engine.input.pointers.primary.lastWorldPos;
            path += `,${Math.floor(pos.x).toString()}.${Math.floor(pos.y).toString()}`
            localStorage.setItem("path", path);
            console.log(path)
        } else {
            this.string += `${Math.floor(engine.input.pointers.primary.lastWorldPos.x)},`
            this.string += `${Math.floor(engine.input.pointers.primary.lastWorldPos.y)},`
            console.log(this.string)
        }
    }

    activeTower(tower) {
        this.activetower = tower;
    }

    onPreUpdate(engine, delta) {

        if (engine.input.keyboard.wasPressed(Input.Keys.B)) {
            placing = !placing;
            console.log(int);
            if (placing) {
                const circle = Shape.Circle(10);
                placingSprite.collider.set(circle);
                placingSprite.collisionType = CollisionType.Passive;
                placingSprite._setName('PlacingSprite')
                this.add(placingSprite);
                placingSprite.checkSelf(int);
            } else {
                placingSprite.kill();
            }
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.G)) {
            placinge = !placinge;
            console.log(int);
            if (placinge) {
                this.add(placingSpritee);
            } else {
                placingSprite.kill();
            }
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.O)) {
            this.activetower.updateRange(this.activetower.range -= 50);
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.Enter)) {
            running = !running;
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.P)) {
            this.activetower.updateRange(this.activetower.range += 50);

        }
        if (engine.input.keyboard.wasPressed(Input.Keys.K)) {
            this.activetower.tier -= 1;
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.L)) {
            this.activetower.tier += 1;
            console.log(this.activetower.tier)

        }
        if (engine.input.keyboard.wasPressed(Input.Keys.H)) {
            mapping = !mapping;
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.N)) {
            int += 1;
            if (int > 1) {
                int = 0;
            }
            placingSprite.checkSelf(int);
        }
        if (placing) {
            placingSprite.pos = engine.input.pointers.primary.lastWorldPos;
        }
        if (placinge) {
            placingSpritee.pos = engine.input.pointers.primary.lastWorldPos;
        }
        if (waveItem <= order.length - 1) {
            if (this.spiderSpawner === 1 && running) {
                let enemy = new Spider();
                enemy.setType(order[waveItem]);
                this.add(enemy)
                waveItem += 1;
            }
            this.spiderSpawner++
            if (this.spiderSpawner > Math.random() * (200 - 50) + 50) {
                this.spiderSpawner = 0
            }
        }
    }
}

