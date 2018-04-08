
class EventObject {
	constructor(func, timer, loop){
		if(!func || typeof func !== 'function') console.error('EventObject - No function supplied!');

		this._func = func;

		this._timer = 0;
		this._timerThreshold = timer;
		this._loop = !!loop;

		this._isComplete = false;
		this._isPaused = false;
	}

	get isLooping(){
		return this._loop;
	}

	update(dt){
		if(this.isComplete || this.isPaused) return;

		this._timer += dt;
		if(this._timer >= this._timerThreshold){
			this._isComplete = !this._loop;
			this._func();
		}
	}

	stop(){
		this._isComplete = true;
	}

	pause(){
		this._isPaused = true;
	}

	get isPaused(){
		return this._isPaused;
	}

	play(){
		this._isPaused = false;
	}

	unpause(){
		this.play();
	}

	get isComplete(){
		return (this._isComplete);
	}
}

module.exports = EventObject;