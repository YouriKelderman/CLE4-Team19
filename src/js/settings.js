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
    music = Resources.SettingsMusic;
    click = Resources.Click;


    onInitialize(engine) {
      
        this.logo = new Actor();
        this.logo.graphics.use(Resources.PausedLogo.toSprite());
        this.logo.pos = new Vector(720, 250);
        this.logo.scale = new Vector(0.1, 0.1)
        this.logo.actions.scaleTo(vec(1.1,1.1),vec(1,1));
        this.logo.z = 1000;
        this.add(this.logo);

        this.music.volume = 0.3;
        this.music.loop = true;
        this.music.play().then(r => console.log(r));

        //hervat knop
        const resumeButton = new Actor();
        resumeButton.graphics.use(Resources.HervatButton.toSprite());
        resumeButton.pos = new Vector(720, 400);
        resumeButton.scale = new Vector(0.1, 0.1)
        resumeButton.actions.scaleTo(vec(1.1,1.1),vec(0.5,0.5));
        resumeButton.z = 1000;
        resumeButton.enableCapturePointer = true;
        resumeButton.pointer.useGraphicsBounds = true;
        resumeButton.on("pointerup", (event) => this.resumeGame());
        this.add(resumeButton);

        //geluid knop aan uit of zachter
        const soundButton = new Actor();
        soundButton.graphics.use(Resources.Mutebutton.toSprite());
        soundButton.pos = new Vector(648.00, 540);
        soundButton.scale = new Vector(0.1, 0.1)
        soundButton.actions.scaleTo(vec(1.1,1.1),vec(0.5,0.5));
        soundButton.z = 1000;
        soundButton.enableCapturePointer = true;
        soundButton.pointer.useGraphicsBounds = true;
        soundButton.on("pointerup", (event) => this.muteSound());
        this.add(soundButton);

        //volume knop harder
        const volumeUpButton = new Actor();
        volumeUpButton.graphics.use(Resources.Volumeup.toSprite());
        volumeUpButton.pos = new Vector(790, 520.00);
        volumeUpButton.scale = new Vector(0.1, 0.1)
        volumeUpButton.actions.scaleTo(vec(1.1,1.1),vec(0.5,0.5));
        volumeUpButton.z = 1000;
        volumeUpButton.enableCapturePointer = true;
        volumeUpButton.pointer.useGraphicsBounds = true;
        volumeUpButton.on("pointerup", (event) => this.raiseVolume());
        this.add(volumeUpButton);

        //volume knop zachter
        const volumeDownButton = new Actor();
        volumeDownButton.graphics.use(Resources.Volumedown.toSprite());
        volumeDownButton.pos = new Vector(790, 570.00);
        volumeDownButton.scale = new Vector(0.1, 0.1)
        volumeDownButton.actions.scaleTo(vec(1.1,1.1),vec(0.5,0.5));
        volumeDownButton.z = 1000;
        volumeDownButton.enableCapturePointer = true;
        volumeDownButton.pointer.useGraphicsBounds = true;
        volumeDownButton.on("pointerup", (event) => this.lowerVolume());
        this.add(volumeDownButton);


        // spinnen mode

    }
    onActivate(_context) {

    if (this.music.volume === 0){
        this.music.pause()
    }
    else {
        this.music.loop = true;
        this.music.play().then(r => console.log(r));
    }
    }

    muteSound() {
        this.click.play();
        if (this.engine.musicVolume === 0) {
            this.music.volume = 0.1
            this.music.loop = true;
            this.music.play().then(r => console.log(r));
            this.engine.musicVolume = 0.5
        }
        else {
            this.music.volume = 0;
            this.music.pause();
            this.engine.musicVolume = 0;
        }
    }
    raiseVolume() {
        this.click.play();
        if (this.engine.musicVolume < 1 && this.music.volume < 0.3) {
            this.engine.musicVolume += 0.1;
            this.music.volume += 0.03;
        }

    }
    lowerVolume() {
        this.click.play();
        if (this.engine.musicVolume > 0 && this.music.volume > 0) {
            this.engine.musicVolume -= 0.1;
            this.music.volume -= 0.03
        }
    }

    resumeGame() {
        this.click.play();
        console.log('start game');
        this.engine.goToScene('park');

    }

    onPreUpdate(engine, _delta) {
    }

    onDeactivate(_  ) {
        this.music.pause();
    }
}
