const axios = require('axios');
const config = require('config');
const axiosConfig = config.get('axiosConfig');
const util = require('./util/util');
const CryptoPair = require('./model/crypto-pair');

/**
 * Request sender to send HTTP GET request to third party crypto API
 * it will parse the response and send back the json for response
 * or send back error message in case of pair not found or other error
 */
class RequestSender {
	constructor() {

	}

	sendRequest(query, callback) {
		const api = util.apiForQuery(query);
		console.log('sending GET to: ' + api);
		this.sendRequestAndParse(api, callback);
	}

	sendRequestAndParse(url, callback) {
		axios.get(url, axiosConfig)
			.then((res) => {
				if (res.data.success) {
					const crypto = new CryptoPair(res.data.ticker);
					crypto.lastUpdated = res.data.timestamp;
					crypto.upsert((err, doc) => {
						if (callback) { callback(undefined, doc.customJSON()); }
					});
				} else {
					if (callback) { callback(res.data.error, undefined); }
				}
			})
			.catch((err) => {
				if (callback) { callback(err.message, undefined); }
			});
	}
}

module.exports = RequestSender;