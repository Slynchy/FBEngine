
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

		this.animTimer = 0;
		this.animState = 1;

		this.bg = new Background(background_day);
		this.bg.width = Settings.PIXI.applicationSettings.width;
		this.bg.height = Settings.PIXI.applicationSettings.height;
		this.dialog.addChild(this.bg);

		this.bg2 = new Background(background_day);
		this.bg2.width = Settings.PIXI.applicationSettings.width;
		this.bg2.x = this.bg2.width;
		this.bg2.height = Settings.PIXI.applicationSettings.height;
		this.dialog.addChild(this.bg2);

		this.bird = new GameObject(yellowbird_midflap, {checkCollisions: false});
		this.bird.anchor.x = 0.5;
		this.bird.anchor.y = 0.5;
		this.bird.x = Settings.PIXI.applicationSettings.width / 2;
		this.bird.y = Settings.PIXI.applicationSettings.height / 2;
		this.bird.scale.x = 2;
		this.bird.scale.y = 2;
		this.dialog.addChild(this.bird);

		this.ground = new Ground();
		this.ground.x = 0;
		this.ground.y = application.renderer.height - (ground_floor.height * 3);
		this.ground.width = application.renderer.width;
		this.dialog.addChild(this.ground);

		this.ground2 = new Ground();
		this.ground2.x = application.renderer.width;
		this.ground2.y = application.renderer.height - (ground_floor.height * 3);
		this.ground2.width = application.renderer.width;
		this.dialog.addChild(this.ground2);

		this.title = new GameObject(mainMenu_title, { checkCollisions: false });
		this.title.scale.x = 3;
		this.title.scale.y = 3;
		this.title.x = (application.renderer.width / 2) - (this.title.width / 2);
		this.title.y = (application.renderer.height / 5)- (this.title.height / 2);
		this.dialog.addChild(this.title);

		this.copyright = new GameObject(mainMenu_copyright, { checkCollisions: false });
		this.copyright.anchor.x = 0.5;
		this.copyright.anchor.y = 0.5;
		this.copyright.scale.x = 3;
		this.copyright.scale.y = 3;
        this.copyright.x = (application.renderer.width / 2);
        this.copyright.y = (application.renderer.height - this.copyright.height - 10);
        this.dialog.addChild(this.copyright);

        this.muteButton = new GameObject(flowController.audioMuted === true ? button_muted : button_unmuted, {checkCollisions: false});
		this.muteButton.anchor.x = 1.0;
		this.muteButton.x = Settings.PIXI.applicationSettings.width - 10;
		this.muteButton.y = 10;
		this.muteButton.interactive = true;
		this.muteButton.on('pointerup', (event) =>{
			AudioAPI.muted = !AudioAPI.muted;
			self.updateMuteButton();
		});
		this.dialog.addChild(this.muteButton);

		this.play = new GameObject(mainMenu_play, { checkCollisions: false });
		this.play.scale.x = 3;
		this.play.scale.y = 3;
		this.play.x = ((application.renderer.width / 2) - (this.play.width / 2)) - (this.play.width / 2) - 5;
		this.play.y = (application.renderer.height / 2) - (this.play.height / 2) + 50;
		this.play.interactive = true;
		this.play.on('pointerup', (event) =>{
			self.startGame();
		});
		this.dialog.addChild(this.play);

		this.leaderboard = new GameObject(mainMenu_leaderboard_locked, { checkCollisions: false });
		this.leaderboard.scale.x = 3;
		this.leaderboard.scale.y = 3;
		this.leaderboard.x = ((application.renderer.width / 2) - (this.leaderboard.width / 2)) + (this.leaderboard.width / 2) + 5;
		this.leaderboard.y = (application.renderer.height / 2)- (this.leaderboard.height / 2) + 50;
		this.leaderboard.interactive = true;
		this.leaderboard.on('pointerup', (event) =>{
			console.log('leaderboard');
		});
		this.dialog.addChild(this.leaderboard);

		application.stage.addChild(this.dialog);

		if(props) Object.assign(this,props);
	};

	updateMuteButton(){
		let tex = (AudioAPI.muted === true ? button_muted : button_unmuted);
		this.muteButton.updateTexture(tex);
	}

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

		let storedY = this.bird.y;
		this.bird.y = -100 + ((Settings.PIXI.applicationSettings.height / 2) + ((20) * Math.sin(Date.now() * 0.002)));
		storedY = storedY - this.bird.y;
		this.bird.rotation = Math.atan2(storedY, 4);

		this.animTimer += dt;
		if(this.animTimer > Settings.GameSettings.birdAnimSpeed){
			this.animTimer = 0;
			if(this.animState >= 2){
				this.animState = 0;
			} else {
				this.animState++;
			}
			switch(this.animState){
				case 0:
					this.bird.updateTexture(yellowbird_downflap);
					break;
				case 1:
					this.bird.updateTexture(yellowbird_midflap);
					break;
				case 2:
					this.bird.updateTexture(yellowbird_upflap);
					break;
			}
		}

		this.bg.endStep(dt);
		this.bg2.endStep(dt);
		this.ground.endStep(dt);
		this.ground2.endStep(dt);
	}

}

module.exports = MainMenu;