
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

export class PanBami extends Projectile {

    projectileSpeed;
    projectileTime = 200;
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
        this.graphics.use(Resources.Bami.toSprite());
        this._setName("projectile");
        this.collider.set(Shape.Box(10, 10))
        this.scale = new Vector(0.2, 0.2);

        if (this.special === 1) {
            this.graphics.use(Resources.SpicyPan.toSprite());
        }


        if (this.special === 2) {
            this.scale = new Vector(0.4, 0.4)
            this.collider.set(Shape.Box(25, 25))
            this.graphics.use(Resources.SpicyPan.toSprite());
        }
    }
}