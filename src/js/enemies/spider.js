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
    vec, Input, RotationType, ParticleEmitter, EmitterType, Timer
} from "excalibur";
import {Resources} from "../resources.js";

let route = [];
let enemies = [
    [Resources.Spider, 5,],
    [Resources.Mouse, 3],
    [Resources.Rat, 6],
    [Resources.Racoon, 10],

];

let tempRoute = ",1128.102,1125.141,1118.192,1114.224,1116.268,1114.318,1098.352,1068.398,1030.444,993.468,936.461,867.452,806.444,761.426,723.401,707.352,674.289,641.246,600.217,547.192,490.182,416.197,345.220,305.252,273.289,250.319,231.368,227.417,234.478,248.526,258.560,273.588,275.619,254.643,214.673,189.705,171.731,156.783".split(",");
tempRoute.forEach(item => {
    item = item.split(".");
    let newItem = new Vector(Number(item[0]), Number(item[1]));
    route.push(newItem);
});
route[0] = route[1];

export class Spider extends Actor {
    game;
    timeAlive = 0;
    particle;
    speed = 100;
    health = 1;
    type = 0;
    deathTime

    constructor(game) {
        super();

        this.game = game;

        // this.particle = new ParticleEmitter({
        //     emitterType: EmitterType.Rectangle,
        //     radius: 1,
        //     minVel: 100,
        //     maxVel: 150,
        //     minAngle: 0,
        //     maxAngle: Math.PI * 2,
        //     emitRate: 300,
        //     opacity: 1,
        //     fadeFlag: true,
        //     particleLife: 1000,
        //     maxSize: 5,
        //     minSize: 1,
        //     beginColor: Color.fromRGB(125, 62, 42),
        //
        //     isEmitting: false
        // });
    }

    onInitialize(engine) {
        this.engine = engine;
        this.anchor = new Vector(0.5, 0.5);
        this.z = 100;
        this._setName("Enemy");
        this.on('collisionstart', (event) => this.collided(event));
        this.move(route);
    }

    setType(type) {
        this.type = type;
        this.sprite = enemies[type][0].toSprite();
        this.graphics.use(this.sprite);
        this.health = enemies[type][1];

        if (type === 0) {
            this.body.scale = new Vector(0.25, 0.25);
            this.collider.set(Shape.Box(100, 100));
            this.speed = 100
        }
        if (type === 1) {
            this.body.scale = new Vector(0.5, 0.5);
            this.collider.set(Shape.Box(100, 50));
            this.speed = 200
        }
        if (type === 2) {
            this.body.scale = new Vector(0.6, 0.6);
            this.collider.set(Shape.Box(125, 60));
            this.speed = 150
        }
        if (type === 3) {
            this.body.scale = new Vector(0.5, 0.5);
            this.collider.set(Shape.Box(125, 60));
            this.speed = 50
        }

    }

    collided(event) {
        console.log(event)
        if (event.other !== null) {
            if (event.other.name === "projectile") {
                event.other.kill();
                this.health -= 1;
                if (this.health < 1) {
                    this.explode();
                }
            }
        }
    }

    explode() {

        this.actions.clearActions()
        this.collider.clear()
        this.deathTime = new Timer({
            fcn: () => this.kill(),
            repeats: false,
            interval: 100,
        })
        this.engine.currentScene.add(this.deathTime)
        this.deathTime.start()
        this.actions
            .fade(0,100)
    }


    move(pathToFollow) {
        console.log(`type = ${this.type} speed = ${this.speed}, health = ${this.health}`);
        if (pathToFollow !== []) {
            this.pos = pathToFollow[0];

            for (let i = 0; i < pathToFollow.length; i++) {

                let previousPos = i + 1;
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
                    this.actions.moveTo(pathToFollow[i].x, pathToFollow[i].y, Math.random() * ((this.speed + 20) - (this.speed - 20)) + (this.speed - 20));
                    this.actions.rotateTo(angle, 1000, RotationType.ShortestPath);

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
            this.move(route);

        }
        if (engine.input.keyboard.wasPressed(Input.Keys.J)) {

        }

        this.timeAlive++;

    }
}
