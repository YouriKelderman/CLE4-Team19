import {Actor, Vector, Engine, Random, CollisionType} from "excalibur";
import {Resources} from "./resources";


export class Placeholder extends Actor {

    constructor(spriteID) {

        super({
            width:Resources.Rock.width, height:Resources.Rock.height
        })
    }
    onInitialize(engine) {
        this.body.collisionType = CollisionType.Fixed;
        this.sprite = Resources.Rock.toSprite();
        this.graphics.use(this.sprite);
        this.anchor = new Vector(0.5, 0.5);

    }
    checkSelf(){

    }
}
