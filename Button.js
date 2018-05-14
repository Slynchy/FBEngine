let GameObject = require('./GameObject.js');

class Button extends GameObject {
	constructor(upstate, downstate, props) {
		super(upstate, props);

		this.upstateTexture = upstate;
		this.downstateTexture = downstate;

		this._isInDownstate = false;

		this.interactive = true;

		this.on('pointerup', () => {
			if (!this._isInDownstate && !this._isToggleButton) return;
			this._pointerUp(true);
		});
		this.on('pointerdown', () => {
			this._pointerDown();
		});

		this.on('pointerout', () => {
			this._pointerUp(false);
		});

		if (props) {
			Object.assign(this, props);
		}
	}

	isDown() {
		return this._isInDownstate;
	}

	/**
	 * @private
	 */
	_pointerDown() {
		this.updateTexture(this.downstateTexture);
		this.y += this.height / 55;

		if (this.text) {
			this.text.y += this.height / 55;
		}

		this._isInDownstate = true;
	}

	/**
	 * @param {Boolean} activate
	 * @private
	 */
	_pointerUp(activate) {
		if (this._isInDownstate) {
			this.updateTexture(this.upstateTexture);
			this.y -= this.height / 55;

			if (this.text) {
				this.text.y -= this.height / 55;
			}

			this._isInDownstate = false;

			if (activate) this.onClick();
		}
	}

	/**
	 * Pure function; intended to be overwritten
	 */
	onClick() {
		console.warn('[Button] onClick not overridden; is this intended?');
	}
}

module.exports = Button;
