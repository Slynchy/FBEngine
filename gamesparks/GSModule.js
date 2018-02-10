class GSModule {
    constructor(){
        "use strict";
        this['debug'] = false;
        this['secret'] = null;
        this['key'] = null;
        this['offlineMode'] = null;
        Object.assign(this,Settings.GameSparks);

        this._signedIn = false;
        this._isInit = false;

        if(!this.offlineMode) {
            this._gamesparks = new GameSparks();
            /*
                Dirty hack to make GS work with build setup
             */
            global.gamesparks = this._gamesparks;
        }
        else
            this._gamesparks = {};
    }

    get _gs (){
        return this._gamesparks;
    }

    init(callback){
        "use strict";
        if(this.offlineMode === true){
            if(callback)
                callback();
            return;
        }
        this._initCallback = callback;
        this._gamesparks.initPreview(this);
    }

    GetAroundMeLeaderboard(callback){
        "use strict";
        if(!this._isInit || !this._signedIn || this.offlineMode) return;

        this._gamesparks.aroundMeLeaderboardRequest(5,[],'global_leaderboard',false, (data) => {
            if(data.error){
                throw new Error(data.error);
            }
            console.log("[GSModule] AroundmeLeaderboard successful");
            if(callback) callback(data.data);
        });
    }

    /**
     * Sends data to GS using key
     * @param {string} key
     * @param {string} attr
     * @param {string | number | object} data
     * @param {function?} callback
     * @constructor
     */
    SendData(key, attr, data, callback){
        "use strict";
        if(this.offlineMode === true){
            if(callback)
                callback();
            return;
        }
        if(this._signedIn === false) throw new Error("Not signed in!");
        if(this._isInit === false) throw new Error("Not init'd!");

        let output = {
            eventKey: key
        };
        output[attr] = data;

        this._gamesparks.sendWithData(
            "LogEventRequest",
            output,
            (response)=>{
                console.log(JSON.stringify(response));
                if(callback)
                    callback();
            }
        );
    }

    onNonce(nonce){
        "use strict";
        return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(nonce, this['secret']));
    }

    registerUser(callback){
        "use strict";
        this._gamesparks.registrationRequest(FBINSTANT_INFO.playerInfo.displayName, FBINSTANT_INFO.playerInfo.id, FBINSTANT_INFO.playerInfo.id, (response) =>{
            console.log("[GSModule] Successfully registered");
            if(this.debug === true)
                console.log(JSON.stringify(response));
            if(callback) callback();
        });
    }

    signIn(callback){
        "use strict";
        let self = this;
        if(this._signedIn) return;
        if(this._isInit === false) throw new Error("Not init!");

        this._gamesparks.authenticationRequest(FBINSTANT_INFO.playerInfo.id, FBINSTANT_INFO.playerInfo.id, (response) => {
            if(this.debug === true)
                console.log(JSON.stringify(response));

            if(response['error']){
                switch(response['error']['DETAILS']){
                    case 'UNRECOGNISED':
                        console.log("[GSModule] New user; registering...");
                        self.registerUser(
                            /*self.signIn(*/()=>{
                                if(callback) callback();
                            }//)
                        );
                        break;
                    default:
                        throw new Error('Unhandled auth error!');
                }
            } else {
                console.log("[GSModule] Signed in!");
                this._signedIn = true;
                if(callback) callback();
            }
        });
    }

    onInit(){
        "use strict";
        let self = this;
        this._isInit = true;
        console.log("[GSModule] Initialized");

        this.signIn(self._initCallback ? self._initCallback : ()=>{});
    }

    onMessage(message){
        //if(this.debug === true)
           // console.log(JSON.stringify(message));
    }
}

module.exports = new GSModule();