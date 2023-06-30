import {
    Actor,
    Engine,
    Vector,
    Label,
    Color,
    Font,
    Debug,
    Transform,
    Screen,
    Scene,
    Camera,
    Physics,
    Sound,
    FontUnit,
    Shape, CollisionType, Input, PointerSystem, vec
} from "excalibur";

import {Resources, ResourceLoader} from "./resources.js";
import {Cursor} from "./cursor.js";

export class CutScene extends Scene {

    background
    timer = 0

    constructor() {
        super();
    }


    onActivate(_context) {
        this.background.scale = new Vector(1.15, 1.15)
        this.background.pos = new Vector(970, 500)

        this.timer = 0

    }

    onInitialize(engine) {
        this.background = new Actor()
        this.background.graphics.use(Resources.CutScene.toSprite())
        this.add(this.background)
    }

    onPreUpdate(engine, _delta) {
        this.timer++

        console.log(this.timer)

        if (this.timer < 500) {
            this.background.pos.x += -1 * (this.timer / 500)
            this.background.scale = new Vector(this.background.scale.x -= (this.timer / 1000000), this.background.scale.y -= (this.timer / 1000000))
        }
        if (this.timer > 600) {
            this.engine.goToScene('levelselect')
        }

        if (engine.input.keyboard.wasPressed(Input.Keys.Space || Input.Keys.Escape)) {
            this.engine.goToScene('levelselect')
        }

    }
}
