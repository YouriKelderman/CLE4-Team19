import {Actor, Vector, Engine, Random, CollisionType, Shape, Circle, Color, Line, Input} from "excalibur";
import {Resources} from "./resources";
import {Game} from "./game.js";
import {Range} from "./range.js";
import {Projectile} from "./projectile.js";


let itemIds = [
    Resources.Pan, Resources.Kevin,
]
let towerRange =300;
let game;

export class Tower extends Actor {

    shootingCooldown = 0

    constructor(Game) {
        super({
            width: 50, height: 50
        })
        this.game = Game;
    }

    onInitialize(engine) {
        this.engine = engine;
        this.anchor = new Vector(0.5, 0.5);
        this.scale = new Vector(1, 1);
        this.range = towerRange;
        this.z = 100;
        const circle = Shape.Circle(towerRange)
        this.collider.clear();
        this._setName("Tower")
        this.collider.set(circle);
        this.on('precollision', (event) => this.collisionHandler(event));
        this.on('pointerdown', () => this.clicked())
        console.log(game);
    }
clicked(){
this.game.activeTower(this);
}
    collisionHandler(event) {
        if (event.other.name === "Enemy") {
            let distance = new Vector(event.other.pos.x - this.pos.x, event.other.pos.y - this.pos.y);

            let angle = Math.sqrt((distance.x * distance.x) + (distance.y * distance.y))
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

                this.rotation = angle + 0.5 * Math.PI;
            }
            this.inRange();
        }
    }

    checkSelf(sprite) {
        this.sprite = itemIds[sprite].toSprite();
        this.graphics.use(itemIds[sprite].toSprite());

    }

    updateRange(newRange){
        const circle = Shape.Circle(newRange);
        this.collider.clear();
        this._setName("Tower")
        this.collider.set(circle);

    }

    inRange(){
        if (this.shootingCooldown === 1) {
            let bullet = new Projectile(1000);
            bullet.pos = this.pos;
            bullet.rotation = this.rotation - Math.PI / 2
            this.engine.add(bullet)
        }
        if (this.shootingCooldown > 25) {
            this.shootingCooldown = 0
        }
        this.shootingCooldown++

    }

}
