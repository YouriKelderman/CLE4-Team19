import {Vector,Actor} from "excalibur";
import {Resources} from "./resources.js";

export class UpgradeMenu extends Actor {


    constructor() {
        super({

        });

        this.graphics.use(Resources.BuyMenu.toSprite());
        this.scale = new Vector(3,1)
        this.pos= new Vector(1600, 450);
        this.z = 99999;
        this.enableCapturePointer = true;
        this.pointer.useGraphicsBounds = true;

    }
}