let EventObject = require("./EventObject.js");

class EventHandler {

	constructor(ticker){
		this._ticker = ticker;
        this._ticker.add(this._loop.bind(this));

		this._queue = [];
	}

	_loop(){
		let dt = this._ticker.elapsedMS;

		for(let i = this._queue.length-1; i >= 0; i--){
			if(this._queue[i].isComplete === true){
				this._queue.splice(i, 1);
			}
		}

		for(let i = 0; i < this._queue.length; i++){
			this._queue[i].update(dt);
		}
	}

    /**
     *
     * @param {function} func Function to call when the event fires
     * @param {number} timer
     * @param {boolean} [loop]
     * @returns {object} The created event object (optional)
     * @constructor
     */
	ScheduleEvent(func, timer, loop){
		let event = new EventObject(func,timer,loop);
		this._queue.push(event);
		return this._queue[this._queue.length - 1];
	}
}

module.exports = EventHandler;