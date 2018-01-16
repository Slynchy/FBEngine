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
		this.animSpeed = 30;

		Object.assign(this,props);
	}

	endStep(dt){
		super.endStep(dt);

		//this.x += 1;
		this._vY += 1;
		this._vY = this._vY > Settings.GameSettings.gravity ? Settings.GameSettings.gravity : this._vY;

		this.y += this._vY;

		if(this.y > Settings.PIXI.applicationSettings.height){
			this.y = 0;
		}

		// this.animTimer += dt;
		// if(this.animTimer > this.animSpeed){
		// 	this.animTimer = 0;
		// 	if(this.currentFrame + 1 > this.animTextures.length){
		// 		this.currentFrame = 0;
		// 	} else {
		// 		this.currentFrame++;
		// 	}
		// 	this.texture = this.animTextures[this.currentFrame];
		//}
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