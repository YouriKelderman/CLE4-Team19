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
    Resources.Pan, Resources.Kevin
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
    enemiesDistance = []
    coolDown = 0;
    damage = 1;
    shootingMode = 3

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
        this._setName("Pan Bami");
        this.collider.set(circle);
        this.on('precollision', (event) => {
            if (event.other.name === "Enemy") this.collisionHandler(event)
        });
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

    checkSelf(sprite) {
        console.log('sicko')
        console.log(this.game.isLegal)
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

        // oldet enemy algorithm

        if (this.shootingMode === 0) {
            let oldestEnemy = Math.max(...this.enemiesInRadiusTime);
            let oldestEnemyName = this.enemiesInRadiusName[this.enemiesInRadiusTime.indexOf(oldestEnemy, 0)]
            this.enemiesInRadiusName = []
            this.enemiesInRadiusTime = []
            this.enemy = oldestEnemyName
        }
        if (this.shootingMode === 1) {
            let youngestEnemy = Math.min(...this.enemiesInRadiusTime);
            let youngestEnemyName = this.enemiesInRadiusName[this.enemiesInRadiusTime.indexOf(youngestEnemy, 0)]
            this.enemiesInRadiusName = []
            this.enemiesInRadiusTime = []
            this.enemy = youngestEnemyName
        }
        if (this.shootingMode === 2) {
            let randomEnemyName = this.enemiesInRadiusName[Math.random() * (this.enemiesInRadiusName.length - 0) * 0, 0]
            this.enemiesInRadiusName = []
            this.enemiesInRadiusTime = []
            this.enemy = randomEnemyName
        }
        if (this.shootingMode === 3) {

            for (let i = 0; i < this.enemiesInRadiusName.length; i++) {
                let pos1 = new Vector(this.pos.x, this.pos.y,)
                let pos2 = new Vector(this.enemiesInRadiusName[i].other.pos.x, this.enemiesInRadiusName[i].other.pos.y)

                let distance = pos1.distance(pos2)

                this.enemiesDistance.push(distance)

            }

            let nearestEnemy = Math.min(...this.enemiesDistance);
            let nearestEnemyName = this.enemiesInRadiusName[this.enemiesDistance.indexOf(nearestEnemy, 0)]


            this.enemiesInRadiusName = []
            this.enemiesDistance = []

            this.enemy = nearestEnemyName
        }


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
            this.inRange();
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
