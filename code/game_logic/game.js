// Also template for tokens

let Token = require("../game_engine/Token.js");
let GameObject = require("../game_engine/GameObject.js");
let Player = require("./Player.js");
let Background = require("./Background.js");
let Pipe = require("./Pipe.js");
let Ground = require("./Ground.js");
let InGameUI = require("./InGameUI.js");
let EndScreenUI = require("./EndScreenUI.js");
let FlashWhite = require("./FlashWhite.js");
let StaticEffect = require("./StaticEffect.js");
let RewardedAdDialog = require("./RewardedAdDialog.js");

class Game extends Token {
	constructor(props){
		super({});

		/*
			Game variables go here
		 */
		this.name = "Game";
		this.scene = new PIXI.Container();
		this.score = 0;
		this.counter = 0;
		this.player = null;
        this._whiteFlash = null;
        this.ui = null;

        this.hasRetried = false;

		this._states = {
			DO_NOTHING: -1,
			STARTING: 0,
			INGAME: 1,
			GAMEOVER: 2,
			GAMEOVER_UI: 3,
            REWARDED_AD: 0x6c6f616473616d6f6e6579
		};
		this.state = this._states.DO_NOTHING;

		// DEPRECATED
		this.physics = {
			scale: 1,
			dtElapsed: 0,
			stepAmount: 1, // amount of iterations to do per frame
			stepInterval: 1/60
		};

		this.sceneGraph = [];

		Object.assign(this, props);
	}

	endStep(delta){
		"use strict";
		super.endStep(delta);

		this.ui.endStep(delta);

		switch(this.state){
			case this._states.STARTING:
			case this._states.INGAME:
                this.player.endStep(delta);
				for(let i=0; i < this.sceneGraph.length; i++){
					this.sceneGraph[i].endStep(delta);
				}
				break;
			case this._states.GAMEOVER:
				this.player.endStep(delta);
				if(this.rewindUI)
                	this.rewindUI.endStep(delta);
				if(this.player.recording && this.player.recording.isPlaying){
                    for(let i=0; i < this.sceneGraph.length; i++){
                        this.sceneGraph[i].endStep(delta);
                    }
				}
				if(this._whiteFlash)
					this._whiteFlash.endStep(delta);
				break;
            case this._states.GAMEOVER_UI:
            	if(this.gameOverUI)
                    this.gameOverUI.endStep(delta);
            	break;
            case this._states.REWARDED_AD:
                if(this.rewardedAdUI)
                    this.rewardedAdUI.endStep(delta);
                break;
		}
	};

	onDestroy(){
		"use strict";
		super.onDestroy();
		application.stage.removeChild(this.scene);
		application.stage.removeChild(this.ui);
		flowController.game = null;
		flowController.showMainMenu();
	};

	onAdd(){
		"use strict";
		super.onAdd();
		let self = this;

		this.bg = new Background(background_day);
		this.bg.width = Settings.PIXI.applicationSettings.width;
		this.bg.height = Settings.PIXI.applicationSettings.height;
		this.addObjectToScene(this.bg);

		this.bg2 = new Background(background_day);
		this.bg2.width = Settings.PIXI.applicationSettings.width;
		this.bg2.x = this.bg2.width;
		this.bg2.height = Settings.PIXI.applicationSettings.height;
		this.addObjectToScene(this.bg2);

		this.object = new Pipe();
		this.object.x = application.renderer.width / 2 * 2;
		this.object.y = 0;
		this.addObjectToScene(this.object);

		this.object2 = new Pipe();
		this.object2.x = application.renderer.width * 2;
		this.object2.y = 0;
		this.addObjectToScene(this.object2);

		this.ground = new Ground();
		this.ground.x = 0;
		this.ground.y = application.renderer.height - (ground_floor.height * 3);
		this.ground.width = application.renderer.width;
		this.addObjectToScene(this.ground);

		this.ground2 = new Ground();
		this.ground2.x = application.renderer.width;
		this.ground2.y = application.renderer.height - (ground_floor.height * 3);
		this.ground2.width = application.renderer.width;
		this.addObjectToScene(this.ground2);

		this.player = new Player(yellowbird_midflap);
		this.player.x = 100;
		this.player.y = application.renderer.height / 2;
        this.scene.addChild(this.player);

		this.jumpButton = new GameObject(null, { checkCollisions: false });
		this.jumpButton.x = 0;
		this.jumpButton.y = 0;
		this.jumpButton.width = Settings.PIXI.applicationSettings.width;
		this.jumpButton.height = Settings.PIXI.applicationSettings.height;
		this.jumpButton.interactive = true;
		this.jumpButton.on('pointerup', (event) =>{
			if(this.ui && this.ui.gamestart && this.ui.gamestart.callback && this.ui.gamestart.isBeingRemoved === false){
				this.ui.gamestart.callback();
                self.player.jump();
			} else {
				self.player.jump();
			}
		});
		this.addObjectToScene(this.jumpButton);


		application.stage.addChild(this.scene);

		this.ui = new InGameUI();
		application.stage.addChild(this.ui);
		this.ui.onAdd(application.stage);

		this.changeState(this._states.STARTING);
	};

