import {Resources} from "./resources.js";
import {Actor, Vector} from "excalibur";

export class Projectile extends Actor {

    projectileSpeed;
    projectileTime = 100;
    damage = 1;

    constructor(speed, damage) {
        super({
            width: 10, height: 10
        });

        this.projectileSpeed = speed;
        this.damage = damage;

    }

    onInitialize(engine) {
        this.scale = new Vector(1, 1);
        this.sprite = Resources.Bami.toSprite();
        this.graphics.use(this.sprite);
        this._setName("projectile");
        this.scale = new Vector(1.5, 1.5);
    }

    onPreUpdate(engine, _delta) {
        this.vel = new Vector(
            Math.cos(this.rotation) * this.projectileSpeed,
            Math.sin(this.rotation) * this.projectileSpeed
        );
        if (this.projectileTime < 0) {
            this.kill();
        }
        this.projectileTime--;
    }

}
