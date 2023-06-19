import {Resources} from "./resources.js";
import {Actor, Vector} from "excalibur";

export class Projectile extends Actor {

    projectileSpeed
    projectileTime = 100

    constructor(speed) {
        super({
            width: 10, height: 10
        });

        this.projectileSpeed = speed

    }

    onInitialize(engine) {
        this.scale = new Vector(1, 1);
        this.sprite = Resources.Bami.toSprite();
        this.graphics.use(this.sprite);

        console.log('shot')
    }

    onPreUpdate(engine, _delta) {
        this.vel = new Vector(
            Math.cos(this.rotation) * this.projectileSpeed,
            Math.sin(this.rotation) * this.projectileSpeed
        )
        if (this.projectileTime < 0) {
            this.kill()
        }
        this.projectileTime--
    }

}
