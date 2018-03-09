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