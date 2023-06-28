import {
    Actor,
    Vector,
    RepeatForever,
    Repeat,
    Engine,
    Random,
    CollisionType,
    Shape,
    Circle,
    Color,
    Line,
    vec, Input, RotationType, ParticleEmitter, EmitterType, Timer
} from "excalibur";
import {Resources} from "../resources.js";
import {Web} from "../towers/web.js";

export class Enemy extends Actor {

    route = [];
    levels = [0, 1];
    routes = [
        [",1128.102,1125.141,1118.192,1114.224,1116.268,1114.318,1098.352,1068.398,1030.444,993.468,936.461,867.452,806.444,761.426,723.401,707.352,674.289,641.246,600.217,547.192,490.182,416.197,345.220,305.252,273.289,250.319,231.368,227.417,234.478,248.526,258.560,273.588,275.619,254.643,214.673,189.705,171.731,156.1083".split(","),
            ",1310. 730,1120. 545,1023. 477,924. 463,800. 442,715. 414,704. 348,662. 274,588. 212,511. 189,409. 197,372. 212,372. 256,370. 295,387. 317,436. 321,486. 312,539. 311,585. 346,607. 388,617. 435,605. 493,574. 539,540. 559,455. 576,394. 583,342. 606,290. 630,249. 659,219. 678,188. 699,170. 729,155. 758, 153.1018".split(","),
            "0. 0,1087. 745,1085. 624,1117. 556,1028. 479,926. 459,817. 444,721. 425,711. 487,680. 563,630. 619,572. 652,511. 661,431. 653,353. 629,321. 612,296. 612,283. 629,262. 647,241. 662,226. 672,203. 685,184. 702,174. 719,163. 746,162. 770,154. 1052".split(",")],
        ["133. 838, 132. 851,141. 394,178. 334,222. 309,280. 312,342. 327,384. 343,447. 370,511. 384,1013. 505,1077. 528,1098. 547,1113. 579,1116. 603,1101. 635,1089. 656,1085. 675,1085. 723,1090. 786,1090. 851,1063. 766,".split(","), "146. 45,146. 45,145. 212,174. 277,214. 301,302. 327,365. 333,414. 354,602. 404,1013. 500,1078. 537,1133. 611,1115. 665,1101. 690,1092. 724,1085. 777,1089. 829,1056. 605,".split(",")],
        ["1005. 519,287. 45,300. 255,328. 447,399. 592,502. 642,689. 687,1218. 686,1254. 653,1276. 613,1287. 212,1256. 169,1202. 158,566. 153,520. 186,501. 226,510. 609,556. 648,649. 666,862. 666,888. 661,906. 641,911. 611,907. 553,892. 474,894. 390,894. 382".split(",")],
    ];

    enemies = [
        [Resources.Spider, 4],
        [Resources.Mouse, 3],
        [Resources.Rat, 6],
        [Resources.Racoon, 10],
        [Resources.Snail, 50],

    ];
    positionInRoute;
    engine;

    game;
    timeAlive = 0;
    particle;
    speed = 100;
    health = 1;
    type = 0;
    deathAnimation;
    damageAnimation;
    nextPath
    damageOverTime = 0
    damageCooldown = 0
    worth;


    enemyType = 0;

    constructor(game) {
        super();
        this.game = game;
    }

    onInitialize(engine) {
        this.engine = engine;
        this.game = engine;

        this.anchor = new Vector(0.5, 0.5);
        this.z = 100;
        this._setName("Enemy");
        this.on('collisionstart', (event) => this.collided(event));
        this.setRoute()
    }

    setRoute() {

        this.tempRoute = this.routes[this.game.currentScene.id];

        let routeToUse = 0;

        this.tempRoute[routeToUse].forEach(item => {
            item = item.split(".");
            let newItem = new Vector(Number(item[0]), Number(item[1]));
            this.route.push(newItem);
        });
        this.route[0] = this.route[1];
        this.move(this.route);
    }

    setType(type) {
        this.type = type;
        this.enemyType = type
        this.sprite = this.enemies[type][0].toSprite();
        this.graphics.use(this.sprite);
        this.health = this.enemies[type][1];
        this.worth = this.health *3

        if (type === 0) {
            this.body.scale = new Vector(0.25, 0.25);
            this.collider.set(Shape.Box(100, 100));
            this.speed = 100;
        }
        if (type === 1) {
            this.body.scale = new Vector(0.5, 0.5);
            this.collider.set(Shape.Box(100, 50));
            this.speed = 200;
        }
        if (type === 2) {
            this.body.scale = new Vector(0.6, 0.6);
            this.collider.set(Shape.Box(125, 60));
            this.speed = 150;
        }
        if (type === 3) {
            this.body.scale = new Vector(0.5, 0.5);
            this.collider.set(Shape.Box(125, 60));
            this.speed = 50;
        }
        if (type === 4) {
            this.body.scale = new Vector(0.25, 0.25);
            this.collider.set(Shape.Box(50, 50));
            this.speed = 30;
        }

    }

