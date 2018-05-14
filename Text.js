let PIXI = require('pixi.js');

class Text extends PIXI.Text {
	constructor(props) {
		'use strict';
		super(props['text'] ? props['text'] : '', props);
		this.tag = 'Text';

		// TODO: Implement _isVisible properly
		this._isVisible = true;

		this.parentScene = null;

		if (props) Object.assign(this, props);
	}

	hide() {
		'use strict';
		this.alpha = 0;
		this._isVisible = false;
	}

	onAdd(scene) {
		'use strict';
		this.parentScene = scene;
	}

	show() {
		'use strict';
		this.alpha = 1;
		this._isVisible = true;
	}

	endStep() {}

	onRemove() {}

	get x() {
		return this.position.x;
	}

	get y() {
		'use strict';
		return this.position.y;
	}

	set x(val) {
		this.position.x = val;
	}

	set y(val) {
		'use strict';
		this.position.y = val;
	}
}

module.exports = Text;
