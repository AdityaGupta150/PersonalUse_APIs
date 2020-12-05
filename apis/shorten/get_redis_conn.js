const moment = require("moment");

const redis = require("redis");
//  deepcode ignore WrongNumberOfArgs: False Positive by deepcode, contacted
const redisClient = redis.createClient({
	port: 6379,
	host: "127.0.0.1",
	retry_strategy: (options) => {
		if( options.error  && options.error.code === "ECONNREFUSED" ){
			// End reconnecting on a specific error and flush all commands with an individual error
			return new Error("The server refused the connection");
		}
		if( options.total_retry_time > 5 * 60 * 1000 ){ // 5 minutes
			return new Error("Retry time for connecting to redis exhausted");
		}
		if( options.attempt > 10 ){
			// End reconnecting with built in error
			return undefined;
		}

		// reconnect after
		return Math.min( options.attempt * 10, 300 );
	}
}); // the default port is 6379 itself

redisClient.on(
	"error",
	(err) => console.log(`[${moment().format("DD/MM HH:mm:ss")}] Redis Error -> ${err.code}`)
);

/**
 * @events @redis ->
 *  ready   - connection established, any commands before this are queued 
 * connect  - stream is connected to the server
 * reconnecting - trying to reconnect to the Redis server after losing the connection
 * error - when encountering an error connecting to the Redis server or when any other in Node Redis occurs. If you use a command without callback and encounter a ReplyError it is going to be emitted to the error listener.
 * end - an established Redis server connection has closed
 * warning - when password was set but none is needed and if a deprecated option / function / similar is used
 */

module.exports = redisClient;
