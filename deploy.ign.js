const server = require("./bin/server");

setTimeout(() => {
	server.close();
	console.log("Exiting gracefully :D");
	process.exit(0); // OK
}, 5000); // waits for 5 seconds before exiting
