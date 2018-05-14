let PIXI = require('pixi.js');

class AnimatedGameObject extends PIXI.extras.AnimatedSprite {
	constructor(textures, props) {
		'use strict';
		super(textures);

		this._isAnimated = true;

		//this.filters = [new PIXI.filters.FXAAFilter()];

		this.uid = parseInt(
			Math.random()
				.toString()
				.slice(2)
		);

		this.zOrder = 0;

		this._addChild = this.addChild;
		this.addChild = obj => {
			if (obj.onAdd) obj.onAdd(this);
			this._addChild(obj);
		};

		this._removeChild = this.removeChild;
		this.removeChild = obj => {
			if (obj.onRemove) obj.onRemove();
			this._removeChild(obj);
		};

		if (props) Object.assign(this, props);
	}

	get isFrozen() {
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

	freeze() {
		this._isFrozen = true;
	}

	unfreeze() {
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
		'use strict';
		return this.position.y;
	}

	set z(val) {
		this.zOrder = val;
	}

	get z() {
		return this.zOrder;
	}

	hide() {
		'use strict';
		this.alpha = 0;
		this._isVisible = false;
	}

	show() {
		'use strict';
		this.alpha = 1;
		this._isVisible = this.isVisible;
	}

	onDestroy() {
		/* To be overridden*/
	}
	onRemove() {
		/* To be overridden*/
	}

	onAdd(scene) {
		'use strict';
		this.parentScene = scene;
	}

	endStep() {
		if (this.isFrozen) return;
	}

	onCollide() {}

	physicsStep() {}

	destroy() {
		if (this.onDestroy) this.onDestroy();
		if (this.parentScene) this.parentScene.removeChild(this);
	}

	set z(val) {
		this.zOrder = val;
	}

	get z() {
		return this.zOrder;
	}
}

module.exports = AnimatedGameObject;
