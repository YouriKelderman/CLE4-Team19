import {Actor, Vector, Engine, Random, CollisionType, Shape, Circle, Color, Line} from "excalibur";
import {Resources} from "../resources.js";
import {Tower} from "../tower.js";

let itemIds = [
    Resources.Pan, Resources.Kevin,
]
let range = 300;

export class Bami extends Tower {

    constructor(spriteID) {

    }


    onInitialize(engine) {
        this.scale = new Vector(1, 1);
        console.log(this.towerRange)
        this.towerRange = 300;

    }

    checkSelf(sprite) {
        this.sprite = itemIds[sprite].toSprite();
        this.graphics.use(itemIds[sprite].toSprite());

    }
}
