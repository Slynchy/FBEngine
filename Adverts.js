
class Adverts {

    constructor(){
        this.placementId = Settings.adverts.placementId;
        this.instance = null;

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

        if(this.enabled === false){
            if(callback)
                callback();
            if(waitForLoad)
                waitForLoad();
            return;
        }

        FBInstant.getRewardedVideoAsync(this.placementId)
            .then((rewardedVideo) => {
                console.log("[Adverts] Loaded ad instance");
                self.instance = rewardedVideo;
                self.instance.loadAsync()
                    .then( (retVal) => {
                        console.log("[Adverts] Preloaded ad");
                        self._loaded = true;
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

                        console.error('[Adverts] Load ad failed! ' + err.code);
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

                console.error('[Adverts] Get ad instance failed! ' + err.code);
                console.error(err.message);

                if(callback) callback();
                if(waitForLoad) waitForLoad();
            });
    }

    showAd(callback){
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

        this.instance.showAsync()
            .then( () => {
                self._loaded = false;
                if(callback) callback();
                self.instance = null;
                self.initialize();
            })
            .catch( (err) => {
                // ad not watched
                switch(err){
                    case 'ADS_NOT_LOADED':
                    case 'INVALID_PARAM':
                    case 'NETWORK_FAILURE':
                        break;
                }
                console.error('[Adverts] ShowAd failed! ' + err.code);
                console.error(err.message);
            });
    }
}

module.exports = new Adverts();