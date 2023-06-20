import {Actor, Engine, Vector, Label, Color, Font, Debug, Transform, Screen, Scene, Camera, DisplayMode} from "excalibur";
import {Resources, ResourceLoader} from "./resources.js";
import {Menu} from "./menu.js";
import {Park} from "./park.js";

export class Game extends Engine {

    game

    constructor() {
        super({width: 1440, height: 900, displayMode: DisplayMode.FitScreenAndZoom});
        this.start(ResourceLoader).then(() => this.startGame());
        this.showDebug(false);
        this.debug.motion = {
            accelerationColor: Color.Azure,
            showAcceleration: true,
            showAll: true,
            showVelocity: true,
            velocityColor: Color.Green,
        };

        this.add('menu', new Menu());
        this.add('park', new Park());
        this.add('settings', new Settings());
    }

    startGame(engine) {
        this.game = engine;
        this.goToScene('menu');
    }

}

new Game();
