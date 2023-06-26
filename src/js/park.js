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

import {Settings} from "./settings.js";

export class Park extends Scene {
    constructor() {
        super();
    }

    placing = false;
    placingSprite;
    int = 0;
    activetower;
    path = "";
    engine;
    route = [];
    towers = [];
    crunch = Resources.Crunch;
    upgradeParticles = new ParticleEmitter({
        emitterType: EmitterType.Rectangle,
        radius: 2,
        minVel: 100,
        maxVel: 200,
        minAngle: 0,
        maxAngle: Math.PI * 2,
        emitRate:300,
        opacity: 1,
        fadeFlag: true,
        particleLife: 1000,
        maxSize: 3,
        minSize: 1,
        beginColor: Color.Green,
        endColor: Color.Green,
        isEmitting: false
    })
    timer = new Timer({
        fcn: () => this.removeParticles(),
        repeats: false,
        interval: 200,
    })
    towersInDistance = [];
    mapping = false;
    running = false;
    //Volgorde waarin de mobs spawnen, de syntax is: [Aantal Enemies] * [Type Enemy], [...]*[...]
    //Enemies: 0: Spider, 1: Mouse, 2: Rat, 3: Raccoon, 4: Snail
    levels = [
        "5*0",
        "5*0, 6*1",
    ];
    wave = 0;
    waveItem = 0;
    activeWave;
    order = [];
    walls = [];
    nearestTowerName;
    garden = new Actor({width: 100, height: 100});
    gardenSprites = [Resources.Garden, Resources.Garden4, Resources.Garden3, Resources.Garden2, Resources.Garden1, Resources.Garden1]
    music = Resources.ParkMusic;
    plop = Resources.Plop;
    click = Resources.Click;
    spiderSpawner = 0;
    isLegal = true;
    string = "";
    endlessMode = false;
    activeEnemies = 0;
    nameLabel;
    settingsButton;

    onActivate(_context) {
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
        this.add(this.garden)
        this.garden.z = 9999;
        this.garden.pos = new Vector(163, 755);
        this.garden.collisionType = CollisionType.Passive;

        this.garden.on("collisionstart", (event) => {
            if (event.other instanceof Enemy) {
                this.engine.damage();
                this.crunch.play();
                this.garden.graphics.use(this.gardenSprites[Math.ceil(this.engine.levens / 4)].toSprite())
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


        this.enemies();
        this.buyMenu = new Actor();
        this.buyMenu.graphics.use(Resources.BuyMenu.toSprite());
        this.buyMenu.pos = new Vector(1400, 450);
        this.buyMenu.scale = new Vector(3, 1.0);
        this.buyMenu.z = 9999;
        this.buyMenu.enableCapturePointer = true;
        this.buyMenu.pointer.useGraphicsBounds = true;
        this.add(this.buyMenu);

        //buy bami tower

        this.bamiButton = new Actor();
        this.button(this.bamiButton, Resources.Pan, new Vector(1350, 200), new Vector(1.5, 1.5))
        this.bamiButton.on("pointerdown", (event) => this.buyTower(1));


        // buy tini en lau tower
        this.tinyLauButton = new Actor();
        this.button(this.tinyLauButton, Resources.TinyLau, new Vector(1350, 350), new Vector(2, 2))
        this.tinyLauButton.on("pointerdown", (event) => this.buyTower(2));

        // buy spiderTrike tower
        this.spiderTrikeButton = new Actor();
        this.button(this.spiderTrikeButton, Resources.SpiderTrike, new Vector(1350, 500), new Vector(1.5, 1.5))
        this.spiderTrikeButton.on("pointerdown", (event) => this.buyTower(3));
        this.enemies();


        this.activeWave = new Actor();
        this.button(this.activeWave, Resources.TinyLau, new Vector(130, 350), new Vector(2, 2))
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
        this.add(item);
    }

    enemies() {
        if (this.endlessMode) {
            this.levels = [`${Math.round(Math.random() * (10 - 1) + 1)}*${Math.round(Math.random() * (4 - 0) + 0)}`];
        }

        this.parse(this.wave);
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
                    tower.deSelect()
                });
                this.activetower = this.nearestTowerName;
                this.activetower.select();
                this.menuInfo();


            } else {
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
            this.timer.start()
            newClone.checkSelf(this.int);
            this.activetower = newClone;
            this.placing = false;
            this.placingSprite.kill();
            this.plop.play();
        } else if (this.mapping) {
            let pos = this.engine.input.pointers.primary.lastWorldPos;
            this.path += `,${Math.floor(pos.x).toString()}.${Math.floor(pos.y).toString()}`;
            localStorage.setItem("this.path", this.path);
            // console.log(this.path)
        } else {
            //this.string += `${Math.floor(this.engine.input.pointers.primary.lastWorldPos.x)}. ${Math.floor(this.engine.input.pointers.primary.lastWorldPos.y)},`;

        }
    }
    removeParticles() {
        this.upgradeParticles.isEmitting = false;
        this.upgradeParticles.kill();
    }
    menuInfo() {
        if (this.activetower) {

            console.log(this.activetower);
            console.log(this.activetower.id);
            console.log(this.activetower.type);
            console.log(this.activetower._name);
            console.log(this.activetower.tier);
            console.log(this.activetower.range);
            console.log(this.activetower.damage);
        }
    }

