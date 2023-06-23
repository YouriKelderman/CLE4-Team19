import {Actor, Vector, Engine, Random, CollisionType, Shape, Circle, Color, Line} from "excalibur";
import {Resources} from "../resources.js";
import {PanBami} from "./panBami.js";


export class PlaceTower extends PanBami {

    range;
    itemIds = [
        Resources.Pan, Resources.TinyLau,
    ]

    constructor(spriteID) {
        super()
    }


    onInitialize(engine) {
        this.scale = new Vector(1, 1);
        console.log(this.towerRange)
        this.towerRange = 300;

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
}