import {Actor, Color, EmitterType, ParticleEmitter, RotationType, Shape, Timer, Vector} from "excalibur";

import {Resources} from "../resources.js";
import {PanBami} from "./panBami.js";
import {CurseWord} from "./curseword.js";
import {Web} from "./web.js";
import {Laser} from "./laser.js";


let itemIds = [
    Resources.Pan, Resources.TinyLau, Resources.SpiderMeneer, Resources.aboutaleb,
];


export class Tower extends Actor {
    tier = 0;
    tierList = [0, 1.1, 1.2, 2.1, 2.2];
    descriptionList = [];
    costList = [];
    type = 0;
    shootingCooldown = 0;
    amountOfEnemies;
    enemy;
    enemiesInRadiusName = [];
    enemiesInRadiusTime = [];
    enemiesDistance = [];
    coolDown = 0;
    damage = 1;
    shootingMode = 0;
    upgradeButton;
    selected

    rangeDisplay;
    worldPosition;
    randomizerCooldown = 0;
    engine;
    upgrade = Resources.Upgrade;
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
    timer = new Timer({
        fcn: () => this.removeParticles(),
        repeats: false,
        interval: 200,
    });

    towerRange = 0;
    description = "";
    game;
    curseCooldown = 250;
    damageMultiplier = 1;
    seeMouses = false;
    whoosh = Resources.Whoosh;
    Bami = Resources.Bamigeluid;

    constructor(Game, type) {
        super({
            width: 50, height: 50
        });
        this.type = type;
        this.game = Game;

    }

    onInitialize(engine) {
        this.engine = engine;
        this.rangeDisplay = new Actor();
        this.rangeDisplay.graphics.use(Resources.Range.toSprite());
        this.rangeDisplay.pos = new Vector(0, 0);

        if (this.type === 0) {
            this._setName("Pan Bami");
            this.description = ("Gooit een pan bami\nnaar ongedierte. \n\nHet liefst uit het\nraam naar beneden.");
            this.towerRange = 200;
            this.shootingMode = 0
            this.descriptionList = ["Sneller schieten", "Meer schade", "Pittige bami", "Grotere pan"]
            this.costList = ["200", "600", "350", "750"]
        }
        if (this.type === 1) {
            this._setName("Tiny & Lau");
            this.towerRange = 100;
            this.description = ("Scheld naar andere.\n\nVersterkt anderen of\npijnigt de vijand");
            this.descriptionList = ["Scheld meer", "Scheld sneller", "Beïnvloed meer", "Beïnvloede zien muizen"]
            this.costList = ["400", "800", "375", "1000"]
        }
        if (this.type === 2) {
            this._setName("Spinnenman");
            this.towerRange = 300;
            this.description = ("Kookt lekker eten.\n\nMaar schiet ook\nwebben naar vijanden");
            this.shootingMode = 3
            this.descriptionList = ["Schiet 3 webben", "Schiet 5 webben", "Meer schade", "Spinnen ontploffen!"]
            this.costList = ["275", "475", "400", "700"]
        }
        if (this.type === 3) {
            this._setName("Aboutaleb");
            this.towerRange = 9999;
            this.description = ("Leuke burgemeester.\nPas op want hij ziet\n alles en iedereen.");
            this.shootingMode = 3
            this.descriptionList = ["Meer schade", "Nog meer schade en kan\nongedierte verlammen", "Schoten kunnen splitsen", "Kans op splitsen verhogen"]
            this.costList = ["800", "2000", "950", "1200"]

        }

        this.coolDown = 100;
        this.engine = engine;
        this.anchor = new Vector(0.5, 0.5);
        this.scale = new Vector(1, 1);
        this.range = this.towerRange;
        this.rangeDisplay.scale = new Vector(this.towerRange / 24, this.towerRange / 24);
        this.z = 100;
        const circle = Shape.Circle(this.towerRange);
        this.collider.clear();
        this.collider.set(circle);
        this.on('precollision', (event) => {
            if (event.other.name === "Enemy" || event.other.name === "Pan Bami" || event.other.name === "Tiny & Lau" || event.other.name === "Spiderman") {
                this.collisionHandler(event);
            }
        });

        this.worldPosition = new Vector(this.pos.x, this.pos.y);
    }

    select() {
        // this.game.activeTower(this);
        this.selected = true
        if (this.children < 1) {
            this.addChild(this.rangeDisplay);
        }
    }

    deSelect() {
        this.selected = false
        this.rangeDisplay.unparent();
        this.rangeDisplay.kill();
    }

