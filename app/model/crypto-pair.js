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

/**
 * ensure unique compound index with base + target
 */
cryptoPairSchema.index({ base: 1, target: 1}, { unique: true });

/**
 * Returns a custom JSON without the _id field
 */
cryptoPairSchema.methods.customJSON = function() {
	const json = this.toJSON();
	delete json._id;
	delete json.__v;
	return json;
};

/**
 * Update or insert the model in DB.
 * The updated / inserted doc will be passed back to the callback
 */
cryptoPairSchema.methods.upsert = function(callback) {
	const query = {};
	query.target = this.target;
	query.base = this.base;
	const newData = {};
	newData.price = this.price;
	newData.volume = this.volume;
	newData.change = this.change;
	newData.lastUpdated = this.lastUpdated;
	this.model('CryptoPair')
		.findOneAndUpdate(query, newData, { upsert: true, new: true })
		.exec((err, doc) => {
			callback(err, doc);
		});
};

module.exports = mongoose.model('CryptoPair', cryptoPairSchema);