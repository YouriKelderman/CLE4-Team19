import {
    Actor,
    Engine,
    Vector,
    Label,
    Color,
    Font,
    Debug,
    Transform,
    Screen,
    Scene,
    Camera,
    DisplayMode
} from "excalibur";
import {DevTool} from "@excaliburjs/dev-tools";
import {Resources, ResourceLoader} from "./resources.js";
import {Menu} from "./menu.js";
import {Park} from "./park.js";
import {Settings} from "./settings.js";
import {Levelselect} from "./levelselect.js";
import {Gulden} from "./money.js";
import {Levens} from "./health.js";
import {UpgradeMenu} from "./buyMenu.js";
import {Gameover} from "./gameover.js";

import {Arcade} from "arcade-game";
import {Cursor} from "./cursor.js";

import {Park1} from "./park1.js";
import {Park2} from "./park2.js";
import {Park3} from "./park3.js";
import {CutScene} from "./cutscene.js";


export class Game extends Engine {
    game
    musicVolume = 0.5;
    gulden = 500;
    buyMenu;
    activetower;
    levens = 20;
    profanityMode = true
    activeScene
    endless = false
    paused = false

    #arcade;
    #joystickListener;

    cursor

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
        this.add ('levelselect', new Levelselect());
        this.add('level1', new Park1())
        this.add('level2', new Park2())
        this.add('level3', new Park3())
        this.add('settings', new Settings())
        this.add('gameover', new Gameover())
        this.add('cutscene', new CutScene())
    }

    onInitialize(engine) {
        this.game = engine;
        if(localStorage.getItem("0") === null){
            localStorage.setItem("0", "0");
        }
        if(localStorage.getItem("1") === null){
            localStorage.setItem("1", "0");
        }
        if(localStorage.getItem("2") === null){
            localStorage.setItem("2", "0");
        }

    }

    startGame(engine) {

        this.#arcade = new Arcade(this, false, false);
        this.#joystickListener = (e) => this.#joyStickFound(e);
        document.addEventListener("joystickcreated",  this.#joystickListener);

    this.goToScene('menu');
    }

    onPreUpdate(){
        console.log(this.paused)
    }

    #joyStickFound(e) {
        let joystick = this.#arcade.Joysticks[e.detail]

        // debug, this shows you the names of the buttons when they are pressed
        for (const buttonEvent of joystick.ButtonEvents) {
            document.addEventListener(buttonEvent, () => console.log(buttonEvent))
        }
    }

    disconnect() {
        document.removeEventListener("joystickcreated", this.#joystickListener)
    }


    damage() {
        this.levens -=1;
        this.currentScene.camera.shake(2, 2, 300)
    }
    shake(){
        this.currentScene.camera.shake(0.5, 0.5, 300)
    }

}

new Game();
