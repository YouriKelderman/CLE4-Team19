import {
    Actor,
    Vector,

    Scene,

    Physics, vec,

} from "excalibur";

import {Resources, ResourceLoader} from "./resources.js";
import {SliderBase} from "./sliderBase.js";
import {Slider} from "./slider.js";

export class Settings extends Scene {

    logo
    spider

    constructor() {
        super();
        Physics.useRealisticPhysics();
    }
    music = Resources.MenuMusic;

    onActivate(_context) {
    }

    onInitialize(engine) {
        //hervat knop
        //geluid knop aan uit of zachter
        // spinnen mode
        const startButton = new Actor();
        startButton.graphics.use(Resources.Start.toSprite());
        startButton.pos = new Vector(720, 500);
        startButton.scale = new Vector(0.1, 0.1)
        startButton.actions.scaleTo(vec(0.6,0.6),vec(0.5,0.5));
        startButton.z = 1000;
        startButton.enableCapturePointer = true;
        startButton.pointer.useGraphicsBounds = true;
        startButton.on("pointerup", (event) => this.startGame());
        this.add(startButton);
    }

    startGame() {
        console.log('start game');
        this.engine.goToScene('park');

    }

    onPreUpdate(engine, _delta) {
    }

    onDeactivate(_  ) {
        this.music.stop();
        this.music.volume = 0
    }
}
