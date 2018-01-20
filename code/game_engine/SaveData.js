// This will house save data to send to GS

class SaveDataHandler {
    constructor(api, props){

        this.api = api;

        if(props)
            Object.assign(this, props);

        this._data = null;

        this.initialize();
    }

    initialize(){
        // should be retrieved from GS and initialized to default values if not
        this._data = {};
    }

    get data(){
        return this._data;
    }

    SaveData(){
        "use strict";
        return "SUCCESS";
    }

    LoadData(){
        return {};
    }
}

module.exports = SaveDataHandler;