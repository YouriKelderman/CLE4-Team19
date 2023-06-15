import {Actor, Vector, Engine, Random, CollisionType, Shape, Circle, Color} from "excalibur";
import {Resources} from "./resources";
import {Game} from "./game.js";
import {Range} from "./range.js";

let itemIds = [
    Resources.Pan, Resources.Kevin
]
let range = 0;
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
this.range = Math.floor(Math.random() * 300)
        const circle = Shape.Circle(100)
        this.collider.clear();
        this.collider.set(circle);
this.on('precollision', () => this.collisionHandler());
    }

    collisionHandler(e){
console.log(e);
    }
clickEvent() {


}

    checkSelf(sprite) {
        this.sprite = itemIds[sprite].toSprite();
        this.graphics.use(itemIds[sprite].toSprite());

    }
}
