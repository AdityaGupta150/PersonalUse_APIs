const app = require("./app");
const server = app.listen(7943, ()=>console.log("Listening temporarily on port 7943"));

setTimeout(() => {
	server.close();
	console.log("Exiting gracefully :D");
	process.exit(0); // OK
}, 5000); // waits for 5 seconds before exiting
