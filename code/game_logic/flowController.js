

let FlowController = function(){
	this.finishedLoading = false;
	this.game = null;

	this.currentAction = this.main;
};

FlowController.prototype.log = function(data){
	return console.log("[flowController] " + data);
};

FlowController.prototype.main = function(){
	"use strict";
	// ENTRY POINT
	console.log('[flowController] main');
	let self = this;
	if(FBInstant){
		this.currentAction = this.startFBInstant;
		FBInstant.initializeAsync()
			.then(function() {
				console.log("[flowController] FACEBOOK INITITIALIZED!");
				self.currentAction = self.startLoading;
			});
	} else {
		this.currentAction = this.startLoading;
	}
};

FlowController.prototype.startLoading = function(){
	"use strict";
	console.log("[flowController] startLoading");

	let self = this;
	let length = Object.keys(Settings.resources).length;
	this.loadingProgress = 0;

	if(length === 0){
		this.finishedLoading = true;
		this.currentAction = this.showSplashScreen;
		return;
	}

	PIXI.loader.onLoad.add((file, res) => {
		console.log("[flowController] Loaded resource: " + res.url);
	});
	PIXI.loader.onError.add((err) => {
		throw new Error("[flowController] Failed to load file! " + err.stack);
	});

	let firstPromise;
	let currPromise;
	for(let k in Settings.resources){
		if(!Settings.resources.hasOwnProperty(k)) continue;

		if(!firstPromise){
			firstPromise = PIXI.loader.add(k, "assets/" + Settings.resources[k]);
			currPromise = firstPromise;
			continue;
		}

		currPromise = currPromise.add(k, "assets/" + Settings.resources[k]);
	}

	PIXI.loader.load(function(loader, resources){
		global._TEXTURES = {};
		for(let k in resources){
			if(resources.hasOwnProperty(k)){
				global[k] = resources[k].texture;
				global._TEXTURES[k] = resources[k].texture;
			}
		}
		self.finishedLoading = true;
	});

	if(FBInstant){
		FBInstant.setLoadingProgress(0);
	}
	this.currentAction = this.waitForLoading;
};

FlowController.prototype.waitForLoading = function(){
	"use strict";
	console.log("[flowController] waitForLoading");
	let self = this;

	if(PIXI.loader.progress === 100 && this.finishedLoading === true) {
		FBInstant.setLoadingProgress(100);
		console.log("[flowController] FB INSTANT GAME STARTING");
		this.currentAction = this.startFBInstant;
		FBInstant.startGameAsync()
			.then(function() {
				self.currentAction = self.showSplashScreen;
				global.FBINSTANT_INFO = {
					contextId: FBInstant.context.getID(),
					contextType: FBInstant.context.getType()
				};
			});
	} else {
		FBInstant.setLoadingProgress(PIXI.loader.progress);
	}
};

FlowController.prototype.startFBInstant = function(){
	"use strict";
};

FlowController.prototype.showSplashScreen = function(){
	"use strict";
	console.log("[flowController] showSplashScreen");
	// TODO: splash screen
	this.currentAction = this.showMainMenu;
};

FlowController.prototype.showMainMenu = function(){
	"use strict";
	console.log("[flowController] showMainMenu");

	let self = this;
	this.mainMenu = AddToken(new Settings.flowSettings.mainMenu());
	this.mainMenu.onPlay = function(){
		self.mainMenu.destroy();
		self.mainMenu = null;
		self.currentAction = self.enterGame;
	};
	this.currentAction = this.onMainMenu;
};

FlowController.prototype.onMainMenu = function(){};

FlowController.prototype.enterGame = function(){
	"use strict";
	console.log("[flowController] enterGame");
	this.game = AddToken(new Settings.flowSettings.inGame());
	this.currentAction = this.inGame;
};

FlowController.prototype.inGame = function(){
	"use strict";
};

module.exports = new FlowController();