import {Actor, Engine, Vector, Color, Debug, Physics, Input, Axis, CollisionType, Shape, vec} from "excalibur";
import {Scene} from "excalibur";
import {Tower} from "./tower.js";
import {Resources, ResourceLoader} from "./resources.js";
import {Range} from "./range.js";
import {Bami} from "./towers/bami.js";
import {Spider} from "./enemies/spider.js";
import {Wall} from "./hitbox.js";
import {Settings} from "./settings.js";

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
    "5*2*100, 2*1*50, 2*2*100, 2*1*50, 2*2*100, 2*1*50, 2*2*100, 2*1*50, 2*2*100, 2*1*50, 2*2*100, 2*1*50, 2*2*100, 100*0*75,10*1*50, 10*0*75, 2000*1*50"
]
let waveItem = 0;
let order = [];
let speed = [];
let walls = [];
let parsedResult = levels[0].split(",");
parsedResult.forEach(item => {
    item = item.split("*")
    for (let i = 0; i < Number(item[0]); i++) {
        order.push(Number(item[1]));
        speed.push(Number(item[2]));
    }
})

export class Park extends Scene {
    constructor() {
        super();
    }

    music = Resources.BackgroundMusic;
    spiderSpawner = 0
    isLegal = true;
    string = "";

    onActivate(_context) {
        this.engine.backgroundColor = new Color(239, 255, 228);
        if (this.engine.musicVolume === 0) {
            this.music.pause()

        }else {
            this.music.volume = this.engine.musicVolume;
            this.music.loop = true;
            this.music.play().then(r => console.log(r));
        }

    }

    onDeactivate(_context) {
        super.onDeactivate(_context);
        this.music.pause();
    }

    onInitialize(_engine) {

        placingSprite = new Bami();
        this.engine.input.pointers.primary.on("down", () => this.mouseInput());
        engine = _engine;
        let hitboxPoints = [1103, 45, 1094, 188, 1083, 321, 1066, 361, 994, 454, 913, 440, 787, 409, 736, 404, 714, 324, 656, 229, 592, 192, 515, 166, 458, 162, 394, 179, 302, 220, 214, 347, 210, 501, 232, 557, 263, 617, 216, 646, 175, 680, 130, 796, 186, 808, 204, 743, 241, 700, 302, 643, 322, 596, 272, 515, 271, 373, 315, 313, 357, 264, 421, 237, 526, 237, 594, 268, 646, 328, 677, 368, 684, 447, 571, 449, 537, 377, 474, 345, 414, 371, 375, 435, 399, 504, 469, 547, 543, 514, 579, 458, 534, 372, 582, 449, 480, 547, 325, 590, 399, 617, 488, 628, 602, 591, 663, 527, 679, 466, 676, 386, 633, 321, 541, 252, 459, 247, 351, 279, 296, 348, 271, 430, 283, 522, 321, 580, 306, 646, 357, 674, 418, 701, 556, 710, 634, 672, 702, 608, 739, 518, 743, 473, 866, 484, 1009, 500, 1079, 552, 1079, 591, 1075, 708, 1067, 803, 1120, 805, 1121, 734, 1116, 605, 1321, 814, 1410, 809, 1050, 465, 1093, 427, 1126, 369, 1145, 333, 1148, 192, 1152, 47];
        for (let i = 0; i < hitboxPoints.length; i += 2) {
            console.log(`${hitboxPoints[i]} ${hitboxPoints[i + 1]} ${hitboxPoints[i + 2]} ${hitboxPoints[i + 3]}`)
            let offsetX = 0
            let offsetY = 0

            let wall = new Wall((hitboxPoints[i]) + offsetX, (hitboxPoints[i + 1]) + offsetY, (hitboxPoints[i + 2]) + offsetX, (hitboxPoints[i + 3]) + offsetY);
            wall.on("precollision", (event) => {
                if (event.other instanceof Bami)
                    this.isLegal = false;

            })
            wall.on("collisionend", (event) => {
                if (event.other instanceof Bami)
                    this.isLegal = true;
            })
            walls.push(wall);
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
        settingsButton.pos = new Vector(50, 105);
        settingsButton.scale = new Vector(0.7, 0.7)
        settingsButton.z = 9999;
        settingsButton.enableCapturePointer = true;
        settingsButton.pointer.useGraphicsBounds = true;
        settingsButton.on("pointerup", (event) => this.goToSettings());
        this.add(settingsButton);

        //sidebutton
        this.sideButton = new Actor();
        this.sideButton.graphics.use(Resources.SideButton.toSprite());
        this.sideButton.pos = new Vector(1400, 450);
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
        this.buyMenu.z = 10000;
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
            this.string += `${Math.floor(engine.input.pointers.primary.lastWorldPos.x)}, ${Math.floor(engine.input.pointers.primary.lastWorldPos.y)},`
            console.log(this.string);
        }
    }

    activeTower(tower) {
        this.activetower = tower;
    }


    onPreUpdate(engine, delta) {
        placingSprite.checkSelf(int, this.isLegal);



        if (engine.input.keyboard.wasPressed(Input.Keys.B)) {
            placing = !placing;
            console.log(int);
            if (placing) {
                walls.forEach(wall => {
                    this.add(wall);
                })
                const circle = Shape.Circle(50);
                placingSprite.collider.set(circle);
                placingSprite.collisionType = CollisionType.Passive;
                placingSprite._setName('PlacingSprite')
                this.add(placingSprite);
            } else {
                walls.forEach(wall => {
                    wall.kill();
                })
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
                enemy.setSpeed(speed[waveItem]);
                this.add(enemy)
                waveItem += 1;
            }
            this.spiderSpawner++
            if (this.spiderSpawner > Math.random() * (150 - 50) + 50) {
                this.spiderSpawner = 0
            }
        }
    }
}

