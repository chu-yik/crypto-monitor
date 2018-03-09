const CryptoPair = require('../model/crypto-pair');
const util = require('../util/util');

class DefaultRouter {
	constructor() {

	}

	getCryptoPair(req, res) {
		const query = {};
		query.base = req.params.base;
		query.target = req.params.target;
		CryptoPair.findOne(query, (err, doc) => {
			if (util.shouldUpdateFromApi(doc)) {
				// TODO: update from API
				res.status(404).send({error: 'not found'});
			} else {
				res.status(200).json(doc.customJSON());
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