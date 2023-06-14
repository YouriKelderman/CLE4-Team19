import {Actor, Engine, Vector, Color, Debug, Physics, Input, Axis} from "excalibur";
import {Scene} from "excalibur";
import {Placeholder} from "./placeholder.js"

let placing = false;
let placingSprite;

export class Park extends Scene {
    onPreUpdate(engine, delta) {
        if (engine.input.keyboard.isHeld(Input.Keys.N)) {
            placing = !placing;
            if (placing) {
                placingSprite = new Placeholder();
                this.add(placingSprite);
            } else {
                placingSprite.kill()
            }
        }
        if (placing) {
placingSprite.pos = engine.input.pointers.primary.lastWorldPos;
        }
    }
}

