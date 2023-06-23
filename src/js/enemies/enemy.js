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

export class Enemy extends Actor {

    route = [];
    tempRoute;
    enemies = [
        [Resources.Spider, 5],
        [Resources.Mouse, 3],
        [Resources.Rat, 6],
        [Resources.Racoon, 10],
        [Resources.Snail, 50],

    ];
    positionInRoute;
    
    game;
    timeAlive = 0;
    particle;
    speed = 100;
    health = 1;
    type = 0;
    deathAnimation;
    damageAnimation;
    nextPath
    damageOverTime = 0
    damageCooldown = 0

    constructor(game) {
        super();
        this.game = game;
    }

    onInitialize(engine) {
        this.engine = engine;
        this.anchor = new Vector(0.5, 0.5);
        this.z = 100;
        this._setName("Enemy");
        this.on('collisionstart', (event) => this.collided(event));
        this.setRoute()
    }
    
    setRoute() {
        this.tempRoute = ",1128.102,1125.141,1118.192,1114.224,1116.268,1114.318,1098.352,1068.398,1030.444,993.468,936.461,867.452,806.444,761.426,723.401,707.352,674.289,641.246,600.217,547.192,490.182,416.197,345.220,305.252,273.289,250.319,231.368,227.417,234.478,248.526,258.560,273.588,275.619,254.643,214.673,189.705,171.731,156.783".split(",");
        this.tempRoute.forEach(item => {
            item = item.split(".");
            let newItem = new Vector(Number(item[0]), Number(item[1]));
            this.route.push(newItem);
        });
        this.route[0] = this.route[1];
        this.move(this.route);
    }

    setType(type) {
        this.type = type;
        this.sprite = this.enemies[type][0].toSprite();
        this.graphics.use(this.sprite);
        this.health = this.enemies[type][1];

        if (type === 0) {
            this.body.scale = new Vector(0.25, 0.25);
            this.collider.set(Shape.Box(100, 100));
            this.speed = 100;
        }
        if (type === 1) {
            this.body.scale = new Vector(0.5, 0.5);
            this.collider.set(Shape.Box(100, 50));
            this.speed = 200;
        }
        if (type === 2) {
            this.body.scale = new Vector(0.6, 0.6);
            this.collider.set(Shape.Box(125, 60));
            this.speed = 150;
        }
        if (type === 3) {
            this.body.scale = new Vector(0.5, 0.5);
            this.collider.set(Shape.Box(125, 60));
            this.speed = 50;
        }
        if (type === 4) {
            this.body.scale = new Vector(0.25, 0.25);
            this.collider.set(Shape.Box(50, 50));
            this.speed = 30;
        }

    }

    collided(event) {
        if (event.other !== null) {
            if (event.other.name === "projectile") {
                if (event.other.special === 1 || event.other.special === 2) {
                    this.damageOverTime = 1000;
                }
                this.removeBulletHealth(event)
                this.health -= event.other.damage;
                this.damageAnimation = 50
            }
        }
    }

    removeBulletHealth(target) {
        let bullet = target
        bullet.other.health--

        if (bullet.other.speed > 10) {
        bullet.other.speed = bullet.other.speed - 10
    }
    }

    explode() {
        this.actions.clearActions();
        this.collider.clear();
        this.deathAnimation = 50;
    }

    move(pathToFollow) {
        let nextPath = pathToFollow.length
        //console.log(`type = ${this.type} speed = ${this.speed}, health = ${this.health}`);
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
                    console.log(this.speed);
                }

            }
        }
    }

    onPreUpdate(engine, delta) {
        if (this.health < 0 && this.health > -9999) {
            this.explode();
            this.health = -10000
        }

        if (this.damageOverTime > 1) {
            this.damageOverTime--
        }

        if (this.damageOverTime > 1 && this.damageCooldown === 1) {
            this.health--
            this.damageAnimation = 50
            //console.log('damage!')
        }

        if (this.damageCooldown > 100) {
            this.damageCooldown = 0
        }
        this.damageCooldown++



        if (this.deathAnimation < 0) {
            this.kill();
        }
        if (this.deathAnimation > 0) {
            this.graphics.opacity = (this.deathAnimation / 50);
            let graphic = this.enemies[this.type][0].toSprite();
            graphic.tint = new Color(this.deathAnimation * 5, 0, 0)
            this.graphics.use(graphic)

        }
        this.deathAnimation--;

        if (this.damageAnimation > 1 && this.health > 1) {
            let graphic = this.enemies[this.type][0].toSprite();
            graphic.tint = new Color(250 - this.damageAnimation * 5, 255, 255)
            this.graphics.use(graphic)

        }
        if (this.damageAnimation > 0) {
            this.damageAnimation--;
        }


        if (this.pos.y > window.innerHeight) {
            //console.log("JE BENT DOOD SUKKEL");
            this.kill();

        }
        if (engine.input.keyboard.wasPressed(Input.Keys.Enter)) {
            this.move(this.route);

        }
        if (engine.input.keyboard.wasPressed(Input.Keys.J)) {

        }

        this.timeAlive++;

    }
}
