const chai = require('chai');
const expect = chai.expect;
const CryptoPair = require('../app/model/crypto-pair');

describe('Crypto pair model tests', () => {
	describe('model validation', () => {
		it('should be invalid if base is empty', (done) => {
			const c = new CryptoPair({ target: 'usd' });
			c.validate((err) => {
				expect(err.errors.base).to.exist;
				done();
			});
		});

		it('should be invalid if target is empty', (done) => {
			const c = new CryptoPair({ base: 'btc' });
			c.validate((err) => {
				expect(err.errors.target).to.exist;
				done();
			});
		});
	});

	describe('model initialization', () => {
		it('should force lowercase on base', (done) => {
			done();
		});

		it('should force lowercase on target', (done) => {
			done();
		});
	});

	describe('model to json', () => {
		it('should return expected info', (done) => {
			done();
		});
	});
});