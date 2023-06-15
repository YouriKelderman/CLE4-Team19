import {Actor, Vector, Engine, Random, CollisionType, Shape, Circle, Color} from "excalibur";
import {Resources} from "./resources";

export class Range extends Actor {
    constructor(spriteID) {
        super({
            width: Resources.Range / 10, height: Resources.Range.height / 100
        })
    }

    onInitialize(engine) {
        this.engine = engine;
        this.anchor = new Vector(0.5, 0.5);
        this.scale = new Vector(0.1, 0.1);
        this.sprite = Resources.Range.toSprite();
        this.graphics.use(this.sprite);
    }

    changeScale(int) {
        this.scale = new Vector(int/1000, int/1000)
    }
}
