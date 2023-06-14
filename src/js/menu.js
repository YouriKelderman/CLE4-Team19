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

export class Menu extends Scene {

    logo

    constructor() {
        super();
        Physics.useRealisticPhysics();
        Physics.gravity = new Vector(0, 200);

    }

    // music = Resources.menuMusic;

    onActivate(_context) {
        this.engine.backgroundColor = Color.White;


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
        this.logo.scale = new Vector(0.1, 0.1)
        this.logo.actions.scaleTo(vec(1.1,1.1),vec(1,1));
        this.logo.z = 1000;
        this.add(this.logo);

        const startButton = new Actor();
        startButton.graphics.use(Resources.Start.toSprite());
        startButton.pos = new Vector((this.engine.canvasWidth / 2) - 200, 400);
        startButton.scale = new Vector(0.75, 0.75);
        startButton.z = 1000;
        startButton.enableCapturePointer = true;
        startButton.pointer.useGraphicsBounds = true;
        startButton.on("pointerup", (event) => this.startGame());
        this.add(startButton);


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

        
    }

    onPreUpdate(engine, _delta) {
        this.logo.actions.scaleTo(vec(1.1,1.1),vec(0.05,0.05));
        this.logo.actions.scaleTo(vec(1.0,1.0),vec(0.05,0.05));

    }

    startGame() {
        console.log('start game');
        this.engine.goToScene('park');

    }

    startPractise() {
        console.log('start je moeder');
    }

    // onDeactivate() {
    //     this.music.stop();
    //     this.music.volume = 0
    // }
}
