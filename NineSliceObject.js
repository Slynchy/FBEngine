let PIXI = require('pixi.js');

class NineSliceObject extends PIXI.mesh.NineSlicePlane {
	/**
	 *
	 * @param {PIXI.Texture} texture
	 * @param {object} props
	 * @param {number} [leftWidth]
	 * @param {number} [topHeight]
	 * @param {number} [rightWidth]
	 * @param {number} [bottomHeight]
	 */
	constructor(texture, props, leftWidth, topHeight, rightWidth, bottomHeight) {
		if (typeof props === 'undefined') {
			throw new Error('No properties passed to NineSlice!');
		}

		if (typeof leftWidth === 'undefined') {
			if (
				!props.hasOwnProperty('leftWidth') ||
				!props.hasOwnProperty('topHeight') ||
				!props.hasOwnProperty('rightWidth') ||
				!props.hasOwnProperty('bottomHeight')
			) {
				throw new Error('Missing required nineslice properties! (refer to documentation)');
			} else {
				leftWidth = props.leftWidth;
				topHeight = props.topHeight;
				rightWidth = props.rightWidth;
				bottomHeight = props.bottomHeight;
			}
		}

		super(texture, leftWidth, topHeight, rightWidth, bottomHeight);

		if (props) {
			Object.assign(this, props);
		}
	}

	smartScale(x, y) {
		'use strict';
		if (this.width === 0 || this.height === 0) {
			console.error('divide by zero!');
			return;
		}

		if (x) {
			this.scale.x = x / this.width;
			if (!y) {
				this.scale.y = this.scale.x;
			}
		}
		if (y) {
			this.scale.y = y / this.height;
			if (!x) {
				this.scale.x = this.scale.y;
			}
		}
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

	get isVisible() {
		'use strict';
		let result;

		if (this.parentScene) {
			if (
				this.x < this.parentScene.position.x + Settings.PIXI.applicationSettings.width &&
				this.x + this.texture.width > this.parentScene.position.x &&
				this.y < this.parentScene.position.y + Settings.PIXI.applicationSettings.height &&
				this.y + this.texture.height > this.parentScene.position.y
			) {
				result = true;
			} else result = false;
		} else if (this.alpha > 0) {
			result = true;
		}

		if (this.alpha <= 0) {
			result = false;
		}

		this._isVisible = result;
		return result;
	}

	onAdd(scene) {
		'use strict';
		this.parentScene = scene;
	}

	destroy() {
		if (this.onDestroy) this.onDestroy();
		if (this.parentScene) this.parentScene.removeChild(this);
	}

	onDestroy() {
		/* To be overridden*/
	}
	onRemove() {
		/* To be overridden*/
	}
	endStep() {
		/* To be overridden*/
	}
	onCollide() {
		/* To be overridden*/
	}
	physicsStep() {
		/* To be overridden*/
	}
}

module.exports = NineSliceObject;
