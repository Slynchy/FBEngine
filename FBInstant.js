let __fbInstantInit = () => {
	if (!global.FBINSTANT_INFO) {
		global.FBINSTANT_INFO = {
			contextId: null,
			contextType: null,
			playerInfo: {
				displayName: null,
				id: null
			}
		};
	}
};

module.exports = __fbInstantInit();
