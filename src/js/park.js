import {Actor, Engine, Vector, Color, Debug, Physics, Input, Axis, CollisionType, Shape} from "excalibur";
import {Scene} from "excalibur";
import {Placeholder} from "./placeholder.js";
import {Resources, ResourceLoader} from "./resources.js";


let placing = false;
let placingSprite;
let int = 0;

export class Park extends Scene {

    constructor() {
        super();

    }
    music = Resources.BackgroundMusic;

    onActivate(_context) {
        this.engine.backgroundColor = new Color(239, 255, 228)
        this.music.stop()
        this.music.volume = 0.5
        this.music.loop = true;
        this.music.play().then(r => console.log(r));
    }

    onInitialize(_engine) {
        placingSprite = new Placeholder();
        this.engine.input.pointers.primary.on("down", () => this.mouseInput());

        let mapFloor = new Actor();
        mapFloor.graphics.use(Resources.Map1Ground.toSprite());
        mapFloor.scale = new Vector(6, 6);
        mapFloor.pos = new Vector(775, 335);
        this.add(mapFloor);

        let mapTop = new Actor();
        mapTop.graphics.use(Resources.Map1Top.toSprite());
        mapTop.scale = new Vector(6, 6);
        mapTop.pos = new Vector(775, 335);
        mapTop.z = 9999
        this.add(mapTop);

    }

    mouseInput() {
        if (placing) {
            let newClone = new Placeholder();
            newClone.pos = placingSprite.pos;
            this.add(newClone);
            newClone.checkSelf(int);
        }
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
    }
}

