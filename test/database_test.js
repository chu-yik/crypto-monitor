const mongoose = require('mongoose');
const config = require('config');
const dbUrl = config.get('dbUrl');
const chai = require('chai');
const expect = chai.expect;

const CryptoPair = require('../app/model/crypto-pair');
const CryptoMock = require('./mock/crypto-mock');

describe('Database integration tests', () => {
	before((done) => {
		mongoose.connect(dbUrl);
		mongoose.connection.on('error', console.error.bind(console, 'Database Connection Error'));
		mongoose.connection.once('open', () => {
			const c = new CryptoPair(CryptoMock.btc_usd);
			CryptoPair.remove({}, (err) => {
				c.save((err) => {
					console.log('connected to and initialised DB: ' + dbUrl);
					done();
				});
			});
		});
	});

	after((done) => {
		mongoose.connection.close(() => {
			console.log('closing connection to DB: ' + dbUrl);
			done();
		});
	});

	describe('Query from mongoose model', () => {
		it('should be case-insensitive', (done) => {
			CryptoPair.findOne({ base: 'BtC', target: 'uSd' }, (err, doc) => {
				expect(doc.customJSON()).to.eql(CryptoMock.btc_usd);	
				done();
			});
		});

		it('should return the record if found', (done) => {
			CryptoPair.findOne({ base: 'btc', target: 'usd' }, (err, doc) => {
				expect(doc.customJSON()).to.eql(CryptoMock.btc_usd);	
				done();
			});
		});

		it('should return null if not found', (done) => {
			CryptoPair.findOne({ base: 'eth', target: 'usd' }, (err, doc) => {
				expect(doc).to.be.null;
				done();
			});
		});
	});

	describe('Save from mongoose model', () => {
		it('should throw error for duplicated index', (done) => {
			done();
		});
	});

	describe('Upsert from mongoose model', () => {
		it('should update the record if existing', (done) => {
			done();
		});

		it('should insert the record if not existing', (done) => {
			done();
		});
	});
});