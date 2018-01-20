let ContainerObject = require('../game_engine/ContainerObject.js');
let GameObject = require('../game_engine/GameObject.js');
let PIXI = require("pixi.js");
let jsAnim = require("js-easing-functions");

class EndScreenUI extends ContainerObject {
    constructor(props){
        "use strict";
        super(props);

        let self = this;

        this.tag = "EndScreenUI";

        this.score = props ? props.score ? props.score : 0 : 0;

        this.highScore = 100;

        this.revealButtons = false;

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
                medalTexture = null;
            } else if(props.score >= 10 && props.score < 50){
                // silver
                medalTexture = bronzeMedal;
            } else if(props.score >= 50 && props.score < 100){
                // gold
                medalTexture = silverMedal;
            } else if(props.score >= 50 && props.score < 100){
                // platinum
                medalTexture = goldMedal;
            } else if(props.score > 100){
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

        this.scoreContainer = new PIXI.Container();
        this.scoreContainer.x = 95;
        this.scoreContainer.y = 17;
        this.scoreContainer.scale.x = 0.5;
        this.scoreContainer.scale.y = 0.5;
        this.score_digit1 = new GameObject(number0_s, {checkCollisions: false});
        this.score_digit1.x = -((number0_s.width * this.score_digit1.scale.x) * 2);
        this.score_digit2 = new GameObject(number0_s, {checkCollisions: false});
        this.score_digit2.x = -(number0_s.width * this.score_digit1.scale.x);
        this.score_digit3 = new GameObject(number0_s, {checkCollisions: false});
        this.scoreContainer.addChild(this.score_digit1);
        this.scoreContainer.addChild(this.score_digit2);
        this.scoreContainer.addChild(this.score_digit3);

        let digit1,digit2,digit3;
        if(this.score.toString().length === 1){
            digit1 = "0";
            this.score_digit1.alpha = 0;
            digit2 = "0";
            this.score_digit2.alpha = 0;
            digit3 = this.score.toString()[0];
        } else if(this.score.toString().length === 2){
            digit1 = "0";
            this.score_digit1.alpha = 0;
            digit2 = this.score.toString()[0];
            digit3 = this.score.toString()[1];
        } else {
            digit1 = this.score.toString()[0];
            digit2 = this.score.toString()[1];
            digit3 = this.score.toString()[2];
        }
        this.score_digit1.texture = _TEXTURES["number" + digit1 + "_s"];
        this.score_digit2.texture = _TEXTURES["number" + digit2 + "_s"];
        this.score_digit3.texture = _TEXTURES["number" + digit3 + "_s"];

        this.highScore_digit1 = new GameObject(number0_s, {checkCollisions: false});
        this.highScore_digit1.x = -((number0_s.width * this.score_digit1.scale.x) * 2);
        this.highScore_digit1.y = 40;
        this.highScore_digit2 = new GameObject(number0_s, {checkCollisions: false});
        this.highScore_digit2.x = -(number0_s.width * this.score_digit1.scale.x);
        this.highScore_digit2.y = this.highScore_digit1.y;
        this.highScore_digit3 = new GameObject(number0_s, {checkCollisions: false});
        this.highScore_digit3.y = this.highScore_digit1.y;
        this.scoreContainer.addChild(this.highScore_digit1);
        this.scoreContainer.addChild(this.highScore_digit2);
        this.scoreContainer.addChild(this.highScore_digit3);

        digit1 =  digit2 =  digit3 = '0';
        if(this.score.toString().length === 1){
            digit1 = "0";
            this.highScore_digit1.alpha = 0;
            digit2 = "0";
            this.highScore_digit2.alpha = 0;
            digit3 = this.score.toString()[0];
        } else if(this.score.toString().length === 2){
            digit1 = "0";
            this.highScore_digit1.alpha = 0;
            digit2 = this.score.toString()[0];
            digit3 = this.score.toString()[1];
        } else {
            digit1 = this.score.toString()[0];
            digit2 = this.score.toString()[1];
            digit3 = this.score.toString()[2];
        }
        this.highScore_digit1.texture = _TEXTURES["number" + digit1 + "_s"];
        this.highScore_digit2.texture = _TEXTURES["number" + digit2 + "_s"];
        this.highScore_digit3.texture = _TEXTURES["number" + digit3 + "_s"];

        this.main.addChild(this.scoreContainer);

        // buttons
        this.ok_button = new GameObject(ok_button, {checkCollisions: false, interactive:false});
        this.ok_button.anchor.x = 0.5;
        this.ok_button.anchor.y = 0.5;
        this.ok_button.x = this.main_ui.width / 2 - 40;
        this.ok_button.y = this.main_ui.height + 20;
        this.ok_button.on('pointerup', (event) =>{
            flowController.game.quit();
        });
        this.ok_button.alpha = 0;
        this.main.addChild(this.ok_button);

        this.share_button = new GameObject(share_button, {checkCollisions: false, interactive:false});
        this.share_button.anchor.x = 0.5;
        this.share_button.anchor.y = 0.5;
        this.share_button.x = this.main_ui.width / 2 + 40;
        this.share_button.y = this.main_ui.height + 20;
        this.share_button.on('pointerup', (event) =>{
            console.log('sharreee!');
            FBInstant.shareAsync({
                intent: 'REQUEST',
                image: 'data:image/gif;base64,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',
                text: 'X is asking for your help!',
                data: { test:0 },
            }).then(function() {
                // continue with the game.
                self.share_button.interactive = true;
                self.share_button.texture = share_button;
            });
            self.share_button.interactive = false;
            self.share_button.texture = share_button_grey;
        });
        this.share_button.alpha = 0;
        this.main.addChild(this.share_button);

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
                this.revealButtons = true;
                this.ok_button.interactive = true;
                this.share_button.interactive = true;
            }
            this.main.y = jsAnim.easeOutBounce(
                this.main.elapsed,
                Settings.PIXI.applicationSettings.height,
                -(Settings.PIXI.applicationSettings.height/1.5 - 55),
                80
            );
        }

        if(this.revealButtons){
            this.share_button.alpha = lerp(this.share_button.alpha, 1, 0.06);
            this.ok_button.alpha = lerp(this.ok_button.alpha, 1, 0.06);
        }
    }

    onAdd(){
        "use strict";
        super.onAdd();
    }
}

module.exports = EndScreenUI;