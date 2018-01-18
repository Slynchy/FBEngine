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

		this.scoreText = [];
		this.scoreText.push(new GameObject(number0,{ checkCollisions: false }));
		this.scoreText.push(new GameObject(number0,{ checkCollisions: false }));
		this.scoreText.push(new GameObject(number0,{ checkCollisions: false }));

		let offset = Settings.PIXI.applicationSettings.width / 2 - ( (number0.width * 3) / 2);
		this.scoreText[0].x = offset;
		this.scoreText[1].x = offset + number0.width;
		this.scoreText[2].x = offset + (number0.width*2);

		this.scoreText[0].y = Settings.PIXI.applicationSettings.height / 5;
		this.scoreText[1].y = Settings.PIXI.applicationSettings.height / 5;
		this.scoreText[2].y = Settings.PIXI.applicationSettings.height / 5;

		this.scoreText[0].hide();
		this.scoreText[2].hide();


		this.addChild(this.scoreText[0]);
		this.addChild(this.scoreText[1]);
		this.addChild(this.scoreText[2]);

		Object.assign(this,props);
	}

	endStep(dt){
		"use strict";
		super.endStep(dt);

		if(this.gamestart){
			this.timer += dt;

			if(this.timer > 2000 || this.gamestart.isBeingRemoved === true){
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
		var digits = score.toString();
		switch(digits.length){
			case 1:
				this.scoreText[0].hide();
				this.scoreText[1].show();
				this.scoreText[2].hide();
				this.scoreText[1].texture = this.numbers[Number.parseInt(digits[0])];
				break;
			case 2:
				this.scoreText[0].show();
				this.scoreText[1].show();
				this.scoreText[2].hide();
				this.scoreText[0].texture = this.numbers[Number.parseInt(digits[0])];
				this.scoreText[1].texture = this.numbers[Number.parseInt(digits[1])];
				break;
			case 3:
				this.scoreText[0].show();
				this.scoreText[1].show();
				this.scoreText[2].show();
				this.scoreText[0].texture = this.numbers[Number.parseInt(digits[0])];
				this.scoreText[1].texture = this.numbers[Number.parseInt(digits[1])];
				this.scoreText[2].texture = this.numbers[Number.parseInt(digits[2])];
				break;
		}
	}
}

module.exports = InGameUI;