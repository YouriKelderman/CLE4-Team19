import {Actor, Rectangle, Color, Engine, Vector, Timer} from "excalibur";

export class Cursor extends Actor {
    speedX = 0;
    speedY = 0;
    clicked = false;
    timer = new Timer({
        fcn: () => this.button1Clicked(),
        repeats: false,
        interval: 200,
    });

    game;
    actorsInRadius = []
    actorsDistance = []
    actorClicked


    constructor(engine) {
        super({
            width: 50,
            height: 50,
            color: Color.Red,
        });
    }

    onInitialize(engine) {
        this.game = engine
        this._setName("Cursor")

        this.z = 10000;

        document.addEventListener("joystick0up", () => this.setUp());
        document.addEventListener("joystick0down", () => this.setDown());
        document.addEventListener("joystick0left", () => this.setLeft());
        document.addEventListener("joystick0right", () => this.setRight());
        document.addEventListener("joystick0neutral", () => this.setNeutral());
        document.addEventListener("joystick0button0", () => this.button1Click());
        // document.addEventListener("joystick0button1", () => this.buttonToggle());
        // document.addEventListener("joystick0button2", () => this.buttonToggle());
        // document.addEventListener("joystick0button3", () => this.buttonToggle());
        // document.addEventListener("joystick0button4", () => this.buttonToggle());
        // document.addEventListener("joystick0button5", () => this.buttonToggle());

        this.game.add(this.timer);
        console.log(this.game)
    }


    onPreUpdate() {
        // console.log(this.speedX + ' ' + this.speedY);
        this.vel = new Vector(this.speedX, this.speedY);
        if (this.clicked === false) {
            this.color = Color.Red
        }
    }

    button1Click() {
        console.log('hallo')
        this.clicked = true
        this.color = Color.Green
        this.timer.start()

        let currentScene = this.game.currentScene;
        let values = Object.values(currentScene);

        values.forEach(value => {
            if (value instanceof Actor) {
                this.actorsDistance.push(value);
            }
        });

        for (let i = 0; i < this.actorsInRadius.length; i++) {
            if (this.actorsDistance[i].clickable) {
                let pos1 = new Vector(this.pos.x, this.pos.y,);
                let pos2 = new Vector(this.actorsInRadius[i].other.pos.x, this.actorsInRadius[i].other.pos.y);

                let distance = pos1.distance(pos2);

                this.actorsDistance.push(distance);
            } else {
                this.actorsDistance.splice(i, 0)
            }
        }

        let nearestActor = Math.min(...this.actorsDistance);
        let nearestActorName = this.actorsInRadius[this.actorsDistance.indexOf(nearestActor, 0)];


        this.actorsDistance = [];

        this.actorClicked = nearestActorName;
    }

    button1Clicked() {
        this.clicked = false
        this.timer.reset()
    }

    setUp() {
        this.speedY = -400;
    }

    setDown() {
        this.speedY = 400;
    }

    setLeft() {
        this.speedX = -400;
    }

    setRight() {
        this.speedX = 400;
    }

    setNeutral() {
        this.speedX = 0;
        this.speedY = 0;
    }

    onPreKill(_scene) {
        document.removeEventListener("joystick0up", () => this.setUp());
        document.removeEventListener("joystick0down", () => this.setDown());
        document.removeEventListener("joystick0left", () => this.setLeft());
        document.removeEventListener("joystick0right", () => this.setRight());
        document.removeEventListener("joystick0neutral", () => this.setNeutral());
        document.removeEventListener("joystick0button0", () => this.buttonToggle());
        document.removeEventListener("joystick0button1", () => this.buttonToggle());
        document.removeEventListener("joystick0button2", () => this.buttonToggle());
        document.removeEventListener("joystick0button3", () => this.buttonToggle());
        document.removeEventListener("joystick0button4", () => this.buttonToggle());
        document.removeEventListener("joystick0button5", () => this.buttonToggle());
    }
}