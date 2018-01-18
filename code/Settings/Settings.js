let game = require("../game_logic/game.js");
let mainMenu = require("../game_logic/mainMenu.js");

let Settings = function() {
	this.init();
};

Settings.prototype.init = function(){
	this.PIXI = {};

	this.PIXI.applicationSettings = {
		width: 384,
		height: 683,
		antialias: false,
		sharedTicker: true,
		autoStart: false,
		roundPixels: true
	};

	this.PIXI.styleSettings = {
		width: (this.PIXI.applicationSettings.width / this.PIXI.applicationSettings.height) * window.innerHeight,
		height: window.innerHeight,
		position: 'absolute',
		left: '50%',
		top: '50%',
		transform: 'translate3d( -50%, -50%, 0 )',
		//SCALE_MODE: PIXI.SCALE_MODES.NEAREST,
	};

	this.GameSettings = {
		birdJumpPower: 10,
		gravity: 9.81,
		gravityStrength: 1,
		birdAnimSpeed: 30, // in milliseconds, how often to change sprite of anim
		moveSpeed: 1.75, // move speed of the level
		pipes: {
			offset: 40, // The base amount to offset the pipes on the Y axis
			chanceOffset: 50 // The amount that it COULD offset (i.e. if it's 50, then the offset can be 0 to 50)
		}
	};

	this.Analytics = {
		tid: 'UA-73612409-3'
	};

	this.Graphics = {
		width: 1366,
		height: 768,
		bgColor: 0xEEEEEE
	};

	this.resources = {
		'yellowbird_downflap': 'yellowbird_downflap.png',
		'yellowbird_midflap': 'yellowbird_midflap.png',
		'yellowbird_upflap': 'yellowbird_upflap.png',
		'pipe_green': 'pipe_green.png',
		'pipe_green_flipped': 'pipe_green_flipped.png',
		'background_day': 'background_day.png',
		'test_sprite': 'test_sprite.png',
		'ground_floor': 'ground_floor.png',
		'number0': '0.png',
		'number1': '1.png',
		'number2': '2.png',
		'number3': '3.png',
		'number4': '4.png',
		'number5': '5.png',
		'number6': '6.png',
		'number7': '7.png',
		'number8': '8.png',
		'number9': '9.png',
		'message': 'message.png'
	};

	this.flowSettings = {
		mainMenu: mainMenu,
		inGame: game
	}

};

module.exports = (new Settings());