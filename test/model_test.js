const chai = require('chai');
const expect = chai.expect;
const CryptoPair = require('../app/model/crypto-pair');
const CryptoMock = require('./mock/crypto-mock');

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
			const c = new CryptoPair(CryptoMock.btc_usd_cap);
			expect(c.base).to.eql('btc');
			done();
		});

		it('should force lowercase on target', (done) => {
			const c = new CryptoPair(CryptoMock.btc_usd_cap);
			expect(c.target).to.eql('usd');
			done();
		});
	});

	describe('model to json', () => {
		it('should return expected info', (done) => {
			const c = new CryptoPair(CryptoMock.btc_usd_cap);
			expect(c.customJSON()).to.eql(CryptoMock.btc_usd);
			done();
		});
	});
});