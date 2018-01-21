let GameObject = require('../game_engine/GameObject.js');
let jsAnim = require("js-easing-functions");

class Player extends GameObject {
	constructor(texture, props){
		super(texture);

		this.isPlayer = true;

		this.animTextures = [
			yellowbird_upflap,
			yellowbird_midflap,
			yellowbird_downflap
		];
		this.currentFrame = 0;
		this.animTimer = 0;
		this.animSpeed = Settings.GameSettings.birdAnimSpeed;
		this._isFrozen = true;

		this.recording = null;/*{
			frames: [],
			recordInterval: 20,
			rewindSpeed: 1
		};*/

		this._deathAnimStates = {
			STAGE1: 1337,
			STAGE2: 1,
			FINISHED: 2
		};

		this._isDying = false;
        this._deathAnim = null;

		// Setting centered sprite
		this.anchor.x = 0.5;
		this.anchor.y = 0.5;

		Object.assign(this,props);
	}

	reset(){
        this.recording = null;
        this._deathAnim = null;
	}

	onAdd(scene,world){
		super.onAdd(scene,world);
	}

	handleMovement(dt){
		//this.x += 1;
        let _gravitySpeed = Settings.GameSettings.gravityStrength;
		this._vY += _gravitySpeed * dt;
		this._vY = this._vY > Settings.GameSettings.terminalVelocity && this.isDying !== true ? Settings.GameSettings.terminalVelocity : this._vY;

		this.y += this._vY * dt;
	}

	handleAnimation(dt){
		this.rotation = Math.atan2(this._vY, 5);

		if(this.isDying === true) {
            this.texture = this.animTextures[0];
			return;
        }

		if(this._vY < 0) {

		} else {
			this.animTimer += dt;
			if (this.animTimer > this.animSpeed) {
				this.animTimer = 0;
				if (this.currentFrame + 1 >= this.animTextures.length) {
					this.currentFrame = 0;
				} else {
					this.currentFrame++;
				}
				this.texture = this.animTextures[this.currentFrame];
			}
		}
	}

	get isFrozen(){
		return this._isFrozen;
	}

	endStep(dt){
		super.endStep(dt);

		if(!this._isFrozen){
			this.handleMovement(dt);
			this.handleAnimation(dt);
		} else if(this._deathAnim && this._deathAnim.playing === true){

			if(this._deathAnim.onRewind && this._deathAnim.state === this._deathAnimStates.STAGE1){

				this.recording.currentRecordTimer += dt;

				if(this.recording.currentRecordTimer > this.recording.recordInterval){
					this.recording.currentRecordTimer = 0;
                    this.recording.frames.push({y: this.y, vY: this._vY});
                    console.log('pushing rewind frame');
				}
			}

			switch(this._deathAnim.state){
				case this._deathAnimStates.STAGE1:
                    this.handleMovement(dt);
                    this.handleAnimation(dt);
                    if(this.y - (this.height / 2) - 10 > Settings.PIXI.applicationSettings.height){
                        this._deathAnim.onFinish();
                        this._deathAnim.state = this._deathAnimStates.STAGE2;
                        if(this.recording){
                        	this.recording.currentFrame = this.recording.frames.length-1;
						}
                    }
					break;
                case this._deathAnimStates.STAGE2:
                	if(!this._deathAnim.onRewind) {
                        this._deathAnim.state = this._deathAnimStates.FINISHED;
                        break;
					} else {

                        this.handleAnimation(dt);
                		this.handleRewind(dt);
                		if(this.recording.currentFrame < 0){
                			this._deathAnim.state = this._deathAnimStates.FINISHED;
                			this._deathAnim.onRewind();
						}

					}
                    break;
                case this._deathAnimStates.FINISHED:
                    break;
			}

		}

	}

	handleRewind(dt){
		"use strict";
		this.recording.animTimer += dt * this.recording.rewindSpeed;

        this.y = lerp(
			this.y,
			this.recording.frames[this.recording.currentFrame].y,
			0.4
		);
        this.vY = lerp(
            this.vY,
            this.recording.frames[this.recording.currentFrame].vY,
            0.4
        );

		if(Math.round(this.y) === Math.round(this.recording.frames[this.recording.currentFrame].y)){
			this.recording.currentFrame--;
		}
	}

	jump(){
		if(this.isDying || this.isFrozen) return;
		this._vY = -Settings.GameSettings.birdJumpPower;
	}

    playDeathAnim(onFinish, onRewind){
		"use strict";
		if(typeof(onRewind)==='undefined') onRewind = null;

		this.freeze();
        this._vY = -Settings.GameSettings.birdJumpPower * 1.33;

        if(onRewind){
        	console.log('making rewind');
        	this.recording = {
                frames: [],
                recordInterval: 5,
				currentRecordTimer: 0,
                rewindSpeed: 0.2,
				currentFrame: 0,
				animTimer: 0,
				isPlaying: true,
            };

        	this.recording.frames.push({y: this.y, vY: this._vY});
		}

		this.isDying = true;
		this._deathAnim = {
			playing: true,
			onFinish: onFinish,
			onRewind: onRewind,
			state: this._deathAnimStates.STAGE1
		}
	}

	onCollide(){
		if(this.isDying === true) return;
		super.onCollide();

		for(let i=0; i < this.collisions.length; i++){
			let obj = this.collisions[i];

			switch(obj.tag){
				case "AddScoreTrigger":
					if(obj.hasBeenTouched) return;
					obj.hasBeenTouched = true;
					flowController.game.ui.updateScore(++flowController.game.score);
					break;
				case "Ground":
                    if(flowController.game){
                        flowController.game.gameOver(false);
                    }
                    break;
				case "Pipe":
					if(flowController.game){
						flowController.game.gameOver(true);
					}
					return;
				default:
					break;
			}
		}
	}
}

module.exports = Player;