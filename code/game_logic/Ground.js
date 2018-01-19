let GameObject = require('../game_engine/GameObject.js');

class Ground extends GameObject {
	constructor(){
		super(ground_floor);
		this.tag = "Ground";
	}

	endStep(dt){
		super.endStep(dt);
		this.x -= Settings.GameSettings.moveSpeed * dt;

		if(this.x < 0-this.width){
			this.x += Settings.PIXI.applicationSettings.width * 2;
		}
	}
}

module.exports = Ground;