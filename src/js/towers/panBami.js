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

import {Resources} from "../resources.js";
import {Game} from "../game.js";
import {Range} from "../range.js";
import {Projectile} from "../projectile.js";


let itemIds = [
    Resources.Pan, Resources.TinyLau
];
let towerRange = 300;
let game;

export class PanBami extends Actor {
    tier = 0;
    tierList = [0, 1.1, 1.2, 2.1, 2.2]
    type = 0;
    shootingCooldown = 0;
    amountOfEnemies;
    enemy;
    enemiesInRadiusName = []
    enemiesInRadiusTime = []
    coolDown = 0;
    damage = 1;

    constructor(Game, type) {
        super({
            width: 50, height: 50
        });
        this.type = type;
        this.game = Game;
    }

    onInitialize(engine) {
        this.coolDown = 25;
        this.engine = engine;
        this.anchor = new Vector(0.5, 0.5);
        this.scale = new Vector(1, 1);
        this.range = towerRange;
        this.z = 100;
        const circle = Shape.Circle(towerRange);
        this.collider.clear();
        this._setName("Pan Bami");
        this.collider.set(circle);
        if (this.type === 1) {
            this.on('collisionstart', (event) => {
                if(event.other instanceof PanBami && event.other !== this.game.placingSprite) this.collisionHandlerTinyLau(event)
            });
        }
        console.log(this.type);
        if (this.type === 0) {
            this.on('precollision', (event) => {
                if (event.other.name === "Enemy") this.collisionHandler(event)
            });
        }
        this.on('pointerdown', () => this.clicked());
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

    collisionHandlerTinyLau(event) {

        if(event.other instanceof PanBami && event.other.type !== 1) {
            event.other.coolDown = event.other.coolDown - (0.25 * event.other.coolDown);
            console.log(event.other.coolDown);
        }
    }

    checkSelf(sprite) {
        if (this.game.isLegal === true) {
            this.sprite = itemIds[sprite].toSprite();
            this.graphics.use(itemIds[sprite].toSprite());
        } else {
            let tint = itemIds[sprite].toSprite()
            tint.tint = new Color(100, 0, 0)
            this.sprite = tint;
            this.graphics.use(tint);
        }
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

                this.actions.rotateTo(angle + 0.5 * Math.PI, 30, RotationType.ShortestPath)
            }
            if (this.type === 0) {
                this.inRange();
            }
        }
    }

    updateRange(newRange) {
        const circle = Shape.Circle(newRange);
        this.collider.clear();
        this._setName("PanBami");
        this.collider.set(circle);

    }

    fire() {
        // default
        if (this.tier === 0) {
            let bullet = new Projectile(1000, this.damage, 0, 1);
            bullet.pos = this.pos;
            bullet.rotation = this.rotation - Math.PI / 2;
            this.engine.add(bullet);
            this.coolDown = 25
        }

        // pad 1
        if (this.tier === 1.1) {
            let bullet = new Projectile(1300, this.damage, 0, 1);
            bullet.pos = this.pos;
            bullet.rotation = this.rotation - Math.PI / 2;
            this.engine.add(bullet);
            this.coolDown = 25
        }
        if (this.tier === 1.2) {
            let bullet = new Projectile(1700, this.damage * 1.3, 0, 1);
            bullet.pos = this.pos;
            bullet.rotation = this.rotation - Math.PI / 2;
            this.engine.add(bullet);
            this.coolDown = 25
        }
        if (this.tier === 1.2) {
            let bullet = new Projectile(2000, this.damage * 1.5, 0, 1);
            bullet.pos = this.pos;
            bullet.rotation = this.rotation - Math.PI / 2;
            this.engine.add(bullet);
            this.coolDown = 20
        }


        // pad 2
        if (this.tier === 2.1) {
            let bullet = new Projectile(1000, this.damage, 1, 1);
            bullet.pos = this.pos;
            bullet.rotation = this.rotation - Math.PI / 2;
            this.engine.add(bullet);
            this.coolDown = 25
        }
        if (this.tier === 2.2) {
            let bullet = new Projectile(1000, this.damage, 2, 5);
            bullet.pos = this.pos;
            bullet.rotation = this.rotation - Math.PI / 2;
            this.engine.add(bullet);
            this.coolDown = 25
        }


    }

    inRange() {
        if (this.shootingCooldown === 1) {
            this.fire();
        }
        if (this.shootingCooldown > this.coolDown) {
            this.shootingCooldown = 0;
        }
        this.shootingCooldown++;

    }

}
