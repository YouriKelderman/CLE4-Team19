import {Resources} from "../resources.js";
import {Actor, Shape, Vector, Text, Font, FontUnit, Color} from "excalibur";
import {Enemy} from "../enemies/enemy.js";
import {Projectile} from "./projectile.js";

export class CurseWord extends Actor {

    projectileSpeed;
    projectileTime = 1000;
    damage = 1;
    special;
    target;
    colour

    constructor(speed, damage, special, target) {
        super({});

        this.projectileSpeed = speed;
        this.damage = damage;
        this.special = special;
        this.target = target;

    }

    onInitialize(engine) {
        let curseWords = []
        if (engine.profanityMode === false) {
            curseWords = ["godgodverdommes", "pestkankertering", "bloedkankerding", "pestpleurislijer", "godverdom maar op", "kankeritus"];
        } else {
            curseWords = ["sjongejonge", "geestelijk gestoord", "kersemus", "achterlijk", "gezeik met jou", "niet goed bij je verstand"];

        }
        this.colour = Color.White

        if (this.special === 1) {
            this.colour = Color.Red
        }
        if (this.special === 2) {
            this.colour = Color.Green
        }


        let curse = new Text({
            text: curseWords[Math.floor(Math.random() * curseWords.length)].toString(),
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 20,

                color: this.colour,
            }),
        });


        this.graphics.use(curse);
        this._setName("curse");
        this.collider.set(Shape.Box(150, 20));
        this.scale = new Vector(1, 1);
    }

    onPreUpdate(engine, _delta) {
        console.log(this.target)
        if (this.target.other._name !== "Enemy") {
            let pos1 = new Vector(this.pos.x, this.pos.y);
            let pos2 = new Vector(this.target.other.worldPosition.x, this.target.other.worldPosition.y);

            let distance = pos1.distance(pos2);
            if (distance < 100) {
                this.target.other.buff(this.special)
                this.kill()
            }
        }

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
