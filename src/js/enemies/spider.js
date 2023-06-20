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

let route = [];
let enemies = [Resources.Spider, Resources.Mouse];

let tempRoute = localStorage.getItem("path").split(",")
tempRoute.forEach(item => {
    item = item.split(".")
    let newItem = new Vector(Number(item[0]), Number(item[1]));
    route.push(newItem)
})
route[0] = route[1];

export class Spider extends Actor {

    timeAlive = 0;
    health = 5;

    constructor(spriteID) {
        super({
            width: Resources.Pan.width / 2, height: Resources.Pan.height / 2
        });
    }

    onInitialize(engine) {
        this.engine = engine;
        this.anchor = new Vector(0.5, 0.5);
        this.scale = new Vector(0.5, 0.5);
        this.z = 100;
        this._setName("Enemy");
        this.on('collisionstart', (event) => this.collided(event));
        this.move(route)
    }

    setType(type) {
        console.log(type)
        console.log(enemies[type]);
        this.sprite = enemies[type].toSprite();
        this.graphics.use(this.sprite);
    }

    collided(event) {
        if (event.other.name === "projectile") {
            event.other.kill();
            this.health -= 1;
            if (this.health < 1) {
                this.kill();
            }
        }
    }

    move(pathToFollow) {
        if (pathToFollow !== []) {
            this.pos = pathToFollow[0];

            for (let i = 0; i < pathToFollow.length; i++) {

                let previousPos = i + 1
                let distance;

                if (pathToFollow[previousPos] === undefined) {
                    distance = new Vector(pathToFollow[i].x - this.pos.x, pathToFollow[i].y - this.pos.y);
                } else {
                    distance = new Vector(pathToFollow[i].x - pathToFollow[previousPos].x, pathToFollow[i].y - pathToFollow[previousPos].y);
                }

                let angle = Math.sqrt((distance.x * distance.x) + (distance.y * distance.y));
                if (distance.x < 0) {
                }
                angle = Math.asin(distance.y / angle);

                if (!isNaN(angle)) {
                    if (distance.x < 0) {
                        angle = Math.abs(angle) + Math.PI;
                    }
                    if (distance.x < 0 && distance.y > 0) {

                        angle = -Math.abs(angle);
                    }


                    this.actions.moveTo(pathToFollow[i].x, pathToFollow[i].y, 100)
                    this.actions.rotateTo(angle, 1000, 1)

                }

            }
        }
    }

    onPreUpdate(engine, delta) {
        if (this.pos.y > window.innerHeight) {
            console.log("JE BENT DOOD SUKKEL");
            this.kill();

        }
        if (engine.input.keyboard.wasPressed(Input.Keys.Enter)) {
            this.move(route)

        }
        if (engine.input.keyboard.wasPressed(Input.Keys.J)) {

        }

        this.timeAlive++;

    }
}
