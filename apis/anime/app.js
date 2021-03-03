const http_parser = require("node-html-parser");
const router = require("express").Router();
const compose = require("request-compose").client;
const http_req = require("http").request;

const base_urls = {
	drstone: "http://ww3.readdrstone.com/chapter/dr-stone-chapter-",
};

router.get("/drstone/:chapNo", (req, res) => {
	http_req(`${base_urls.drstone}${parseInt(req.params.chapNo)}/`, {
		headers: {
			"user-agent": "uf-apis"
		}
	}, (response) => {
		console.log( `Resonse is ${response.statusCode}` );
		response.on("data", (chunk) => console.log(`Body -> ${chunk}`));
		res.sendStatus(200);
	});
	console.log(`${base_urls.drstone}${parseInt(req.params.chapNo)}/`)
	// compose.call()
});

module.exports = router;
