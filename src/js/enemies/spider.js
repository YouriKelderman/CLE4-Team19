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

<<<<<<<<< Temporary merge branch 1
let route = [];
let tempRoute = localStorage.getItem("path").split(",")
tempRoute.forEach(item => {

    item = item.split(".")
    let newItem = new Vector(Number(item[0]), Number(item[1]));
    route.push(newItem)
})
route[0] = route[1];
=========
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

>>>>>>>>> Temporary merge branch 2
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
        this.sprite = Resources.Spider.toSprite();
        this.graphics.use(this.sprite);
        this.z = 100;
        this._setName("Enemy");
        this.on('collisionstart', (event) => this.collided(event));
<<<<<<<<< Temporary merge branch 1
        this.move(route)
console.log(route);
    }

    collided(event) {
        if(event.other.name === "projectile"){
            event.other.kill()
=========
        this.move(path);

    }

    collided(event) {

        if (event.other.name === "projectile") {
            event.other.kill();
>>>>>>>>> Temporary merge branch 2
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

                    let previousPos = i +1
                    let distance;

                    if (pathToFollow[previousPos] === undefined) {
                        distance = new Vector(pathToFollow[i].x - this.pos.x, pathToFollow[i].y - this.pos.y);
                    } else {
                        distance = new Vector(pathToFollow[i].x - pathToFollow[previousPos].x, pathToFollow[i].y - pathToFollow[previousPos].y);
                    }

                    console.log(distance.x)

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
<<<<<<<<< Temporary merge branch 1
            this.move(route)
=========
            this.move(path);
>>>>>>>>> Temporary merge branch 2
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.J)) {

        }

        this.timeAlive++;

    }
}