    collisionHandler(event) {
        if (this.type === 0) {
            if (this.seeMouses === true) {
                if (event.other.name === "Enemy") {
                    this.amountOfEnemies++;
                    this.enemiesInRadiusName.push(event);
                    this.enemiesInRadiusTime.push(event.other.timeAlive);
                }
            } else {
                if (event.other.name === "Enemy" && event.other.enemyType !== 1) {
                    this.amountOfEnemies++;
                    this.enemiesInRadiusName.push(event);
                    this.enemiesInRadiusTime.push(event.other.timeAlive);
                }
            }
        }

        if (this.type === 1) {
            if (event.other.name === "Enemy" || event.other.name === "Pan Bami" || event.other.name === "Spiderman") {
                this.amountOfEnemies++;
                this.enemiesInRadiusName.push(event);
            }
        }
        if (this.type === 2) {
            if (event.other.name === "Enemy") {
                this.amountOfEnemies++;
                this.enemiesInRadiusName.push(event);
                this.enemiesInRadiusTime.push(event.other.timeAlive);
            }
        }
    }

    checkSelf(sprite) {
        if (this.game.isLegal === true) {
            this.sprite = itemIds[sprite].toSprite();
            this.graphics.use(itemIds[sprite].toSprite());
        } else {
            let tint = itemIds[sprite].toSprite();
            tint.tint = new Color(100, 0, 0);
            this.sprite = tint;
            this.graphics.use(tint);
        }
    }

    onPreUpdate(engine, _delta) {
        if (this.amountOfEnemies > 0) {
            this.onCollision();
        }
        this.amountOfEnemies = 0;


        if (this.type === 0 || this.type === 2) {
            if (this.shootingMode === 0) {
                let oldestEnemy = Math.max(...this.enemiesInRadiusTime);
                this.enemy = this.enemiesInRadiusName[this.enemiesInRadiusTime.indexOf(oldestEnemy, 0)];
            }
            if (this.shootingMode === 1) {
                let youngestEnemy = Math.min(...this.enemiesInRadiusTime);
                this.enemy = this.enemiesInRadiusName[this.enemiesInRadiusTime.indexOf(youngestEnemy, 0)];
            }
            if (this.shootingMode === 2) {
                this.enemy = this.enemiesInRadiusName[Math.floor(Math.random() * Math.length)];
            }
            if (this.shootingMode === 3) {

                for (let i = 0; i < this.enemiesInRadiusName.length; i++) {
                    let pos1 = new Vector(this.pos.x, this.pos.y,);
                    let pos2 = new Vector(this.enemiesInRadiusName[i].other.pos.x, this.enemiesInRadiusName[i].other.pos.y);

                    let distance = pos1.distance(pos2);

                    this.enemiesDistance.push(distance);

                }

                let nearestEnemy = Math.min(...this.enemiesDistance);
                let nearestEnemyName = this.enemiesInRadiusName[this.enemiesDistance.indexOf(nearestEnemy, 0)];


                this.enemiesDistance = [];

                this.enemy = nearestEnemyName;
            }

        }
        if (this.type === 1) {
            if (this.randomizerCooldown === 1) {
                let towers = [];
                this.enemiesInRadiusName.forEach(enemy => {

                    if (enemy.other instanceof Tower) {
                        towers.push(enemy);

                    }
                });
                if (towers.length > 0) {
                    this.enemy = towers[Math.floor(Math.random() * this.enemiesInRadiusName.length)];
                } else {
                    this.enemy = this.enemiesInRadiusName[Math.floor(Math.random() * this.enemiesInRadiusName.length)];
                }
                towers = [];
                this.actions.clearActions();
                this.shootingCooldown = this.coolDown - 50;
            }

        }
        this.enemiesInRadiusName = [];
        this.enemiesInRadiusTime = [];


        if (this.randomizerCooldown > this.curseCooldown) {
            this.randomizerCooldown = 0;
        }
        this.randomizerCooldown++;

        if (this.buffCooldown > 1) {
            this.buffCooldown--;
        }
        if (this.buffCooldown === 1) {
            this.deBuff();
        }
    }

