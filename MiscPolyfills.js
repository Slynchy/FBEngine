let __miscPolyFillInit = () => {
	if (global.__hasInitPolyfills) return;

	global._ATLAVER = '1.0.0';

	// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
	String.prototype.generateUID = () => {
		let hash = 0,
			i,
			chr;
		if (this.length === 0) return hash;
		for (i = 0; i < this.length; i++) {
			chr = this.charCodeAt(i);
			hash = (hash << 5) - hash + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return Math.floor(hash * Math.random());
	};

	global.renderScale = x => {
		return x * (global.Settings ? Settings.applicationSettings.renderScale : 1.0);
	};

	global.lerp = (v0, v1, t) => {
		return v0 * (1 - t) + v1 * t;
	};

	global.SetRendererProperties = rendererView => {
		'use strict';
		rendererView.style = Object.assign(rendererView.style, Settings.styleSettings);
	};

	global.Tokens = [];

	global.AddToken = token => {
		Tokens.push(token);
		if (token.onAdd) token.onAdd();
		return Tokens[Tokens.length - 1];
	};

	global.RemoveToken = token => {
		for (let i = 0; i < Tokens.length; i++) {
			if (Tokens[i].uid === token.uid) {
				Tokens[i]._queuedForDestruction = true;
				if (Tokens[i].onRemove) Tokens[i].onRemove();
				return;
			}
		}
	};

	global.UpdateTokens = (deltaTime) => {
		for(let i = 0; i < Tokens.length; i++){
			if(!Tokens[i]._queuedForDestruction && Tokens[i].startStep){
				Tokens[i].startStep(deltaTime);
			}
		}
		for(let i = 0; i < Tokens.length; i++){
			if(!Tokens[i]._queuedForDestruction && Tokens[i].endStep){
				Tokens[i].endStep(deltaTime);
			}
		}
		for(let i = (Tokens.length-1); i >= 0; i--){
			if(Tokens[i]._queuedForDestruction){
				Tokens[i] = null;
				Tokens.splice(i,1);
			}
		}
	};

	global.__hasInitPolyfills = true;
};

module.exports = __miscPolyFillInit();
