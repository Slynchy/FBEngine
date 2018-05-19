let PIXI = require('pixi.js');

class ContainerObject extends PIXI.Container {
	constructor(props) {
		'use strict';
		super();

		//this.orientation = Math.random() < 0.5 ? 0 : 1; // 0 == down to up, 1 == up to down
		this.tag = 'ContainerObject';

		this.uid = parseInt(
			Math.random()
				.toString()
				.slice(2)
		);

		this._addChild = this.addChild;
		this.addChild = obj => {
			if (obj.onAdd) obj.onAdd(this);
			this._addChild(obj);
			this._forceSort();
		};

		this._removeChild = this.removeChild;
		this.removeChild = obj => {
			if (obj.onRemove) obj.onRemove();
			this._removeChild(obj);
			this._forceSort();
		};

		if (props) Object.assign(this, props);
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

	set z(val) {
		this.zOrder = val;
	}

	get z() {
		return this.zOrder;
	}

	onAdd(scene) {
		'use strict';
		this.parentScene = scene;
	}

	onDestroy() {
		/* To be overridden*/
	}
	onRemove() {
		/* To be overridden*/
	}

	_forceSort() {
		this.children.sort(function(a, b) {
			if (!a.zOrder) a.zOrder = 0;
			if (!b.zOrder) b.zOrder = 0;
			if (a.zOrder === b.zOrder) return 0;
			else return a.zOrder < b.zOrder ? -1 : 1;
		});
	}

	destroy() {
		if (this.onDestroy) this.onDestroy();
		if (this.parentScene) this.parentScene.removeChild(this);
	}

	endStep(dt) {
		'use strict';

		for (let k = 0; k < this.children.length; i++) {
			if(this.children[k].endStep)
				this.children[k].endStep(dt);
		}
	}
}

module.exports = ContainerObject;
