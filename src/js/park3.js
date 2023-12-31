import {
    Actor,
    Vector,
    CollisionType, Label, Font, FontUnit, Timer, ParticleEmitter, EmitterType, Color,
} from "excalibur";

import {Resources, ResourceLoader} from "./resources.js";
import {PlaceTower} from "./towers/placeTower.js";
import {Wall} from "./hitbox.js";
import {Park} from "./park.js";
import {Gulden} from "./money.js";
import {Levens} from "./health.js";
import {Enemy} from "./enemies/enemy.js";

export class Park3 extends Park {
    constructor() {
        super();
    }

    //Volgorde waarin de mobs spawnen, de syntax is: [Aantal Enemies] * [Type Enemy], [...]*[...]
    //Enemies: 0: Spider, 1: Mouse, 2: Rat, 3: Raccoon, 4: Snail
    levels = [
        "5*0",
        "8*0, 2*2, 2*0",
        "12*0,3*2,5*0,2*2,6*0",
        "8*0, 2*2, 3*0",
        "4*2, 2*3",
        "13*0, 2*2, 7*0",
        "5*0, 3*2, 2*0",
        "2*3, 7*2, 9*0",
        "9*2, 2*1",
        "5*0,1*4",
        "8*0, 7*2, 10*0",
        "12*0,3*2,5*0,2*2,6*0",
        "8*0, 2*2, 2*0",
        "4*2, 2*3",
        "2*2,15*0",
    ];
    id = 2;
    wave = 0;
    waveItem = 0;
    activeWave;
    activeEnemyObjects = [];
    order = [];
    walls = [];
    garden = new Actor({width: 100, height: 100});
    gardenSprites = [Resources.Garden, Resources.Garden4, Resources.Garden3, Resources.Garden2, Resources.Garden1, Resources.Garden1];
    endlessMode = false;
    timer = new Timer({
        fcn: () => this.removeParticles(),
        repeats: false,
        interval: 200,
    });
    deathParticles = new ParticleEmitter({
        emitterType: EmitterType.Rectangle,
        radius: 10,
        minVel: 50,
        maxVel: 100,
        minAngle: 0,
        maxAngle: Math.PI * 2,
        emitRate: 300,
        opacity: 1,
        fadeFlag: true,
        particleLife: 600,
        maxSize: 3,
        minSize: 1,
        beginColor: Color.Red,
        endColor: Color.fromRGB(139, 69, 19),
        isEmitting: false
    });
    upgradeParticles = new ParticleEmitter({
        emitterType: EmitterType.Rectangle,
        radius: 2,
        minVel: 100,
        maxVel: 200,
        minAngle: 0,
        maxAngle: Math.PI * 2,
        emitRate: 300,
        opacity: 1,
        fadeFlag: true,
        particleLife: 1000,
        maxSize: 3,
        minSize: 1,
        beginColor: Color.Green,
        endColor: Color.Green,
        isEmitting: false
    });
    impactParticle = new ParticleEmitter({
        emitterType: EmitterType.Rectangle,
        radius: 1,
        minVel: 50,
        maxVel: 100,
        minAngle: 0,
        maxAngle: Math.PI * 2,
        emitRate: 50,
        opacity: 1,
        fadeFlag: true,
        particleLife: 1000,
        maxSize: 3,
        minSize: 1,
        beginColor: Color.Red,
        endColor: Color.Red,
        isEmitting: false
    });

