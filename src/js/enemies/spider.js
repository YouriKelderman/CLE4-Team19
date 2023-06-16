import {
    Actor,
    Vector,
    RepeatForever,
    Repeat,
    Engine,
    Random,
    CollisionType,
    Shape,
    Circle,
    Color,
    Line,
    vec, Input
} from "excalibur";
import {Resources} from "../resources.js";

let path = [
    new Vector(1130, 50),
    new Vector(1112, 300),
    new Vector(931, 460),
    new Vector(717, 420),
    new Vector(630, 247),
    new Vector(470, 187),
    new Vector(360, 229),
    new Vector(229, 377),
    new Vector(256, 554),
    new Vector(301, 617),
    new Vector(242, 660),
    new Vector(180, 717),
    new Vector(151, 900),
];

let engine;
export class Spider extends Actor {


    timeAlive = 0;


    health = 3

    constructor(spriteID) {
        super({
            width: Resources.Pan.width / 2, height: Resources.Pan.height / 2
        })
    }

    onInitialize(engine) {
        this.engine = engine;

        this.anchor = new Vector(0.5, 0.5);
        this.scale = new Vector(1, 1);
        this.sprite = Resources.MenuSpider.toSprite();
        this.graphics.use(this.sprite);
        this.z = 100;
        this._setName("Enemy")
        this.on('collisionstart', (event) => this.collided(event));
        this.move(path)

    }

    collided(event) {

        if(event.other.name === "projectile"){
            event.other.kill()
            this.health -= 1;
            if(this.health < 1) {
                this.kill()
            }
        }
    }

    mouseClick() {
        path.push(new Vector(Math.floor(this.engine.input.pointers.primary.lastWorldPos.x), Math.floor(this.engine.input.pointers.primary.lastWorldPos.y)));


    }

    move(pathToFollow) {
        if (pathToFollow !== []) {
            this.pos = pathToFollow[0];

            for (let i = 0; i < pathToFollow.length; i++) {

                this.actions
                    .moveTo(pathToFollow[i].x, pathToFollow[i].y, 100)

            }

        }
    }

    onPreUpdate(engine, delta) {
        if(this.pos.y > window.innerHeight) {
            console.log("JE BENT DOOD SUKKEL")
            this.kill();

        }
        if (engine.input.keyboard.wasPressed(Input.Keys.Enter)) {
            this.move(path)
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.J)) {

        }

        this.timeAlive++
    }
}
