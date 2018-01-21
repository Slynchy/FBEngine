let ContainerObject = require('../game_engine/ContainerObject.js');
let GameObject = require('../game_engine/GameObject.js');
let PIXI = require("pixi.js");
let jsAnim = require("js-easing-functions");

class RewardedAdDialog extends ContainerObject {
    constructor(onSuccess, onClose, props){
        "use strict";
        super(props);
        let self = this;

        this.onSuccess = onSuccess;
        this.onClose = onClose;

        this.tag = "RewardedAdDialog";

        this.bg = new GameObject(black, {checkCollisions: false});
        this.bg.width = Settings.PIXI.applicationSettings.width;
        this.bg.height = Settings.PIXI.applicationSettings.height;
        this.bg.alpha = 0.6;
        this.addChild(this.bg);

        this.buttonContainer = new PIXI.Container();
        this.buttonContainer.x = Settings.PIXI.applicationSettings.width / 2;
        this.buttonContainer.y = Settings.PIXI.applicationSettings.height / 2;
        this.addChild(this.buttonContainer);

        this.sunburst = new GameObject(sunburst, {checkCollisions:false});
        this.sunburst.anchor.x = 0.5;
        this.sunburst.anchor.y = 0.5;
        this.sunburst.scale.x = 2.25;
        this.sunburst.scale.y = 2.25;
        this.sunburst.alpha = 0.2;
        this.buttonContainer.addChild(this.sunburst);

        this.playButton = new GameObject(playAdButton, {checkCollisions:false,interactive: true});
        this.playButton.anchor.x = 0.5;
        this.playButton.anchor.y = 0.5;
        this.playButton.scale.x = 2;
        this.playButton.scale.y = 2;
        this.playButton.alpha = 1.0;
        this.playButton.on('pointerup', function(){
            self.watchedAd = true;
            self.destroy();
        });
        this.buttonContainer.addChild(this.playButton);

        this.nothanksButton = new GameObject(noThanks_button, {checkCollisions:false,interactive: true});
        this.nothanksButton.anchor.x = 0.5;
        this.nothanksButton.anchor.y = 0.5;
        this.nothanksButton.scale.x = 2;
        this.nothanksButton.scale.y = 2;
        this.nothanksButton.alpha = 1.0;
        this.nothanksButton.y = 300;
        this.nothanksButton.on('pointerup', function(){
            self.destroy();
        });
        this.buttonContainer.addChild(this.nothanksButton);

        this.adDesc = new GameObject(ad_description, {checkCollisions:false});
        this.adDesc.anchor.x = 0.5;
        this.adDesc.anchor.y = 0.5;
        this.adDesc.scale.x = 2;
        this.adDesc.scale.y = 2;
        this.adDesc.y = 180;
        this.buttonContainer.addChild(this.adDesc);

        Object.assign(this,props);
    }

    endStep(dt){
        "use strict";
        super.endStep(dt);

        this.sunburst.rotation += 0.0025;
    }

    onAdd(){
        "use strict";
        super.onAdd();
    }

    destroy(){
        super.destroy();

        if(this.watchedAd){
            if(this.onSuccess){
                this.onSuccess();
            }
        } else if(this.onClose){
            this.onClose();
        }
    }
}

module.exports = RewardedAdDialog;