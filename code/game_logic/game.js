// Also template for tokens

var Token = require("../game_engine/Token.js");

class Game extends Token {
	constructor(props){
		super({});

		/*
			Game variables go here
		 */
		this._difficulty = 0;
		this.scene = new PIXI.Container();
		this.counter = 0;

		Object.assign(this, props);
	}

	get difficulty(){
		return this._difficulty;
	}

	set difficulty(val){
		this._difficulty = val;
	}

	startStep(delta){
		"use strict";
		super.startStep(delta);
	};

	endStep(delta){
		"use strict";
		super.endStep(delta);
		this.testSprite.rotation += (0.004);
	};

	destroy() {
		"use strict";
		super.destroy();
	};

	onDestroy(){
		"use strict";
		super.onDestroy();
		application.stage.removeChild(this.scene);
	};

	onAdd(){
		"use strict";
		super.onAdd();

		this.testSprite = new PIXI.Sprite(test_sprite);
		this.testSprite.x = application.renderer.width / 2;
		this.testSprite.y = application.renderer.height / 2;
		this.scene.addChild(this.testSprite);
		application.stage.addChild(this.scene);
	};

	/*
		UNIQUE FUNCTIONS HERE
	 */

	// Quits the game
	quit(){
		"use strict";
		this.destroy();
	}
}

module.exports = Game;