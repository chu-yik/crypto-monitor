class DefaultRouter {
	constructor() {

	}

	getCryptoPair(req, res) {
		
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