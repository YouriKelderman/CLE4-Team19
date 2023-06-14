import {Actor, Engine, Vector, Color, Debug, Physics, Input, Axis, CollisionType, Shape} from "excalibur";
import {Scene} from "excalibur";
import {Placeholder} from "./placeholder.js"

let placing = false;
let placingSprite;
let int =0;
export class Park extends Scene {

    constructor() {
        super();
    }


    onInitialize(_engine) {
        placingSprite = new Placeholder();
        this.engine.input.pointers.primary.on("down", () => this.mouseInput())

    }
mouseInput(){
        if(placing){
            let newClone = new Placeholder();
            newClone.pos = placingSprite.pos;
            this.add(newClone);
            newClone.checkSelf(int)
        }
}
    onPreUpdate(engine, delta) {

        if (engine.input.keyboard.wasPressed(Input.Keys.B)) {
            placing = !placing;
            console.log(int)
            if (placing) {
                this.add(placingSprite);
                placingSprite.checkSelf(int)
            } else {
                placingSprite.kill();
            }
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.N)) {
            int += 1;
            if(int > 1) {
                int = 0;
            }
            placingSprite.checkSelf(int)
        }
        if (placing) {
            placingSprite.pos = engine.input.pointers.primary.lastWorldPos;
        }
    }
}
