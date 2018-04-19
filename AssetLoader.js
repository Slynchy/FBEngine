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
			for (let k in assetList) {
				if (!assetList.hasOwnProperty(k)) continue;

				if (!firstPromise) {
					firstPromise = PIXI.loader.add(k, 'assets/' + assetList[k]);
					currPromise = firstPromise;
					continue;
				}

				currPromise = currPromise.add(k, 'assets/' + assetList[k]);
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
								resources[k].sound.__PARENT = resources[k];
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
				resolve(resources);
			});
		});
	}
}

module.exports = AssetLoader;
