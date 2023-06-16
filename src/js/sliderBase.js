import {Actor, Vector, Engine, Random, CollisionType, Shape, Circle, Color} from "excalibur";
import {Resources} from "./resources";

export class SliderBase extends Actor {

    positionX
    positionY

    constructor(posX, posY) {
        super()

        this.positionX = posX
        this.positionY = posY


        this.graphics.use(Resources.SliderBase.toSprite());
        this.pos = new Vector(this.positionX, this.positionY)
        this.z = 1
        this.collider.set(Shape.Box(400,50));
        this.body.collisionType = CollisionType.Fixed

    }

}
