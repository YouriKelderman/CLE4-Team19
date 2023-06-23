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

export class Levelselect extends Scene {

    levelselect
    spider
    music = Resources.BackgroundMusic;
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


        // levelselect & buttons
        this.levelselect = new Actor();
        this.levelselect.graphics.use(Resources.Logo.toSprite());
        this.levelselect.pos = new Vector(720, 250);
        this.levelselect.scale = new Vector(0.1, 0.1)
        this.levelselect.actions.scaleTo(vec(1.1,1.1),vec(1,1));
        this.levelselect.z = 1000;
        this.add(this.levelselect);

        const parklevel = new Actor();
        parklevel.graphics.use(Resources.ParkMapselect.toSprite());
        parklevel.pos = new Vector(720, 500);
        parklevel.scale = new Vector(0.1, 0.1)
        parklevel.actions.scaleTo(vec(0.6,0.6),vec(0.5,0.5));
        parklevel.z = 1000;
        parklevel.enableCapturePointer = true;
        parklevel.pointer.useGraphicsBounds = true;
        parklevel.on("pointerup", (event) => this.parkLevel());
        this.add(parklevel);


        // Funny menu things
        this.spider = new Actor();
        this.spider.graphics.use(Resources.MenuSpider.toSprite());
        this.spider.pos = new Vector(100, 0);
        this.spider.scale = new Vector(1.5, 1.5)
        this.spider.z = 1000;
        this.add(this.spider);

    }

    onPreUpdate(engine, _delta) {
        this.levelselect.actions.scaleTo(vec(1.2, 1.2), vec(0.05, 0.05));
        this.levelselect.actions.scaleTo(vec(1.0, 1.0), vec(0.05, 0.05));

        if (Math.floor(Math.random() * (2000 - 1) + 1) === 1) {
            this.spiderPeek();
        }

        if (engine.input.keyboard.wasReleased(Input.Keys.S)) {
            this.spiderPeek()
        }
    }

    parkLevel() {
        console.log('park level');
        this.click.volume = 1;
        this.click.play();
        this.engine.goToScene('park');

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
