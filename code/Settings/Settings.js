let game = require("../game_logic/game.js");
let mainMenu = require("../game_logic/mainMenu.js");

let Settings = function() {
	this.init();
};

Settings.prototype.init = function(){
	this.PIXI = {};

	this.PIXI.applicationSettings = {
		width: 384, // REQUIRED
		height: 683, // REQUIRED
		antialias: false,
		sharedTicker: true, // REQUIRED
		autoStart: false, // REQUIRED
		roundPixels: true
	};

	this.PIXI.styleSettings = {
		width: window.innerWidth,
		height: window.innerHeight,
		position: 'absolute',
		left: '50%',
		top: '50%',
		transform: 'translate3d( -50%, -50%, 0 )',
		//SCALE_MODE: PIXI.SCALE_MODES.NEAREST,
	};

	this.GameSettings = {
		birdJumpPower: 5,
		gravityStrength: 0.35,
		terminalVelocity: 4.5,
		birdAnimSpeed: 30, // in milliseconds, how often to change sprite of anim
		moveSpeed: 2.25, // move speed of the level
		pipes: {
			offset: 35, // The base amount to offset the pipes on the Y axis
			chanceOffset: 40 // The amount that it COULD offset (i.e. if it's 50, then the offset can be 0 to 50)
		}
	};

	this.Analytics = {
		tid: 'UA-73612409-3',
		url: 'https://www.google-analytics.com/collect?'
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
		'message': 'message.png',
		'mainMenu_play': 'mainMenu/playbutton.png',
		'mainMenu_copyright': 'mainMenu/copyright.png',
		'mainMenu_leaderboard': 'mainMenu/leaderboardbutton.png',
		'mainMenu_title': 'mainMenu/title.png',
        'white': 'white.png'
	};

	this.flowSettings = {
		mainMenu: mainMenu,
		inGame: game
	}

};

module.exports = (new Settings());