	/*
		UNIQUE FUNCTIONS HERE
	 */

	addObjectToScene(obj){
		this.sceneGraph.push(obj);
		this.scene.addChild(obj);
		if(obj.children){
			for(let k in obj.children){
				this.sceneGraph.push(obj.children[k]);
				if(obj.children[k].onAdd) obj.children[k].onAdd(this.scene, this.physics.world);
			}
		}
		if(obj.onAdd) obj.onAdd(this.scene, this.physics.world);
	}

	startRewind(){
		"use strict";
		for(let i = 0; i < this.sceneGraph.length; i++){
			var obj = this.sceneGraph[i];
			if(obj.tag === "Pipe" ||
                obj.tag === "Ground" ||
                obj.tag === "Background" ){
				obj.rewind = true;
			}
		}

		this.rewindUI = new StaticEffect();
		this.scene.addChild(this.rewindUI);
	}

	gameOver(canShowAd){
		"use strict";
		let self = this;
		if(typeof(canShowAd) === 'undefined') canShowAd = true;

		if(this.score >= 5){
            Analytics.SendEvent('score', null, null, this.score);
		}

		this.state = this._states.GAMEOVER;
		this.flashWhite();
		this.ui.hideScore('set');
		this.freezePipesNShit();

		if(SaveData.data.highScore < this.score)
        	SaveData.saveData('highScore', this.score);

		let showAd = true;

		if(canShowAd === false || this.hasRetried === true || this.score <= Settings.GameSettings.retryScoreThreshold){
			showAd = false;
		}

		if(showAd === false){
            this.player.playDeathAnim(
                function(){
                    // onRewindFinish
                    self.changeState(self._states.GAMEOVER_UI);
                }
            );
		} else {
            this.player.playDeathAnim(
                /* onFinish, onRewindFinish */
                function(){
                    // onFinish
                    self.unfreezePipesNShit();
                    self.startRewind();
                },
                function(){
                    // onRewindFinish
                    //self.destroy();
                    self.scene.removeChild(self.rewindUI);
                    self.changeState(self._states.REWARDED_AD);
                }
            );
		}
	}

	flashWhite(){
		"use strict";
		// create white object and fade alpha to 0, destroy object when alpha hits 0
		let self = this;

		this._whiteFlash = new FlashWhite({
			onDestroy: function(){
				// do stuff
				self._whiteFlash = null;
			},
			_scene: application.stage,
		});
		this.addObjectToScene(this._whiteFlash);
	}

	changeState_silent(state){
		"use strict";
		this.state = state;
	}

