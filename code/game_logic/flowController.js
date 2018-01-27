

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
		this.currentAction = this.waitForFBInstant;
		FBInstant.initializeAsync()
			.then(function() {
				console.log("[flowController] Initializing ad api");
                adAPI.initialize(function(){
                    self.currentAction = self.initializeSaveData;
				});
			});
	} else {
		this.currentAction = this.startLoading;
	}
};

FlowController.prototype.waitForFBInstant = function(){
    "use strict";
};

FlowController.prototype.initializeSaveData = function(){
	"use strict";
    console.log('[flowController] initializeSaveData');
    let self = this;
	SaveData.initialize(function(){
		self.currentAction = self.startLoading;
	});
	this.currentAction = this.waitForSaveData;
};

FlowController.prototype.waitForSaveData = function(){
    "use strict";
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
		if(!Settings.DEBUG.suppressLoadingLogs)
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
				if(!resources[k].texture){
					if(
						resources[k].url.includes('.ogg', Math.floor(resources[k].url.length * 0.5)) ||
						resources[k].url.includes('.mp3', Math.floor(resources[k].url.length * 0.5))
					){
						// audio is handled seperately
						console.log("loaded audio file" + k);
						resources[k].sound.fileKey = k;
						global[k] = resources[k].sound;
					} else {
						global[k] = resources[k];
					}
				} else {
					global[k] = resources[k].texture;
					global._TEXTURES[k] = resources[k].texture;
				}
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
    if(!Settings.DEBUG.suppressLoadingLogs)
		console.log("[flowController] waitForLoading");

	let self = this;

	if(PIXI.loader.progress === 100 && this.finishedLoading === true) {
		FBInstant.setLoadingProgress(100);
		console.log("[flowController] FB INSTANT GAME STARTING");
		this.currentAction = this.startFBInstant;
		FBInstant.startGameAsync()
			.then(function() {
                console.log("[flowController] startGameAsync resolved");
				self.currentAction = self.startGameSparks;
				global.FBINSTANT_INFO = {
					contextId: FBInstant.context.getID(),
					contextType: FBInstant.context.getType(),
					playerInfo: {
						displayName: FBInstant.player.getName(),
						id: FBInstant.player.getID(),
					}
				};
			});
	} else {
		FBInstant.setLoadingProgress(PIXI.loader.progress);
	}
};

FlowController.prototype.startGameSparks = function(){
    "use strict";
    console.log("[flowController] startGameSparks");
    let self = this;
    self.currentAction = self.waitForGameSparks;
    gsApi.init(() => {
        self.currentAction = self.showSplashScreen;
    })
};

FlowController.prototype.waitForGameSparks = function(){
    "use strict";
};

FlowController.prototype.showSplashScreen = function(){
	"use strict";
	console.log("[flowController] showSplashScreen");
	// TODO: splash screen

	this.music = AudioAPI.PlayFile(m_mainmenu, Settings.audioSettings.musicVolume * Settings.audioSettings.globalVolume, true);
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