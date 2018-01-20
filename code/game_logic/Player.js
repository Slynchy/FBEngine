let GameObject = require('../game_engine/GameObject.js');

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

	freeze(){
		this._isFrozen = true;
	}

	unfreeze(){
		this._isFrozen = false;
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

			switch(this._deathAnim.state){
				case this._deathAnimStates.STAGE1:
                    this.handleMovement(dt);
                    this.handleAnimation(dt);
                    if(this.y > Settings.PIXI.applicationSettings.height){
                        this._deathAnim.onFinish();
                        this._deathAnim.state = this._deathAnimStates.STAGE2;
                    }
					break;
                case this._deathAnimStates.STAGE2:
                	if(!this._deathAnim.onRewind) {
                        this._deathAnim.state = this._deathAnimStates.FINISHED;
                        break;
					} else {
                		// do shit
					}
                    break;
                case this._deathAnimStates.FINISHED:
                    break;
			}

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
				case "Pipe":
				default:
					if(flowController.game){
						flowController.game.gameOver();
						//flowController.game.quit();
					}
					return;
			}
		}
	}
}

module.exports = Player;