import {Actor, Engine, Vector, Color, Debug, Physics, Input, Axis, CollisionType, Shape, vec} from "excalibur";
import {Scene} from "excalibur";
import {Tower} from "./tower.js";
import {Resources, ResourceLoader} from "./resources.js";
import {Range} from "./range.js";
import {Bami} from "./towers/bami.js";
import {Spider} from "./enemies/spider.js";

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
    "7*0,6*1, 10*0, 2*1"
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

    onActivate(_context) {
        this.engine.backgroundColor = new Color(239, 255, 228)
        this.music.stop()
        this.music.volume = 0.5
        this.music.loop = true;
        this.music.play().then(r => console.log(r));
    }

    onInitialize(_engine) {
        console.log(order)

        placingSprite = new Bami();
        this.engine.input.pointers.primary.on("down", () => this.mouseInput());
        engine = _engine;
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
        settingsButton.pos = new Vector(1365,125);
        settingsButton.scale = new Vector(0.9, 0.9)
        settingsButton.z = 9999;
        settingsButton.enableCapturePointer = true;

        settingsButton.on("pointerup", (event) => console.log("settings"));
        this.add(settingsButton);


    }

    mouseInput() {
        if (placing) {
            let newClone = new Tower(this);
            newClone.pos = placingSprite.pos;
            this.add(newClone);
            newClone.checkSelf(int);
            this.activetower = newClone;
        } else if(mapping) {
            let pos = engine.input.pointers.primary.lastWorldPos;
            path += `,${Math.floor(pos.x).toString()}.${Math.floor(pos.y).toString()}`
            localStorage.setItem("path", path);
            console.log(path)
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
        if (waveItem <= order.length -1) {
            if (this.spiderSpawner === 1 && running) {
                let enemy = new Spider();
                enemy.setType(order[waveItem]);
                this.add(enemy)
                waveItem += 1;
            }
            this.spiderSpawner++
            if (this.spiderSpawner > 50) {
                this.spiderSpawner = 0
            }
        }
    }
}

