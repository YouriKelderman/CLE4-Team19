import {Actor, Engine, Vector, Label, Color, Font, Debug, Transform, Screen, Scene, Camera, DisplayMode} from "excalibur";
import {Resources, ResourceLoader} from "./resources.js";
import {Menu} from "./menu.js";
import {Park} from "./park.js";

export class Game extends Engine {

    game

    constructor() {
        super({width: 1440, height: 900, displayMode: DisplayMode.FillScreen});
        this.start(ResourceLoader).then(() => this.startGame());
        this.showDebug(true);
        this.add('menu', new Menu());
        this.debug.motion = {
            accelerationColor: Color.Azure,
            showAcceleration: true,
            showAll: true,
            showVelocity: true,
            velocityColor: Color.Green,
        };
    }

    startGame(engine) {
        this.game = engine;
        this.addScene('park', new Park());
        this.goToScene('menu');
    }

}

new Game();
