let GameObject = require('../game_engine/GameObject.js');

class FlashWhite extends GameObject {
    constructor(){
        super(white);
        this.tag = "FlashWhite";
    }

    endStep(dt){
        super.endStep(dt);


    }
}

module.exports = FlashWhite;