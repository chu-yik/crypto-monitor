process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const MyCryptoServer = require('../app/server');
const DefaultRouter = require('../app/router/default-router');
const router = new DefaultRouter();
const testServer = new MyCryptoServer(router);


describe('Crypto-monitor server tests', () => {

	before((done) => {
		testServer.start(done);
	});

	describe.skip('/GET /:target/:base', () => {

		describe('when queried crypto pair in DB is up to date', () => {
			it('should return the correct crypto pair from DB', (done) => {
				done();
			});

			it('should be case-insensitive', (done) => {
				done();
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