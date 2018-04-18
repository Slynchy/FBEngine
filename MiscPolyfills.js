let __miscPolyFillInit = () => {
	if (global.__hasInitPolyfills) return;

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

	global.AddToken = token => {
		tokens.push(token);
		if (token.onAdd) token.onAdd();
		return tokens[tokens.length - 1];
	};

	global.RemoveToken = token => {
		for (let i = 0; i < tokens.length; i++) {
			if (tokens[i].uid === token.uid) {
				tokens[i]._queuedForDestruction = true;
				if (tokens[i].onRemove) tokens[i].onRemove();
				return;
			}
		}
	};

	global.__hasInitPolyfills = true;
};

module.exports = __miscPolyFillInit();