    startWave() {
        if (this.activeEnemies === 0) {
            this.waveItem = 0;
            this.parse(this.wave);
            this.running = true;
            this.wave += 1;
        } else {
            console.log("Already Running");
        }
    }

    buyTower(id) {
        if (this.engine.gulden >= 50) {
            this.engine.gulden -= 50;
            this.guldenDisplay.text = `${this.engine.gulden}`;

            if (id === 1) {
                this.int = 0;
            }
            if (id === 2) {
                this.int= 1;
            }
            if (id === 3) {
                this.int = 2;
            }

            this.placing = !this.placing;
            // console.log(this.int);
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
    }

    onPreUpdate(engine, delta) {

        if (engine.input.keyboard.wasPressed(Input.Keys.Esc || Input.Keys.Escape)) {
            this.goToSettings();
        }
        this.guldenDisplay.text = `${this.engine.gulden}`;
        this.levensDisplay.text = `${this.engine.levens}`;

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
            this.guldenDisplay.text = `${this.engine.gulden}`;
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.U)) {
            this.engine.gulden -= 50;
            this.guldenDisplay.text = `${this.engine.gulden}`;
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.Enter)) {
            this.running = !this.running;
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.P)) {
            this.activetower.updateRange(this.activetower.range += 50);
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.T)) {
            this.towers.splice(this.towers.indexOf(this.activetower), 1);
            this.engine.gulden += 50;
            this.guldenDisplay.text = `${this.engine.gulden}`;
            this.activetower.kill();
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.K)) {

            this.activetower.tier = this.activetower.tierList[(this.activetower.tierList.indexOf(this.activetower.tier, 0) - 1)];
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.L)) {
            if (this.engine.gulden >= 50) {
                this.engine.gulden -= 50;
                this.guldenDisplay.text = `${this.engine.gulden}`;
                this.activetower.tier = this.activetower.tierList[(this.activetower.tierList.indexOf(this.activetower.tier, 0) + 1)];
                this.activetower.tierUp();
            }


        }
        if (engine.input.keyboard.wasPressed(Input.Keys.H)) {
            this.mapping = !this.mapping;
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.N)) {
            this.int += 1;
            if (this.int > 2) {
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
                }
                if (this.endlessMode && this.waveItem === this.order.length) {
                    this.levels = [`${Math.round(Math.random() * (10 - 1) + 1)}*${Math.round(Math.random() * (4 - 0) + 0)}`];
                    this.parse(this.wave);
                }
                this.spiderSpawner++;
                if (this.spiderSpawner > Math.random() * (150 - 50) + 50) {
                    this.spiderSpawner = 0;
                }
            } else {

            }
        }
    }
}