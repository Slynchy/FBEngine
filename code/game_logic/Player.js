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

		// Setting centered sprite
		this.anchor.x = 0.5;
		this.anchor.y = 0.5;

		Object.assign(this,props);
	}

	onAdd(scene,world){
		super.onAdd(scene,world);
	}

	endStep(dt){
		super.endStep(dt);

		//this.x += 1;
		this._vY += Settings.GameSettings.gravityStrength;
		this._vY = this._vY > Settings.GameSettings.gravity ? Settings.GameSettings.gravity : this._vY;

		this.y += this._vY;

		if(this.y > Settings.PIXI.applicationSettings.height){
			this.y = 0;
		}

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

	jump(){
		console.log('jump!');
		this._vY = -Settings.GameSettings.birdJumpPower;
	}

	onCollide(){
		super.onCollide();

		for(let i=0; i < this.collisions.length; i++){
			let obj = this.collisions[i];

			switch(obj.tag){
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