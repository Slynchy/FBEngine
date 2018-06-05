/*
	Analytics wrapper
 */

class Analytics {
	constructor(enabled, debug) {
		// this.cid = null;
		// this.tid = Settings.Analytics.tid;
		// this.mode = Settings.Analytics.mode;
		// this.enabled = Settings.Analytics.enabled;
		// this._debug = Settings.Analytics.debug;

		this.mode = 'FBINSTANT';

		if(typeof(enabled) !== 'undefined'){
			this.enabled = enabled;
		} else {
			// backward compat
			this.enabled = (typeof(Settings) !== 'undefined') ? Settings.Analytics.enabled : false;
		}

		if(typeof(debug) !== 'undefined'){
			this._debug = debug;
		} else {
			// backward compat
			this._debug = (typeof(Settings) !== 'undefined') ? Settings.Analytics.debug : false;
		}

		if (this.mode === 'FBINSTANT') {
			this.initialize();
		}
	}

	initialize(clientID) {
		if (this.mode === 'GOOGLE') {
			if (!clientID) {
				throw new Error('Analytics error - no CID!');
			} else {
				this.cid = clientID;
			}
		}

		if (this.mode === 'FBINSTANT' && typeof FBInstant === 'undefined') {
			this.enabled = false;
			console.warn('Analytics warning - FBInstant is undefined');
		}

		this.log('Initialized analytics');
	}

	EnableDebugging() {
		this._debug = true;
	}

	log(data) {
		if (this._debug) console.log(data);
	}

	SendEvent(category, action, label, value) {
		'use strict';
		let self = this;

		if (this.enabled === false) return;

		if (typeof value === 'undefined') value = 1;

		if (this.mode === 'FBINSTANT') {
			try {
				let result = FBInstant.logEvent(category, value, {
					action: action,
					label: label
				});
				if (result) {
					// We could throw an error here but analytics are not that important -Sam
					console.error('Send event ' + category + ' unsuccessfully');
				} else {
					console.log('Send event ' + category + ' successfully');
				}
			} catch (err) {
				console.error(err);
			}
		} else if (this.mode === 'GOOGLE') {
			let genData = this._generateData('event', category, action, label, value);
			this._postAjax(Settings.Analytics.url, genData, function(da) {
				self.log('Sent event of category "' + category + '" ' + genData);
			});
		}
	}

	_generateData(type, category, action, label, value) {
		'use strict';
		let result = '';

		result += 'v=1';
		result += '&';
		result += 'tid=' + this.tid;
		result += '&';
		result += 'cid=' + this.cid;
		result += '&';
		result += 't=' + type;

		if (category) {
			result += '&';
			result += 'ec=' + category;
		}
		if (action) {
			result += '&';
			result += 'ea=' + action;
		}
		if (label) {
			result += '&';
			result += 'el=' + label;
		}
		if (value) {
			result += '&';
			result += 'ev=' + value;
		}

		return result;
	}

	_postAjax(url, data, success) {
		try {
			let xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function(retVal) {
				//console.log(retVal);
			};
			xhttp.onload = function(da) {
				if (success) success(da);
			};
			xhttp.open('GET', url + data, true);
			xhttp.send();
		} catch (err) {
			console.error(err);
			return null;
		}
	}
}

module.exports = Analytics;
