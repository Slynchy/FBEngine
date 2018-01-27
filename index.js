
// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
String.prototype.hashCode = function() {
	var hash = 0, i, chr;
	if (this.length === 0) return hash;
	for (i = 0; i < this.length; i++) {
	  chr   = this.charCodeAt(i);
	  hash  = ((hash << 5) - hash) + chr;
	  hash |= 0; // Convert to 32bit integer
	}
	return hash;
  };

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

const AudioAPI = require("./code/game_engine/Audio.js");
global.AudioAPI = AudioAPI;


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

window.addEventListener('resize', function(){
	onResize(application.renderer, application.view);
});

const flowController = require("./code/game_logic/flowController.js");
global.flowController = flowController;


/*
	FUNCTIONS INITIALIZATION
*/

function SetRendererProperties(rendererView){
	"use strict";
	rendererView.style = Object.assign(rendererView.style, Settings.PIXI.styleSettings);
}

function onResize(renderer) {
	renderer.resize( Settings.PIXI.applicationSettings.width, Settings.PIXI.applicationSettings.height );
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

/*
    This gives us more accurate delta time... possibly
    Set to false or null to disable
 */
let deltaExperimental = Date.now();

function MainLoop (delta) {
	"use strict";
	let deltaTime = delta;

	if(deltaExperimental){
		deltaTime = (Date.now() - deltaExperimental) * 0.07;
		deltaExperimental = Date.now();
	}

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