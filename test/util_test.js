const chai = require('chai');
const expect = chai.expect;
const util = require('../app/util/util');

const CryptoPair = require('../app/model/crypto-pair');
const CryptoMock = require('./mock/crypto-mock');

describe('Custom util tests', () => {
	describe('#shouldUpdateFromApi', () => {
		it('should return true if doc is null', () => {
			const doc = null;
			expect(util.shouldUpdateFromApi(doc)).to.be.true;
		});

		it('should return true if doc has expired', () => {
			const doc = CryptoPair(CryptoMock.btc_usd);
			expect(util.shouldUpdateFromApi(doc)).to.be.true;
		});

		it('should return false if doc is up-to-date', () => {
			const doc = CryptoPair(CryptoMock.btc_usd_never_expire);
			expect(util.shouldUpdateFromApi(doc)).to.be.false;
		});
	});
});