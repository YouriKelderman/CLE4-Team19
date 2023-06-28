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
    mapLabel1;
    mapLabel2;
    mapLabel3;
    endlessMode

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
        this.engine = engine;
        this.endlessMode = this.engine.endless

        // levelselect & buttons
        this.levelselect = new Actor();
        this.levelselect.graphics.use(Resources.SelectText.toSprite());
        this.levelselect.pos = new Vector(720, 200);
        this.levelselect.scale = new Vector(0.1, 0.1)
        this.levelselect.actions.scaleTo(vec(4.5, 4.5), vec(3, 3));
        this.levelselect.z = 1000;
        this.add(this.levelselect);

        const parklevel = new Actor();
        parklevel.graphics.use(Resources.ParkMapselect.toSprite());
        parklevel.pos = new Vector(350, 500);
        parklevel.scale = new Vector(0.1, 0.1)
        parklevel.actions.scaleTo(vec(0.6, 0.6), vec(0.5, 0.5));
        parklevel.z = 1000;
        parklevel.enableCapturePointer = true;
        parklevel.pointer.useGraphicsBounds = true;
        parklevel.on("pointerup", (event) => this.parkLevel(1));
        this.add(parklevel);

        if (this.endlessMode === false) {
            this.mapLabel1 = new Label({
                font: new Font({
                    unit: FontUnit.Px,
                    family: 'VCR',
                    size: 30,
                }),
            });
            this.mapLabel1.text = `${localStorage.getItem("0")}/5`;
            this.mapLabel1.pos = new Vector(320, 630);
            this.mapLabel1.z = 99999;
            this.add(this.mapLabel1)
        }


        this.mapLabel1 = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 30,
            }),
        });
        this.mapLabel1.text = `${localStorage.getItem("0")}/5`;
        this.mapLabel1.pos = new Vector(320, 630);
        this.mapLabel1.z = 99999;
        this.add(this.mapLabel1)
        const parklevel2 = new Actor();
        parklevel2.graphics.use(Resources.ParkMapSelect2.toSprite());
        parklevel2.pos = new Vector(720, 500);
        parklevel2.scale = new Vector(0.1, 0.1)
        parklevel2.actions.scaleTo(vec(0.6, 0.6), vec(0.5, 0.5));
        parklevel2.z = 1000;
        parklevel2.enableCapturePointer = true;
        parklevel2.pointer.useGraphicsBounds = true;
        console.log(Number(localStorage.getItem("0")));
        if (Number(localStorage.getItem("0")) > 4) {
            parklevel2.on("pointerup", (event) =>
                this.parkLevel(2)
            );
        } else {
            const lock = new Actor();
            lock.graphics.use(Resources.Lock.toSprite());
            lock.scale = new Vector(0.01, 0.01)
            lock.actions.scaleTo(vec(0.5, 0.5), vec(0.5, 0.5));
            lock.pos = new Vector(720, 490);
            lock.z = 1100;
            this.add(lock);
            let tint = Resources.ParkMapSelect2.toSprite();
            tint.tint = new Color(100, 100, 100);
            parklevel2.sprite = tint;
            parklevel2.graphics.use(tint);
        }
        this.add(parklevel2);
        if (this.endlessMode === false) {
            this.mapLabel2 = new Label({
                font: new Font({
                    unit: FontUnit.Px,
                    family: 'VCR',
                    size: 30,
                }),
            });
            this.mapLabel2.text = `${localStorage.getItem("1")}/8`;
            this.mapLabel2.pos = new Vector(700, 630);
            this.mapLabel2.z = 99999;
            this.add(this.mapLabel2)
        }
        let mapFloor = new Actor();
        mapFloor.graphics.use(Resources.background.toSprite());
        mapFloor.scale = new Vector(5, 5);
        mapFloor.pos = new Vector(745, 433);
        this.add(mapFloor);
        const parklevel3 = new Actor();
        parklevel3.graphics.use(Resources.ParkMapSelect3.toSprite());
        parklevel3.pos = new Vector(1090, 500);
        parklevel3.scale = new Vector(0.1, 0.1)
        parklevel3.actions.scaleTo(vec(0.6, 0.6), vec(0.5, 0.5));
        parklevel3.z = 1000;
        parklevel3.enableCapturePointer = true;
        parklevel3.pointer.useGraphicsBounds = true;
        if (Number(localStorage.getItem("1")) > 9) {
            parklevel3.on("pointerup", (event) =>
                this.parkLevel(3)
            );
        } else {
            const lock = new Actor();
            lock.graphics.use(Resources.Lock.toSprite());
            lock.scale = new Vector(0.01, 0.01)
            lock.actions.scaleTo(vec(0.5, 0.5), vec(0.5, 0.5));
            lock.pos = new Vector(1090, 490);
            let tint = Resources.ParkMapSelect3.toSprite();
            tint.tint = new Color(100, 100, 100);
            parklevel3.sprite = tint;
            parklevel3.graphics.use(tint);
            lock.z = 1100;
            this.add(lock);
        }
            this.add(parklevel3);
            if (this.endlessMode === false) {
            this.mapLabel3 = new Label({
                font: new Font({
                    unit: FontUnit.Px,
                    family: 'VCR',
                    size: 30,
                }),
            });
            this.mapLabel3.text = `${localStorage.getItem("2")}/10`;
            this.mapLabel3.pos = new Vector(1065, 630);
            this.mapLabel3.z = 99999;
            this.add(this.mapLabel3)
        }

        // Funny menu things
        this.spider = new Actor();
        this.spider.graphics.use(Resources.MenuSpider.toSprite());
        this.spider.pos = new Vector(100, 0);
        this.spider.scale = new Vector(1.5, 1.5)
        this.spider.z = 1000;
        this.add(this.spider);

    }

    onPreUpdate(engine, _delta) {
        if (engine.input.keyboard.wasPressed(Input.Keys.H)) {
            localStorage.clear()
        }
        this.levelselect.actions.scaleTo(vec(4.5, 4.5), vec(0.05, 0.05));
        this.levelselect.actions.scaleTo(vec(4.2, 4.2), vec(0.1, 0.1));

        if (Math.floor(Math.random() * (2000 - 1) + 1) === 1) {
            this.spiderPeek();
        }

        if (engine.input.keyboard.wasReleased(Input.Keys.S)) {
            this.spiderPeek()
        }
    }

    parkLevel(id) {
        this.click.volume = 1;
        this.click.play();

        if (id === 1) {
            this.engine.goToScene('level1');
            this.engine.activeScene = 1
            console.log('park level1');
        }
        if (id === 2) {
            this.engine.goToScene('level2');
            this.engine.activeScene = 2
            console.log('park level2');
        }
        if (id === 3) {
            this.engine.goToScene('level3');
            this.engine.activeScene = 3
            console.log('park level3');
        }

    }

    spiderPeek() {
        this.spider.actions
            .moveTo(vec(100, 100), 50)
            .delay(1000)
            .moveTo(vec(100, 0), 50)
    }


    onDeactivate(_) {
        this.music.stop();
        this.music.volume = 0
    }
}
