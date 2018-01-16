let PIXI = require("pixi.js");

class GameObject extends PIXI.Sprite {
	constructor(texture, props){
		super(texture);

		this.parentScene = null;

		this._vX = 0;
		this._vY = 0;

		this.tag = "GameObject";

		this.checkCollisions = true;

		this.collisions = [];

		this.width = texture ? texture.width : 0;
		this.height = texture ? texture.height : 0;

		if(props)
			Object.assign(this, props);
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

	get isVisible(){
		if(this.parentScene){
			if(
				this.x < this.parentScene.position.x + Settings.PIXI.applicationSettings.width &&
				this.x + this.texture.width > this.parentScene.position.x &&
				this.y < this.parentScene.position.y + Settings.PIXI.applicationSettings.height &&
				this.y + this.texture.height > this.parentScene.position.y
			){
				return true;
			}
			else return false;
		} else return false;
	}

	onAdd(scene){
		this.parentScene = scene;
	}

	onRemove(){
		this.body = null;
	}

	endStep(){

	}

	onCollide(){

	}

	physicsStep(){

	}
}

module.exports = GameObject;