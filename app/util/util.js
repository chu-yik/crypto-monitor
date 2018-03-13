const debug = require('debug')('crypto:util');
const config = require('config');
const api = config.get('api');

const createDebug = require('debug');
createDebug.formatters.t = (v) => {
	return new Date(v * 1000).toLocaleTimeString();
};

module.exports.shouldUpdateFromApi = function(doc) {
	if (doc) {
		const interval = config.get('expireInSec');
		const querySpacing = config.get('querySpacingInSec');
		const epochSecNow = Math.ceil(Date.now() / 1000);
		const lastUpdated = doc.lastUpdated;
		const lastQueried = doc.lastQueried;
		debug('now: %t, last updated: %t, last queried: %t', epochSecNow, lastUpdated, lastQueried);
		const shouldUpdate = epochSecNow - interval > lastUpdated && 
			(lastQueried === undefined || epochSecNow - querySpacing > lastQueried);
		return shouldUpdate;
	}
	return true;
};

module.exports.apiForQuery = function(query) {
	return api + query.base.toLowerCase() + '-' + query.target.toLowerCase();
};