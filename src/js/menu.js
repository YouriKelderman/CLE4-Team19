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

export class Menu extends Scene {

    logo
    spider
    music = Resources.MenuMusic;
    click = Resources.Click;

    constructor() {
        super();
        Physics.useRealisticPhysics();



    }


    onActivate(_context) {
        this.engine.backgroundColor = new Color(239, 255, 228)
        this.music.volume = 0.3;
        this.music.loop = true;
        this.music.play().then(r => console.log(r));

    }
    onInitialize(engine) {
        this.cursor = new Cursor(this.engine);
        this.add(this.cursor);


        // logo & buttons
        this.logo = new Actor();
        this.logo.graphics.use(Resources.Logo.toSprite());
        this.logo.pos = new Vector(720, 250);
        this.logo.scale = new Vector(0.1, 0.1)
        this.logo.actions.scaleTo(vec(1.1,1.1),vec(2,2));
        this.logo.z = 1000;
        this.add(this.logo);

        const startButton = new Actor();
        startButton.graphics.use(Resources.Start.toSprite());
        startButton.pos = new Vector(720, 500);
        startButton.scale = new Vector(0.1, 0.1)
        startButton.actions.scaleTo(vec(0.6,0.6),vec(2.5,2.5));
        startButton.z = 1000;
        startButton.enableCapturePointer = true;
        startButton.pointer.useGraphicsBounds = true;
        startButton.collider.set(Shape.Box(500, 200));
        startButton.on("pointerup", (event) => this.startGame());
        startButton.on("precollision", (event) => this.onCollision(event));
        this.add(startButton);


        const endlessButton = new Actor();
        endlessButton.graphics.use(Resources.EndlessButton.toSprite());
        endlessButton.pos = new Vector(720, 700);
        endlessButton.scale = new Vector(0.1, 0.1)
        endlessButton.actions.scaleTo(vec(0.6,0.6),vec(0.5,0.5));
        endlessButton.z = 1000;
        endlessButton.enableCapturePointer = true;
        endlessButton.pointer.useGraphicsBounds = true;
        endlessButton.on("pointerup", (event) => this.startEndless());
        this.add(endlessButton);

        // this.helpSelect = new Actor();
        // this.helpSelect.graphics.use(Resources.helpButton.toSprite());
        // this.helpSelect.pos = new Vector(1330, 790);
        // this.helpSelect.scale = new Vector(0.3, 0.3)
        // this.helpSelect.actions.scaleTo(vec(0.8,0.8),vec(2.5,2.5));
        //
        // this.helpSelect.z = 1000;
        // this.helpSelect.enableCapturePointer = true;
        // this.helpSelect.pointer.useGraphicsBounds = true;
        // this.helpSelect.on("pointerup", (event) => this.startHelp());
        // this.add(this.helpSelect);



        const practise = new Actor();
        // let practiseButton = Resources.Practise.toSprite()
        // practiseButton.tint = new Color(100, 100, 100)
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
        this.spider.pos = new Vector(100, 0);
        this.spider.scale = new Vector(1.5, 1.5)
        this.spider.z = 1000;
        this.add(this.spider);

        // let sliderBase = new SliderBase(400, 500)
        // let sliderHead = new Slider(400, 500)
        // this.add(sliderHead)
        //     this.add(sliderBase)

    }
    startHelp() {
        console.log('start game');
        this.click.volume = 1;
        this.click.play();
        this.engine.goToScene('Helper');

    }

    onCollision(event) {
        if (event.other.name === "Cursor" && event.other.clicked === true) {
            this.startGame()
        }
    }

    onPreUpdate(engine, _delta) {
        this.logo.actions.scaleTo(vec(1.2, 1.2), vec(0.05, 0.05));
        this.logo.actions.scaleTo(vec(1.0, 1.0), vec(0.05, 0.05));

        if (Math.floor(Math.random() * (2000 - 1) + 1) === 1) {
            this.spiderPeek();
        }

        if (engine.input.keyboard.wasReleased(Input.Keys.S)) {
            this.spiderPeek()
        }
    }

    startGame() {
        console.log('start game');
        this.click.volume = 1;
        this.click.play();
        this.engine.goToScene('cutscene');

    }


    startEndless() {
        console.log('start endless');
        this.click.volume = 1;
        this.click.play();
        this.engine.endless = true;
        this.engine.goToScene('levelselect');
    }


    startPractise() {
    }

    spiderPeek() {
        this.spider.actions
            .moveTo(vec(100, 100), 50)
            .delay(1000)
            .moveTo(vec(100, 0), 50)
    }


    onDeactivate(_  ) {
        this.music.stop();
        this.music.volume = 0
    }
}
