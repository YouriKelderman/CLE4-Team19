import {Actor, Input, Vector, Transform, Debug, Color, Shape, CollisionType, EdgeCollider} from "excalibur";


export class Wall extends Actor {
    constructor(startX, startY, endX, endY) {
        super()
        this._setName('wall')
        this.pos = new Vector(0, 0)
        const box = new EdgeCollider({
            begin: new Vector(startX, startY),
            end: new Vector(endX, endY),
        })
        this.collider.set(box);
        this.body.collisionType = CollisionType.Fixed;
    }
}
