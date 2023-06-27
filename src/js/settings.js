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
    musicVolume;

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
        this.soundButton.pos = new Vector(648.00, 640);
        this.soundButton.scale = new Vector(0.1, 0.1)

        this.soundButton.z = 1000;
        this.soundButton.enableCapturePointer = true;
        this.soundButton.pointer.useGraphicsBounds = true;
        this.soundButton.on("pointerup", (event) => this.muteSound());
        this.add(this.soundButton);


        // profanity filter
        this.profanityFilter = new Actor(
        );
        this.profanityFilter.graphics.use(Resources.SwearAan.toSprite());
        this.profanityFilter.pos = new Vector(794.00, 643.5);
        this.profanityFilter.scale = new Vector(0.1, 0.1)
        this.profanityFilter.actions.scaleTo(vec(1.1, 1.1), vec(8, 8));
        this.profanityFilter.z = 1000;
        this.profanityFilter.enableCapturePointer = true;
        this.profanityFilter.pointer.useGraphicsBounds = true;
        this.profanityFilter.on("pointerup", (event) => this.toggleProfanityFilter());
        this.add(this.profanityFilter);

        this.levelSelectButton = new Actor();
        this.levelSelectButton.graphics.use(Resources.levelSelectButtonX.toSprite());
        this.levelSelectButton.pos = new Vector(720, 520);
        this.levelSelectButton.scale = new Vector(0.1, 0.1)
        this.levelSelectButton.actions.scaleTo(vec(1.1, 1.1), vec(8, 8));
        this.levelSelectButton.z = 1000;
        this.levelSelectButton.enableCapturePointer = true;
        this.levelSelectButton.pointer.useGraphicsBounds = true;
        this.levelSelectButton.on("pointerup", (event) =>  this.engine.goToScene('levelselect'));
        this.add(this.levelSelectButton);

    }

    onActivate(_context) {
        this.mapId = _context.id;

        this.resumeButton.actions.scaleTo(vec(1.1, 1.1), vec(8, 8));
        this.soundButton.actions.scaleTo(vec(1.1, 1.1), vec(8, 8));
        this.levelSelectButton.actions.scaleTo(vec(1.1, 1.1), vec(8, 8));

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
        this.buttonAnimatior(this.volumeUpButton)
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
        this.profanityFilter.scale = new Vector(0.1, 0.1)
        this.levelSelectButton.scale = new Vector(0.1, 0.1)

        this.resumeButton.actions.scaleTo(vec(1.1, 1.1), vec(8, 8));
        this.soundButton.actions.scaleTo(vec(1.1, 1.1), vec(8, 8));
        this.profanityFilter.actions.scaleTo(vec(1.1, 1.1), vec(8, 8));
        this.levelSelectButton.actions.scaleTo(vec(1.1, 1.1), vec(8, 8));

        this.music.pause();
    }
}
