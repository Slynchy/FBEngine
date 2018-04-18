class AssetLoader {
	constructor() {
		console.warn('Instance of AssetLoader created; it is intended to be static!');
	}

	/**
	 *
	 * @param {Object} assetList
	 * @returns {Promise<any>}
	 * @static
	 */
	static LoadAssetsFromAssetList(assetList) {
		let self = this;
		let length = Object.keys(assetList).length;
		this.loadingProgress = 0;

		if (typeof PIXI === 'undefined') {
			throw new Error('PIXI is undefined!');
		}

		return new Promise((resolve, reject) => {
			if (length === 0) {
				resolve();
				return;
			}

			PIXI.loader.onLoad.add((file, res) => {
				if (!Settings.DEBUG.suppressLoadingLogs)
					console.log('[flowController] Loaded resource: ' + res.url);
			});

			PIXI.loader.onError.add(err => {
				reject('[flowController] Failed to load file! ' + err.stack);
			});

			let firstPromise;
			let currPromise;
			for (let k in Settings.resources) {
				if (!Settings.resources.hasOwnProperty(k)) continue;

				if (!firstPromise) {
					firstPromise = PIXI.loader.add(k, 'assets/' + Settings.resources[k]);
					currPromise = firstPromise;
					continue;
				}

				currPromise = currPromise.add(k, 'assets/' + Settings.resources[k]);
			}

			PIXI.loader.load(function(loader, resources) {
				if (!global._TEXTURES) global._TEXTURES = {};

				for (let k in resources) {
					if (resources.hasOwnProperty(k)) {
						if (!resources[k].texture) {
							if (
								resources[k].url.includes(
									'.ogg',
									Math.floor(resources[k].url.length * 0.5)
								) ||
								resources[k].url.includes(
									'.mp3',
									Math.floor(resources[k].url.length * 0.5)
								)
							) {
								// audio is handled seperately
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
				resolve();
			});
		});
	}
}

module.exports = AssetLoader;
