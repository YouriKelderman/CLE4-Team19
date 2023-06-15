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
import {Slider} from "./slider.js";
import {SliderBase} from "./sliderBase.js";

export class Menu extends Scene {

    logo;
    spider;

    constructor() {
        super();
        Physics.useRealisticPhysics();
    }

    // music = Resources.menuMusic;
    onActivate(_context) {
        this.engine.backgroundColor = new Color(239, 255, 228);
        // this.music.stop()
        // this.music.volume = 1
        // this.music.loop = true;
        // this.music.play();
    }

    onInitialize(engine) {
        // logo & buttons
        this.logo = new Actor();
        this.logo.graphics.use(Resources.Logo.toSprite());
        this.logo.pos = new Vector((this.engine.canvasWidth / 2) - 200, 175);
        this.logo.scale = new Vector(0.1, 0.1);
        this.logo.actions.scaleTo(vec(1.1, 1.1), vec(1, 1));
        this.logo.z = 1000;
        this.add(this.logo);

        const startButton = new Actor();
        startButton.graphics.use(Resources.Start.toSprite());
        startButton.pos = new Vector((this.engine.canvasWidth / 2) - 200, 400);
        startButton.scale = new Vector(0.1, 0.1);
        startButton.actions.scaleTo(vec(0.6, 0.6), vec(0.5, 0.5));
        startButton.z = 1000;
        startButton.enableCapturePointer = true;
        startButton.pointer.useGraphicsBounds = true;
        startButton.on("pointerup", (event) => this.startGame());
        this.add(startButton);


        const practise = new Actor();
        // let practiseButton = Resources.PlayButton.toSprite()
        // practise.graphics.use(practiseButton);
        practise.pos = new Vector(750, 500);
        practise.scale = new Vector(0.75, 0.75);
        practise.z = 1000;
        practise.enableCapturePointer = true;
        practise.pointer.useGraphicsBounds = true;
        practise.on("pointerup", (event) => this.startPractise());
        this.add(practise);

        // Funny menu things
        this.spider = new Actor();
        this.spider.graphics.use(Resources.MenuSpider.toSprite());
        this.spider.pos = new Vector(100, -100);
        this.spider.scale = new Vector(1.5, 1.5);
        this.spider.z = 1000;
        this.add(this.spider);

        let slider = new Slider(500, 500);
        this.add(slider)
        let sliderBase = new SliderBase(500, 500);
        this.add(sliderBase)

    }

    onPreUpdate(engine, _delta) {
        this.logo.actions.scaleTo(vec(1.1, 1.1), vec(0.05, 0.05));
        this.logo.actions.scaleTo(vec(1.0, 1.0), vec(0.05, 0.05));

        if (Math.floor(Math.random() * (2000 - 1) + 1) === 1) {
            this.spiderPeek();
        }

        if (engine.input.keyboard.wasReleased(Input.Keys.S)) {
            this.spiderPeek();
        }
    }

    startGame() {
        console.log('start game');
        this.engine.goToScene('park');

    }

    startPractise() {
        console.log('start je moeder');
    }

    spiderPeek() {
        this.spider.actions
            .moveTo(vec(100, 50), 50)
            .delay(1000)
            .moveTo(vec(100, -100), 50);
    }


    // onDeactivate() {
    //     this.music.stop();
    //     this.music.volume = 0
    // }
}
