const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const port = config.get('port');

class MyCryptoServer {
	constructor(router) {
		this.router = router;
		this.app = express();
	}

	start(callback) {
		this.app.use(bodyParser.json());
		this.app.route('/:target/:base').get(this.router.getCryptoPair);
		this.app.use('/', this.router.send404);
		this.app.listen(port, () => {
			console.log('Server started, listening on port ' + port);
			callback();
		});
	}
}

module.exports = MyCryptoServer;