    onCollision() {
        if (this.enemy !== undefined) {
            let distance = new Vector(this.enemy.other.pos.x - this.pos.x, this.enemy.other.pos.y - this.pos.y);

            let angle = Math.sqrt((distance.x * distance.x) + (distance.y * distance.y));
            if (distance.x < 0) {
            }
            angle = Math.asin(distance.y / angle);

            if (!isNaN(angle)) {
                if (distance.x < 0) {
                    angle = Math.abs(angle) + Math.PI;
                }
                if (distance.x < 0 && distance.y > 0) {

                    angle = -Math.abs(angle);
                }

                if (this.type === 0) {
                    this.actions.rotateTo(angle + 0.5 * Math.PI, 1000, RotationType.ShortestPath);
                }
                if (this.type === 1) {
                    this.actions.rotateTo(angle + 0.5 * Math.PI, 30, RotationType.ShortestPath);
                }
                if (this.type === 2) {
                    this.actions.rotateTo(angle + 0.5 * Math.PI, 1000, RotationType.ShortestPath);
                }

            }

            this.inRange();
        }
    }

    updateRange(newRange) {
        const circle = Shape.Circle(newRange);
        this.rangeDisplay.scale = new Vector(newRange / 24, newRange / 24);
        this.collider.clear();
        this.collider.set(circle);

    }

    fire() {
        if (this.type === 0) {
            // default
            if (this.tier === 0) {
                this.whoosh.play(0.5);
                let bullet = new PanBami(1000, this.damage * this.damageMultiplier, 0, 1);
                bullet.pos = this.pos;
                bullet.rotation = this.rotation - Math.PI / 2;
                this.engine.add(bullet);
                this.coolDown = 25;
            }

            // pad 1
            if (this.tier === 1.1) {
                this.whoosh.play(0.5);
                let bullet = new PanBami(1700, this.damage * this.damageMultiplier * 1.3, 0, 1);
                bullet.pos = this.pos;
                bullet.rotation = this.rotation - Math.PI / 2;
                this.engine.add(bullet);
                this.coolDown = 25;
            }
            if (this.tier === 1.2) {
                this.whoosh.play();
                let bullet = new PanBami(2000, this.damage * this.damageMultiplier * 1.5, 0, 1);
                bullet.pos = this.pos;
                bullet.rotation = this.rotation - Math.PI / 2;
                this.engine.add(bullet);
                this.coolDown = 20;
            }

            // pad 2
            if (this.tier === 2.1) {
                this.whoosh.play();
                let bullet = new PanBami(1000, this.damage * this.damageMultiplier, 1, 1);
                bullet.pos = this.pos;
                bullet.rotation = this.rotation - Math.PI / 2;
                this.engine.add(bullet);
                this.coolDown = 25;
            }
            if (this.tier === 2.2) {
                this.Bami.play();
                let bullet = new PanBami(1000, this.damage * this.damageMultiplier, 2, 5);
                bullet.pos = this.pos;
                bullet.rotation = this.rotation - Math.PI / 2;
                this.engine.add(bullet);
                this.coolDown = 25;
                this.engine.shake();
            }
        }
        if (this.type === 1) {
            // default
            if (this.tier === 0 && this.enemy !== undefined) {
                let curse = new CurseWord(250, 1, 0, this.enemy);
                curse.pos = this.pos;
                curse.rotation = this.rotation - Math.PI / 2;
                this.engine.add(curse);
                this.coolDown = 250;
                this.curseCooldown = 200;
                this.updateRange(100);
            }
            if (this.tier === 1.1 && this.enemy !== undefined) {
                let curse = new CurseWord(300, 1, 0, this.enemy);
                curse.pos = this.pos;
                curse.rotation = this.rotation - Math.PI / 2;
                this.engine.add(curse);
                this.coolDown = 250;
                this.curseCooldown = 150;
                this.updateRange(100);
            }
            if (this.tier === 1.2 && this.enemy !== undefined) {
                let curse = new CurseWord(300, 1, 1, this.enemy);
                curse.pos = this.pos;
                curse.rotation = this.rotation - Math.PI / 2;
                this.engine.add(curse);
                this.coolDown = 250;
                this.curseCooldown = 150;
                this.updateRange(100);

            }
            if (this.tier === 2.1 && this.enemy !== undefined) {
                let curse = new CurseWord(250, 1, 0, this.enemy);
                curse.pos = this.pos;
                curse.rotation = this.rotation - Math.PI / 2;
                this.engine.add(curse);
                this.coolDown = 250;
                this.curseCooldown = 200;
                this.updateRange(300);
            }
            if (this.tier === 2.2 && this.enemy !== undefined) {
                let curse = new CurseWord(250, 1, 2, this.enemy);
                curse.pos = this.pos;
                curse.rotation = this.rotation - Math.PI / 2;
                this.engine.add(curse);
                this.coolDown = 250;
                this.curseCooldown = 200;
                this.updateRange(300);
            }


        }

        if (this.type === 2) {
            // default
            if (this.tier === 0) {
                let bullet = new Web(1000, 0.75 * this.damageMultiplier, 0, 1);
                bullet.pos = this.pos;
                bullet.rotation = this.rotation - Math.PI / 2;
                this.engine.add(bullet);
                this.coolDown = 20;
            }
            if (this.tier === 1.1) {
                let bullet = new Web(1000, 0.5 * this.damageMultiplier, 0, 1);
                bullet.pos = this.pos;
                bullet.rotation = this.rotation - Math.PI / 2;
                this.engine.add(bullet);
                let bullet1 = new Web(1000, 0.5 * this.damageMultiplier, 0, 1);
                bullet1.pos = this.pos;
                bullet1.rotation = this.rotation - 1.3;
                this.engine.add(bullet1);
                let bullet2 = new Web(1000, 0.5 * this.damageMultiplier, 0, 1);
                bullet2.pos = this.pos;
                bullet2.rotation = this.rotation - 1.8;
                this.engine.add(bullet2);
                this.coolDown = 20;
            }
            if (this.tier === 1.2) {
                let bullet = new Web(1000, 0.25 * this.damageMultiplier, 0, 1);
                bullet.pos = this.pos;
                bullet.rotation = this.rotation - Math.PI / 2;
                this.engine.add(bullet);
                let bullet1 = new Web(1000, 0.25 * this.damageMultiplier, 0, 1);
                bullet1.pos = this.pos;
                bullet1.rotation = this.rotation - 1.3;
                this.engine.add(bullet1);
                let bullet2 = new Web(1000, 0.25 * this.damageMultiplier, 0, 1);
                bullet2.pos = this.pos;
                bullet2.rotation = this.rotation - 1.8;
                this.engine.add(bullet2);
                let bullet3 = new Web(1000, 0.25 * this.damageMultiplier, 0, 1);
                bullet3.pos = this.pos;
                bullet3.rotation = this.rotation - 1.45;
                this.engine.add(bullet3);
                let bullet4 = new Web(1000, 0.25 * this.damageMultiplier, 0, 1);
                bullet4.pos = this.pos;
                bullet4.rotation = this.rotation - 1.65;
                this.engine.add(bullet4);

                this.coolDown = 20;
            }
            if (this.tier === 2.1) {
                let bullet = new Web(1500, 0.5 * this.damageMultiplier, 3, 1);
                bullet.pos = this.pos;
                bullet.rotation = this.rotation - Math.PI / 2;
                this.engine.add(bullet);
                this.coolDown = 15;
            }
            if (this.tier === 2.2) {
                let bullet = new Web(1500, 0.5 * this.damageMultiplier, 4, 1);
                bullet.pos = this.pos;
                bullet.rotation = this.rotation - Math.PI / 2;
                this.engine.add(bullet);
                this.coolDown = 15;
            }


        }
    }

