let PIXI = require("pixi.js");

class GenericDialog extends PIXI.Container {
    constructor(props){
        "use strict";
        super(null);
        this.tag = "GenericDialog";

        // TODO: Implement _isVisible properly
        this._isVisible = true;

        this.parentScene = null;

        if(props)
            Object.assign(this, props);
    }

    hide(){
        "use strict";
        this.alpha = 0;
        this._isVisible = false;
    }

    onAdd(scene){
        "use strict";
        this.parentScene = scene;
    }

    show(){
        "use strict";
        this.alpha = 1;
        this._isVisible = this.isVisible;
    }

    endStep(){}

    onRemove(){}

    set x(val) {
        let offset = 0;

        if(this['xAlignment']){
            switch(this['xAlignment']){
                case 'left':
                    break;
                case 'center':
                    offset = -(this.width / 2);
                    break;
                case 'right':
                    offset = -(this.width);
                    break;
            }
        }
        this.position.x = val + (offset);
    }

    set y(val) {
        let offset = 0;

        if(this['yAlignment']){
            switch(this['yAlignment']){
                case 'top':
                    break;
                case 'center':
                    offset = -(this.height / 2);
                    break;
                case 'right':
                    offset = -(this.height);
                    break;
            }
        }

        this.position.y = val + (offset);
    }

    get x() {
        return this.position.x;
    }

    get y() {
        "use strict";
        return this.position.y;
    }
}

module.exports = GenericDialog;