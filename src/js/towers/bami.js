import {Actor, Vector, Engine, Random, CollisionType, Shape, Circle, Color, Line} from "excalibur";
import {Resources} from "../resources.js";
import {Tower} from "../tower.js";

let itemIds = [
    Resources.Pan, Resources.Kevin,
]
let range = 300;

export class Bami extends Tower {

    constructor(spriteID) {
        super()
    }


    onInitialize(engine) {
        this.scale = new Vector(1, 1);
        console.log(this.towerRange)
        this.towerRange = 300;

    }

    checkSelf(sprite, legal) {
        if (legal === true) {
            this.sprite = itemIds[sprite].toSprite();
            this.graphics.use(itemIds[sprite].toSprite());
        } else {
            let tint = itemIds[sprite].toSprite()
            tint.tint = new Color(255, 0, 0)

            this.sprite = tint;
            this.graphics.use(tint);

        }
    }
}
