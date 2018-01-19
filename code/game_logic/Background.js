let GameObject = require('../game_engine/GameObject.js');

class Background extends GameObject {
	constructor(texture, props){
		super(texture);

		this.tag = "Background";

		this.checkCollisions = false;
		Object.assign(this,props);
	}

	endStep(dt){
		super.endStep(dt);
		this.x -= Settings.GameSettings.moveSpeed * dt;

		if(this.x < 0-this.width){
			this.x += Settings.PIXI.applicationSettings.width * 2;
		}
	}
}

module.exports = Background;