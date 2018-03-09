/**
 * mock data for btc-usd crypto pair
 */
module.exports.btc_usd = {
	base: 'btc',
	target: 'usd',
	price: 135.79,
	volume: 23.45,
	change: -0.98,
	lastUpdated: 1520500000
};

/**
 * mock data for btc-usd crypto pair, 
 * with capitalised base and target input
 * other content should remain the same as btc_usd
 */
module.exports.btc_usd_cap = {
	base: 'BTC',
	target: 'USD',
	price: 135.79,
	volume: 23.45,
	change: -0.98,
	lastUpdated: 1520500000
};

/**
 * mock data for btc-usd crypto pair, 
 * with a last updated time that is unlikely to expire 
 */
module.exports.btc_usd_never_expire = {
	base: 'BTC',
	target: 'USD',
	price: 135.79,
	volume: 23.45,
	change: -0.98,
	lastUpdated: 32479920000 // 2999-04-01
};

/**
 * mock data for btc-usd cryto pair - updated info
 */
module.exports.btc_usd_new = {
	base: 'btc',
	target: 'usd',
	price: 10763.56478871,
	volume: 81869.94445057,
	change: -6.51378095,
	lastUpdated: 1520600000
};

/**
 * mock data for eth-usd cryto pair - updated info
 */
module.exports.eth_usd_new = {
	base: 'eth',
	target: 'usd',
	price: 811.77905031,
	volume: 143517.19935316,
	change: -1.76038390,
	lastUpdated: 1520600000
};