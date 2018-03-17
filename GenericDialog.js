let PIXI = require("pixi.js");
let ContainerObject = require('./ContainerObject.js');

class GenericDialog extends ContainerObject {
    constructor(props){
        "use strict";
        super(null);
        this.tag = "GenericDialog";

        // TODO: Implement _isVisible properly
        this._isVisible = true;

        this.parentScene = null;

        this.anchor = {
            x: 0,
            y: 0
        };

        if(props)
            Object.assign(this, props);
    }

    hide(){
        "use strict";
        this.alpha = 0;
        this.interactiveChildren = false;
        this._isVisible = false;
    }

    onAdd(scene){
        "use strict";
        this.parentScene = scene;
    }

    show(){
        "use strict";
        this.alpha = 1;
        this.interactiveChildren = true;
        this._isVisible = true;
    }

    endStep(){}

    onRemove(){}

    set x(val) {
        let offset = -(this.width * this.anchor.x);

        this.position.x = val + (offset);
    }

    set y(val) {
        let offset = -(this.height * this.anchor.y);

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