    onInitialize(_engine) {
        this.endlessMode = this.engine.endless;
        if (this.endlessMode === false) {
            this.waveText = new Label({
                font: new Font({
                    unit: FontUnit.Px,
                    family: 'VCR',
                    size: 30,
                    color: Color.White,
                    strokeColor: Color.Black,
                }),
            });
            this.waveText.text = `${localStorage.getItem(`0`)}/${this.levels.length}`;
            this.waveText.pos = new Vector(20, 350);
            this.waveText.z = 99999;
            this.add(this.waveText);
        }
        this.buyMenu = new Actor();
        this.buyMenu.graphics.use(Resources.BuyMenu.toSprite());
        this.buyMenu.pos = new Vector(1400, 450);
        this.buyMenu.scale = new Vector(3, 1.0);
        this.buyMenu.z = 9999;
        this.buyMenu.enableCapturePointer = true;
        this.buyMenu.pointer.useGraphicsBounds = true;


        this.guldenLogo = new Actor();
        this.guldenLogo.graphics.use(Resources.Gulden.toSprite());
        this.guldenLogo.scale = new Vector(0.4, 0.4);
        this.guldenLogo.pos = new Vector(120, 80);
        this.guldenLogo.z = 99999;
        this.add(this.guldenLogo);

        this.guldenDisplay = new Gulden(

        );
        this.add(this.guldenDisplay);

        this.levensLogo = new Actor();
        this.levensLogo.graphics.use(Resources.Health.toSprite());
        this.levensLogo.scale = new Vector(0.4, 0.4);
        this.levensLogo.pos = new Vector(120, 120);
        this.levensLogo.z = 99999;
        this.add(this.levensLogo);

        this.levensDisplay = new Levens(
        );
        this.add(this.levensDisplay);

        this.placingSprite = new PlaceTower();
        this.engine.input.pointers.primary.on("up", () => this.mouseInput());
        this.engine = _engine;
        let hitboxPoints = [182, 45,184, 854,249, 853,238, 45,309, 45,318, 846,389, 846,382, 45,384, 854,393, 72,1371, 74,1371, 136,400, 140,403, 197,1369, 188,1371, 806,1334, 807,1334, 72,1281, 70,1297, 811,1244, 811,1236, 72,565, 73,571, 809,506, 811,530, 72,459, 72,496, 810,398, 813,396, 761,1372, 761,1373, 716,399, 711,397, 671,1371, 679,1373, 626,399, 629,399, 629,];
        for (let i = 0; i < hitboxPoints.length; i += 2) {
            //console.log(`${hitboxPoints[i]} ${hitboxPoints[i + 1]} ${hitboxPoints[i + 2]} ${hitboxPoints[i + 3]}`);
            let offsetX = 0;
            let offsetY = 0;
            let wall = new Wall((hitboxPoints[i]) + offsetX, (hitboxPoints[i + 1]) + offsetY, (hitboxPoints[i + 2]) + offsetX, (hitboxPoints[i + 3]) + offsetY);
            wall.on("precollision", (event) => {
                if (event.other instanceof PlaceTower)
                    this.isLegal = false;

            });
            wall.on("collisionend", (event) => {
                if (event.other instanceof PlaceTower)
                    this.isLegal = true;
            });
            this.walls.push(wall);
        }
        this.garden.sprite = Resources.Garden.toSprite();
        this.garden.graphics.use(this.garden.sprite);
        this.add(this.garden);
        this.garden.z = 9999;
        this.garden.pos = new Vector(900, 400);
        this.garden.collisionType = CollisionType.Passive;

        this.garden.on("collisionstart", (event) => {
            if (event.other instanceof Enemy) {
                this.engine.damage();
                this.crunch.play();
                this.garden.graphics.use(this.gardenSprites[Math.ceil(this.engine.levens / 4)].toSprite());
                event.other.explode();
            }
        });
        let mapFloor = new Actor();
        mapFloor.graphics.use(Resources.Map3Ground.toSprite());
        mapFloor.scale = new Vector(5.9, 5.9);
        mapFloor.pos = new Vector(750, 450);
        this.add(mapFloor);
        let mapTop = new Actor();
        mapTop.graphics.use(Resources.Map3Top.toSprite());
        mapTop.scale = new Vector(5.9, 5.9);
        mapTop.pos = new Vector(691, 450);
        mapTop.z = 9999;
        this.add(mapTop);

        this.settingsButton = new Actor();
        this.settingsButton.graphics.use(Resources.SettingsButton.toSprite());
        this.settingsButton.pos = new Vector(50, 105);
        this.settingsButton.scale = new Vector(0.7, 0.7);
        this.settingsButton.z = 9999;
        this.settingsButton.enableCapturePointer = true;
        this.settingsButton.pointer.useGraphicsBounds = true;
        this.settingsButton.on("pointerup", (event) => this.goToSettings());
        this.add(this.settingsButton);

        this.buyMenuButton = new Actor();
        this.buyMenuButton.graphics.use(Resources.BuyButton.toSprite());
        this.buyMenuButton.pos = new Vector(50, 195);
        this.buyMenuButton.scale = new Vector(0.7, 0.7);
        this.buyMenuButton.z = 9999;
        this.buyMenuButton.enableCapturePointer = true;
        this.buyMenuButton.pointer.useGraphicsBounds = true;
        this.buyMenuButton.on("pointerup", (event) => this.drawBuyMenu());
        this.add(this.buyMenuButton);

        this.playRoundButton = new Actor();
        this.playRoundButton.graphics.use(Resources.PlayButton.toSprite());
        this.playRoundButton.pos = new Vector(50, 285);
        this.playRoundButton.scale = new Vector(0.7, 0.7);
        this.playRoundButton.z = 9999;
        this.playRoundButton.enableCapturePointer = true;
        this.playRoundButton.pointer.useGraphicsBounds = true;
        this.playRoundButton.on("pointerup", (event) => this.startWave());
        this.add(this.playRoundButton);

        //sidebutton
        this.enemies();
        this.koopLabel = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 30,
            }),
        });
        this.koopLabel.text = 'Koop:';
        this.koopLabel.pos = new Vector(1350, 150);
        this.koopLabel.z = 99999;

        // bami toren name label
        this.bamiLabel = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 16,
            }),
        });
        this.bamiLabel.text = 'Pan bami';
        this.bamiLabel.pos = new Vector(1350, 150);
        this.bamiLabel.z = 99999;

        //buy bami tower
        this.bamiButton = new Actor();
        this.button(this.bamiButton, Resources.Pan, new Vector(1350, 200), new Vector(1.5, 1.5));
        this.bamiButton.on("pointerdown", (event) => this.buyTower(1));

        // cost logo and text
        this.costlogobami = new Actor();
        this.costLogo(this.costlogobami, new Vector(1350, 250));

        this.bamicost = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 16,
            }),
        });
        this.bamicost.text = '375';
        this.bamicost.pos = new Vector(1370, 250);
        this.bamicost.z = 99999;


        // tini en lau toren name label
        this.tinyLauLabel = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 16,
            }),

        });
        this.tinyLauLabel.text = 'Tiny en Lau';
        this.tinyLauLabel.pos = new Vector(1350, 300);
        this.tinyLauLabel.z = 99999;

        // buy tiny en lau tower
        this.tinyLauButton = new Actor();
        this.button(this.tinyLauButton, Resources.TinyLau, new Vector(1350, 350), new Vector(2, 2));
        this.tinyLauButton.on("pointerdown", (event) => this.buyTower(2));

        // cost logo and text
        this.costlogotiny = new Actor();
        this.costLogo(this.costlogotiny, new Vector(1350, 400));

        this.tinycost = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 16,
            }),
        });
        this.tinycost.text = '500';
        this.tinycost.pos = new Vector(1370, 400);
        this.tinycost.z = 99999;

        // spiderTrike toren name label
        this.spiderTrikeLabel = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 16,
            }),
        });
        this.spiderTrikeLabel.text = 'Spinnenman';
        this.spiderTrikeLabel.pos = new Vector(1350, 450);
        this.spiderTrikeLabel.z = 99999;
        // buy spiderTrike tower
        this.spiderTrikeButton = new Actor();
        this.button(this.spiderTrikeButton, Resources.SpiderMeneer, new Vector(1350, 500), new Vector(1.5, 1.5));
        this.spiderTrikeButton.on("pointerdown", (event) => this.buyTower(3));
        this.enemies();


        // cost logo and text
        this.costlogospider = new Actor();
        this.costLogo(this.costlogospider, new Vector(1350, 550));

        this.spidercost = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 16,
            }),

        });
        this.spidercost.text = '650';
        this.spidercost.pos = new Vector(1370, 550);
        this.spidercost.z = 99999;


        this.activeWave = new Actor();
        this.button(this.activeWave, Resources.TinyLau, new Vector(130, 350), new Vector(2, 2));
        this.activeWave.on("pointerdown", (event) => this.startWave());
    }

    drawBuyMenu() {
        this.buyMenuClick++;
        if (this.buyMenuClick === 1) {
            this.buyMenu.pos = new Vector(1500, 450);
            this.buyMenu.actions.moveTo(1400, 450, 1100);
            this.add(this.buyMenu);

            this.koopLabel.pos = new Vector(1500, 100);
            this.koopLabel.actions.moveTo(1300, 100, 1100);
            this.add(this.koopLabel);


            this.bamiLabel.pos = new Vector(1500, 150);
            this.bamiLabel.actions.moveTo(1310, 150, 1300);
            this.add(this.bamiLabel);

            this.bamiButton.pos = new Vector(1500, 180);
            this.bamiButton.actions.moveTo(1350, 180, 1300);
            this.add(this.bamiButton);

            this.costlogobami.pos = new Vector(1500, 200);
            this.costlogobami.actions.moveTo(1300, 230, 1300);
            this.add(this.costlogobami);

            this.bamicost.pos = new Vector(1500, 230);
            this.bamicost.actions.moveTo(1330, 230, 1300);
            this.add(this.bamicost);


            this.tinyLauLabel.pos = new Vector(1500, 270);
            this.tinyLauLabel.actions.moveTo(1295, 270, 1300);
            this.add(this.tinyLauLabel);

            this.tinyLauButton.pos = new Vector(1500, 300);
            this.tinyLauButton.actions.moveTo(1350, 300, 1300);
            this.add(this.tinyLauButton);

            this.costlogotiny.pos = new Vector(1500, 350);
            this.costlogotiny.actions.moveTo(1300, 350, 1300);
            this.add(this.costlogotiny);

            this.tinycost.pos = new Vector(1500, 380);
            this.tinycost.actions.moveTo(1330, 350, 1300);
            this.add(this.tinycost);

            this.spiderTrikeLabel.pos = new Vector(1500, 380);
            this.spiderTrikeLabel.actions.moveTo(1300, 390, 1300);
            this.add(this.spiderTrikeLabel);

            this.spiderTrikeButton.pos = new Vector(1500, 430);
            this.spiderTrikeButton.actions.moveTo(1350, 440, 1300);
            this.add(this.spiderTrikeButton);

            this.costlogospider.pos = new Vector(1500, 480);
            this.costlogospider.actions.moveTo(1300, 490, 1300);
            this.add(this.costlogospider);

            this.spidercost.pos = new Vector(1500, 510);
            this.spidercost.actions.moveTo(1330, 490, 1300);
            this.add(this.spidercost);

        }
        if (this.buyMenuClick === 2) {
            this.buyMenu.kill();

            this.koopLabel.pos = new Vector(1350, 50);
            this.koopLabel.kill();

            this.bamiLabel.pos = new Vector(1350, 150);
            this.bamiLabel.kill();
            this.bamiButton.pos = new Vector(1350, 450);
            this.bamiButton.kill();
            this.costlogobami.pos = new Vector(1350, 250);
            this.costlogobami.kill();
            this.bamicost.pos = new Vector(1350, 250);
            this.bamicost.kill();

            this.tinyLauLabel.pos = new Vector(1350, 250);
            this.tinyLauLabel.kill();
            this.tinyLauButton.pos = new Vector(1350, 350);
            this.tinyLauButton.kill();
            this.costlogotiny.pos = new Vector(1350, 350);
            this.costlogotiny.kill();
            this.tinycost.pos = new Vector(1350, 350);
            this.tinycost.kill();

            this.spiderTrikeLabel.pos = new Vector(1350, 450);
            this.spiderTrikeLabel.kill();
            this.spiderTrikeButton.pos = new Vector(1350, 250);
            this.spiderTrikeButton.kill();
            this.costlogospider.pos = new Vector(1350, 350);
            this.costlogospider.kill();
            this.spidercost.pos = new Vector(1350, 350);
            this.spidercost.kill();


            this.buyMenuClick = 0;
        }
    }

    enemyKilled(pos) {
        this.deathParticles.isEmitting = true;
        this.deathParticles.pos = pos;
        this.add(this.deathParticles);
        this.particleCounter = 0;
        this.particleEmitting = true;
        console.log("eeee");
    }

    impactParticleFunction(pos) {
        this.impactParticle.isEmitting = true;
        this.impactParticle.pos = pos;
        this.add(this.impactParticle);
        this.impactParticleCounter = 0;
        console.log("eeee");
    }

    removeParticles() {
        this.upgradeParticles.isEmitting = false;
        this.upgradeParticles.kill();
    }

}
