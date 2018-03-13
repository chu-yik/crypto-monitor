const config = require('config');
const api = config.get('api');
const interval = config.get('expireInSec');
const querySpacing = config.get('querySpacingInSec');
const nock = require('nock');
const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const MyCryptoServer = require('../app/server');
const DefaultRouter = require('../app/router/default-router');
const RequestSender = require('../app/request-sender');
const CryptoPair = require('../app/model/crypto-pair');
const CryptoMock = require('./mock/crypto-mock');

const sender = new RequestSender();
const router = new DefaultRouter(sender);
const testServer = new MyCryptoServer(router);

describe('Crypto-monitor server tests', () => {

	before((done) => {
		testServer.connectToDatabase(() => {
			testServer.start(done);
		});
	});

	beforeEach('resetting DB', (done) => {
		const c = new CryptoPair(CryptoMock.btc_usd);
		CryptoPair.remove({}, (err) => {
			c.save(done);
		});
	});

	describe('/GET /:target/:base', () => {

		describe('when queried crypto pair in DB is up to date', () => {
			it('should return the correct crypto pair from DB', (done) => {
				const expected = CryptoMock.btc_usd;
				const clock = sinon.useFakeTimers({ now: expected.lastUpdated * 1000 });
				chai.request(testServer.app)
					.get('/usd/btc')
					.end((err, res) => {
						expect(res.body).to.eql(expected);
						clock.restore();
						done();
					});
			});

			it('should be case-insensitive', (done) => {
				const expected = CryptoMock.btc_usd;
				const clock = sinon.useFakeTimers({ now: expected.lastUpdated * 1000 });
				chai.request(testServer.app)
					.get('/UsD/bTc')
					.end((err, res) => {
						expect(res.body).to.eql(expected);
						clock.restore();
						done();
					});
			});
		});

		describe('when queried crypto pair in DB is not found / has expired', () => {

			var clock;
			beforeEach('mocking http responses', () => {
				nock(api).get('/btc-usd').reply(200, CryptoMock.btc_usd_response_new).persist();
				nock(api).get('/eth-usd').reply(200, CryptoMock.eth_usd_response_new).persist();
			});

			afterEach('cleaning mock response and restoring time if faked', () => {
				nock.cleanAll();
				if (clock) {
					clock.restore();
				}
			});

			it('should send http get request to third party api', (done) => {
				const spy = sinon.spy(sender, 'sendRequest');
				chai.request(testServer.app)
					.get('/usd/eth')
					.end((err, res) => {
						expect(spy.calledOnce).to.be.true;
						sender.sendRequest.restore();
						done();
					});
			});

			it('should update the cryto pair in DB when received response data', (done) => {
				const spy = sinon.spy(sender, 'sendRequest');
				const expected = CryptoMock.btc_usd_new;
				clock = sinon.useFakeTimers({ now: expected.lastUpdated * 1000 });
				// sending two consecutive request, if in second one we get the expected doc
				// with the http request firing only once then the data is from DB
				chai.request(testServer.app)
					.get('/usd/btc')
					.end((err, res) => {
						chai.request(testServer.app)
							.get('/usd/btc')
							.end((err, res) => {
								expect(res.body).to.eql(expected);
								expect(spy.calledOnce).to.be.true;
								sender.sendRequest.restore();
								done();
							});
					});
			});

			it('should return the updated cryto pair info when received response data', (done) => {
				const expected = CryptoMock.eth_usd_new;
				clock = sinon.useFakeTimers({ now: expected.lastUpdated * 1000 });
				chai.request(testServer.app)
					.get('/usd/eth')
					.end((err, res) => {
						expect(res.body).to.eql(expected);
						done();
					});
			});

			it('should not send query if spacing from last query is not established', (done) => {
				const spy = sinon.spy(sender, 'sendRequest');
				const expected = CryptoMock.btc_usd_new;
				// mocking time so that server response has expired
				clock = sinon.useFakeTimers({ now: (expected.lastUpdated + interval + 1) * 1000 });
				// sending two consecutive request, make sure the http request is fired only once
				chai.request(testServer.app)
					.get('/usd/btc')
					.end((err, res) => {
						chai.request(testServer.app)
							.get('/usd/btc')
							.end((err, res) => {
								expect(spy.calledOnce).to.be.true;
								sender.sendRequest.restore();
								done();
							});
					});
			});

			it('should send query if spacing from last query is established', (done) => {
				const spy = sinon.spy(sender, 'sendRequest');
				const expected = CryptoMock.btc_usd_new;
				// mocking time so that server response has expired
				clock = sinon.useFakeTimers({ now: (expected.lastUpdated + interval + 1) * 1000 });
				// sending two consecutive request, make sure the http request is fired only once
				chai.request(testServer.app)
					.get('/usd/btc')
					.end((err, res) => {
						// advance by spacing + 1 sec
						clock.tick((querySpacing + 1) * 1000);
						chai.request(testServer.app)
							.get('/usd/btc')
							.end((err, res) => {
								expect(spy.calledTwice).to.be.true;
								sender.sendRequest.restore();
								done();
							});
					});
			});
		});

		describe('when queried crypto pair in DB has expired but failed getting api response', () => {

			const expected = CryptoMock.btc_usd;
			var clock;
			beforeEach('faking time to have expired', () => {
				clock = sinon.useFakeTimers({ now: (expected.lastUpdated + interval + 1) * 1000 });
			});

			afterEach('cleaning mock response and restoring time', () => {
				nock.cleanAll();
				if (clock) {
					clock.restore();
				}
			});

			it('should return the existing cryto pair from DB, when response is 404', (done) => {
				// fake response to be 404 error
				nock(api).get('/btc-usd').reply(404);
				chai.request(testServer.app)
					.get('/usd/btc')
					.end((err, res) => {
						expect(res.body).to.eql(expected);
						done();
					});
			});

			it('should return the existing cryto pair from DB, when response is error message', (done) => {
				// fake response to be response error message
				nock(api).get('/btc-usd').reply(200, CryptoMock.error_response);
				chai.request(testServer.app)
					.get('/usd/btc')
					.end((err, res) => {
						expect(res.body).to.eql(expected);
						clock.restore();
						done();
					});
			});

			it('should not send query if spacing from last query is not established', (done) => {
				// fake response to be response error message
				nock(api).get('/btc-usd').reply(200, CryptoMock.error_response);
				const spy = sinon.spy(sender, 'sendRequest');
				// sending two consecutive request, make sure the http request is fired only once
				chai.request(testServer.app)
					.get('/usd/btc')
					.end((err, res) => {
						chai.request(testServer.app)
							.get('/usd/btc')
							.end((err, res) => {
								expect(spy.calledOnce).to.be.true;
								sender.sendRequest.restore();
								done();
							});
					});
			});

			it('should send query if spacing from last query is established', (done) => {
				// fake response to be response error message
				nock(api).get('/btc-usd').reply(200, CryptoMock.error_response).persist();
				const spy = sinon.spy(sender, 'sendRequest');
				// sending two consecutive request
				chai.request(testServer.app)
					.get('/usd/btc')
					.end((err, res) => {
						// advance by spacing + 1 sec
						clock.tick((querySpacing + 1) * 1000);
						chai.request(testServer.app)
							.get('/usd/btc')
							.end((err, res) => {
								expect(spy.calledTwice).to.be.true;
								sender.sendRequest.restore();
								done();
							});
					});
			});
		});

		describe('when queried crypto pair in DB is not found but failed getting api response', () => {

			it('should return error message, when response is 404', (done) => {
				// fake response to be 404 error
				nock(api).get('/eth-usd').reply(404);
				chai.request(testServer.app)
					.get('/usd/eth')
					.end((err, res) => {
						expect(res.body.error).to.exist;
						done();
					});
			});

			it('should return error message, when response is error message', (done) => {
				// fake response to be response error message
				nock(api).get('/eth-usd').reply(200, CryptoMock.error_response);
				chai.request(testServer.app)
					.get('/usd/eth')
					.end((err, res) => {
						expect(res.body.error).to.exist;
						done();
					});
			});
		});
	});

	describe('Invalid requests', () => {
		it('should return 404 error', (done) => {
			chai.request(testServer.app)
				.get('/random')
				.end((err, res) => {
					expect(res).to.have.status(404);
					done();
				});
		});
	});
});