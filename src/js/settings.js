import {
    Actor,
    Vector,

    Scene,

    Physics, vec, Input,

} from "excalibur";

import {Resources, ResourceLoader} from "./resources.js";

export class Settings extends Scene {

    logo
    spider

    constructor() {
        super();
        Physics.useRealisticPhysics();
    }
    music = Resources.MenuMusic;

    onActivate(_context) {
        if (this.engine.musicVolume === 0) {
            this.music.pause()

        }else {
            this.music.volume = 0.1;
            this.music.loop = true;
            this.music.play().then(r => console.log(r));
        }
    }

    onInitialize(engine) {

        this.logo = new Actor();
        this.logo.graphics.use(Resources.PausedLogo.toSprite());
        this.logo.pos = new Vector(720, 250);
        this.logo.scale = new Vector(0.1, 0.1)
        this.logo.actions.scaleTo(vec(1.1,1.1),vec(1,1));
        this.logo.z = 1000;
        this.add(this.logo);

        //hervat knop
        const resumeButton = new Actor();
        resumeButton.graphics.use(Resources.HervatButton.toSprite());
        resumeButton.pos = new Vector(720, 450);
        resumeButton.scale = new Vector(1, 1)
        resumeButton.z = 1000;
        resumeButton.enableCapturePointer = true;
        resumeButton.pointer.useGraphicsBounds = true;
        resumeButton.on("pointerup", (event) => this.resumeGame());
        this.add(resumeButton);

        //geluid knop aan uit of zachter
        const soundButton = new Actor();
        soundButton.graphics.use(Resources.Volumeup.toSprite());
        soundButton.pos = new Vector(720, 550);
        soundButton.scale = new Vector(1, 1)
        soundButton.z = 1000;
        soundButton.enableCapturePointer = true;
        soundButton.pointer.useGraphicsBounds = true;
        soundButton.on("pointerup", (event) => this.muteSound());
        this.add(soundButton);




        // spinnen mode

    }

    muteSound() {
        if (this.music.volume === 0) {
            this.music.volume = 0.1
            this.engine.musicVolume = 0.5
        }
        else {
            this.music.volume = 0;
            this.engine.musicVolume = 0;
        }
    }

    resumeGame() {
        console.log('start game');
        this.engine.goToScene('park');

    }

    onPreUpdate(engine, _delta) {
        if (engine.input.keyboard.wasPressed(Input.Keys.Esc || Input.Keys.Escape)) {
            this.resumeGame()
        }
    }

    onDeactivate(_  ) {
        this.music.pause();
    }
}
