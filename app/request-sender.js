const util = require('./util/util');

class RequestSender {
	constructor() {
		
	}

	sendRequest(query, callback) {
		const api = util.apiForQuery(query);
		console.log('sending GET to: ' + api);
		callback();
		// TODO: send http request
	}
}

module.exports = RequestSender;