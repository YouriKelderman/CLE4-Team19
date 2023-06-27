import {
    Actor,
    Vector,

    Scene,

    Physics, vec, Input,

} from "excalibur";

import {Resources, ResourceLoader} from "./resources.js";
import {Park} from "./park.js";



export class Settings extends Scene {

    logo
    spider
    music = Resources.SettingsMusic;
    click = Resources.Click;
    mapId

    constructor() {
        super();
        //Physics.useRealisticPhysics();
        console.log("I am settings!")
    }


    onInitialize(engine) {
        this.engine = engine;

        this.logo = new Actor();
        this.logo.graphics.use(Resources.PausedLogo.toSprite());
        this.logo.pos = new Vector(720, 250);
        this.logo.scale = new Vector(1.1, 1.1)
        this.logo.z = 1000;
        this.add(this.logo);

        this.music.volume = 0.3;
        this.music.loop = true;
        this.music.play().then(r => console.log(r));

        //hervat knop
        this.resumeButton = new Actor();
        this.resumeButton.graphics.use(Resources.HervatButton.toSprite());
        this.resumeButton.pos = new Vector(720, 400);
        this.resumeButton.scale = new Vector(0.1, 0.1)

        this.resumeButton.z = 1000;
        this.resumeButton.enableCapturePointer = true;
        this.resumeButton.pointer.useGraphicsBounds = true;
        this.resumeButton.on("pointerup", (event) => this.resumeGame());
        this.add(this.resumeButton);

        //geluid knop aan uit of zachter
        this.soundButton = new Actor();
        this.soundButton.graphics.use(Resources.Mutebutton.toSprite());
        this.soundButton.pos = new Vector(648.00, 540);
        this.soundButton.scale = new Vector(0.1, 0.1)

        this.soundButton.z = 1000;
        this.soundButton.enableCapturePointer = true;
        this.soundButton.pointer.useGraphicsBounds = true;
        this.soundButton.on("pointerup", (event) => this.muteSound());
        this.add(this.soundButton);

        //volume knop harder
        this.volumeUpButton = new Actor();
        this.volumeUpButton.graphics.use(Resources.Volumeup.toSprite());
        this.volumeUpButton.pos = new Vector(790, 520.00);
        this.volumeUpButton.scale = new Vector(0.1, 0.1)

        this.volumeUpButton.z = 1000;
        this.volumeUpButton.enableCapturePointer = true;
        this.volumeUpButton.pointer.useGraphicsBounds = true;
        this.volumeUpButton.on("pointerup", (event) => this.raiseVolume());
        this.add(this.volumeUpButton);

        //volume knop zachter
        this.volumeDownButton = new Actor();
        this.volumeDownButton.graphics.use(Resources.Volumedown.toSprite());
        this.volumeDownButton.pos = new Vector(790, 570.00);
        this.volumeDownButton.scale = new Vector(0.1, 0.1)
        this.volumeDownButton.actions.scaleTo(vec(1.1, 1.1), vec(8, 8));
        this.volumeDownButton.z = 1000;
        this.volumeDownButton.enableCapturePointer = true;
        this.volumeDownButton.pointer.useGraphicsBounds = true;
        this.volumeDownButton.on("pointerup", (event) => this.lowerVolume());
        this.add(this.volumeDownButton);


        // profanity filter
        this.profanityFilter = new Actor();
        this.profanityFilter.graphics.use(Resources.SwearAan.toSprite());
        this.profanityFilter.pos = new Vector(720, 680);
        this.profanityFilter.scale = new Vector(0.1, 0.1)
        this.profanityFilter.z = 1000;
        this.profanityFilter.enableCapturePointer = true;
        this.profanityFilter.pointer.useGraphicsBounds = true;
        this.profanityFilter.on("pointerup", (event) => this.toggleProfanityFilter());
        this.add(this.profanityFilter);

    }

    onActivate(_context) {
        this.mapId = _context.id;

        this.resumeButton.actions.scaleTo(vec(1.1, 1.1), vec(8, 8));
        this.soundButton.actions.scaleTo(vec(1.1, 1.1), vec(8, 8));
        this.volumeUpButton.actions.scaleTo(vec(1.1, 1.1), vec(8, 8));
        this.volumeDownButton.actions.scaleTo(vec(1.1, 1.1), vec(8, 8));
        this.profanityFilter.actions.scaleTo(vec(1.1, 1.1), vec(8, 8));

        if (this.music.volume === 0) {
            this.music.pause()
        } else {
            this.music.loop = true;
            this.music.play().then(r => console.log(r));
        }
    }

    muteSound() {
        this.click.play();
        if (this.engine.musicVolume === 0) {
            this.music.volume = 0.5
            this.music.loop = true;
            this.music.play().then(r => console.log(r));
            this.engine.musicVolume = 0.5
        } else {
            this.music.volume = 0;
            this.music.pause();
            this.engine.musicVolume = 0;
        }
    }

    raiseVolume() {
        this.click.play();
        if (this.engine.musicVolume < 1) {
            this.engine.musicVolume += 0.1;
            this.music.volume += 0.1;
        }


    }

    lowerVolume() {
        this.click.play();
        if (this.engine.musicVolume > 0) {
            this.engine.musicVolume -= 0.1;
            this.music.volume -= 0.1
        }
    }

    resumeGame() {
        this.click.play();
        this.music.pause();
        console.log('start game');
        if (this.engine.activeScene === 1) {
            this.engine.goToScene('level1');
        }
        if (this.engine.activeScene === 2) {
            this.engine.goToScene('level2');
        }

    }

    toggleProfanityFilter() {
        this.engine.profanityMode = this.engine.profanityMode === false;

        if (this.engine.profanityMode === false) {
            this.profanityFilter.graphics.use(Resources.SwearUit.toSprite());
        }
        if (this.engine.profanityMode === true) {
            this.profanityFilter.graphics.use(Resources.SwearAan.toSprite());
        }
    }

    onPreUpdate(engine, _delta) {
        if (engine.input.keyboard.wasPressed(Input.Keys.Esc || Input.Keys.Escape)) {
            this.resumeGame();
        }
    }

    onDeactivate(_) {

        this.resumeButton.scale = new Vector(0.1, 0.1)
        this.soundButton.scale = new Vector(0.1, 0.1)
        this.volumeUpButton.scale = new Vector(0.1, 0.1)
        this.volumeDownButton.scale = new Vector(0.1, 0.1)

        this.resumeButton.actions.scaleTo(vec(1.1, 1.1), vec(8, 8));
        this.soundButton.actions.scaleTo(vec(1.1, 1.1), vec(8, 8));
        this.volumeUpButton.actions.scaleTo(vec(1.1, 1.1), vec(8, 8));
        this.volumeDownButton.actions.scaleTo(vec(1.1, 1.1), vec(8, 8));

        this.music.pause();
    }
}
