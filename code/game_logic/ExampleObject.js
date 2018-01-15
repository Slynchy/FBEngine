let GameObject = require('../game_engine/GameObject.js');

class ExampleObject extends GameObject {
	constructor(texture, props){
		super(texture);
		Object.assign(this,props);
	}
}

module.exports = ExampleObject;