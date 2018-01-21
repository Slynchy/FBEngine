let PIXI = require("pixi.js");

class ContainerObject extends PIXI.Container {
	constructor(props){
		"use strict";
		super();

		//this.orientation = Math.random() < 0.5 ? 0 : 1; // 0 == down to up, 1 == up to down
		this.tag = "ContainerObject";

		if(props)
			Object.assign(this,props);
	}

	onAdd(){
		"use strict";
	}

	destroy(){

	}

	physicsStep(){
		"use strict";
	}

	set x(val) {
		this.position.x = val;
	}

	set y(val) {
		this.position.y = val;
	}

	get x() {
		return this.position.x;
	}

	get y() {
		return this.position.y;
	}

	endStep(dt){
		"use strict";
	}
}

module.exports = ContainerObject;