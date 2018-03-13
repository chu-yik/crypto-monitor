const debug = require('debug')('crypto:server');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('config');
const port = config.get('port');
const dbUrl = config.get('dbUrl');
const corsOrigin = config.get('corsOrigin');

class MyCryptoServer {
	constructor(router) {
		this.router = router;
		this.app = express();
	}

	connectToDatabase(callback) {
		mongoose.connect(dbUrl);
		mongoose.connection.on('error', debug.bind(debug, 'Database Connection Error'));
		mongoose.connection.once('open', callback);
	}

	start(callback) {
		this.app.use(bodyParser.json());
		this.app.use((req, res, next) => {
			// allowing CORS (Cross-Origin Resource Sharing) before next layer of middleware
			res.setHeader('Access-Control-Allow-Origin', corsOrigin);
			next();
		});
		this.app.route('/:target/:base').get(this.router.getCryptoPair.bind(this.router));
		this.app.use('/', this.router.send404);
		this.app.listen(process.env.PORT || port, () => {
			debug('Server started, listening on port %d', port);
			if (callback) { callback(); }
		});
	}
}

module.exports = MyCryptoServer;