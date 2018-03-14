# crypto-monitor

## Summary
This project is my submission for a programming test. It also acts as a refresher for me to practise skills on node.js & mongodb. 

The project contains an API server implemented with node.js (using express), it provides API for querying information on cryptocurrencies. The information is stored in a connected mongodb, if the information has expired, the server will query it from an external, third party API.

In this project the third party API used is from [cryptonator](https://www.cryptonator.com).

### Server API

Only a single GET API is implemented on the server:

```
GET [server_address]/[target]/[base]
```

+ *server_address*: the address for which the server is hosted, the default is *localhost:8080*
+ *target*: target currency to which the price of base currency is compared, this terminology is borrowed from cryptonator
+ *base*: base currency in concern, this terminology is borrowed from cryptonator 

Note that cryptonator uses *[base]-[target]* as currency pair, whereas implementation for our server has */[target]/[base]*.

#### Sample queries and responses

Assuming our server is running at the default address *localhost:8080/*.

##### Successful query

A sample query for the price of Bitcoin *(btc)* in terms of US dollars *(usd)* will be:

```
GET localhost:8080/usd/btc
```

And the response is in JSON format, for example:

```
{
	base: "btc",
	target: "usd",
	lastUpdated: 1520992621,
	change: -15.80475103,
	volume: 106676.71239259,
	price: 9298.28675296
}
```

+ *lastUpdated*: last updated time in epoch seconds
+ *change, volume, price*: see next section about Cryptonator API

##### Invalid currency pair

A error will be returned if the given currency pair is not found. For example the following query:

```
GET localhost:8080/abc/def
```

will result in the following response

```
{
	error: "Pair not found"
}
```

##### Invalid query

Queries other than the implemented one is regarded as invalid, and will result in the following response:

```
{
	error: "Invalid request",
	method: "GET",
	path: "/"
}
```


### Cryptonaptor API
There is only a single HTTP GET API used:
- https://api.cryptonator.com/api/ticker/*[currency-pair]*

##### [currency-pair]
The currency pair consists of a base and a target, in the form of *[base]-[target]*. For instance, the following will query the price of Bitcoin *(btc)* to US dollars *(usd)*:

- [https://api.cryptonator.com/api/ticker/btc-usd](https://api.cryptonator.com/api/ticker/btc-usd)

A detailed explanation of the API can be found at [this page on cryptonator](https://www.cryptonator.com/api/). A complete list of supported currencies can also be found.


## Build environment

**[node (and npm)](https://nodejs.org/en/download/)** and **[mongodb](https://docs.mongodb.com/manual/installation/)** are required for building the project. See relevant link on installation.

### Tested versions

This project was tested on macOS 10.13 with [homebrew](https://brew.sh) managed node (and npm) and mongodb.

- node 5.6.0
- npm 9.8.0
- mongodb 3.6.3

For it to work on Linux or Windows, the npm scripts in package.json will need to be modified.

### Dependencies

Dependencies are managed by npm, the following packages are used:

+ **axios**: [axios 0.18.0](https://www.npmjs.com/package/axios)   
+ **body-parser**: [body-parser 1.18.2](https://www.npmjs.com/package/body-parser)
+ **config**: [config 1.30.0](https://www.npmjs.com/package/config)
+ **debug**: [debug 3.1.0](https://www.npmjs.com/package/debug)
+ **express**: [express 4.16.2](https://www.npmjs.com/package/express)
+ **mongoose**: [mongoos 5.0.9](https://www.npmjs.com/package/mongoose)


#### Development dependencies

This project also uses the following development dependencies, mainly for testing purpose:

+ **chai**: [chai 4.1.2](https://www.npmjs.com/package/chai)
+ **chai-http**: [chai-http 3.0.0](https://www.npmjs.com/package/chai-http)
+ **mocha**: [mocha 5.0.4](https://www.npmjs.com/package/mocha)
+ **nock**: [nock 9.2.3](https://www.npmjs.com/package/nock)
+ **sinon**: [sinon 4.4.2](http://sinonjs.org)

## How to build the project

After cloning the project, install all npm packages by running:

```
npm install
```

This should install all the dependencies.

### Update npm scripts (optional)

There are serveral predefined scripts in **package.json**. On window and linux they will need to be updated.

#### pre-start and pre-test scripts (optional)

The following script will be run for both *prestart* and *pretest*:

```
mongod --dbpath data --fork --logpath /dev/null
```

This will starts the mongodb on a child process *(--fork)* with the specified database path *(--dbpath data)*. We are not interested in the database log so we specify the logpath to go to /dev/null *(--logpath /dev/null.)*

It is worth noting that the **only requirement** before starting the server is to have a running mongodb that we could connect to.

Also refer to the section on configuration file for specifying the database url.

#### post-stop and post-test scripts (optional)

The following script will be run for both *poststop* and *posttest*:

```
mongo admin --eval 'db.shutdownServer()' > /dev/null
```

What the script does is to try shutting down the database after server has stopped, and test is finished. 

### Create database directory

As explained, by default the prestart and pretest script points to **data/** directory for mongodb path. The database directory will need to be created if specified and not already existing.

Create the directory in the project root folder:

```
mkdir data
```

Others options are changing the prestart and pretest script to point to another directory, or removing the *'--dbpath data'* to use the default database path.

## How to run the project

After all the prerequisites mentioned in previous section(s), the npm scripts can be used to test, start, and stop the server.

### Testing

Run the following command to execute the tests implemented:

```
npm test
```

For debugging the tests, change the 'test' script in *package.json* to:

```
export DEBUG='crypto:*' && export NODE_ENV='test' && mocha --exit
```

### Starting the server

The following command will start the server: 

```
npm start
```

Before the server starts, the script will also try to start the database. An error will be thrown if the database is alraedy running, in this case see *Shutting down the database* section.

### Stoping the server

The following command will stop the server (if it is running), and then shuts down the database:

```
npm stop
```

### Shutting down the database

The mongodb will be left running if the server has crashed or is terminated without executing the 'npm stop' command, in such case the database need to be manually shut down using the following command:

```
mongo admin --eval 'db.shutdownServer()'

```

It is worth noting that both 'npm start' or 'npm test' assumes the mongodb is not currently running and invokes the 'prestart' and 'pretest' script to launch the mongodb. If either of them throws an error it is likely that the database needs to be shut down manually.


### Server Configuration

This project uses [*config*](https://www.npmjs.com/package/config) for loading configuration files. The config files are located at config/ directory.

The default configuration *(default.json)* contains the following:

```
{
	"port": 8080,
	"expireInSec": 120,
	"querySpacingInSec": 60,
	"api": "https://api.cryptonator.com/api/ticker/",
	"dbUrl": "mongodb://localhost:27017/production",
	"corsOrigin": "*",
	"axiosConfig": {
		"maxRedirects": 10,
		"maxContentLength": 20971520,
		"timeOut": 2500
	}
}
```

+ *port*: the port at which the server will be listening to
+ *expireInSec*: the expiry time, in seconds, for stored cryptocurreny information, more on this later
+ *querySpacingInSec*: the minimum spacing, in seconds, between firing the same query to third party API, more on this later
+ *api*: base url for the third party API
+ *dbUrl*: url for the connected database
+ *corsOrigin*: used to configure [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) origin allowed by the server, this is for the front-end hosted on the same server (or localhost) to access our API server
+ *axiosConfig*: configurations for the npm package [*axios*](https://www.npmjs.com/package/axios) used for sending http requests, see its page for more detail

During testing the specified fileds in test configuration file *(test.json)* will overwrite the default one.

#### Expiry time and query spacing

These are used to prevent firing an excessive amount of API queries to the third party API. The server will only send http request to third party API if:

+ the queried currency pair information is not found in the database, or
+ the queried currency pair information in the database has expired (i.e. the stored last updated time is more than *expireInSec* seconds ago), **and** the query spacing is established (i.e. the last **same** query sent to third party API was *querySpacingInSec* seconds ago)

##### Note

Whenever a query is sent to the third party API, the last queried time will be saved in the database for the queried currency pair, even if there is an error getting response from the third party API.

## Working demo

A [working demo](https://mc-crypto-server.herokuapp.com/usd/btc) of the server is deployed to [heroku](https://www.heroku.com/).

The branch used is [heroku](https://github.com/chu-yik/crypto-monitor/tree/heroku).

##### Note

The app hosted on heroku will [sleep a period of inactivity](https://devcenter.heroku.com/articles/free-dyno-hours), so chances are the initial load will have a short delay.

