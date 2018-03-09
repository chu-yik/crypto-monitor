const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const MyCryptoServer = require('../app/server');
const DefaultRouter = require('../app/router/default-router');
const CryptoPair = require('../app/model/crypto-pair');
const CryptoMock = require('./mock/crypto-mock');

const router = new DefaultRouter();
const testServer = new MyCryptoServer(router);


describe('Crypto-monitor server tests', () => {

	before((done) => {
		testServer.connectToDatabase(() => {
			const c = new CryptoPair(CryptoMock.btc_usd);
			CryptoPair.remove({}, (err) => {
				c.save((err) => {
					testServer.start(done);
				});
			});
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
			it('should send http get request to third party api', (done) => {
				done();
			});

			it('should update the cryto pair in DB when received response data', (done) => {
				done();
			});

			it('should return the updated cryto pair info when received response data', (done) => {
				done();
			});
		});

		describe('when queried crypto pair in DB has expired but failed getting api response', () => {
			it('should return the existing cryto pair from DB', (done) => {
				done();
			});
		});

		describe('when queried crypto pair in DB is not found but failed getting api response', () => {
			it('should return error', (done) => {
				done();
			});
		});

	});

	describe('Invalid requests', () => {
		it('should return 404 error', (done) => {
			chai.request(testServer.app)
				.get('/random')
				.end( (err, res) => {
					expect(res).to.have.status(404);
					done();
				});
		});
	});
});