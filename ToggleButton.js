let Button = require("./Button.js");

class ToggleButton extends Button {
    constructor(enabledTexture, disabledTexture, props){
        super(enabledTexture, disabledTexture, props);

        this._enabled = false;
        this._isToggleButton = true;

        if(props){
            Object.assign(this, props);
        }
    }

    isEnabled(){
        return this._enabled;
    }

    /**
     * @private
     */
    _pointerDown(){/* do nothing*/}

    /**
     * @private
     */
    _pointerUp(activate){
        if(!activate) return;

        if(this._isInDownstate){
            this._isInDownstate = false;
            this.updateTexture(this.upstateTexture);
        } else {
            this.updateTexture(this.downstateTexture);
            this._isInDownstate = true;
        }

        if(activate){
            this._enabled = true;
            this.onClick();
        }
    }

}

module.exports = ToggleButton;