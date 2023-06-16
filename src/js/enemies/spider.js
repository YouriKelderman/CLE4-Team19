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

let path = [new Vector(0, 0)];

let engine;
export class Spider extends Actor {
    health = 3
    constructor(spriteID) {
        super({
            width: Resources.Pan.width / 2, height: Resources.Pan.height / 2
        })
    }

    onInitialize(engine) {
        this.engine = engine;
        this.engine.input.pointers.primary.on("down", () => this.mouseClick());
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
            console.log(this.health)
            this.health -= 1;
            if(this.health < 1) {
                console.log("dood als een pier")
                this.kill()
            }
        }
    }

    mouseClick() {
        path.push(new Vector(Math.floor(this.engine.input.pointers.primary.lastWorldPos.x), Math.floor(this.engine.input.pointers.primary.lastWorldPos.y)));
        console.log(path)
    }

    move(pathToFollow) {
        if (pathToFollow !== []) {
            this.pos = pathToFollow[0];
            console.log(pathToFollow)
            for (let i = 0; i < pathToFollow.length - 1; i++) {
                console.log(pathToFollow[i])
                this.actions
                    .moveTo(pathToFollow[i].x, pathToFollow[i].y, 100)
            }
        }
    }

    onPreUpdate(engine, delta) {
        if (engine.input.keyboard.wasPressed(Input.Keys.Enter)) {
            this.move(path)
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.J)) {
            console.log(path)
        }
    }
}
