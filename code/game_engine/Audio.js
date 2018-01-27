let api = require("pixi-sound");

/**
 * The main engine audio handler
 */
class Audio {
    constructor(){
        this.audioInstances = [];

        this._isMuted = false;

        if(PIXI.sound.isSupported === false){
			console.error("SOUND NOT SUPPORTED");
			PIXI.sound.useLegacy = true;
		}

        if(PIXI.sound.isSupported === false){
            throw new Error("LEGACY SOUND NOT SUPPORTED");
        }

		PIXI.sound.volumeAll = Settings.audioSettings.globalVolume;
	}

    /**
     * Gets if the global audio is muted
     * @returns {boolean}
     */
	get muted(){
    	return this._isMuted;
	}

    /**
     * Sets the global mute value
     * @param {boolean} val
     */
	set muted(val){
    	"use strict";

    	if(typeof(val) !== 'boolean') throw new Error("[Audio] Incorrect type passed to muted");
    	if(this._isMuted === val) return;

    	this._isMuted = val;

    	if(val === true){
			// handle muting
			for(let i = 0; i < this.audioInstances.length; i++){
                this.audioInstances[i]._origVolume = this.audioInstances[i].volume;
                this.audioInstances[i].volume = 0;
			}
		} else {
    		// handle unmuting
			for(let i = 0; i < this.audioInstances.length; i++){
                this.audioInstances[i].volume = this.audioInstances[i]._origVolume ? this.audioInstances[i]._origVolume : 1;
			}
		}

	}

    /**
     *
     * @param file
     * @param {float} volume
     * @param {boolean?} loop
     * @returns {PIXI.sound.IMediaInstance|Promise<PIXI.sound.IMediaInstance>|void|Promise<void>}
     * @constructor
     */
    PlayFile(file, volume, loop){
        "use strict";
        let self = this;
		let callbackSet = false;

        if(typeof(volume) === "undefined"){
            volume = Settings.audioSettings.globalVolume;
        }
		if(typeof(loop) === "undefined"){
			loop = false;
		} else if(typeof(loop) === "function"){
        	callbackSet = true;
		}

		if(!file) throw new Error("Audio file not found! " + file.url);
        let instance = file.play({ loop:loop });
		if(!instance) throw new Error("Audio file failed! " + file.url);

		instance.volume = volume;
        instance.uid = file.url.hashCode() | Date.now();
        instance.filename = file.url;
		instance.fileKey = file.fileKey;

        this.audioInstances.push(instance);
        instance.on('end', function(){ 
            self.removeAudio(instance.uid);
			if(callbackSet === true) loop();
        });

        return instance;
    }

    /**
     * Stops the specified track by unique ID
     * @param {int} uid
     */
    removeAudio(uid){
        for(let i = this.audioInstances.length-1; i >= 0; i--){
            if(this.audioInstances[i].uid === uid){
				this.audioInstances[i].stop();
                this.audioInstances.splice(i, 1);
                return;
            }
        }
    };

    /**
     * Stops all instances of the specified track
     * @param {string|Array} strings
     */
    stopAllInstancesOf(strings){
        if(strings.hasOwnProperty && strings.hasOwnProperty('fileKey')){
            let temp = strings;
            strings = [];
            strings.push(temp.fileKey);
        } else if(typeof(strings) === 'string'){
            let temp = strings;
            strings = [];
            strings.push(temp);
        } else if(strings.constructor === Array){
            // handled by default
        } else {
            throw new Error("[Audio] Unhandled parameter type!");
        }

        for(let s = 0; s < strings.length; s++){
            for(let i = this.audioInstances.length-1; i >= 0; i--){
                if(this.audioInstances[i].fileKey === strings[s]){
					this.audioInstances[i].stop();
                    this.audioInstances.splice(i, 1);
                }
            }
        }
    }

}

module.exports = new Audio();