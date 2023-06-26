import {Vector, Actor, Label, Font, Color} from "excalibur";
import {Resources} from "./resources.js";
import {Park} from "./park.js";

export class UpgradeMenu extends Actor {
    rangeIndicator;

    constructor() {
        super({

        });

        this.graphics.use(Resources.BuyMenu.toSprite());
        this.scale = new Vector(3,1)
        this.pos= new Vector(1600, 450);
        this.z = 99999;
        this.enableCapturePointer = true;
        this.pointer.useGraphicsBounds = true;


        this.rangeIndicator = new Label(
            {
                pos: new Vector(500, 500),
                z: 99999,
                font: new Font({
                    family: 'VCR',
                    size: 20,
                    color: Color.White,
                    text: 'test',
                }),
            }
        )
    }
}