    collided(event) {
        if (event.other !== null) {
            if (event.other.name === "projectile") {
                if (event.other.special === 1 || event.other.special === 2) {
                    this.damageOverTime = 1000;
                }
                if (event.other.special === 4 && this.type === 0) {
                    for (let i = 0; i < Math.ceil(Math.random() * 20); i++) {
                        let bullet = new Web(1000, 1, 4, 1);
                        bullet.pos = this.pos;
                        bullet.rotation = Math.random() * 6 - Math.PI / 2;
                        this.engine.add(bullet);
                    }
                    this.explode()
                }

                this.removeBulletHealth(event)
                this.health -= event.other.damage;
                this.damageAnimation = 50
            }
            if (event.other.name === "curse") {
                this.health -= event.other.damage;
                this.damageAnimation = 50
            }
        }
    }

    removeBulletHealth(event) {
        let bullet = event
        this.game.currentScene.impactParticleFunction(event.other.pos)
        bullet.other.health--
        if (bullet.other.speed > 100) {
            bullet.other.speed = bullet.other.speed - 100
        }
    }

    explode() {
        this.actions.clearActions();
        this.collider.clear();
        this.deathAnimation = 50;
        Resources.Smash.play(0.1);
        this.engine.gulden += this.worth
        this.game.currentScene.enemyKilled(this.pos);
    }

    move(pathToFollow) {
        let nextPath = pathToFollow.length
        //console.log(`type = ${this.type} speed = ${this.speed}, health = ${this.health}`);
        if (pathToFollow !== []) {
            this.pos = pathToFollow[0];

            for (let i = 0; i < pathToFollow.length; i++) {

                let previousPos = i + 1;
                let distance;

                if (pathToFollow[previousPos] === undefined) {
                    distance = new Vector(pathToFollow[i].x - this.pos.x, pathToFollow[i].y - this.pos.y);
                } else {
                    distance = new Vector(pathToFollow[i].x - pathToFollow[previousPos].x, pathToFollow[i].y - pathToFollow[previousPos].y);
                }

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
                    this.actions.moveTo(pathToFollow[i].x, pathToFollow[i].y, Math.random() * ((this.speed + 20) - (this.speed - 20)) + (this.speed - 20));
                    this.actions.rotateTo(angle, 1000, RotationType.ShortestPath);
                }

            }
        }
    }

    onPreUpdate(engine, delta) {
        if (this.health < 0 && this.health > -9999) {
            this.explode();
            this.health = -10000
        }

        if (this.damageOverTime > 1) {
            this.damageOverTime--
        }

        if (this.damageOverTime > 1 && this.damageCooldown === 1) {
            this.health--
            this.damageAnimation = 50
            //console.log('damage!')
        }

        if (this.damageCooldown > 100) {
            this.damageCooldown = 0
        }
        this.damageCooldown++


        if (this.deathAnimation < 0) {
            this.kill();
            this.game.currentScene.activeEnemies -= 1;
            this.game.currentScene.activeEnemyObjects.splice(this.game.currentScene.activeEnemyObjects.indexOf(this));
            if (this.engine.levens < 1) {
                this.game.currentScene.activeEnemyObjects.forEach(enemy => {
                    enemy.kill();
                })
                this.game.levens = 20;

                this.engine.goToScene('gameover');

            }

        }
        if (this.deathAnimation > 0) {
            this.graphics.opacity = (this.deathAnimation / 50);
            let graphic = this.enemies[this.type][0].toSprite();
            graphic.tint = new Color(this.deathAnimation * 5, 0, 0)
            this.graphics.use(graphic)

        }
        this.deathAnimation--;

        if (this.damageAnimation > 1 && this.health > 1) {
            let graphic = this.enemies[this.type][0].toSprite();
            graphic.tint = new Color(250 - this.damageAnimation * 5, 255, 255)
            this.graphics.use(graphic)

        }
        if (this.damageAnimation > 0) {
            this.damageAnimation--;
        }


        if (engine.input.keyboard.wasPressed(Input.Keys.Enter)) {
            this.move(this.route);

        }
        if (engine.input.keyboard.wasPressed(Input.Keys.J)) {

        }

        this.timeAlive++;

    }
}