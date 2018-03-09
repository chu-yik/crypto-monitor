const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schema for crypto pair DB model
 * base is the crypto currency like btc, eth
 * target is the real world currency like usd
 * lastUpdated is last updated time in epoch seconds
 */
const cryptoPairSchema = new Schema({
	base: { type: String, required: true, lowercase: true },
	target: { type: String, required: true, lowercase: true },
	price: Number,
	volume: Number,
	change: Number,
	lastUpdated: Number,
});

module.exports = mongoose.model('CryptoPair', cryptoPairSchema);