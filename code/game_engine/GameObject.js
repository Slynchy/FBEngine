let PIXI = require("pixi.js");

class GameObject extends PIXI.Sprite {
	constructor(texture, props){
		super(texture);

		if(props)
			Object.assign(this, props);
	}
}

module.exports = GameObject;