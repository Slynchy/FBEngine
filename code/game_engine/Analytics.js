/*
	Google Analytics wrapper
	Doesn't work with FB
 */

class Analytics {

	constructor(tid,debuggingMode){
		if(typeof(tid) === 'undefined'){
			throw new Error("Analytics error - no tid provided!");
		}

		this.tid = tid;
		this.cid = 'clientid';

		this.mode = 'FBINSTANT';

		this.enabled = Settings.Analytics.enabled;

		if(typeof(debuggingMode) === "undefined"){
			this._debug = false;
		} else {
			this._debug = debuggingMode;
		}

		this.log("Initialized analytics");
	}

	EnableDebugging(){
		this._debug = true;
	}

	log(data){
		if(this._debug) console.log(data);
	}

	SendEvent(category, action, label, value){
		"use strict";
		let self = this;

		if(typeof(value) === "undefined") value = 1;

		if(this.mode === 'FBINSTANT'){

			try{
				let result = FBInstant.logEvent(
					category,
					value,
					{
						action: action,
						label: label
					},
				);
				if(result){
					// We could throw an error here but analytics are not that important -Sam
					console.error("Send event " + category + " unsuccessfully");
				} else {
					console.log("Send event " + category + " successfully");
				}
			}
			catch(err){
				console.error(err);
			}

		} else if(this.mode === 'GOOGLE') {

			let genData = this._generateData('event', category, action, label, value);
			this._postAjax(
				Settings.Analytics.url,
				genData,
				function(da){
					self.log("Sent event of category \"" + category + "\" " + genData);
				}
			);

		}
	}

	_generateData(type, category, action, label, value){
		"use strict";
		let result = "";

		result += 'v=1';
		result += '&';
		result += 'tid=' + this.tid;
		result += '&';
		result += 'cid=' + this.cid;
		result += '&';
		result += 't=' + type;

		if(category){
			result += '&';
			result += 'ec=' + category;
		}
		if(action){
			result += '&';
			result += 'ea=' + action;
		}
		if(label){
			result += '&';
			result += 'el=' + label;
		}
		if(value){
			result += '&';
			result += 'ev=' + value;
		}

		return result;
	}

	_postAjax(url, data, success) {
		try{
			let xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function(retVal){
				//console.log(retVal);
			};
			xhttp.onload = function(da){
				if(success) success(da);
			};
			xhttp.open("GET", url + data, true);
			xhttp.send();
		}
		catch(err){
			console.error(err);
			return null;
		}
	}
}

module.exports = Analytics;