const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const config = require('config');
const api = config.get('api');
const interval = config.get('expireInSec');
const util = require('../app/util/util');

const CryptoPair = require('../app/model/crypto-pair');
const CryptoMock = require('./mock/crypto-mock');

var clock;
describe('Custom util tests', () => {
	describe('#shouldUpdateFromApi', () => {
		afterEach('restore time if faked', () => {
			if (clock) {
				clock.restore();
			}
		});

		it('should return true if doc is null', () => {
			const doc = null;
			expect(util.shouldUpdateFromApi(doc)).to.be.true;
		});

		it('should return true if doc has expired', () => {
			const doc = CryptoPair(CryptoMock.btc_usd);
			clock = sinon.useFakeTimers({ now: (doc.lastUpdated + interval + 1) * 1000 });
			expect(util.shouldUpdateFromApi(doc)).to.be.true;
		});

		it('should return false if doc is up-to-date', () => {
			const doc = CryptoPair(CryptoMock.btc_usd);
			clock = sinon.useFakeTimers({ now: (doc.lastUpdated + interval) * 1000 });
			expect(util.shouldUpdateFromApi(doc)).to.be.false;
		});
	});

	describe('#apiForQuery', () => {
		it('should return the correct api', () => {
			const expected = api + 'btc-usd';
			const query = { target: 'UsD', base: 'bTc' };
			expect(util.apiForQuery(query)).to.eql(expected);
		});
	});
});