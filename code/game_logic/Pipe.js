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

		this.scoreCollider = new GameObject(null, {tag:"AddScoreTrigger"});
		this.scoreCollider.width = pipe_green.width;
		this.scoreCollider.height = this.pipe2.y - (this.pipe1.y + pipe_green_flipped.height);
		this.scoreCollider.x = this.pipe1.x - (pipe_green.width / 2);
		this.scoreCollider.y = this.pipe1.y + pipe_green_flipped.height;
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

		if(this.rewind){
            this.x += Settings.GameSettings.moveSpeed * dt;

            if(this.x > Settings.PIXI.applicationSettings.width * 2) {
                this.x -= (Settings.PIXI.applicationSettings.width * 2) + pipe_green.width + 20;
                this.randomisePos();
                this.scoreCollider.width = pipe_green.width;
                this.scoreCollider.height = this.pipe2.y - (this.pipe1.y + pipe_green_flipped.height);
                this.scoreCollider.x = this.pipe1.x;
                this.scoreCollider.y = this.pipe1.y + pipe_green_flipped.height;
                this.scoreCollider.hasBeenTouched = false;
            }
		} else {
            this.x -= Settings.GameSettings.moveSpeed * dt;

            if(this.x < 0-pipe_green.width){
                this.x += (Settings.PIXI.applicationSettings.width * 2) - pipe_green.width - 20;
                this.randomisePos();
                this.scoreCollider.width = pipe_green.width;
                this.scoreCollider.height = this.pipe2.y - (this.pipe1.y + pipe_green_flipped.height);
                this.scoreCollider.x = this.pipe1.x;
                this.scoreCollider.y = this.pipe1.y + pipe_green_flipped.height;
                this.scoreCollider.hasBeenTouched = false;
            }
		}
	}

	randomisePos(){
		"use strict";
		let randomY = (Math.random() * Settings.GameSettings.pipes.chanceOffset) + Settings.GameSettings.pipes.offset;

		let magic = (Settings.PIXI.applicationSettings.height - (pipe_green.height * 2));

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
		let minOff = (ground_floor.height - (Settings.PIXI.applicationSettings.height - this.pipe2.y)) * -1;
		let maxOff = this.pipe1.y * -1;

		// Offset
			// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
		let getRandomInt = function(min, max){return Math.floor(Math.random() * (max - min + 1)) + min};
		let fOffset = getRandomInt(minOff, maxOff);
		this.pipe1.y += fOffset;
		this.pipe2.y += fOffset;

		this.pipe1.y = Math.round(this.pipe1.y);
		this.pipe2.y = Math.round(this.pipe2.y);

		if(this.pipe1.y > 0 || this.pipe2.y < Settings.PIXI.applicationSettings.height - ground_floor.height){
			console.error('bad pipe pos!');
			Analytics.SendEvent('bad_pipe_pos');
		}
	}
}

module.exports = Pipe;