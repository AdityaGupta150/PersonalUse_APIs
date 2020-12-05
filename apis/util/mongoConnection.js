const { createConnection } = require("mongoose");

// eslint-disable-next-line no-unused-vars
const dbNames = { // used by get Connection from req.baseUrl
	sihJ20: "Hack",
	doist15: "MyDoist15"
};

const allConnections = {};

// the default database options for each new connection
const dbOptions = {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,

	retryWrites: true,
	w: "majority"
};

/**
 * @note -> mongoose Connection objects are not `just` promises 
 * 
 * So when we return a createConnection(), it actually is a <<Connection>> Object,
 * ALTHOUGH we can ALSO do `await createConnection()` since the `Connection objects are thenable`, so we can also use the result as a promise
 * 
 * @params -> dbName - Name of database to connect to
 * @note2 - Currently you can't chose to which host to connect localhost or a custom URI, since it just isn't needed
*/

function getConnection(dbName) {
	if (allConnections[dbName]) 
		return allConnections[dbName];
	
	if (dbName.split("/").length > 1) 
		dbName = dbName.split("/")[1];
	else if (!dbName) 
		return null;
	

	if( allConnections[dbName] )
		return allConnections[dbName];
	

	const dbSource = process.env.DB_URI || "mongodb://localhost";

	dbOptions.dbName = dbName; // modifying the dpOptions object
	let conn;
	console.log(`Creating a connection with ${dbOptions.dbName}, at source: ${dbSource}`);
	conn = createConnection(dbSource, dbOptions);
	allConnections[dbName] = conn;
	conn.then((conn) => {
		// attaching the open and error event listeners to the connection object... and then will return this promise
		conn
			.once("open", () => console.log(`Connected to MongoDB, database: ${conn.db.databaseName}, at source: ${dbSource.substr(0,15)}`))
			.on("error", function (err) {
				/**@note - `this` is the conn object itself, change the connection and try again */
				console.error(`Error in DB connection -> code: ${err.code} at host: ${err.hostname}`);
			});
	})
		.catch(() => {
			if( dbSource !== "mongodb://localhost/" ){
				console.log("Unable to connect to MONGODB cluster... Trying to connect to localhost");

				// change connection to the localhost URI 
				conn.openUri("mongodb://localhost/", dbOptions)
					.then((conn) => {
						console.log("Connection to Localhost mongod established");
						conn
							.once("open", () => console.log(`Connected to Localhost MongoDB, database: ${conn.db.databaseName}`))
							.on("error", function (err) {
								console.error(`Error in DB connection -> code: ${err.code} at host: ${err.hostname}`);
							});
					}).catch((err) => {
						console.error("Couldn't connect to MongoDB, neither online cluster, nor localhost", "Start mongod, or connect to internet");

						allConnections[dbName] = null;
						return err;
					});
			}else{
				console.error("Couldn't connect to Localhost MongoDB.", "Start mongod, or connect to internet");

				allConnections[dbName] = null;
				return new Error("Couldn't Connect to Localhost MongoDB");
			}
		});

	return conn;
}

/**
 * @brief - dbName refers to the database name to connect to
 * @deprecated -> no need of this function since, even if we just `return createConnection();` even then it will behave as a promise, since they are thenable so no need actually
 * @returns promise object
 * */
const getConnectionPromise = (dbName) => { // works both ways... dbName can be a baseURL, or a proper one-word name
	// @todo -> will return a promise with the connection object

	return new Promise((resolve, reject) => {
		if (allConnections[dbName]) 
			return allConnections[dbName];
		
		if (dbName.split("/").length > 1) 
			dbName = dbName.split("/")[1];
		else if (!dbName) 
			return null;
		

		const dbSource = process.env.DB_URI || "mongodb://localhost";

		dbOptions.dbName = dbName; // modifying the dpOptions object
		let conn;
		console.log(`Creating a connection with ${dbOptions.dbName}, at source: ${dbSource}`);
		conn = createConnection(dbSource, dbOptions);

		conn.then((conn) => {
			// attaching the open and error event listeners to the connection object... and then will return this promise
			conn
				.once("open", () => console.log(`Connected to MongoDB, database: ${conn.db.databaseName}, at source: ${dbSource.substr(0,15)}`))
				.on("error", function (err) {
					/**@note - `this` is the conn object itself, change the connection and try again */
					console.error(`Error in DB connection -> code: ${err.code} at host: ${err.hostname}`);
				});

			allConnections[dbName] = conn;
			return resolve( conn );
		})
			.catch((err) => {
				if( dbSource !== "mongodb://localhost/" ){
					console.log("Unable to connect to MONGODB cluster...\nTrying to connect to localhost");
					conn = createConnection("mongodb://localhost/", dbOptions)
						.then((conn) => {
							conn
								.once("open", () => console.log(`Connected to Localhost MongoDB, database: ${conn.db.databaseName}`))
								.on("error", function (err) {
									console.error(`Error in DB connection -> code: ${err.code} at host: ${err.hostname}`);
								});

							allConnections[dbName] = conn;
							return resolve( conn );
						}).catch((err) => {
							console.error("Couldn't connect to MongoDB, neither online cluster, nor localhost", "Start mongod, or connect to internet");
							return reject( err );
						});
				}else{
					console.error("Couldn't connect to Localhost MongoDB.", "Start mongod, or connect to internet");
					return reject( new Error("Couldn't Connect to Localhost MongoDB") );
				}
			});
	});
};

exports.getConnection = getConnection;
