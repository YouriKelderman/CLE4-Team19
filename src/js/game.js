import {Actor, Engine, Vector, Label, Color, Font, Debug, Transform, Screen, Scene, Camera, DisplayMode} from "excalibur";
import {DevTool} from "@excaliburjs/dev-tools";
import {Resources, ResourceLoader} from "./resources.js";
import {Menu} from "./menu.js";
import {Park} from "./park.js";
import {Settings} from "./settings.js";
import {Gulden} from "./money.js";
import {Levens} from "./health.js";

export class Game extends Engine {

    game
    musicVolume = 0.5;
    gulden = 1000;
    levens = 0;

    constructor() {
        super({width: 1440, height: 900, displayMode: DisplayMode.FitScreenAndZoom});


        this.start(ResourceLoader).then(() => this.startGame());
        this.showDebug(true);
        this.debug.motion = {
            accelerationColor: Color.Azure,
            showAcceleration: true,
            showAll: true,
            showVelocity: true,
            velocityColor: Color.Green,
        };

        this.add('menu', new Menu());
        this.add('park', new Park());
        this.add('settings', new Settings())

    }

    onInitialize(engine) {
        this.game = engine;
        const devtool = new DevTool(this.game);
    }

    startGame(engine) {
        this.goToScene('menu');
    }

}

new Game();
