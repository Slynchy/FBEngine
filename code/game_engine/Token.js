
class Token {
	constructor(props){
		this.name = "SampleToken";
		this.uid = Math.random() | Date.now();
		this._queuedForDestruction = false;

		if(props) Object.assign(this,props);
	};

	destroy() {
		"use strict";
		this._queuedForDestruction = true;
	};

	startStep(delta){
		"use strict";
		// this function is called at the start of a frame
	};

	endStep(delta){
		"use strict";
		// this function is called at the end of a frame
	};

	onDestroy(){
		"use strict";
	};

	onAdd(){
		"use strict";
	};

}

module.exports = Token;