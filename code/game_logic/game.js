// Also template for tokens

let Token = require("../game_engine/Token.js");
let GameObject = require("../game_engine/GameObject.js");
let Player = require("./Player.js");
let Background = require("./Background.js");
let Pipe = require("./Pipe.js");
let Ground = require("./Ground.js");
let InGameUI = require("./InGameUI.js");

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

		this._states = {
			STARTING: 0,
			INGAME: 1,
			GAMEOVER: 2
		};

		this.physics = {
			gravity: 9.81,
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

		for(let i=0; i < this.sceneGraph.length; i++){
			this.sceneGraph[i].endStep(delta);
		}
		//this.player.rotation += (0.004);
	};

	onDestroy(){
		"use strict";
		super.onDestroy();
		application.stage.removeChild(this.scene);
		application.stage.removeChild(this.ui);
		flowController.game = null;
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
		this.ground.y = application.renderer.height - ground_floor.height;
		this.ground.width = application.renderer.width;
		this.addObjectToScene(this.ground);

		this.ground2 = new Ground();
		this.ground2.x = application.renderer.width;
		this.ground2.y = application.renderer.height - ground_floor.height;
		this.ground2.width = application.renderer.width;
		this.addObjectToScene(this.ground2);

		this.player = new Player(yellowbird_midflap);
		this.player.x = 100;
		this.player.y = application.renderer.height / 2;
		this.addObjectToScene(this.player);

		this.jumpButton = new GameObject(null, { checkCollisions: false });
		this.jumpButton.x = 0;
		this.jumpButton.y = 0;
		this.jumpButton.width = Settings.PIXI.applicationSettings.width;
		this.jumpButton.height = Settings.PIXI.applicationSettings.height;
		this.jumpButton.interactive = true;
		this.jumpButton.on('pointerup', (event) =>{
			self.player.jump();
		});
		this.addObjectToScene(this.jumpButton);


		application.stage.addChild(this.scene);

		this.ui = new InGameUI();
		application.stage.addChild(this.ui);
		this.ui.onAdd(application.stage);
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

	CheckCollision(obj1, obj2){
		if(obj1.checkCollisions == false || obj2.checkCollisions == false) return false;

		var obj1_truePos = {
			x1: obj1.toGlobal(this.scene).x - (obj1.width * obj1.anchor.x),
			x2: obj1.toGlobal(this.scene).x - (obj1.width * obj1.anchor.x) + obj1.width,
			y1: obj1.toGlobal(this.scene).y - (obj1.height * obj1.anchor.y),
			y2 :obj1.toGlobal(this.scene).y - (obj1.height * obj1.anchor.y) + obj1.height
		};

		var obj2_truePos = {
			x1: obj2.toGlobal(this.scene).x - (obj2.width * obj2.anchor.x),
			x2: obj2.toGlobal(this.scene).x - (obj2.width * obj2.anchor.x) + obj2.width,
			y1: obj2.toGlobal(this.scene).y - (obj2.height * obj2.anchor.y),
			y2 :obj2.toGlobal(this.scene).y - (obj2.height * obj2.anchor.y) + obj2.height
		}

		if (obj1_truePos.x1 < obj2_truePos.x2 &&
			obj1_truePos.x2 > obj2_truePos.x1 &&
			obj1_truePos.y1 < obj2_truePos.y2 &&
			obj1_truePos.y2 > obj2_truePos.y1 )
		{
			return true;
		}
		else return false;
	}

	HandleCollision(obj1,obj2){
		obj1.collisions.push(obj2);
		obj2.collisions.push(obj1);

		obj1.onCollide();
		obj2.onCollide();
	}

	physicsStep(dt){
		this.physics.dtElapsed += dt;

		if(this.physics.dtElapsed >= this.physics.stepInterval){
			this.physics.dtElapsed = 0;
			for(let i = 0; i < this.physics.stepAmount; i++){
				for(let o = 0; o < this.sceneGraph.length; o++){
					if(this.sceneGraph[o].isPlayer === true) {
						this.sceneGraph[o].collisions = [];
						continue;
					}

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