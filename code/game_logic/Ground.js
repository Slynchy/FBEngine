let GameObject = require('../game_engine/GameObject.js');

class Ground extends GameObject {
	constructor(){
		super(ground_floor);
		this.tag = "Ground";

        this.rewind = false;
	}

	endStep(dt){
		super.endStep(dt);
        if(this.isFrozen) return;
		if(!this.rewind){
            this.x -= Settings.GameSettings.moveSpeed * dt;

            if(this.x < 0-this.width){
                this.x += Settings.PIXI.applicationSettings.width * 2;
            }
		} else {
            this.x += Settings.GameSettings.moveSpeed * dt;

            if(this.x > Settings.PIXI.applicationSettings.width){
                this.x -= Settings.PIXI.applicationSettings.width * 2 + this.width;
            }
		}
	}
}

module.exports = Ground;