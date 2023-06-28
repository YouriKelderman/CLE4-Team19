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

export class Helper extends Scene {

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
    this.engine = engine;

        this.helpTextX = new Actor();
        this.helpTextX.graphics.use(Resources.helpText.toSprite());
        this.helpTextX.pos = new Vector(720, 210);
        this.helpTextX.scale = new Vector(0.1, 0.1)
        this.helpTextX.actions.scaleTo(vec(4.5,4.5),vec(10,10));
        this.helpTextX.z = 1000;
        this.add(this.helpTextX);

        this.backButton = new Actor();
        this.backButton.graphics.use(Resources.UpgradeButton.toSprite());
        this.backButton.pos = new Vector(170, 220);
        this.backButton.rotation = Math.PI*5.5;
        this.backButton.scale = new Vector(0.1, 0.1)
        this.backButton.actions.scaleTo(vec(2.5,2.5),vec(8,8));
        this.backButton.z = 1000;
        this.backButton.enableCapturePointer = true;
        this.backButton.pointer.useGraphicsBounds = true;
        this.backButton.on("pointerup", (event) => this.engine.goToScene('settings'));
        this.add(this.backButton);


        let mapFloor = new Actor();
        mapFloor.graphics.use(Resources.background.toSprite());
        mapFloor.scale = new Vector(5, 5);
        mapFloor.pos = new Vector(745, 433);
        this.add(mapFloor);

        this.buyMenuButton = new Actor();
        this.buyMenuButton.graphics.use(Resources.BuyButton.toSprite());
        this.buyMenuButton.pos = new Vector(170, 610);
        this.buyMenuButton.scale = new Vector(0.7, 0.7);
        this.buyMenuButton.z = 9999;
        this.add(this.buyMenuButton);

        this.settingsButton = new Actor();
        this.settingsButton.graphics.use(Resources.SettingsButton.toSprite());
        this.settingsButton.pos = new Vector(170, 510);
        this.settingsButton.scale = new Vector(0.7, 0.7);
        this.settingsButton.z = 9999;
        this.add(this.settingsButton);

        this.playRoundButton = new Actor();
        this.playRoundButton.graphics.use(Resources.PlayButton.toSprite());
        this.playRoundButton.pos = new Vector(170, 710);
        this.playRoundButton.scale = new Vector(0.7, 0.7);
        this.playRoundButton.z = 9999;
        this.playRoundButton.enableCapturePointer = true;
        this.playRoundButton.pointer.useGraphicsBounds = true;
        this.playRoundButton.on("pointerup", (event) => this.startWave());
        this.add(this.playRoundButton);

        this.settingsDesc = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 28,
            }),
        });
        this.settingsDesc.pos = new Vector(220, 500);
        this.settingsDesc.actions.moveTo(220, 500, 1600);
        this.settingsDesc.text = `Brengt je naar de instellingen, hier kan je het geluid dempen, van level\nveranderen of terug naar het spel.`;
        this.settingsDesc.z = 99999;

        this.add(this.settingsDesc);

        this.buyMenuDesc = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 28,
            }),
        });
        this.buyMenuDesc.pos = new Vector(220, 605);
        this.buyMenuDesc.actions.moveTo(220, 605, 1600);
        this.buyMenuDesc.text = `Met deze knop kan je de winkel openen of sluiten`;
        this.buyMenuDesc.z = 99999;

        this.add(this.buyMenuDesc);

        this.playbuttonDesc = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 28,
            }),
        });
        this.playbuttonDesc.pos = new Vector(220, 705);
        this.playbuttonDesc.actions.moveTo(220, 705, 1600);
        this.playbuttonDesc.text = `Met deze knop begin je de (volgende) ronde`;
        this.playbuttonDesc.z = 99999;

        this.add(this.playbuttonDesc);


    }

    onPreUpdate(engine, _delta) {

        if (Math.floor(Math.random() * (2000 - 1) + 1) === 1) {
            this.spiderPeek();
        }

        if (engine.input.keyboard.wasReleased(Input.Keys.S)) {
            this.spiderPeek()
        }
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
