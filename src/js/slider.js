import {Actor, Vector, Engine, Random, CollisionType, Shape, Circle, Color} from "excalibur";
import {Resources} from "./resources";

export class Slider extends Actor {

    positionX
    positionY

    constructor(posX, posY) {
        super()

        this.positionX = posX
        this.positionY = posY

        this.graphics.use(Resources.SliderHead.toSprite());
        this.pos = new Vector(this.positionX, this.positionY)
        this.z = 2
        this.collider.set(Shape.Box(100,100));
        this.body.collisionType = CollisionType.Active
        this.draggable = true
    }

    onInitialize(_engine) {
        console.log('hallo')
    }

    onPreUpdate(_engine, _delta) {
    }
}
