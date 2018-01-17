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
		this._vY += Settings.GameSettings.gravityStrength;
		this._vY = this._vY > Settings.GameSettings.gravity ? Settings.GameSettings.gravity : this._vY;

		this.y += this._vY;

		if(this.y > Settings.PIXI.applicationSettings.height){
			this.y = 0;
		}
	}

	handleAnimation(dt){
		this.rotation = Math.atan2(this._vY, 5);

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
		}

	}

	jump(){
		console.log('jump!');
		this._vY = -Settings.GameSettings.birdJumpPower;
	}

	onCollide(){
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
					//alert(obj.tag);
					console.log(obj.tag);
					flowController.game.quit();
					return;
			}
		}
	}
}

module.exports = Player;