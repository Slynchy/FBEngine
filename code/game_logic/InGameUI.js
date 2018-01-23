let ContainerObject = require('../game_engine/ContainerObject.js');
let GameObject = require('../game_engine/GameObject.js');
let PIXI = require("pixi.js");
let jsAnim = require("js-easing-functions");

class InGameUI extends ContainerObject {
	constructor(props){
		"use strict";
		super(props);

		//this.orientation = Math.random() < 0.5 ? 0 : 1; // 0 == down to up, 1 == up to down
		this.tag = "InGameUI";

		this.timer = 0;

		this.numbers = [];
		this.numbers.push(number0);
		this.numbers.push(number1);
		this.numbers.push(number2);
		this.numbers.push(number3);
		this.numbers.push(number4);
		this.numbers.push(number5);
		this.numbers.push(number6);
		this.numbers.push(number7);
		this.numbers.push(number8);
		this.numbers.push(number9);

		this.score = 0;

		this.scoreText = [];
		this.scoreText.push(new GameObject(number0,{ checkCollisions: false }));
		this.scoreText.push(new GameObject(number0,{ checkCollisions: false }));
		this.scoreText.push(new GameObject(number0,{ checkCollisions: false }));
		for(let i = 0; i < this.scoreText.length; i++){
			this.scoreText[i].anchor.x = 0.5;
			this.scoreText[i].anchor.y = 0.5;
		}

		this.scoreContainer = new PIXI.Container();
		this.scoreContainer.x = Settings.PIXI.applicationSettings.width / 2;
		this.scoreContainer.y = Settings.PIXI.applicationSettings.height / 5;

		this.scoreText[0].x = -number0.width;
		this.scoreText[1].x = 0;
		this.scoreText[2].x = number0.width;

		this.scoreText[0].hide();
		this.scoreText[0]._value = -1;
		this.scoreText[1]._value = 0;
		this.scoreText[2].hide();
		this.scoreText[2]._value = -1;


		this.scoreContainer.addChild(this.scoreText[0]);
		this.scoreContainer.addChild(this.scoreText[1]);
		this.scoreContainer.addChild(this.scoreText[2]);
		this.addChild(this.scoreContainer);

		Object.assign(this,props);
	}

	hideScore(setOrDo){

		if(setOrDo === 'set'){
			this._hideScore = true;
		} else {
            this.scoreText[0].alpha = lerp(this.scoreText[0].alpha, 0, setOrDo * 0.3 );
            this.scoreText[1].alpha = lerp(this.scoreText[1].alpha, 0, setOrDo * 0.3 );
            this.scoreText[2].alpha = lerp(this.scoreText[2].alpha, 0, setOrDo * 0.3 );
		}
	}

    showScore(setOrDo){

        if(setOrDo === 'set'){
            this._hideScore = false;
        } else {
			if(this.scoreText[0]._value !== -1) {
				this.scoreText[0].alpha = lerp(this.scoreText[0].alpha, 1, setOrDo * 0.3);
			}

            //if(this.scoreText[1]._value !== -1){
				this.scoreText[1].alpha = lerp(this.scoreText[1].alpha, 1, setOrDo * 0.3 );
			//}

			if(this.scoreText[2]._value !== -1){
            	this.scoreText[2].alpha = lerp(this.scoreText[2].alpha, 1, setOrDo * 0.3 );
            }
        }
    }

	endStep(dt){
		"use strict";
		super.endStep(dt);

        if(this._hideScore === true){
        	this.hideScore(dt);
		} else {
        	this.showScore(dt);
		}

		if(this.gamestart){
			this.timer += dt * 6;

			if(this.timer > 350 || this.gamestart.isBeingRemoved === true){
				if(!this.timerStart) this.timerStart = this.timer;
				this.gamestart.alpha = jsAnim.easeOutQuad(this.timerStart - this.timer, 1, 1, 1000);

				if(this.gamestart.alpha <= 0){
					if(this.gamestart.isBeingRemoved === true){
						this.removeChild(this.gamestart);
						this.gamestart = null;
					} else {
						this.gamestart.callback();
						this.removeChild(this.gamestart);
						this.gamestart = null;
					}
				}
			}
		}
	}

	playGameStart(cb){
		"use strict";
		let self = this;
		this.gamestart = new GameObject(message, { checkCollisions: false });
		this.gamestart.anchor.x = 0.5;
		this.gamestart.anchor.y = 0.5;
		this.gamestart.isBeingRemoved = false;
		this.gamestart.x = Settings.PIXI.applicationSettings.width / 2;
		this.gamestart.y = Settings.PIXI.applicationSettings.height / 2;
		this.addChild(this.gamestart);
		this.timer = 0;
		this.gamestart.callback = function() {
			//self.removeChild(self.gamestart);
			self.gamestart.isBeingRemoved = true;
			if(cb) cb();
		}
		// fade out in 5 seconds or when the player taps

		//if(cb) cb();
	}

	onAdd(){
		"use strict";
		super.onAdd();
	}

	updateScore(score){
		"use strict";
		let digits = score.toString();
		this.score = score;
		switch(digits.length){
			case 1:
				this.scoreText[0].hide();
				this.scoreText[1].show();
				this.scoreText[2].hide();
				this.scoreText[1].texture = this.numbers[Number.parseInt(digits[0])];
				this.scoreText[1]._value = digits[0];
				break;
			case 2:
				this.scoreText[0].show();
				this.scoreText[1].show();
				this.scoreText[2].hide();
				this.scoreText[0].texture = this.numbers[Number.parseInt(digits[0])];
				this.scoreText[0]._value = digits[0];
				this.scoreText[1].texture = this.numbers[Number.parseInt(digits[1])];
				this.scoreText[1]._value = digits[1];

				this.scoreContainer.x = (Settings.PIXI.applicationSettings.width / 2) + (number0.width / 2);
				break;
			case 3:
				this.scoreText[0].show();
				this.scoreText[1].show();
				this.scoreText[2].show();
				this.scoreText[0].texture = this.numbers[Number.parseInt(digits[0])];
				this.scoreText[0]._value = digits[0];
				this.scoreText[1].texture = this.numbers[Number.parseInt(digits[1])];
				this.scoreText[1]._value = digits[1];
				this.scoreText[2].texture = this.numbers[Number.parseInt(digits[2])];
				this.scoreText[2]._value = digits[2];

				this.scoreContainer.x = (Settings.PIXI.applicationSettings.width / 2);
				break;
		}
	}
}

module.exports = InGameUI;