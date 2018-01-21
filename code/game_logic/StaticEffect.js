let GameObject = require('../game_engine/GameObject.js');
let jsAnim = require("js-easing-functions");

class StaticEffect extends GameObject {
    constructor(props){
        super(static_effect0);

        this.tag = "StaticEffect";
        this.scale.x = Settings.PIXI.applicationSettings.width / this.width;
        this.scale.y = Settings.PIXI.applicationSettings.width / this.width;

        this.numberOfFrames = 8;
        this.timer = 0;
        this.interval = 3;
        this.frame = 0;

        this.alpha = 0.5;

        this.static = new GameObject(static0);
        this.static.scale.x = Settings.PIXI.applicationSettings.width / this.static.width;
        this.static.scale.y = Settings.PIXI.applicationSettings.width / this.static.width;
        this.static.alpha = 0.3;
        this.addChild(this.static);

        this.numberOfStaticFrames = 8;
        this.staticTimer = 0;
        this.staticInterval = 1;
        this.staticFrame = 0;

        if(props)
            Object.assign(this,props);
    }

    endStep(dt){
        super.endStep(dt);

        this.timer += dt;
        this.staticTimer += dt;

        if(this.timer > this.interval){
            this.frame++;
            if(this.frame >= this.numberOfFrames) this.frame = 0;
            this.texture = _TEXTURES["static_effect" + this.frame.toString()];
        }

        if(this.staticTimer > this.staticInterval){
            this.staticFrame++;
            if(this.staticFrame >= this.numberOfStaticFrames) this.staticFrame = 0;
            this.static.texture = _TEXTURES["static" + this.staticFrame.toString()];
        }
    }
}

module.exports = StaticEffect;