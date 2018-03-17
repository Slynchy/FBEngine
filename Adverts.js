
class Adverts {

    constructor(){
        this.rewarded_placementId = Settings.adverts.rewarded_placementId;
        this.interstitial_placementId = Settings.adverts.interstitial_placementId;

        this.rewarded_instance = null;
        this.interstitial_instance = null;

        this._loaded = false;

        this.enabled = Settings.adverts.enabled;
    }

    /*
        callback: (optional) the callback to execute when instance retrieved
        waitForLoad: (optional) callback to execute when video is preloaded
     */
    initialize(callback, waitForLoad){
        "use strict";
        let self = this;

        console.log("[Adverts] Initializing ad instance");

        if(this.enabled === false || typeof FBInstant === 'undefined'){
            if(callback)
                callback();
            if(waitForLoad)
                waitForLoad();
            return;
        }

        let rewardedAdDone = false;
        let interstitialAdDone = false;
        this._getAndLoadRewardedAdInstance(()=>{
            rewardedAdDone = true;
            if(interstitialAdDone === true){
                if(callback){
                    callback();
                }
            }
        });

        this._getAndLoadInterstitialAdInstance(()=>{
            interstitialAdDone = true;
            if(rewardedAdDone === true){
                if(callback){
                    callback();
                }
            }
        });
    }

    _getAndLoadInterstitialAdInstance(callback, waitForLoad){
        if(this.interstitial_instance) return;

        FBInstant.getInterstitialAdAsync(this.interstitial_placementId)
            .then((interstitial) => {
                console.log("[Adverts] Loaded ad interstitial_instance");
                self.interstitial_instance = interstitial;
                self.interstitial_instance.loadAsync()
                    .then( (retVal) => {
                        console.log("[Adverts] Preloaded interstitial ad");
                        if(waitForLoad) waitForLoad();
                    })
                    .catch( (err) => {
                        switch(err){
                            case 'ADS_FREQUENT_LOAD':
                            case 'ADS_NO_FILL':
                            case 'INVALID_PARAM':
                            case 'NETWORK_FAILURE':
                                break;
                        }

                        console.error('[Adverts] Load interstitial ad failed! ' + err.code);
                        console.error(err.message);

                        if(waitForLoad) waitForLoad();
                    });
                if(callback) callback();
            })
            .catch((err) => {
                switch(err){
                    case 'ADS_TOO_MANY_INSTANCES':
                    case 'CLIENT_UNSUPPORTED_OPERATION':
                        break;
                }

                console.error('[Adverts] Get ad interstitial failed! ' + err.code);
                console.error(err.message);

                if(callback) callback();
                if(waitForLoad) waitForLoad();
            });
    }

    _getAndLoadRewardedAdInstance(callback, waitForLoad){
        if(this.rewarded_instance) return;

        FBInstant.getRewardedVideoAsync(this.rewarded_placementId)
            .then((rewardedVideo) => {
                console.log("[Adverts] Loaded ad rewarded_instance");
                self.rewarded_instance = rewardedVideo;
                self.rewarded_instance.loadAsync()
                    .then( (retVal) => {
                        console.log("[Adverts] Preloaded rewarded ad");
                        if(waitForLoad) waitForLoad();
                    })
                    .catch( (err) => {
                        switch(err){
                            case 'ADS_FREQUENT_LOAD':
                            case 'ADS_NO_FILL':
                            case 'INVALID_PARAM':
                            case 'NETWORK_FAILURE':
                                break;
                        }

                        console.error('[Adverts] Load rewarded ad failed! ' + err.code);
                        console.error(err.message);

                        if(waitForLoad) waitForLoad();
                    });
                if(callback) callback();
            })
            .catch((err) => {
                switch(err){
                    case 'ADS_TOO_MANY_INSTANCES':
                    case 'CLIENT_UNSUPPORTED_OPERATION':
                        break;
                }

                console.error('[Adverts] Get ad rewarded_instance failed! ' + err.code);
                console.error(err.message);

                if(callback) callback();
                if(waitForLoad) waitForLoad();
            });
    }

    showRewardedAd(callback){
        "use strict";
        let self = this;

        if(this.enabled === false){
            if(callback)
                callback();
            return;
        }

        if(this._loaded === false){
            console.error("[Adverts] showAd failed! Ad not loaded!");
            if(callback)
                callback();
            return;
        }

        this.rewarded_instance.showAsync()
            .then( () => {
                if(callback)
                    callback();
                self.rewarded_instance = null;
                self._getAndLoadRewardedAdInstance();
            })
            .catch( (err) => {
                // ad not watched
                switch(err){
                    case 'ADS_NOT_LOADED':
                    case 'INVALID_PARAM':
                    case 'NETWORK_FAILURE':
                        break;
                }
                console.error('[Adverts] showRewardedAd failed! ' + err.code);
                console.log(err.message);
                console.log(err);

                if(callback)
                    callback();
            });
    }

    showInterstitialAd(callback){
        "use strict";
        let self = this;

        if(this.enabled === false){
            if(callback)
                callback();
            return;
        }

        if(this._loaded === false){
            console.error("[Adverts] showAd failed! Ad not loaded!");
            if(callback)
                callback();
            return;
        }

        this.interstitial_instance.showAsync()
            .then( () => {
                if(callback)
                    callback();
                self.interstitial_instance = null;
                self._getAndLoadInterstitialAdInstance();
            })
            .catch( (err) => {
                // ad not watched
                switch(err){
                    case 'ADS_NOT_LOADED':
                    case 'INVALID_PARAM':
                    case 'NETWORK_FAILURE':
                        break;
                }
                console.error('[Adverts] showInterstitialAd failed! ' + err.code);
                console.log(err.message);
                console.log(err);

                if(callback)
                    callback();
            });
    }
}

module.exports = new Adverts();