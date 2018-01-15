let game = require("../game_logic/game.js");
let mainMenu = require("../game_logic/mainMenu.js");

let Settings = function() {
	this.init();
};

Settings.prototype.init = function(){
	this.PIXI = {};

	this.PIXI.applicationSettings = {
		width: 768,
		height: 1366,
		antialias: true,
		sharedTicker: true,
		autoStart: false,
		//roundPixels: true
	};

	this.PIXI.styleSettings = {
		width: (this.PIXI.applicationSettings.width / this.PIXI.applicationSettings.height) * window.innerHeight,
		height: window.innerHeight,
		position: 'absolute',
		left: '50%',
		top: '50%',
		transform: 'translate3d( -50%, -50%, 0 )',
		SCALE_MODE: null,
	};

	this.Graphics = {
		width: 1366,
		height: 768,
		bgColor: 0xEEEEEE
	};

	this.resources = {
		'test_sprite': 'test_sprite.png'
	};

	this.flowSettings = {
		mainMenu: mainMenu,
		inGame: game
	}

};

module.exports = (new Settings());