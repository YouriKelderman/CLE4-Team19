import {
    Actor,
    Vector,
    Color,
    Debug,
    Physics,
    Input,
    Axis,
    CollisionType,
    Shape,
    vec,
    Label,
    FontUnit,
    Font,
    TextAlign, ParticleEmitter, EmitterType, Timer
} from "excalibur";

import {Scene} from "excalibur";
import {Tower} from "./towers/tower.js";
import {Resources, ResourceLoader} from "./resources.js";
import {PlaceTower} from "./towers/placeTower.js";
import {Enemy} from "./enemies/enemy.js";
import {Wall} from "./hitbox.js";
import {Gulden} from "./money.js";
import {Levens} from "./health.js";

import {UpgradeMenu} from "./buyMenu.js";

import {Settings} from "./settings.js";

export class Park extends Scene {
    constructor() {
        super();
    }

    upgradeButton;
    particleEmitting = false;
    placing = false;
    placingSprite;
    int = 0;
    activetower = this.activetower;
    path = "";
    engine;
    id = 0;
    route = [];
    towers = [];
    crunch = Resources.Crunch;
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
    towersInDistance = [];
    mapping = false;
    running = false;
    wavetext;
    //Volgorde waarin de mobs spawnen, de syntax is: [Aantal Enemies] * [Type Enemy], [...]*[...]
    //Enemies: 0: Spider, 1: Mouse, 2: Rat, 3: Raccoon, 4: Snail
    levels = [
    ];

    wave = 0;
    waveItem = 0;
    activeWave;
    waveText;
    impactParticleCounter = 0;
    order = [];
    walls = [];
    nearestTowerName;
    garden = new Actor({width: 100, height: 100});
    gardenSprites = [Resources.Garden, Resources.Garden4, Resources.Garden3, Resources.Garden2, Resources.Garden1, Resources.Garden1];
    music = Resources.ParkMusic;
    plop = Resources.Plop;
    click = Resources.Click;
    spiderSpawner = 0;
    isLegal = true;
    endlessMode = false;
    activeEnemies = 0;
    nameLabel;
    settingsButton;
    buyMenuClick = 0;
    upgradeMenuClicked = 0;
    menuOpened = 0;
    particleCounter = 0;
    id = 0;

    onActivate(_context) {
        this.activetower = undefined;
        this.engine.backgroundColor = new Color(239, 255, 228);

        this.music.volume = this.engine.musicVolume;
        if (this.music.volume === 0) {
            this.music.pause();

        } else {
            this.music.loop = true;
            this.music.play().then(r => console.log(r));
        }
    }

    onDeactivate(_context) {
        super.onDeactivate(_context);
        this.music.pause();
    }

