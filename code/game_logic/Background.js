let GameObject = require('../game_engine/GameObject.js');

class Background extends GameObject {
	constructor(texture, props){
		super(texture);

		this.tag = "Background";

        this.rewind = false;

		this.checkCollisions = false;
        if(props)
            Object.assign(this,props);
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

module.exports = Background;