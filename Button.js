let GameObject = require("./GameObject.js");

class Button extends GameObject {
	constructor(upstate, downstate, props){
		super(upstate, props);

		let self = this;

		this.upstateTexture = upstate;
		this.downstateTexture = downstate;

		this._isInDownstate = false;

		this.interactive = true;
		this.on('pointerup', function(){
			self._pointerUp();
			self.onClick();
		});
		this.on('pointerdown', function(){
			self._pointerDown();
		});

		if(props){
			Object.assign(this, props);
		}
	}

	_pointerDown(){
		this.updateTexture(this.downstateTexture);
		this._isInDownstate = true;
	}

	_pointerUp(){
		this.updateTexture(this.upstateTexture);
		this._isInDownstate = false;
	}

	/**
	 * Pure function; intended to be overwritten
	 */
	onClick(){
		console.warn("[Button] onClick not overridden; is this intended?");
	};

}

module.exports = Button;