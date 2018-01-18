
let Token = require("../game_engine/Token.js");
let GameObject = require("../game_engine/GameObject.js");
let Background = require("./Background.js");
let Ground = require("./Ground.js");

class MainMenu extends Token {
	constructor(props){
		super({});
		let self = this;

		this.name = "MainMenu";
		this._queuedForDestruction = false;

		this.dialog = new PIXI.Container();

		this._onPlay = null;

		this.bg = new Background(background_day);
		this.bg.width = Settings.PIXI.applicationSettings.width;
		this.bg.height = Settings.PIXI.applicationSettings.height;
		this.dialog.addChild(this.bg);

		this.bg2 = new Background(background_day);
		this.bg2.width = Settings.PIXI.applicationSettings.width;
		this.bg2.x = this.bg2.width;
		this.bg2.height = Settings.PIXI.applicationSettings.height;
		this.dialog.addChild(this.bg2);

		this.ground = new Ground();
		this.ground.x = 0;
		this.ground.y = application.renderer.height - ground_floor.height;
		this.ground.width = application.renderer.width;
		this.dialog.addChild(this.ground);

		this.ground2 = new Ground();
		this.ground2.x = application.renderer.width;
		this.ground2.y = application.renderer.height - ground_floor.height;
		this.ground2.width = application.renderer.width;
		this.dialog.addChild(this.ground2);

		this.title = new GameObject(mainMenu_title, { checkCollisions: false });
		this.title.scale.x = 3;
		this.title.scale.y = 3;
		this.title.x = (application.renderer.width / 2) - (this.title.width / 2);
		this.title.y = (application.renderer.height / 5)- (this.title.height / 2);
		this.dialog.addChild(this.title);

		this.play = new GameObject(mainMenu_play, { checkCollisions: false });
		this.play.scale.x = 3;
		this.play.scale.y = 3;
		this.play.x = ((application.renderer.width / 2) - (this.play.width / 2)) - (this.play.width / 2) - 5;
		this.play.y = (application.renderer.height / 2)- (this.play.height / 2);
		this.play.interactive = true;
		this.play.on('pointerup', (event) =>{
			self.startGame();
		});
		this.dialog.addChild(this.play);

		this.leaderboard = new GameObject(mainMenu_leaderboard, { checkCollisions: false });
		this.leaderboard.scale.x = 3;
		this.leaderboard.scale.y = 3;
		this.leaderboard.x = ((application.renderer.width / 2) - (this.leaderboard.width / 2)) + (this.leaderboard.width / 2) + 5;
		this.leaderboard.y = (application.renderer.height / 2)- (this.leaderboard.height / 2);
		this.leaderboard.interactive = true;
		this.leaderboard.on('pointerup', (event) =>{
			console.log('leaderboard');
		});
		this.dialog.addChild(this.leaderboard);

		application.stage.addChild(this.dialog);

		if(props) Object.assign(this,props);
	};

	startGame(){
		"use strict";
		if(this.onPlay)
			this.onPlay();
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
	};

	endStep(dt){
		"use strict";
		super.endStep(dt);

		this.bg.endStep(dt);
		this.bg2.endStep(dt);
		this.ground.endStep(dt);
		this.ground2.endStep(dt);
	}

}

module.exports = MainMenu;