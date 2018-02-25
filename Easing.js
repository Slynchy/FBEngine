let jsAnim = require('js-easing-functions');

class Easing {

    /**
     *
     * @param {Object} obj
     * @param {Object} targetPos
     * @param {Number} [speed]
     * @param {Function} [onComplete]
     * @returns {void}
     */
    static async lerpAsync( obj, targetPos, speed, onComplete ){
        if(
            typeof obj.x === 'undefined' ||
            typeof obj.y === 'undefined' ||
            typeof targetPos !== 'object' ||
            typeof targetPos.x === 'undefined' ||
            typeof targetPos.y === 'undefined'
        ){
            throw new Error("Invalid object passed!");
        }

        let origX = obj.x;
        let origY = obj.y;

        if(typeof speed === 'undefined'){
            speed = 1.0;
        }

        let counter = 0;

        let interval = null;
        interval = setInterval(()=>{
            obj.x = lerp(origX, targetPos.x, counter);
            obj.y = lerp(origY, targetPos.y, counter);
            counter += 0.06 * speed;

            if(counter >= 1.0){
                obj.x = targetPos.x;
                obj.y = targetPos.y;
                clearInterval(interval);
                if(onComplete)
                    onComplete();
            }
        }, 16);
    }

}

module.exports = Easing;