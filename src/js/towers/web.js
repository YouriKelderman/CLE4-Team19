
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
import {Projectile} from "./projectile.js";

export class Web extends Projectile {

    projectileSpeed;
    projectileTime = 25;
    damage = 1;
    health;
    special;

    constructor(speed, damage, special, health) {
        super({});

        this.projectileSpeed = speed;
        this.damage = damage;
        this.health = health
        this.special = special
    }

    onInitialize(engine) {
        this.graphics.use(Resources.Web.toSprite());
        this._setName("projectile");
        this.collider.set(Shape.Box(5, 5))
        this.scale = new Vector(0.2, 0.2);
    }
}