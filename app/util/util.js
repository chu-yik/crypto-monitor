const config = require('config');

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