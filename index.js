
/*
	SETTINGS INITIALIZATION
*/

const Settings = require("./code/Settings/Settings.js");
global.Settings = Settings;

/*
	GAMESPARKS INITIALIZATION
*/

//const gsApi = require("./code/Settings/Settings.js");
//global.gsApi = gsApi;

/*
	AD API INITIALIZATION
*/

const adAPI = require("./code/game_engine/Adverts.js");
global.adAPI = adAPI;

/*
	SAVE DATA INITIALIZATION
*/

const SaveData = require("./code/game_engine/SaveData.js");
global.SaveData = SaveData;


/*
	PIXI INITIALIZATION
*/

const PIXI = require("pixi.js");
global.PIXI = PIXI;


/*
	ANALYTICS INITIALIZATION
*/

const Analytics = new (require("./code/game_engine/Analytics.js"))(Settings.Analytics.tid, true);
global.Analytics = Analytics;

/*
	APPLICATION INITIALIZATION
*/

function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t
}
global.lerp = lerp;

global.tokens = [];

const application = new PIXI.Application(Settings.PIXI.applicationSettings);
global.application = application;
application.renderer.backgroundColor = 0x000000;
document.body.appendChild(application.view);
SetRendererProperties(application.renderer.view);
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
application.ticker.scale = 0.001;
application.ticker.add(MainLoop);

const flowController = require("./code/game_logic/flowController.js");
global.flowController = flowController;


/*
	FUNCTIONS INITIALIZATION
*/

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

function MainLoop (delta) {
	"use strict";
	let deltaTime = delta;

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
			tokens[i] = null;
			tokens.splice(i,1);
		}
	}
}