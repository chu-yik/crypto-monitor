const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const config = require('config');
const api = config.get('api');
const interval = config.get('expireInSec');
const querySpacing = config.get('querySpacingInSec');
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

		it('should return true if doc has expired, and query spacing is enough', () => {
			const mock = CryptoMock.btc_usd;
			const fakeNow = mock.lastUpdated + interval + 1;
			mock.lastQueried = fakeNow - querySpacing - 1;
			const doc = CryptoPair(mock);
			clock = sinon.useFakeTimers({ now: fakeNow * 1000 });
			expect(util.shouldUpdateFromApi(doc)).to.be.true;
		});


		it('should return false even if doc has expired, but query spacing is not enough', () => {
			const mock = CryptoMock.btc_usd;
			const fakeNow = mock.lastUpdated + interval + 1;
			mock.lastQueried = fakeNow - querySpacing;
			const doc = CryptoPair(mock);
			clock = sinon.useFakeTimers({ now: fakeNow * 1000 });
			expect(util.shouldUpdateFromApi(doc)).to.be.false;
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