	changeState(state){
		"use strict";
		let self = this;
		this.state = state;

		switch(this.state){
			case this._states.STARTING:
				this.ui.playGameStart(function(){
					if(self.player.isDying) return;
					self.changeState(self._states.INGAME);
					self.player.unfreeze();
				});
				break;
			case this._states.INGAME:

				break;
			case this._states.GAMEOVER:
				this.player.playGameOverAnim();
				break;
            case this._states.GAMEOVER_UI:
                gsApi.SendData('add_score', 'score', self.score);
            	this.gameOverUI = new EndScreenUI({score: this.score});
            	this.scene.addChild(this.gameOverUI);
                break;
            case this._states.REWARDED_AD:
            	this.rewardedAdUI = new RewardedAdDialog(
            		function(){ // onSuccess
						self.changeState(self._states.INGAME);

                        self.player.unfreeze();
                        self.player.isDying = false;
                        self.player.reset();

                        self.unfreezePipesNShit();

						self.hasRetried = true;

                        self.scene.removeChild(self.rewardedAdUI);
                        self.rewardedAdUI = null;

                        for(let i = 0; i < self.sceneGraph.length; i++){
                            let obj = self.sceneGraph[i];
                            if(obj.tag === "Pipe" ||
                                obj.tag === "Ground" ||
                                obj.tag === "Background" ){
                                obj.rewind = false;
                            }
                        }

                        self.ui.showScore('set');
					},
					function(){ // onClose
						self.scene.removeChild(self.rewardedAdUI);
						self.rewardedAdUI = null;
						self.changeState_silent(self._states.GAMEOVER_UI);
						self.gameOverUI = new EndScreenUI({score: self.score, fadeIn: false});
						self.scene.addChild(self.gameOverUI);
					}
				);
            	this.scene.addChild(this.rewardedAdUI);
                break;
		}
	}

	CheckCollision(obj1, obj2){
		if(obj1.checkCollisions == false || obj2.checkCollisions == false) return false;

		let obj1_truePos = {
			x1: obj1.toGlobal(this.scene).x - (obj1.width * obj1.anchor.x),
			x2: obj1.toGlobal(this.scene).x - (obj1.width * obj1.anchor.x) + obj1.width,
			y1: obj1.toGlobal(this.scene).y - (obj1.height * obj1.anchor.y),
			y2 :obj1.toGlobal(this.scene).y - (obj1.height * obj1.anchor.y) + obj1.height
		};

        let obj2_truePos = {
			x1: obj2.toGlobal(this.scene).x - (obj2.width * obj2.anchor.x),
			x2: obj2.toGlobal(this.scene).x - (obj2.width * obj2.anchor.x) + obj2.width,
			y1: obj2.toGlobal(this.scene).y - (obj2.height * obj2.anchor.y),
			y2 :obj2.toGlobal(this.scene).y - (obj2.height * obj2.anchor.y) + obj2.height
		};

		return (obj1_truePos.x1 < obj2_truePos.x2 &&
			obj1_truePos.x2 > obj2_truePos.x1 &&
			obj1_truePos.y1 < obj2_truePos.y2 &&
			obj1_truePos.y2 > obj2_truePos.y1 );
	}

	freezePipesNShit(){
        for(let i = 0; i < this.sceneGraph.length; i++){
            var obj = this.sceneGraph[i];
            if(
            	obj.tag === "Pipe" ||
                obj.tag === "Ground" ||
                obj.tag === "Background" )
            {
                obj.freeze();
            }
        }
	}

    unfreezePipesNShit(){
        for(let i = 0; i < this.sceneGraph.length; i++){
            var obj = this.sceneGraph[i];
            if(
                obj.tag === "Pipe" ||
                obj.tag === "Ground" ||
                obj.tag === "Background" )
            {
                obj.unfreeze();
            }
        }
    }

	HandleCollision(obj1,obj2){
		obj1.collisions.push(obj2);
		obj2.collisions.push(obj1);

		obj1.onCollide();
		obj2.onCollide();
	}

	physicsStep(dt){
		this.physics.dtElapsed += dt;

		this.player.collisions = [];

		if(this.physics.dtElapsed >= this.physics.stepInterval){
			this.physics.dtElapsed = 0;
			for(let i = 0; i < this.physics.stepAmount; i++){
				for(let o = 0; o < this.sceneGraph.length; o++){
					this.sceneGraph[o].collisions = [];
					let coll = this.CheckCollision(this.player, this.sceneGraph[o]);
					if(coll){
						this.HandleCollision(this.player, this.sceneGraph[o]);
					}
					this.sceneGraph[o].physicsStep(dt);

				}
			}
		}
	}

	// Quits the game
	quit(){
		"use strict";
		this.destroy();
	}
}

module.exports = Game;