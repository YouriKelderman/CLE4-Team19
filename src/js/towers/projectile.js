
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
    ParticleEmitter, EmitterType, RotationType, Timer
} from "excalibur";

import {Resources} from "../resources.js";

export class Projectile extends Actor {

    constructor() {
        super({});
    }

    onPreUpdate(engine, _delta) {

        if (this.health < 1) {
            this.kill()
        }

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