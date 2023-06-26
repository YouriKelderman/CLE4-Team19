import {Actor, Vector, Color, Debug, Physics, Input, Axis, CollisionType, Shape, vec, Label, FontUnit, Font, TextAlign} from "excalibur";
import {Scene} from "excalibur";
import {PanBami} from "./towers/panBami.js";
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


    placing = false;
    placingSprite;
    int = 0;
    activetower = this.activetower
    path = "";
    engine;
    route = [];
    towers = [];
    towersInDistance = [];
    mapping = false;
    running = false;
    levels = [];
    waveItem = 0;
    order = [];
    walls = [];
    nearestTowerName;

    music = Resources.ParkMusic;

    click = Resources.Click;
    spiderSpawner = 0;
    isLegal = true;
    string = "";
    endlessMode = true;

    nameLabel;
    settingsButton;
    buyMenuClick = 0;
    upgradeMenuClicked = 0;
    menuOpened = 0

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

        this.buyMenu = new Actor();
        this.buyMenu.graphics.use(Resources.BuyMenu.toSprite());
        this.buyMenu.pos = new Vector(1400, 450);
        this.buyMenu.scale = new Vector(3, 1.0)
        this.buyMenu.z = 9999;
        this.buyMenu.enableCapturePointer = true;
        this.buyMenu.pointer.useGraphicsBounds = true;

        this.bamiButton = new Actor();
        this.bamiButton.graphics.use(Resources.Bami.toSprite());
        this.bamiButton.scale = new Vector(1, 1);
        this.bamiButton.z = 99999;
        this.bamiButton.enableCapturePointer = true;
        this.bamiButton.pointer.useGraphicsBounds = true;
        this.bamiButton.on("pointerup", (event) => this.buyBami());

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



        let mapFloor = new Actor();
        mapFloor.graphics.use(Resources.Map1Ground.toSprite());
        mapFloor.scale = new Vector(5.5, 5.5);
        mapFloor.pos = new Vector(745, 425);
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

        this. buyMenuButton = new Actor();
        this.buyMenuButton.graphics.use(Resources.BuyButton.toSprite());
        this.buyMenuButton.pos = new Vector(50, 195);
        this.buyMenuButton.scale = new Vector(0.7, 0.7);
        this.buyMenuButton.z = 9999;
        this.buyMenuButton.enableCapturePointer = true;
        this.buyMenuButton.pointer.useGraphicsBounds = true;
        this.buyMenuButton.on("pointerup", (event) => this.drawBuyMenu());
        this.add(this.buyMenuButton);


        //sidebutton


        this.enemies()


        // buy tini en lau tower
        this.tinyLauButton = new Actor();
        this.tinyLauButton.graphics.use(Resources.TinyLau.toSprite());

        this.tinyLauButton.scale = new Vector(2, 2);
        this.tinyLauButton.z = 99999;
        this.tinyLauButton.enableCapturePointer = true;
        this.tinyLauButton.pointer.useGraphicsBounds = true;
        this.tinyLauButton.on("pointerdown", (event) => this.buyTower());

        // buy spiderTrike tower
        this.spiderTrikeButton = new Actor();
        this.spiderTrikeButton.graphics.use(Resources.SpiderTrike.toSprite());
        this.spiderTrikeButton.scale = new Vector(1.5, 1.5);
        this.spiderTrikeButton.z = 99999;
        this.spiderTrikeButton.enableCapturePointer = true;
        this.spiderTrikeButton.pointer.useGraphicsBounds = true;
        this.spiderTrikeButton.on("pointerdown", (event) => this.buyTower());


        this.enemies();

    }

    enemies() {
        if (this.endlessMode) {
            this.levels = [`${Math.round(Math.random() * (10 - 1) + 1)}*${Math.round(Math.random() * (4 - 0) + 0)}`];
        } else {
            this.levels = ["100*4, 2*1, 2*2, 2*1, 2*2, 2*1, 2*2, 2*1, 2*2, 2*1, 2*2, 2*1, 2*2, 100*0, 10*1, 10*0, 2000*1"];
        }

        console.log(this.levels);

        this.parse();
    }

    parse() {
        let parsedResult = this.levels[0].split(",");
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
            this.buyMenu.actions.moveTo(1400, 450,1100);

            this.bamiButton.pos = new Vector(1500, 450);
            this.bamiButton.actions.moveTo(1350, 450,1300);
            this.add(this.buyMenu);
            this.add(this.bamiButton);

            this.tinyLauButton.pos = new Vector(1500, 350);
            this.tinyLauButton.actions.moveTo(1350, 350,1300);
            this.add(this.tinyLauButton);

            this.spiderTrikeButton.pos = new Vector(1500, 250);
            this.spiderTrikeButton.actions.moveTo(1350, 250,1300);
            this.add(this.spiderTrikeButton);
        }
        if (this.buyMenuClick === 2) {
            this.buyMenu.pos = new Vector(1500, 450);
            this.buyMenu.actions.moveTo(1400, 450,800);
            this.buyMenu.kill()

            this.bamiButton.pos = new Vector(1350, 450);
            this.bamiButton.actions.moveTo(1500, 450,1300);
            this.bamiButton.kill()
            this.tinyLauButton.pos = new Vector(1350, 350);
            this.tinyLauButton.actions.moveTo(1500, 350,1300);
            this.tinyLauButton.kill()
            this.spiderTrikeButton.pos = new Vector(1350, 250);
            this.spiderTrikeButton.actions.moveTo(1500, 250,1300);
            this.spiderTrikeButton.kill()





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

            console.log(this.towersInDistance)


            if (nearestTower < 100) {

                this.towers.forEach(tower => {
                    tower.deSelect();
                });



                this.activetower = this.nearestTowerName;
                this.activetower.select();
                this.menuInfo();

            } else {

                if (this.upgradeMenu) {
                    this.upgradeMenu.actions.moveTo(1600, 450, 1000);
                    this.upgradeMenu.kill()

                }

                this.towers.forEach(tower => {
                    tower.deSelect();

                });
            }
            this.towersInDistance = [];


        }


        if (this.placing && this.isLegal) {
            let newClone = new PanBami(this, this.int);
            newClone.pos = this.placingSprite.pos;
            this.add(newClone);
            this.towers.push(newClone);
            newClone.checkSelf(this.int);
            this.activetower = newClone;
            this.placing = false;
            this.placingSprite.kill();
            this.drawBuyMenu();
        } else if (this.mapping) {
            let pos = this.engine.input.pointers.primary.lastWorldPos;
            this.path += `,${Math.floor(pos.x).toString()}.${Math.floor(pos.y).toString()}`;
            localStorage.setItem("this.path", this.path);
            // console.log(this.path)
        } else {
            this.string += `${Math.floor(this.engine.input.pointers.primary.lastWorldPos.x)}. ${Math.floor(this.engine.input.pointers.primary.lastWorldPos.y)},`;
            console.log(this.string);
        }
    }

    menuInfo() {

            if (this.upgradeMenu) {
                this.upgradeMenu.actions.moveTo(1600, 450, 1000);
                this.upgradeMenu.kill()
            }
                this.upgradeMenu = new UpgradeMenu();
                this.pos = new Vector(1600, 450);
                this.upgradeMenu.actions.moveTo(1400, 450, 1000);
                this.add(this.upgradeMenu);

                if (this.nameLabel && this.activetower) {
                    this.nameLabel.text = this.activetower.name.toString();

                    console.log(this.activetower);
                    console.log(this.activetower.id);
                    console.log(this.activetower._name);
                    console.log(this.activetower.tier);
                    console.log(this.activetower.range);
                    console.log(this.activetower.damage);
                }
    }



    buyTower() {
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
        if (engine.input.keyboard.wasPressed(Input.Keys.Enter)) {
            this.running = !this.running;
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.P)) {
            this.activetower.updateRange(this.activetower.range += 50);

        }
        if (engine.input.keyboard.wasPressed(Input.Keys.T)) {
            this.towers.splice(this.towers.indexOf(this.activetower), 1);
            this.activetower.kill();


        }
        if (engine.input.keyboard.wasPressed(Input.Keys.K)) {
            this.activetower.tier = this.activetower.tierList[(this.activetower.tierList.indexOf(this.activetower.tier, 0) - 1)];
            console.log(this.activetower.tier);
        }
        if (engine.input.keyboard.wasPressed(Input.Keys.L)) {
            this.activetower.tier = this.activetower.tierList[(this.activetower.tierList.indexOf(this.activetower.tier, 0) + 1)];
            console.log(this.activetower.tier);

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
        if (this.waveItem <= this.order.length - 1) {
            if (this.spiderSpawner === 1 && this.running) {
                let enemy = new Enemy(this);
                enemy.setType(this.order[this.waveItem]);
                this.add(enemy);
                this.waveItem += 1;
            }
            if (this.endlessMode && this.waveItem === this.order.length) {
                this.levels = [`${Math.round(Math.random() * (10 - 1) + 1)}*${Math.round(Math.random() * (4 - 0) + 0)}`];
                this.parse();
            }
            this.spiderSpawner++;
            if (this.spiderSpawner > Math.random() * (150 - 50) + 50) {
                this.spiderSpawner = 0;
            }
        }
    }
}
