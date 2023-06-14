import {Actor, Engine, Vector, Color, Debug, Physics, Input, Axis} from "excalibur";
import {Scene} from "excalibur";
import {Placeholder} from "./placeholder.js"

let placing = false;
let placingSprite;

export class Park extends Scene {
    onInitialize(_engine) {
        placingSprite = new Placeholder();
        this.engine.input.pointers.primary.on("down", () => this.mouseInput())
    }
mouseInput(){
        if(placing){
            let newClone = new Placeholder();
            newClone.pos = placingSprite.pos;
            this.add(newClone);
        }
}
    onPreUpdate(engine, delta) {
        if (engine.input.keyboard.wasPressed(Input.Keys.B)) {
            placing = !placing;
            if (placing) {
                this.add(placingSprite);
            } else {
                placingSprite.kill();
            }
        }
        if (placing) {
            placingSprite.pos = engine.input.pointers.primary.lastWorldPos;
        }
    }
}

