
/*
	SETTINGS INITIALIZATION
*/

const Settings = require("./code/Settings/Settings.js");
global.Settings = Settings;


/*
	PIXI INITIALIZATION
*/

const PIXI = require("pixi.js");
global.PIXI = PIXI;


/*
	APPLICATION INITIALIZATION
*/

global.tokens = [];

const application = new PIXI.Application(Settings.PIXI.applicationSettings);
global.application = application;
application.renderer.backgroundColor = 0xEEEEEE;
document.body.appendChild(application.view);
SetRendererProperties(application.renderer.view);
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
application.ticker.add(MainLoop);

const flowController = require("./code/game_logic/flowController.js");
global.flowController = flowController;


/*
	FUNCTIONS INITIALIZATION
*/

Object.assignDeep = function(target, ...sources) {
	if (!sources.length) return target;
	const source = sources.shift();

	let isObject = function(item) {
		return (item && typeof item === 'object' && !Array.isArray(item));
	};

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				Object.assignDeep(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return Object.assignDeep(target, ...sources);
};

function SetRendererProperties(rendererView){
	"use strict";
	rendererView.style.width = Settings.PIXI.styleSettings.width;
	rendererView.style.height = Settings.PIXI.styleSettings.height;
	rendererView.style.position = Settings.PIXI.styleSettings.position;
	rendererView.style.left = Settings.PIXI.styleSettings.left;
	rendererView.style.top = Settings.PIXI.styleSettings.top;
	rendererView.style.transform = Settings.PIXI.styleSettings.transform;
}

function AddToken(token){
	tokens.push(token);
	if(token.onAdd) token.onAdd();
	return tokens[tokens.length-1];
}

function RemoveToken(token){
	for(let i = 0; i < tokens.length; i++){
		if(tokens[i].uid === token.uid){
			tokens[i]._queuedForDestruction = true;
			if(tokens[i].onRemove)
				tokens[i].onRemove();
			return;
		}
	}
}
global.AddToken = AddToken;
global.RemoveToken = RemoveToken;

/*
	MAIN CODE INITIALIZATION
*/

let lastTime = 0;
function MainLoop (delta) {
	"use strict";
	let deltaTime = 0;
	if(lastTime){
		deltaTime = Date.now() - lastTime;
	}
	lastTime = Date.now();

	if(flowController.currentAction)
		flowController.currentAction();

	if(flowController && flowController.game)
		flowController.game.physicsStep(deltaTime);

	for(let i = 0; i < tokens.length; i++){
		if(!tokens[i]._queuedForDestruction && tokens[i].startStep){
			tokens[i].startStep(deltaTime);
		}
	}
	for(let i = 0; i < tokens.length; i++){
		if(!tokens[i]._queuedForDestruction && tokens[i].endStep){
			tokens[i].endStep(deltaTime);
		}
	}
	for(let i = (tokens.length-1); i >= 0; i--){
		if(tokens[i]._queuedForDestruction){
			tokens[i].onDestroy();
			tokens[i] = null;
			tokens.splice(i,1);
		}
	}
}