    shootLaser() {
        let bullet = new Laser(1500, 0.5 * this.damageMultiplier, 4, 1);
        bullet.pos = this.pos;
        bullet.rotation = this.rotation - Math.PI / 2;
        this.engine.add(bullet);
        this.coolDown = 15;
    }

    inRange() {
        if (this.shootingCooldown === 1) {
            this.fire();
        }
        if (this.shootingCooldown > this.coolDown) {
            this.shootingCooldown = 0;
        }
        this.shootingCooldown++;

    }

    buff(type) {
        let tint = itemIds[this.type].toSprite();
        tint.tint = new Color(0, 255, 0);
        this.graphics.use(tint);
        this.buffCooldown = 500;
        if (type === 1) {
            this.damageMultiplier = 2;
        }
        if (type === 2) {
            this.seeMouses = true;
        }
    }

    deBuff() {
        this.graphics.use(itemIds[this.type].toSprite());

        this.damageMultiplier = 1;
        this.seeMouses = false;
    }

    onPostUpdate(_engine, _delta) {
        if (this.selected === true) {
            console.log(this.tier)
            this.engine.currentScene.towerRange.text = this.range.toString() + "cm";
            this.engine.currentScene.towerDamage.text = `${this.damage * this.damageMultiplier}`;
            this.engine.currentScene.towerTargeting.text = this.shootingMode.toString();


            if (this.engine.currentScene.upgradeButton !== undefined) {
                if (this.tier === 0) {
                    this.engine.currentScene.upgradeButton.graphics.use(Resources.UpgradeButtonPath1.toSprite());
                    this.engine.currentScene.upgradeButton2.graphics.use(Resources.UpgradeButtonPath2.toSprite());

                    this.engine.currentScene.upgradeDesc1.text = this.descriptionList[0]
                    this.engine.currentScene.upgradeDesc2.text = this.descriptionList[2]

                    this.engine.currentScene.coinDesc1.text = this.costList[0]
                    this.engine.currentScene.coinDesc2.text = this.costList[2]

                    this.engine.currentScene.coin1.graphics.opacity = 1
                    this.engine.currentScene.coin2.graphics.opacity = 1

                }
                if (this.tier === 1.1) {
                    this.engine.currentScene.upgradeButton.graphics.use(Resources.UpgradeButton.toSprite());
                    this.engine.currentScene.upgradeButton2.graphics.use(Resources.upgradeLock.toSprite());

                    this.engine.currentScene.upgradeDesc1.text = this.descriptionList[1]
                    this.engine.currentScene.upgradeDesc2.text = "Pad onbruikbaar"

                    this.engine.currentScene.coinDesc1.text = this.costList[1]
                    this.engine.currentScene.coinDesc2.text = " "

                    this.engine.currentScene.coin1.graphics.opacity = 1
                    this.engine.currentScene.coin2.graphics.opacity = 0


                }
                if (this.tier === 1.2) {
                    this.engine.currentScene.upgradeButton.graphics.use(Resources.upgradeLock.toSprite());
                    this.engine.currentScene.upgradeButton2.graphics.use(Resources.upgradeLock.toSprite());

                    this.engine.currentScene.upgradeDesc1.text = "Max Upgrades!"
                    this.engine.currentScene.upgradeDesc2.text = "Pad onbruikbaar"

                    this.engine.currentScene.coinDesc1.text = " "
                    this.engine.currentScene.coinDesc2.text = " "

                    this.engine.currentScene.coin1.graphics.opacity = 0
                    this.engine.currentScene.coin2.graphics.opacity = 0


                }

                if (this.tier === 2.1) {
                    this.engine.currentScene.upgradeButton.graphics.use(Resources.upgradeLock.toSprite());
                    this.engine.currentScene.upgradeButton2.graphics.use(Resources.UpgradeButton.toSprite());

                    this.engine.currentScene.upgradeDesc1.text = "Pad onbruikbaar"
                    this.engine.currentScene.upgradeDesc2.text = this.descriptionList[3]

                    this.engine.currentScene.coinDesc1.text = " "
                    this.engine.currentScene.coinDesc2.text = this.costList[3]

                    this.engine.currentScene.coin1.graphics.opacity = 0
                    this.engine.currentScene.coin2.graphics.opacity = 1

                }
                if (this.tier === 2.2) {
                    this.engine.currentScene.upgradeButton.graphics.use(Resources.upgradeLock.toSprite());
                    this.engine.currentScene.upgradeButton2.graphics.use(Resources.upgradeLock.toSprite());

                    this.engine.currentScene.upgradeDesc1.text = "Pad onbruikbaar"
                    this.engine.currentScene.upgradeDesc2.text = "Max upgrades!"

                    this.engine.currentScene.coinDesc1.text = " "
                    this.engine.currentScene.coinDesc2.text = " "

                    this.engine.currentScene.coin1.graphics.opacity = 0
                    this.engine.currentScene.coin2.graphics.opacity = 0


                }
            }
        }
    }

