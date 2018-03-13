const debug = require('debug')('crypto:router');
const CryptoPair = require('../model/crypto-pair');
const util = require('../util/util');

/**
 * Implementation of a default router that routes the get crypto pair request
 * It uses a request sender to send request to and parse response from
 * designated third party API specified in the config
 */
class DefaultRouter {
	constructor(requestSender) {
		this.requestSender = requestSender;
	}

	getCryptoPair(req, res) {
		const query = {};
		query.base = req.params.base;
		query.target = req.params.target;
		debug('query: %o', query);
		CryptoPair.findOne(query, (err, doc) => {
			if (util.shouldUpdateFromApi(doc)) {
				this.requestSender.sendRequest(query, (err, result) => {
					if (result) {
						res.json(result);
					} else if (doc) {
						const epochSecNow = Math.ceil(Date.now() / 1000);
						doc.lastQueried = epochSecNow;
						doc.upsert((err, doc) => {
							res.json(doc.customJSON());
						});
					} else {
						res.send({
							error: err
						});
					}
				});
			} else {
				debug('using database stored info');
				res.json(doc.customJSON());
			}
		});
	}

	send404(req, res) {
		res.status(404).send({
			error: 'Invalid request',
			method: req.method,
			path: req.url
		});
	}
}
module.exports = DefaultRouter;