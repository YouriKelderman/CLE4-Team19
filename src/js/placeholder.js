import {Actor, Vector, Engine, Random, CollisionType, Shape} from "excalibur";
import {Resources} from "./resources";

let itemIds = [
    Resources.Rock, Resources.Kevin,
]
export class Placeholder extends Actor {
    constructor(spriteID) {
        super({
            width: Resources.Rock.width /2, height: Resources.Rock.height /2
        })
    }

    onInitialize(engine) {
        this.anchor = new Vector(0.5, 0.5);
        this.scale = new Vector(0.5, 0.5);
    }

    checkSelf(sprite) {
        this.sprite = itemIds[sprite].toSprite();
        this.graphics.use(itemIds[sprite].toSprite());
        console.log(this.sprite);
    }
}
