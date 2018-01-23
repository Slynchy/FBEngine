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

		this.terminalVelocity = false;

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
		"use strict";
		//this.x += 1;
        let _gravitySpeed = Settings.GameSettings.gravityStrength;
		this._vY += _gravitySpeed * (1.0 * dt);

		if(this._vY > Settings.GameSettings.terminalVelocity && this.isDying !== true){
			this._vY = (Settings.GameSettings.terminalVelocity);
			this.terminalVelocity = true;
		} else {
			this.terminalVelocity = false;
		}

		this.y += this._vY * (1.0 * dt);
	}

	handleAnimation(dt){
		"use strict";
		this.rotation = Math.atan2(this._vY, 5);

		if(this.isDying === true) {
            this.texture = this.animTextures[0];
			return;
        }

		if(this.terminalVelocity) {
			this.texture = yellowbird_midflap;
			this.animTimer = 0;
		} else {
			this.animTimer += dt;
			if(this.animTimer > this.animSpeed){
				this.animTimer = 0;
				if(this.currentFrame >= 2){
					this.currentFrame = 0;
				} else {
					this.currentFrame++;
				}
				switch(this.currentFrame){
					case 0:
						this.texture = yellowbird_downflap;
						break;
					case 1:
						this.texture = yellowbird_midflap;
						break;
					case 2:
						this.texture = yellowbird_upflap;
						break;
				}
			}
		}
	}

	get isFrozen(){
		return this._isFrozen;
	}

	endStep(dt){
		"use strict";
		super.endStep(dt);

		if(!this._isFrozen){
			this.handleMovement(dt);
			this.handleAnimation(dt);
		} else if(this._deathAnim && this._deathAnim.playing === true){

			if(this._deathAnim.onRewind && this._deathAnim.state === this._deathAnimStates.STAGE1){

				this.recording.currentRecordTimer += dt;

				if(this.recording.currentRecordTimer >= this.recording.recordInterval){
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
                        	this.recording.initialPos = this.y;
                        	this.recording.initialVel = this.vY;
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
		if(!this._rewindAnimTimer){
			this._rewindAnimTimer = 0;
		}
		this._rewindAnimTimer += dt * 0.3;

        this.y = lerp(
			this.recording.currentFrame < (this.recording.frames.length-1) ? this.recording.frames[this.recording.currentFrame+1].y : this.recording.initialPos,
			this.recording.frames[this.recording.currentFrame].y,
			this._rewindAnimTimer
		);
        this.vY = lerp(
			this.recording.currentFrame < (this.recording.frames.length-1) ? this.recording.frames[this.recording.currentFrame+1].vY : this.recording.initialVel,
            this.recording.frames[this.recording.currentFrame].vY,
			this._rewindAnimTimer
        );

		//if(Math.round(this.y) === Math.round(this.recording.frames[this.recording.currentFrame].y)){
		if(this._rewindAnimTimer >= 1.0){
			console.log("frame");
			this.recording.currentFrame--;
			this._rewindAnimTimer = 0;
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