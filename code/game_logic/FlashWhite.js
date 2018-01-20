let GameObject = require('../game_engine/GameObject.js');
let jsAnim = require("js-easing-functions");

class FlashWhite extends GameObject {
    constructor(props){
        super(white);

        this.tag = "FlashWhite";
        this.scale.x = Settings.PIXI.applicationSettings.width * 2;
        this.scale.y = Settings.PIXI.applicationSettings.height * 2;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.x = Settings.PIXI.applicationSettings.width / 2;
        this.y = Settings.PIXI.applicationSettings.height / 2;

        this.timer = 0;

        if(props)
            Object.assign(this,props);
    }

    endStep(dt){
        super.endStep(dt);

        this.timer += dt * 10;

        if(this.timer > 0){
            if(!this.timerStart) this.timerStart = this.timer;
            this.alpha = jsAnim.easeOutQuad(this.timerStart - this.timer, 1, 1, 200);

            if(this.alpha <= 0){
                this._scene.removeChild(this.gamestart);
            }
        }
    }
}

module.exports = FlashWhite;