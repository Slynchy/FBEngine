// This will house save data to send to GS

class SaveDataHandler {
    constructor(api, props){

        this.api = api;

        this._data = null;
        this._hasLoaded = false;

        if(props)
            Object.assign(this, props);
    }

    get hasLoaded(){
        return this._hasLoaded;
    }

    initialize(callback){
        "use strict";
        let self = this;

        if(!callback) this.callback = function(){};
        else this.callback = callback;

        this._data = {};
        this._data = Object.assign(this._data, Settings.SaveData.defaultSaveData);

        let keys = [];
        for(let k in this._data){
            keys.push(k);
        }

        try{
            console.log('[SaveDataHandler] Loading save data...');
            FBInstant.player
                .getDataAsync(keys)
                .then(function(data) {
                    for(let k in data){
                        if(data.hasOwnProperty(k))
                            self._data[k] = data[k];
                    }
                    console.log('[SaveDataHandler] Save data loaded');
                    self._hasLoaded = true;
                    self.callback();
                });
        }
        catch(err){
            console.error('[SaveDataHandler] Failed to load save data for reason: ' + err);
            console.error(err.stack);
        }
    }

    get data(){
        return this._data;
    }

    saveData(key, value){
        "use strict";
        if(!this._hasLoaded) return;

        if(this._data.hasOwnProperty(key))
            this._data[key] = value;

        try{
            FBInstant.player
                .setDataAsync(this._data)
                .then(function() {
                    console.log('[SaveDataHandler] Save data saved');
                });
        }
        catch(err){
            console.error('[SaveDataHandler] Failed to save data for reason: ' + err);
            console.error(err.stack);
        }
    }
}

module.exports = new SaveDataHandler();