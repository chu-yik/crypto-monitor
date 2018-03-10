const RequestSender = require('./app/request-sender');
const DefaultRouter = require('./app/router/default-router');
const MyCryptoServer = require('./app/server');

const sender = new RequestSender();
const router = new DefaultRouter(sender);
const server = new MyCryptoServer(router);

process.title = process.argv[2];

server.connectToDatabase(() => {
	server.start();
});