const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('config');
const port = config.get('port');
const dbUrl = config.get('dbUrl');

class MyCryptoServer {
	constructor(router) {
		this.router = router;
		this.app = express();
	}

	connectToDatabase(callback) {
		mongoose.connect(dbUrl);
		mongoose.connection.on('error', console.error.bind(console, 'Database Connection Error'));
		mongoose.connection.once('open', callback);
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