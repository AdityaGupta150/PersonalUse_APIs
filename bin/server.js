#!/usr/bin/env node

const app = require('../app');
const http = require('http');

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);		// mounting the express app on the node server

/**
 * Event listener for HTTP server "error" event.
 */
function onError (error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
	case 'EACCES':
		console.error(bind + ' requires elevated privileges');
		process.exit(1);
	case 'EADDRINUSE':
		console.error(bind + ' is already in use');
		process.exit(1);
	default:
		throw error;
	}
}

function onListening () {
	const addr = server.address();
	const bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	console.log('Listening on ' + bind);
}

server.on('error', onError);
module.exports = server.listen(port, onListening);
