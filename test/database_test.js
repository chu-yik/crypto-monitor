const mongoose = require('mongoose');
const config = require('config');
const dbUrl = config.get('dbUrl');

describe('Database integration tests', () => {
	before((done) => {
		mongoose.connect(dbUrl);
		mongoose.connection.on('error', console.error.bind(console, 'Database Connection Error'));
		mongoose.connection.once('open', () => {
			console.log('connected to DB: ' + dbUrl);
			done();
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
			done();
		});

		it('should return the record if found', (done) => {
			done();
		});

		it('should return null if not found', (done) => {
			done();
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