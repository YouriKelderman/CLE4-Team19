import {
    Actor,
    Engine,
    Vector,
    Color,
    Debug,
    Physics,
    Input,
    Axis,
    CollisionType,
    Shape,
    vec,
    PolygonCollider
} from "excalibur";
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
let range = new Range();
let path = "";
let engine;
let route = [];
let mapping = false;
let running = false;

export class Park extends Scene {
    constructor() {
        super();

    }

    music = Resources.BackgroundMusic;
    spiderSpawner = 0;
    isLegal = true;

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

        let hitboxPoints = [1108.45,1101.188,1089.333,1017.439,853.435,733.408,695.282,611.203,498.166,388.182,271.261,219.356,214.509,256.595,265.627,181.681,130.803,180.820,193.757,287.674,311.649,395.697,511.714,637.679,702.609,748.474,1026.515,1084.556,1074.817,1108.812,1117.600,1343.823,1401.821,1053.466,1107.413,1140.337,1147.191,1158.23,1105.33,1105.33]

        for (let i = 0; i < hitboxPoints.length; i += 2) {

            console.log(`${hitboxPoints[i]} ${hitboxPoints[i + 1]} ${hitboxPoints[i + 2]} ${hitboxPoints[i + 3]}`)

            let offsetX = 0
            let offsetY = 0

            let wall = new Wall((hitboxPoints[i]) + offsetX, (hitboxPoints[i + 1]) + offsetY, (hitboxPoints[i + 2]) + offsetX, (hitboxPoints[i + 3]) + offsetY);

            this.add(wall);
        }

        let mapFloor = new Actor();
        mapFloor.graphics.use(Resources.Map1Ground.toSprite());
        mapFloor.scale = new Vector(5.5, 5.5);
        mapFloor.pos = new Vector(745, 425);
        // mapFloor.on('precollision', (event) => this.checkIfLegal(event));
        this.add(mapFloor);

        let mapTop = new Actor();
        mapTop.graphics.use(Resources.Map1Top.toSprite());
        mapTop.scale = new Vector(5.5, 5.5);
        mapTop.pos = new Vector(745, 425);
        mapTop.z = 9999;
        this.add(mapTop);

        let settingsButton = new Actor();
        settingsButton.graphics.use(Resources.SettingsButton.toSprite());
        settingsButton.pos = new Vector(1365, 125);
        settingsButton.scale = new Vector(0.9, 0.9);
        settingsButton.z = 9999;
        settingsButton.enableCapturePointer = true;
        settingsButton.pointer.useGraphicsBounds = true;
        settingsButton.on("pointerup", (event) => console.log("settings"));
        this.add(settingsButton);

    }

    checkIfLegal(event) {
        if (event.other.name === "PlacingSprite") {
            this.isLegal = false
        }
    }

    mouseInput() {
        // if (this.isLegal) {
        //     if (placing) {
        //         let newClone = new Tower(this);
        //         newClone.pos = placingSprite.pos;
        //         this.add(newClone);
        //         newClone.checkSelf(int);
        //         this.activetower = newClone;
        //     } else if (mapping) {
        //         let pos = engine.input.pointers.primary.lastWorldPos;
        //         path += `,${Math.floor(pos.x).toString()}.${Math.floor(pos.y).toString()}`;
        //         localStorage.setItem("path", path);
        //         console.log(path);
        //     }
        // }

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
            console.log(this.activetower.tier);

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

        if (this.spiderSpawner === 1 && running) {
            this.add(new Spider());
        }
        this.spiderSpawner++;
        if (this.spiderSpawner > 50) {
            this.spiderSpawner = 0;
        }

        console.log(this.isLegal)
        this.isLegal = true
    }
}

