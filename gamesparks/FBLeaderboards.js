class FBLeaderboards {
	constructor() {
		'use strict';
		this['debug'] = false;
		this['offlineMode'] = null;
		this['leaderboard_names'] = [];
		Object.assign(this, Settings.Leaderboards);

		this._signedIn = false;
		this._isInit = false;
		this._leaderboards = {};
		this._initCallback = null;

		if (this.offlineMode || typeof FBInstant === 'undefined') {
			this.offlineMode = true;
		}
	}

	get isInit() {
		if (this._isInit === true) return true;
		else {
			return Object.keys(this._leaderboards).length === this.leaderboard_names.length;
		}
	}

	GetLeaderboard(name) {
		let self = this;
		return new Promise((resolve, reject) => {
			FBInstant.getLeaderboardAsync(name)
				.then(leaderboard => {
					self._leaderboards[leaderboard.getName()] = leaderboard;
					resolve(self._leaderboards[leaderboard.getName()]);
				})
				.catch(reject);
		});
	}

	/**
	 *
	 * @param {Function} callback
	 */
	init(callback) {
		'use strict';
		let self = this;

		if (this.offlineMode === true) {
			this._isInit = true;
			if (callback) callback();
			return;
		}

		this._initCallback = callback ? callback : () => {};

		for (let i = 0; i < this.leaderboard_names.length; i++) {
			let boardName = this.leaderboard_names[i];

			FBInstant.getLeaderboardAsync(boardName)
				.then(leaderboard => {
					self._leaderboards[leaderboard.getName()] = leaderboard;
					if (self.isInit) {
						self._isInit = true;
						self._initCallback(self);
					}
				})
				.catch(err => {
					console.error(err);
					self.offlineMode = true;
				});
		}
	}

	/**
	 *
	 * @param {string} boardName
	 * @param {number} score
	 * @param {string | object} [metadata] Must be less than 2KB
	 * @returns {Promise | null}
	 * @constructor
	 */
	SendScoreToLeaderboard(boardName, score, metadata) {
		'use strict';

		// If we're in offline mode just pretend we're done
		if (this.offlineMode) {
			return;
		}

		if (typeof metadata === 'object') {
			metadata = JSON.stringify(metadata);
		}

		if (metadata.length > 2048 || typeof metadata !== 'string') {
			console.error('[FBLeaderboards] Invalid metadata!');
			return;
		}

		if (this._leaderboards[boardName]) {
			let board = this._leaderboards[boardName];

			return board.setScoreAsync(score, metadata);
		} else {
			console.error("[FBLeaderboards] Board doesn't exist!");
			return;
		}
	}

	/**
	 *
	 * @param {string} boardName
	 * @returns {Promise | null}
	 * @constructor
	 */
	GetPlayerLeaderboardInfo(boardName) {
		'use strict';

		if (!this._leaderboards[boardName]) {
			console.error("[FBLeaderboards] Board doesn't exist!");
			return;
		}

		return this._leaderboards[boardName].getPlayerEntryAsync();
	}

	/**
	 *
	 * @param {string} boardName
	 * @param {number} [count]
	 * @param {number} [offset]
	 * @returns {Promise | null}
	 * @constructor
	 */
	GetLeaderboardEntries(boardName, count, offset) {
		'use strict';

		if (!this._leaderboards[boardName]) {
			console.error("[FBLeaderboards] Board doesn't exist!");
			return;
		}

		if (!count) {
			count = 10;
		}

		if (!offset) {
			offset = 0;
		}

		return this._leaderboards[boardName].getEntriesAsync(count, offset);
	}
}

module.exports = new FBLeaderboards();
