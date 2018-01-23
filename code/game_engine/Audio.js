
let api = require("pixi-sound");

class Audio {
    constructor(){
        this.audioInstances = [];

        if(PIXI.sound.isSupported === false){
			console.error("SOUND NOT SUPPORTED");
			PIXI.sound.useLegacy = true;
		}

		PIXI.sound.volumeAll = Settings.audioSettings.globalVolume;
	}

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

        this.audioInstances.push(instance);
        instance.on('end', function(){ 
            self.removeAudio(instance.uid);
			if(callbackSet === true) loop();
        });

        return instance;
    }

    removeAudio(uid){
        for(let i = this.audioInstances.length; i >= 0; --i){
            if(this.audioInstances[i].uid === uid){
                this.audioInstances.splice(i, 1);
                return;
            }
        }
    };

    /*
        Usage for one file:
            + stopAllInstancesOf('filename_without_suffix');
        Usage for multiple files:
            + stopAllInstancesOf(['filename_without_suffix', 'filename_without_suffix2']);
    */
    stopAllInstancesOf(strings){
        if(strings.constructor !== Array){
            let temp = strings;
            strings = [];
            strings.push(temp);
        }

        for(let s = 0; s < strings.length; s++){
            for(let i = this.audioInstances.length; i >= 0; --i){
                if(this.audioInstances[i].filename === strings[s]){
                    this.audioInstances.splice(i, 1);
                }
            }
        }
    }

    // deprecated
    PlayMusic(file, volume, loop){
        "use strict";
        if(typeof(volume) === "undefined"){
            volume = 1.0;
        };
        if(typeof(loop) === "undefined"){
            loop = true;
        };

        let instance = PIXI.audioManager.getAudio(file);
        if(!instance) throw new Error("Audio file not found! " + file);

        instance.volume = volume;
        instance.loop = loop;

        this.audioInstances.push(instance);

        instance.play();
    }

    // deprecated
    async cleanup(){
        if(this.audioInstances.length === 0 || this._isCleaningUp === true) return;

        this._isCleaningUp = true;

        for(let i = this.audioInstances.length; i >= 0; --i){
            if(this.audioInstances[i].playing === false){
                this.audioInstances.splice(i, 1);
            }
        }

        this._isCleaningUp = false;
    };

}

module.exports = new Audio();