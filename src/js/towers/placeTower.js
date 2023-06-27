import {Actor, Vector, Engine, Random, CollisionType, Shape, Circle, Color, Line} from "excalibur";
import {Resources} from "../resources.js";
import {Tower} from "./tower.js";


export class PlaceTower extends Tower {
    game
    range;
    type
    rangeDisplay;
    itemIds = [
        Resources.Pan, Resources.TinyLau, Resources.SpiderMeneer, Resources.aboutaleb
    ]

    constructor(type) {
        super()
        this.type = type;
    }


    onInitialize(engine) {
        this.game = engine;
        this.scale = new Vector(1, 1);
        console.log(this.towerRange)
        this.rangeDisplay = new Actor();
        this.rangeDisplay.graphics.use(Resources.Range.toSprite());
        this.rangeDisplay.pos = new Vector(0, 0);
        if (this.type === 0) {
            this.towerRange = 200;
        }
        if (this.type === 1) {
            this.towerRange = 100;
        }
        if (this.type === 2) {
            this.towerRange = 300;
        }

        if (this.type === 3) {
            this.towerRange = 300;

        }
        this.range = this.towerRange;
        this.rangeDisplay.scale = new Vector(this.towerRange / 24, this.towerRange / 24);
        this.game.currentScene.add(this.rangeDisplay)
    }

    checkSelf(sprite, legal) {
        if (legal === true) {
            this.sprite = this.itemIds[sprite].toSprite();
            this.graphics.use(this.itemIds[sprite].toSprite());
        } else {
            let tint = this.itemIds[sprite].toSprite()
            tint.tint = new Color(255, 0, 0)
            this.sprite = tint;
            this.graphics.use(tint);
        }
    }

    select() {
        this.addChild(this.rangeDisplay);

    }

    deSelect() {
        this.rangeDisplay.unparent();
        this.rangeDisplay.kill();
    }
}