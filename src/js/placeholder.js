import {Actor, Vector, Engine, Random, CollisionType, Shape, Circle} from "excalibur";
import {Resources} from "./resources";

let itemIds = [
    Resources.Pan, Resources.Kevin,
]

let currentClick = false;
let engine;
export class Placeholder extends Actor {
    constructor(spriteID) {
        super({
            width: Resources.Pan.width /2, height: Resources.Pan.height /2
        })
    }

    onInitialize(engine) {
        this.engine = engine;
        this.anchor = new Vector(0.5, 0.5);
        this.scale = new Vector(1, 1);
        this.on('pointerdown', () => this.clickEvent())
    }
clickEvent() {
    let circle = new Circle({
        radius: 10,
        color: Color.Red(),
    })
    console.log(circle)
    circle.showDebug = true;
}

    checkSelf(sprite) {
        this.sprite = itemIds[sprite].toSprite();
        this.graphics.use(itemIds[sprite].toSprite());

    }
}
