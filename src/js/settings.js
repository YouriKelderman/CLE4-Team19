import {
    Actor,
    Vector,

    Scene,

    Physics, vec,

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


    onInitialize(engine) {
      
        this.logo = new Actor();
        this.logo.graphics.use(Resources.PausedLogo.toSprite());
        this.logo.pos = new Vector(720, 250);
        this.logo.scale = new Vector(0.1, 0.1)
        this.logo.actions.scaleTo(vec(1.1,1.1),vec(1,1));
        this.logo.z = 1000;
        this.add(this.logo);
        this.music.volume = 0.1;
        this.music.loop = true;
        this.music.play().then(r => console.log(r));

        //hervat knop
        const resumeButton = new Actor();
        resumeButton.graphics.use(Resources.Start.toSprite());
        resumeButton.pos = new Vector(720, 450);
        resumeButton.scale = new Vector(0.1, 0.1)
        resumeButton.actions.scaleTo(vec(0.6,0.6),vec(0.5,0.5));
        resumeButton.z = 1000;
        resumeButton.enableCapturePointer = true;
        resumeButton.pointer.useGraphicsBounds = true;
        resumeButton.on("pointerup", (event) => this.resumeGame());
        this.add(resumeButton);

        //geluid knop aan uit of zachter
        const soundButton = new Actor();
        soundButton.graphics.use(Resources.Start.toSprite());
        soundButton.pos = new Vector(720, 550);
        soundButton.scale = new Vector(0.1, 0.1)
        soundButton.actions.scaleTo(vec(0.6,0.6),vec(0.5,0.5));
        soundButton.z = 1000;
        soundButton.enableCapturePointer = true;
        soundButton.pointer.useGraphicsBounds = true;
        soundButton.on("pointerup", (event) => this.muteSound());
        this.add(soundButton);


        // spinnen mode

    }
    onActivate(_context) {


    }

    muteSound() {
        if (this.engine.musicVolume === 0) {
            this.music.volume = 0.1
            this.music.play().then(r => console.log(r));
            this.engine.musicVolume = 0.5
        }
        else {
            this.music.volume = 0;
            this.music.pause();
            this.engine.musicVolume = 0;
        }
    }

    resumeGame() {
        console.log('start game');
        this.engine.goToScene('park');

    }

    onPreUpdate(engine, _delta) {
    }

    onDeactivate(_  ) {
        this.music.pause();
    }
}
