let ContainerObject = require('../game_engine/ContainerObject.js');
let GameObject = require('../game_engine/GameObject.js');
let PIXI = require("pixi.js");
let jsAnim = require("js-easing-functions");

class EndScreenUI extends ContainerObject {
    constructor(props){
        "use strict";
        super(props);

        this.tag = "EndScreenUI";

        this.score = 0;

        this.highScore = 100;

        this.gameOver = new GameObject(gameover, {checkCollisions: false});
        this.gameOver.anchor.x = 0.5;
        this.gameOver.anchor.y = 0.5;
        this.gameOver.x = Settings.PIXI.applicationSettings.width / 2;
        this.gameOver.y = Settings.PIXI.applicationSettings.height / 3;
        this.gameOver.alpha = 0;
        this.addChild(this.gameOver);

        this.main = new PIXI.Container();
        this.main.scale.x = 2;
        this.main.scale.y = 2;
        this.main.x = Settings.PIXI.applicationSettings.width / 2 - ((endscreen_main.width * this.main.scale.x) / 2);
        this.main.y = Settings.PIXI.applicationSettings.height;
        this.addChild(this.main);

        this.main_ui = new GameObject(endscreen_main, {checkCollisions:false});
        this.main.addChild(this.main_ui);

        let medalTexture;
        if(props && props.hasOwnProperty('score')){
            if(props.score < 10){
                // bronze
                medalTexture = bronzeMedal;
            } else if(props.score >= 10 && props.score < 50){
                // silver
                medalTexture = silverMedal;
            } else if(props.score >= 50 && props.score < 100){
                // gold
                medalTexture = goldMedal;
            } else if(props.score >= 50 && props.score < 100){
                // platinum
                medalTexture = platinumMedal;
            }
        } else {
            console.error(props);
        }

        this.medal = new GameObject(medalTexture, {checkCollisions: false});
        this.medal.x = 13;
        this.medal.y = 20;
        this.main.addChild(this.medal);

        Object.assign(this,props);
    }

    endStep(dt){
        "use strict";
        super.endStep(dt);

        this.gameOver.alpha = lerp(this.gameOver.alpha, 1, 0.01);
        if(this.gameOver.alpha > 0.7){
            if(!this.main.startTime){
                this.main.startTime = Date.now();
                this.main.elapsed = 0;
            };

            this.main.elapsed += dt;
            if(this.main.elapsed >= 80){
                this.main.elapsed = 80;
            }
            this.main.y = jsAnim.easeOutBounce(
                this.main.elapsed,
                Settings.PIXI.applicationSettings.height,
                -(Settings.PIXI.applicationSettings.height/1.5 - 55),
                80
            );
        }
    }

    onAdd(){
        "use strict";
        super.onAdd();
    }
}

module.exports = EndScreenUI;