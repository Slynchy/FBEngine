let PIXI = require("pixi.js");

class GameObject extends PIXI.Sprite {
	constructor(texture, props){
		"use strict";
		super(texture);

		this.parentScene = null;

		this._vX = 0;
		this._vY = 0;

		this.tag = "GameObject";

		this._isVisible = false;

		this.checkCollisions = true;

		this.collisions = [];

		this._isFrozen = false;

		this.width = texture ? texture.width : 0;
		this.height = texture ? texture.height : 0;

		if(props)
			Object.assign(this, props);
	}

	get isFrozen(){
		return this._isFrozen;
	}

	get vX() {
		return this._vX;
	}

	set vX(val) {
		this._vX = val;
	}

	get vY() {
		return this._vY;
	}

	set vY(val) {
		this._vY = val;
	}

    freeze(){
        this._isFrozen = true;
    }

    unfreeze(){
        this._isFrozen = false;
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
		"use strict";
		return this.position.y;
	}

	hide(){
		"use strict";
		this.alpha = 0;
		this._isVisible = false;
	}

	show(){
		"use strict";
		this.alpha = 1;
		this._isVisible = this.isVisible;
	}

	updateTexture(texture){
		let storedXscale = this.scale.x;
		let storedYscale = this.scale.y;
		this.texture = texture;
		this.scale.x = storedXscale;
		this.scale.y = storedYscale;
	}

	get isVisible(){
		"use strict";
		let result;

		if(this.parentScene){
			if(
				this.x < this.parentScene.position.x + Settings.PIXI.applicationSettings.width &&
				this.x + this.texture.width > this.parentScene.position.x &&
				this.y < this.parentScene.position.y + Settings.PIXI.applicationSettings.height &&
				this.y + this.texture.height > this.parentScene.position.y
			){
				result = true;
			}
			else result = false;
		} else if(this.alpha > 0){
			result = true;
		}

		if(this.alpha <= 0){
			result = false;
		}

		this._isVisible = result;
		return result;
	}

	onAdd(scene){
		"use strict";
		this.parentScene = scene;
	}

	onRemove(){
		"use strict";
		this.body = null;
	}

	endStep(){
        if(this.isFrozen) return;
	}

	onCollide(){

	}

	physicsStep(){

	}
}

module.exports = GameObject;