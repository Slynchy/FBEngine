// Also template for tokens

let Token = require("../game_engine/Token.js");
let GameObject = require("../game_engine/GameObject.js");
let Player = require("./Player.js");
let Background = require("./Background.js");
let Pipe = require("./Pipe.js");
let Ground = require("./Ground.js");

class Game extends Token {
	constructor(props){
		super({});

		/*
			Game variables go here
		 */
		this.name = "Game";
		this._difficulty = 0;
		this.scene = new PIXI.Container();
		this.counter = 0;
		this.player = null;

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

	get difficulty(){
		return this._difficulty;
	}

	set difficulty(val){
		this._difficulty = val;
	}

	endStep(delta){
		"use strict";
		super.endStep(delta);

		for(let i=0; i < this.sceneGraph.length; i++){
			this.sceneGraph[i].endStep();
		}
		//this.player.rotation += (0.004);
	};

	// THIS IS CALLED 1 FRAME BEFORE "ON DESTROY"
	onDestroy(){
		"use strict";
		super.onDestroy();
		application.stage.removeChild(this.scene);
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
		this.object.x = application.renderer.width / 2;
		this.object.y = 0;
		this.addObjectToScene(this.object);

		this.object2 = new Pipe();
		this.object2.x = application.renderer.width;
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

		var obj1_wPos = obj1.toGlobal(this.scene);
		var obj2_wPos = obj2.toGlobal(this.scene);

		if (obj1_wPos.x < obj2_wPos.x + obj2.width &&
			obj1_wPos.x + obj1.width > obj2_wPos.x &&
			obj1_wPos.y < obj2_wPos.y + obj2.height &&
			obj1_wPos.y + obj1.height > obj2_wPos.y)
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