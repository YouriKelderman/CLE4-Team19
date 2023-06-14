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
    Shape, CollisionType, Input, PointerSystem
} from "excalibur";

import {Resources, ResourceLoader} from "./resources.js";

export class Menu extends Scene {

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
        const logo = new Actor();
        // logo.graphics.use(Resources.Logo.toSprite());
        logo.pos = new Vector(750, 150);
        logo.scale = new Vector(0.75, 0.75);
        logo.z = 1000;
        this.add(logo);

        const race = new Actor();
        // race.graphics.use(Resources.Race.toSprite());
        race.pos = new Vector(750, 350);
        race.scale = new Vector(0.75, 0.75);
        race.z = 1000;
        race.enableCapturePointer = true;
        race.pointer.useGraphicsBounds = true;
        race.on("pointerup", (event) => this.startGame());
        this.add(race);


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

    startGame() {
        console.log('start game');
    }

    startPractise() {
        console.log('start je moeder');
    }

    onDeactivate() {
        this.music.stop();
        this.music.volume = 0
    }
}
