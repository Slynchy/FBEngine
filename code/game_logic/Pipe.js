let GameObject = require('../game_engine/GameObject.js');
let PIXI = require("pixi.js");

class Pipe extends PIXI.Container {
	constructor(props){
		"use strict";
		super();

		this.checkCollisions = false;

		this.pipe1 = new GameObject(pipe_green_flipped, {tag:"Pipe"});
		this.pipe2 = new GameObject(pipe_green, {tag:"Pipe"});

		this.pipe1.anchor.x = 0.5;
		this.pipe2.anchor.x = 0.5;
		this.pipe2.anchor.y = 1.0;

		this.pipe1.scale.x = 2;
		this.pipe1.scale.y = 2;
		this.pipe2.scale.x = 2;
		this.pipe2.scale.y = 2;

		let adjustedWidth = pipe_green.width * this.pipe1.scale.x;
		let adjustedHeight = pipe_green.height * this.pipe1.scale.y;

		this.scoreCollider = new GameObject(null, {tag:"AddScoreTrigger"});
		this.scoreCollider.anchor.x = 0.5;
		this.scoreCollider.width = (adjustedWidth / 2);
		this.scoreCollider.height = Settings.PIXI.applicationSettings.height;
		this.scoreCollider.x = this.pipe1.x;
		this.scoreCollider.y = 0;
		this.scoreCollider.hasBeenTouched = false;

		this.rewind = false;

		this._isFrozen = false;

		this.randomisePos();

		this.addChild(this.pipe1);
		this.addChild(this.pipe2);
		this.addChild(this.scoreCollider);

		//this.orientation = Math.random() < 0.5 ? 0 : 1; // 0 == down to up, 1 == up to down
		this.tag = "Pipe";

		if(props)
			Object.assign(this,props);
	}

    get isFrozen(){
        return this._isFrozen;
    }

	onAdd(){
		"use strict";
	}

	physicsStep(){
		"use strict";
		return;
	}

	set x(val) {
		this.position.x = val;
	}

    freeze(){
        this._isFrozen = true;
    }

    unfreeze(){
        this._isFrozen = false;
    }

	set y(val) {
		this.position.y = val;
	}

	get x() {
		return this.position.x;
	}

	get y() {
		return this.position.y;
	}

	endStep(dt){
		"use strict";
		if(this.isFrozen) return;

		let adjustedWidth = pipe_green.width * this.pipe1.scale.x;
		let adjustedHeight = pipe_green.height * this.pipe1.scale.y;

		if(this.rewind){
            this.x += (Settings.GameSettings.moveSpeed * dt) * Settings.GameSettings.rewindSpeed;

            if(this.x > Settings.PIXI.applicationSettings.width * 2) {
                this.x -= (Settings.PIXI.applicationSettings.width * 2) + (adjustedWidth) + 20;
                this.randomisePos();
				this.scoreCollider.width = (adjustedWidth);
				this.scoreCollider.height = Settings.PIXI.applicationSettings.height;
				this.scoreCollider.x = this.pipe1.x;
				this.scoreCollider.y = 0;
                this.scoreCollider.hasBeenTouched = false;
            }
		} else {
            this.x -= Settings.GameSettings.moveSpeed * dt;

            if(this.x < -((pipe_green.width*3) / 2)){
                this.x += (Settings.PIXI.applicationSettings.width * 2) - (pipe_green.width*3) - 20;
                this.randomisePos();
				this.scoreCollider.width = (adjustedWidth);
				this.scoreCollider.height = Settings.PIXI.applicationSettings.height;
				this.scoreCollider.x = this.pipe1.x;
				this.scoreCollider.y = 0;
                this.scoreCollider.hasBeenTouched = false;
            }
		}
	}

	randomisePos(){
		"use strict";
		let adjustedWidth = pipe_green.width * this.pipe1.scale.x;
		let adjustedHeight = pipe_green.height * this.pipe1.scale.y;

		let randomY = (Math.random() * Settings.GameSettings.pipes.chanceOffset) + Settings.GameSettings.pipes.offset;

		let magic = (Settings.PIXI.applicationSettings.height - ((adjustedHeight) * 2));

		// initial offsetting
		this.pipe1.y = 0;
		this.pipe2.y = Settings.PIXI.applicationSettings.height - magic;

		// chance gap
		let chanceGap =  (Math.random() * Settings.GameSettings.pipes.chanceGap );

		// Do gaps
		let totalGap = (chanceGap) + (Settings.GameSettings.pipes.baseGap);
		this.pipe1.y -= totalGap * 0.5;
		this.pipe2.y += totalGap * 0.5;

		// work out offset range
		let minOff = ((ground_floor.height * 3) - (Settings.PIXI.applicationSettings.height - this.pipe2.y)) * -1;
		let maxOff = this.pipe1.y * -1;

		// Offset
			// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
		let getRandomInt = function(min, max){return Math.floor(Math.random() * (max - min + 1)) + min};
		let fOffset = getRandomInt(minOff, maxOff);
		this.pipe1.y += fOffset;
		this.pipe2.y += fOffset;

		this.pipe1.y = Math.round(this.pipe1.y);
		this.pipe2.y = Math.round(this.pipe2.y);

		if(this.pipe1.y > 0 || this.pipe2.y < Settings.PIXI.applicationSettings.height - (ground_floor.height * 3)){
			console.error('bad pipe pos!');
			Analytics.SendEvent('bad_pipe_pos');
		}
	}
}

module.exports = Pipe;