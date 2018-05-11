class Token {
	constructor(props) {
		this.name = 'SampleToken';
		this.uid = Math.floor(Math.random() * Date.now());
		this._queuedForDestruction = false;

		if (props) Object.assign(this, props);
	}

	destroy() {
		'use strict';
		this._queuedForDestruction = true;
		if (this.onDestroy) this.onDestroy();
	}

	startStep(delta) {
		'use strict';
		// this function is called at the start of a frame
	}

	endStep(delta) {
		'use strict';
		// this function is called at the end of a frame
	}

	onDestroy() {
		'use strict';
	}

	onAdd() {
		'use strict';
	}

	// THIS IS CALLED 1 FRAME BEFORE "ON DESTROY"
	onRemove() {
		'use strict';
	}
}

module.exports = Token;
