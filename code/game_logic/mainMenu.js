
let Token = require("../game_engine/Token.js");

class MainMenu extends Token {
	constructor(props){
		super({});
		this.name = "MainMenu";
		this._queuedForDestruction = false;

		this.dialog = new PIXI.Container();

		this._onPlay = null;

		if(props) Object.assign(this,props);
	};

	startGame(){
		"use strict";
		if(this.onPlay)
			this.onPlay();
		this.destroy();
	}

	get onPlay() {
		return this._onPlay;
	}
	set onPlay(val){
		this._onPlay = val;
	}

	onDestroy(){
		super.onDestroy();
		application.stage.removeChild(this.dialog);
	}

	onAdd(){
		"use strict";
		let self = this;

		super.onAdd();

		this.text = new PIXI.Text("Generic\nMain\nMenu", {
			fontFamily:"Arial",
			fontSize: 46,
			wordWrap: true,
			wordWrapWidth: 200,
			padding: 10,
			leading: 10,
			fill : 0x222222,
			align: 'center'
		});
		this.text.scale.x = 2;
		this.text.scale.y = 2;
		this.text.x = (application.renderer.width / 2) - (this.text.width / 2);
		this.text.y = (application.renderer.height / 3)- (this.text.height / 2);
		this.text.interactive = true;
		this.text.on('pointerup', (event) =>{
			self.startGame();
		});
		this.dialog.addChild(this.text);

		application.stage.addChild(this.dialog);
	};

}

module.exports = MainMenu;