    onInitialize(_engine) {
        this.game = _engine;
        this.waveText = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 30,
            }),
        });
        this.waveText.text = `${localStorage.getItem(`0`)}/${this.levels.length}`;
        this.waveText.pos = new Vector(20, 350);
        this.waveText.z = 99999;
        this.game.currentScene.add(this.waveText);

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
        let hitboxPoints = [1103, 45, 1094, 188, 1083, 321, 1066, 361, 994, 454, 913, 440, 787, 409, 736, 404, 714, 324, 656, 229, 592, 192, 515, 166, 458, 162, 394, 179, 302, 220, 214, 347, 210, 501, 232, 557, 263, 617, 216, 646, 175, 680, 130, 796, 186, 808, 204, 743, 241, 700, 302, 643, 322, 596, 272, 515, 271, 373, 315, 313, 357, 264, 421, 237, 526, 237, 594, 268, 646, 328, 677, 368, 684, 447, 571, 449, 537, 377, 474, 345, 414, 371, 375, 435, 399, 504, 469, 547, 543, 514, 579, 458, 534, 372, 582, 449, 480, 547, 325, 590, 399, 617, 488, 628, 602, 591, 663, 527, 679, 466, 676, 386, 633, 321, 541, 252, 459, 247, 351, 279, 296, 348, 271, 430, 283, 522, 321, 580, 306, 646, 357, 674, 418, 701, 556, 710, 634, 672, 702, 608, 739, 518, 743, 473, 866, 484, 1009, 500, 1079, 552, 1079, 591, 1075, 708, 1067, 803, 1120, 805, 1121, 734, 1116, 605, 1321, 814, 1410, 809, 1050, 465, 1093, 427, 1126, 369, 1145, 333, 1148, 192, 1152, 47];
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
        this.garden.pos = new Vector(157, 807);
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
        mapFloor.graphics.use(Resources.Map1Ground.toSprite());
        mapFloor.scale = new Vector(5.5, 5.5);
        mapFloor.pos = new Vector(745, 473);
        this.add(mapFloor);
        let mapTop = new Actor();
        mapTop.graphics.use(Resources.Map1Top.toSprite());
        mapTop.scale = new Vector(5.5, 5.5);
        mapTop.pos = new Vector(745, 425);
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
        this.bamicost.text = '200';
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
        this.tinycost.text = '300';
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

    //Functie voor het maken van een knop die gebruikt wordt in het menu. Het gebruik:
    //this.button(de actor, de image voor de actor, de positie als Vector, de scale als Vector)
    //de functie voegt de knop zelf toe aan het spel

    button(item, sprite, pos, scale) {
        item.graphics.use(sprite.toSprite());
        item.pos = pos;
        item.scale = scale;
        item.z = 99999;
        item.enableCapturePointer = true;
        item.pointer.useGraphicsBounds = true;
    }

    costLogo(cost, pos) {
        cost.graphics.use(Resources.CostLogo.toSprite());
        cost.pos = pos;
        cost.z = 99999;
        cost.scale = new Vector(0.75, 0.75);
    }


    enemies() {
        if (this.endlessMode) {
            this.levels = [`${Math.round(Math.random() * (10 - 1) + 1)}*${Math.round(Math.random() * (4 - 0) + 0)}`];
        }
        this.parse(0);
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

    parse(wave) {
        this.order = [];
        let parsedResult = this.levels[wave].split(",");
        parsedResult.forEach(item => {
            item = item.split("*");
            for (let i = 0; i < Number(item[0]); i++) {
                this.order.push(Number(item[1]));
            }
        });
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

    goToSettings() {
        console.log("goToSettings");
        this.click.play();
        this.game = this.engine;
        this.engine.goToScene('settings');
    }

    mouseInput() {
        if (!this.placing) {
            // determine which tower is closest and which tower gets click priority
            for (let i = 0; i < this.towers.length; i++) {
                let pos1 = new Vector(this.engine.input.pointers.primary.lastWorldPos.x, this.engine.input.pointers.primary.lastWorldPos.y);
                let pos2 = new Vector(this.towers[i].worldPosition.x, this.towers[i].worldPosition.y);
                let distance = pos1.distance(pos2);
                this.towersInDistance.push(distance);
            }
            let nearestTower = Math.min(...this.towersInDistance);
            this.nearestTowerName = this.towers[this.towersInDistance.indexOf(nearestTower, 0)];
            if (nearestTower < 100) {
                this.towers.forEach(tower => {
                    tower.deSelect();
                });
                this.activetower = this.nearestTowerName;
                this.activetower.select();
                this.menuInfo();
            } else {
                if (this.upgradeMenu) {
                    this.uiRemover();
                }
                this.towers.forEach(tower => {
                    tower.deSelect();

                });
            }
            this.towersInDistance = [];
        }
        if (this.placing && this.isLegal) {
            let newClone = new Tower(this, this.int);
            newClone.pos = this.placingSprite.pos;
            this.add(newClone);
            this.towers.push(newClone);
            this.add(this.upgradeParticles);
            this.upgradeParticles.isEmitting = true;
            this.upgradeParticles.pos = newClone.pos;
            this.add(this.timer);
            this.timer.start();
            newClone.checkSelf(this.int);
            this.activetower = newClone;
            this.placing = false;
            this.placingSprite.kill();
            this.drawBuyMenu();

            this.plop.play();
        } else if (this.mapping) {
            let pos = this.engine.input.pointers.primary.lastWorldPos;
            this.path += `,${Math.floor(pos.x).toString()}.${Math.floor(pos.y).toString()}`;
            localStorage.setItem("this.path", this.path);
            // console.log(this.path)
        } else {

            //this.string += `${Math.floor(this.engine.input.pointers.primary.lastWorldPos.x)}, ${Math.floor(this.engine.input.pointers.primary.lastWorldPos.y)},`;
            //console.log(this.string);
        }

    }

    uiRemover() {
        this.upgradeMenuClicked = 0;
        this.upgradeMenu.kill();
        this.towerName.kill();
        this.towerRange.kill()
        this.rangeIndicator.kill()
        this.damageIndicator.kill()
        this.towerDamage.kill()
        this.towerDesc.kill()
        this.upgradeText.kill()
        this.towerTargeting.kill()
        this.towerTargetIndicator.kill()
        this.upgradeDesc1.kill()
        this.upgradeDesc2.kill()
        this.upgradeButton.kill()
        this.upgradeButton2.kill()
        this.coin1.kill()
        this.coin2.kill()
        this.coinDesc1.kill()
        this.coinDesc2.kill()

    }
b

    removeParticles() {
        this.upgradeParticles.isEmitting = false;
        this.upgradeParticles.kill();
    }


    menuInfo() {

        this.buyMenuClick = 1;
        this.drawBuyMenu();
        if (this.upgradeMenu) {
            this.uiRemover();

        }
        this.upgradeMenuClicked = 1;
        this.upgradeMenu = new UpgradeMenu();
        this.pos = new Vector(1600, 450);
        this.upgradeMenu.actions.moveTo(1400, 450, 1600);
        this.add(this.upgradeMenu);
        this.buyMenuClick = 0;
        this.towerName = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 28,
            }),
        });
        this.towerName.pos = new Vector(1350, 85);
        this.towerName.actions.moveTo(1260, 85, 1600);
        this.towerName.text = this.activetower.name.toString();
        this.towerName.z = 99999;
        this.add(this.towerName);

        this.towerDesc = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 14,
                color: Color.White
            }),
        });
        this.towerDesc.pos = new Vector(1350, 105);
        this.towerDesc.actions.moveTo(1260, 105, 1600);
        this.towerDesc.text = this.activetower.description.toString();
        this.towerDesc.z = 99999;

        this.add(this.towerDesc);

        this.towerRange = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 36,
            }),
        });
        this.towerRange.pos = new Vector(1500, 220);
        this.towerRange.actions.moveTo(1330, 220, 1650);
        this.towerRange.z = 99999;
        this.add(this.towerRange);
        this.rangeIndicator = new Actor();
        this.rangeIndicator.graphics.use(Resources.RangeIndicator.toSprite());
        this.rangeIndicator.pos = new Vector(1500, 210);
        this.rangeIndicator.actions.moveTo(1295, 210, 1600);
        this.rangeIndicator.scale = new Vector(1, 1);
        this.rangeIndicator.z = 999999;
        this.add(this.rangeIndicator);

        this.towerDamage = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 36,
            }),
        });
        this.towerDamage.pos = new Vector(1500, 295);
        this.towerDamage.actions.moveTo(1330, 295, 1650);
        this.towerDamage.z = 99999;

        this.add(this.towerDamage);

        this.damageIndicator = new Actor();
        this.damageIndicator.graphics.use(Resources.DamageIndicator.toSprite());
        this.damageIndicator.pos = new Vector(1500, 280);
        this.damageIndicator.actions.moveTo(1295, 280, 1600);
        this.damageIndicator.scale = new Vector(1, 1);
        this.damageIndicator.z = 999999;

        this.add(this.damageIndicator);

        this.towerTargeting = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 36,
            }),
        });

        this.towerTargetIndicator = new Actor();
        this.towerTargetIndicator.graphics.use(Resources.TargetingSymbol.toSprite());
        this.towerTargetIndicator.pos = new Vector(1500, 355);
        this.towerTargetIndicator.actions.moveTo(1295, 355, 1600);
        this.towerTargetIndicator.scale = new Vector(1, 1);
        this.towerTargetIndicator.z = 999999;

        this.add(this.towerTargetIndicator);

        this.towerTargeting.pos = new Vector(1500, 365);
        this.towerTargeting.actions.moveTo(1330, 365, 1650);
        this.towerTargeting.z = 99999;

        this.add(this.towerTargeting);


        this.upgradeText = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 32,
            }),
        });
        this.upgradeText.pos = new Vector(1350, 500);
        this.upgradeText.actions.moveTo(1260, 500, 1600);
        this.upgradeText.text = `Upgrades`;
        this.upgradeText.z = 99999;

        this.add(this.upgradeText);

        this.upgradeDesc1 = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 14,
                color: Color.White,
                textAlign: TextAlign.Center

            }),
        })

        this.upgradeDesc1.pos = new Vector(1500, 540);
        this.upgradeDesc1.actions.moveTo(1335, 540, 1600);
        this.upgradeDesc1.z = 99999
        this.add(this.upgradeDesc1)

        this.coin1 = new Actor()
        this.coin1.graphics.use(Resources.Gulden.toSprite())
        this.coin1.scale = new Vector(0.2, 0.2)
        this.coin1.pos = new Vector(1500, 555);
        this.coin1.actions.moveTo(1305, 555, 1600);
        this.coin1.z = 99999
        this.add(this.coin1)

        this.coinDesc1 = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 14,
                color: Color.White,
                textAlign: TextAlign.Right

            }),
        })

        this.coinDesc1.pos = new Vector(1500, 558);
        this.coinDesc1.actions.moveTo(1345, 558, 1600);
        this.coinDesc1.z = 99999
        this.add(this.coinDesc1)


        this.upgradeDesc2 = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 14,
                color: Color.White,
                textAlign: TextAlign.Center

            }),
        })
        this.upgradeDesc2.pos = new Vector(1500, 690);
        this.upgradeDesc2.actions.moveTo(1335, 690, 1600);
        this.upgradeDesc2.z = 99999
        this.add(this.upgradeDesc2)

        this.coin2 = new Actor()
        this.coin2.graphics.use(Resources.Gulden.toSprite())
        this.coin2.scale = new Vector(0.2, 0.2)
        this.coin2.pos = new Vector(1500, 705);
        this.coin2.actions.moveTo(1305, 705, 1600);
        this.coin2.z = 99999
        this.add(this.coin2)

        this.coinDesc2 = new Label({
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 14,
                color: Color.White,
                textAlign: TextAlign.Right

            }),
        })

        this.coinDesc2.pos = new Vector(1500, 708);
        this.coinDesc2.actions.moveTo(1345, 708, 1600);
        this.coinDesc2.z = 99999
        this.add(this.coinDesc2)

        this.upgradeButton = new Actor();
        this.upgradeButton.pos = new Vector(1500, 600);
        this.upgradeButton.actions.moveTo(1340, 600, 1600);
        this.upgradeButton.scale = new Vector(1.7, 1.7);
        this.upgradeButton.z = 999999;
        this.upgradeButton.enableCapturePointer = true;
        this.upgradeButton.pointer.useGraphicsBounds = true;
        this.upgradeButton.on("pointerdown", (event) => this.activetower.tierUp(1));

        this.upgradeButton2 = new Actor();
        this.upgradeButton2.pos = new Vector(1500, 750);
        this.upgradeButton2.actions.moveTo(1340, 750, 1600);
        this.upgradeButton2.scale = new Vector(1.7, 1.7);
        this.upgradeButton2.z = 999999;
        this.upgradeButton2.enableCapturePointer = true;
        this.upgradeButton2.pointer.useGraphicsBounds = true;
        this.upgradeButton2.on("pointerdown", (event) => this.activetower.tierUp(2));

            this.add(this.upgradeButton);
            this.add(this.upgradeButton2);


    }

    startWave() {
        if (this.activeEnemies === 0) {
            this.wave = Number(localStorage.getItem(`${this.engine.currentScene.id}`));
            if (this.wave < this.engine.currentScene.levels.length) {
                this.engine.gulden += this.wave * 100;
                this.engine.currentScene.guldenDisplay.text = `${this.engine.gulden}`;
                this.waveItem = 0;
                this.parse(Number(localStorage.getItem(`${this.engine.currentScene.id}`)));
                this.running = true;
                this.wave += 1;
                console.log(this.wave)
                localStorage.setItem(`${this.engine.currentScene.id}`, `${this.wave}`);
                this.engine.currentScene.waveText.text = `${localStorage.getItem(`${this.engine.currentScene.id}`)}/${this.engine.currentScene.levels.length}`;

            }
        }
        else {
            console.log("Already Running");
        }
    }

    buyTower(id) {
        if (id === 1 && this.engine.gulden >= 200) {
            this.engine.gulden -= 200;
        }
        if (id === 2 && this.engine.gulden >= 300) {
            this.engine.gulden -= 300;
        }
        if (id === 3 && this.engine.gulden >= 650) {
            this.engine.gulden -= 650;
        }

        if (id === 1) {
            this.int = 0;
        }
        if (id === 2) {
            this.int = 1;
        }
        if (id === 3) {
            this.int = 2;
        }
        this.placing = !this.placing;
        this.drawBuyMenu();
        if (this.placing) {
            this.walls.forEach(wall => {
                this.add(wall);
            });
            const circle = Shape.Circle(50);
            this.placingSprite.collider.set(circle);
            this.placingSprite.collisionType = CollisionType.Passive;
            this.placingSprite._setName('this.placingSprite');
            this.add(this.placingSprite);
        } else {
            this.walls.forEach(wall => {
                wall.kill();
            });
            this.placingSprite.kill();
        }
    }


    onPreUpdate(engine, delta) {
        this.guldenDisplay.text = `${this.engine.gulden}`;
        this.levensDisplay.text = `${this.engine.levens}`;

        if (this.deathParticles.isEmitting) {
            if (this.particleCounter > 20) {
                this.particleCounter = 0;
                this.deathParticles.isEmitting = false;
                this.deathParticles.kill();
            }
            this.particleCounter++;
        }
        if (this.impactParticle.isEmitting) {
            if (this.impactParticleCounter > 5) {
                this.impactParticleCounter = 0;
                this.impactParticle.isEmitting = false;
                this.impactParticle.kill();
            }
            this.impactParticleCounter++;
        }
        if (engine.input.keyboard.isHeld(Input.Keys.R)) {
            if (this.activetower.type === 3) {
                this.activetower.shootLaser();
            }
        }

        if (engine.input.keyboard.wasPressed(Input.Keys.Esc || Input.Keys.Escape)) {
            this.goToSettings();
        }
        this.placingSprite.checkSelf(this.int, this.isLegal);
        if (this.engine.input.keyboard.wasPressed(Input.Keys.B)) {
            this.placing = !this.placing;
            if (this.placing) {
                this.walls.forEach(wall => {
                    this.add(wall);
                });
                const circle = Shape.Circle(50);
                this.placingSprite.collider.set(circle);
                this.placingSprite.collisionType = CollisionType.Passive;
                this.placingSprite._setName('this.placingSprite');
                this.add(this.placingSprite);
            } else {
                this.walls.forEach(wall => {
                    wall.kill();
                });
                this.placingSprite.kill();
            }
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.O)) {
            this.activetower.updateRange(this.activetower.range -= 50);
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.Y)) {
            this.engine.gulden += 50;
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.U)) {
            this.engine.gulden -= 50;
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.Enter)) {
            this.startWave();
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.P)) {
            this.activetower.updateRange(this.activetower.range += 50);
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.T)) {
            this.towers.splice(this.towers.indexOf(this.activetower), 1);
            this.engine.gulden += 50;
            this.activetower.kill();
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.K)) {

            this.activetower.tier = this.activetower.tierList[(this.activetower.tierList.indexOf(this.activetower.tier, 0) - 1)];
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.H)) {
            this.mapping = !this.wave.mapping;
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.N)) {
            this.int += 1;
            if (this.int > 3) {
                this.int = 0;
            }
        }
        if (this.placing) {
            this.placingSprite.pos = this.engine.input.pointers.primary.lastWorldPos;
        }
        if (this.running) {
            if (this.waveItem <= this.order.length - 1) {
                if (this.spiderSpawner === 1) {
                    let enemy = new Enemy(this);
                    enemy.setType(this.order[this.waveItem]);
                    this.add(enemy);
                    this.waveItem += 1;
                    this.activeEnemies += 1;
                    this.engine.currentScene.activeEnemyObjects.push(enemy);
                }
                if (this.endlessMode && this.waveItem === this.order.length) {
                    this.levels = [`${Math.round(Math.random() * (10 - 1) + 1)}*${Math.round(Math.random() * (4 - 0) + 0)}`];
                    this.parse(this.wave);
                }
                this.spiderSpawner++;
                if (this.spiderSpawner > Math.random() * (100 - 25) + 25) {
                    this.spiderSpawner = 0;
                    this.spiderSpawner = 0;
                }
            } else {
            }

        }
    }
}
