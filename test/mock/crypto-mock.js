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
 * mock response data for btc-usd from 3rd party end point
 * content should match btc_usd_new
 */
module.exports.btc_usd_response_new = {
	ticker: {
		base: 'BTC',
		target: 'USD',
		price: '10763.56478871',
		volume: '81869.94445057',
		change: '-6.51378095'
	},
	timestamp: 1520600000,
	success: true,
	error: ''
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

/**
 * mock response data for eth-usd from 3rd party end point
 * content should match eth_usd_new
 */
module.exports.eth_usd_response_new = {
	ticker: {
		base: 'ETH',
		target: 'USD',
		price: '811.77905031',
		volume: '143517.19935316',
		change: '-1.76038390'
	},
	timestamp: 1520600000,
	success: true,
	error: ''
};

/**
 * mock response data for erorr response from 3rd party end point
 */
module.exports.error_response = {
	success: false,
	error: 'Pair not found'
};