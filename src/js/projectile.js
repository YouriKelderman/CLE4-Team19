import {Resources} from "./resources.js";
import {Actor, Vector} from "excalibur";

let Speed;
let velocity = [30, 30];
let type;
export class Projectile extends Actor {

    constructor() {
        super({
            width: 10, height: 10
        })


    }

    onInitialize(engine) {
        this.anchor = new Vector(0.5, 0.5);
        this.scale = new Vector(1, 1);
this.vel = this.velocity;
        this.sprite = Resources.Bami.toSprite();
        this.graphics.use(this.sprite);
    }
    clicked(){
        this.game.activeTower(this);
    }



}
