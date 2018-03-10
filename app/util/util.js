const config = require('config');
const api = config.get('api');

module.exports.shouldUpdateFromApi = function(doc) {
	if (doc) {
		const interval = config.get('expireInSec');
		const epochSecNow = Math.ceil(Date.now() / 1000);
		const lastUpdated = doc.customJSON().lastUpdated;
		console.log('now: ' + epochSecNow + ', last updated: ' + lastUpdated);
		return epochSecNow - interval > lastUpdated;
	}
	return true;
};

module.exports.apiForQuery = function(query) {
	return api + query.base.toLowerCase() + '-' + query.target.toLowerCase();
};