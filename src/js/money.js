import {Font, FontUnit, GraphicsGroup, ScreenElement, Vector, Color, Label} from "excalibur";

export class Gulden extends Label {

    // scoreText
    engine;

    constructor() {
        super({
            pos: new Vector(140, 90),
            z: 99999,
            font: new Font({
                unit: FontUnit.Px,
                family: 'VCR',
                size: 35,


                color: Color.White,
            }),
        });
        console.log(this.text);
    }

    updateScore() {
        this.text = `Score: 200`
    }
}