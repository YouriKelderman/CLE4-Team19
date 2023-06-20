import {
    Actor,
    Vector,
    Engine,
    Random,
    CollisionType,
    Shape,
    Circle,
    Color,
    Line,
    Input,
    ParticleEmitter, EmitterType, RotationType
} from "excalibur";

import {Resources} from "./resources";
import {Game} from "./game.js";
import {Range} from "./range.js";
import {Projectile} from "./projectile.js";


let itemIds = [
    Resources.Pan, Resources.Kevin
];
let towerRange = 300;
let game;

export class Tower extends Actor {
    tier = 1;
    shootingCooldown = 0;
    amountOfEnemies;
    enemy;
    enemiesInRadiusName = []
    enemiesInRadiusTime = []
    interpolatedRotation = 0;

    constructor(Game) {
        super({
            width: 50, height: 50
        });

        this.game = Game;
    }

    onInitialize(engine) {
        this.engine = engine;
        this.anchor = new Vector(0.5, 0.5);
        this.scale = new Vector(1, 1);
        this.range = towerRange;
        this.z = 100;
        const circle = Shape.Circle(towerRange);
        this.collider.clear();
        this._setName("Tower");
        this.collider.set(circle);
        this.on('precollision', (event) => this.collisionHandler(event));
        this.on('pointerdown', () => this.clicked());
        this.particle = new ParticleEmitter({
            emitterType: EmitterType.Rectangle,
            radius: 5,
            minVel: 100,
            maxVel: 200,
            minAngle: 0,
            maxAngle: Math.PI * 2,
            emitRate: 1000,
            opacity: 1,
            fadeFlag: true,
            particleLife: 1000,
            maxSize: 5,
            minSize: 1,
            beginColor: Color.Red,
            isEmitting: true
        });
    }

    clicked() {
        this.game.activeTower(this);
    }

    collisionHandler(event) {

        if (event.other.name === "Enemy") {
            this.amountOfEnemies++;
            this.enemiesInRadiusName.push(event)
            this.enemiesInRadiusTime.push(event.other.timeAlive)

        }
    }

    checkSelf(sprite) {
        this.sprite = itemIds[sprite].toSprite();
        this.graphics.use(itemIds[sprite].toSprite());

    }

    onPreUpdate(engine, _delta) {
        if (this.amountOfEnemies > 0) {
            this.onCollision();
        }
        this.amountOfEnemies = 0;
        let oldestEnemy = Math.max(...this.enemiesInRadiusTime);
        let oldestEnemyName = this.enemiesInRadiusName[this.enemiesInRadiusTime.indexOf(oldestEnemy, 0)]
        this.enemiesInRadiusName = []
        this.enemiesInRadiusTime = []
        this.enemy = oldestEnemyName

    }

    onCollision() {
        if (this.enemy !== undefined) {
            let distance = new Vector(this.enemy.other.pos.x - this.pos.x, this.enemy.other.pos.y - this.pos.y);

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

                this.actions.rotateTo(angle + 0.5 * Math.PI, 10, RotationType.ShortestPath)

                // Unused interpolation algorithm
                // let accurateRotation = angle + 0.5 * Math.PI;
                //
                // if (accurateRotation > this.interpolatedRotation) {
                //     this.interpolatedRotation += 0.05;
                // }
                // if (accurateRotation < this.interpolatedRotation) {
                //     this.interpolatedRotation -= 0.05;
                // }
                //
                // this.rotation = this.interpolatedRotation;
                //
                // console.log(`${this.interpolatedRotation} or ${accurateRotation}`);

            }
            this.inRange();
        }
    }

    updateRange(newRange) {
        const circle = Shape.Circle(newRange);
        this.collider.clear();
        this._setName("Tower");
        this.collider.set(circle);

    }

    fire() {
        if (this.tier === 1) {
            let bullet = new Projectile(1000);
            bullet.pos = this.pos;
            bullet.rotation = this.rotation - Math.PI / 2;
            this.engine.add(bullet);
        }
        if (this.tier === 2) {
            let bullet = new Projectile(1000);
            bullet.pos = this.pos;
            bullet.rotation = this.rotation - Math.PI / 2;
            this.engine.add(bullet);
            let bullet1 = new Projectile(1000);
            bullet1.pos = this.pos;
            bullet1.rotation = this.rotation - 1.3;
            this.engine.add(bullet1);
            let bullet2 = new Projectile(1000);
            bullet2.pos = this.pos;
            bullet2.rotation = this.rotation - 1.8;
            this.engine.add(bullet2);
        }
    }

    inRange() {
        if (this.shootingCooldown === 1) {
            this.fire();
        }
        if (this.shootingCooldown > 25) {
            this.shootingCooldown = 0;
        }
        this.shootingCooldown++;

    }

}
