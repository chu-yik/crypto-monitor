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
		const epochSecNow = Math.ceil(Date.now() / 1000);
		const lastUpdated = doc.customJSON().lastUpdated;
		debug('now: %t, last updated: %t', epochSecNow, lastUpdated);
		return epochSecNow - interval > lastUpdated;
	}
	return true;
};

module.exports.apiForQuery = function(query) {
	return api + query.base.toLowerCase() + '-' + query.target.toLowerCase();
};