const express = require('express');
const bodyParser = require('body-parser');

class MyCryptoServer {
	constructor(router) {
		this.router = router;
		this.app = express();
	}

	start(callback) {
		this.app.use(bodyParser.json());
		this.app.route('/:target/:base').get(this.router.getCryptoPair);
		this.app.use('/', this.router.send404);
		this.app.listen(8888, () => {
			console.log('Server started, listening on port 8888');
			callback();
		});
	}
}

module.exports = MyCryptoServer;