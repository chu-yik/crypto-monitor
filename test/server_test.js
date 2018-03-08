const MyCryptoServer = require('../app/server');
const testServer = new MyCryptoServer();

describe('Crypto-monitor server tests', () => {

	before( (done) => {
		testServer.start();
		done();
	});

	it('should run this test correctly', (done) => {
		done();
	});
});