    tierUp(pad) {
        if (pad === 1 && this.tier === 1.1) {
            if (this.engine.gulden >= Number(this.costList[1])) {
                this.engine.gulden -= Number(this.costList[1]);
                this.tier = 1.2
                this.tierUpSucces()
            }
        }
        if (pad === 1 && this.tier === 0) {
            if (this.engine.gulden >= Number(this.costList[0])) {
                this.engine.gulden -= Number(this.costList[0]);
                this.tier = 1.1
                this.tierUpSucces()
            }
        }
        if (pad === 2 && this.tier === 2.1) {
            if (this.engine.gulden >= Number(this.costList[3])) {
                this.engine.gulden -= Number(this.costList[3]);
                this.tier = 2.2
                this.tierUpSucces()
            }
        }
        if (pad === 2 && this.tier === 0) {
            if (this.engine.gulden >= Number(this.costList[2])) {
                this.engine.gulden -= Number(this.costList[2]);
                this.tier = 2.1
                this.tierUpSucces()
            }
        }

    }

    tierUpSucces() {
        this.game.add(this.upgradeParticles);
        this.upgradeParticles.isEmitting = true;
        this.upgrade.play();
        this.upgradeParticles.pos = this.pos;
        this.game.add(this.timer);
        this.timer.start();
    }

    removeParticles() {
        this.upgradeParticles.isEmitting = false;
        this.upgradeParticles.kill();
    }
}