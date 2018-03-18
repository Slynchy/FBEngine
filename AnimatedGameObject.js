let PIXI = require("pixi.js");

class AnimatedGameObject extends PIXI.extras.AnimatedSprite {
    constructor(textures, props){
        "use strict";
        super(textures);

        this._isAnimated = true;

        this.zOrder = 0;

        if(props)
            Object.assign(this,props);
    }

    set z(val) {
        this.zOrder = val;
    }

    get z() {
        return this.zOrder;
    }
}

module.exports = AnimatedGameObject;