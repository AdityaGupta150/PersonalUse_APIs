const router = require("express").Router();
const request = require("request-composer").client;

/**
 * @shortcut -> You can add this as shortcut in bookmarks toolbar (without quotes) -> 
 *  "javascript: (b => fetch('https://api.github.com/repos/' + b[1] + '/commits?sha=' + (b[2] || '')).then(c => Promise.all([c.headers.get('link'), c.json()])).then(c => { if (c[0]) { var d = c[0].split(',')[1].split(';')[0].slice(2, -1); return fetch(d).then(e => e.json()) } return c[1] }).then(c => c.pop().html_url).then(c => window.location = c))(window.location.pathname.match(/\/([^\/]+\/[^\/]+)(?:\/tree\/([^\/]+))?/));"
 */


/**
 * @brief -> This route redirects you to the first commit of a git repo on github, you can explore the code at that state then
 * 
 * @request_body -> github repo url is needed to be sent (can also send in `username/repo_name` format)
 *                  It can be either in query string, or in body
 *                  the key name will be `REPO`
 * For eg. req.body = { REPO: "https://github.com/AdityaGupta150/Useful_APIs" }
 * 
 * @response -> If success, you will be `redirected`
 * 
 *              else you receieve a 400 status code
 */
router.get("/", (req, res) => {

});

module.exports = router;

/*function func(b){
	fetch("https://api.github.com/repos/" + b[1] + "/commits?sha=" + (b[2] || ""))
		.then(c => Promise.all([c.headers.get("link"), c.json()]))
		.then(c => { 
			if (c[0]) {
				var d = c[0].split(",")[1].split(";")[0].slice(2, -1);
				return fetch(d).then(e => e.json()); 
			} 
			return c[1];
		})
		.then(c => c.pop().html_url)
		.then(c => window.location = c);
}
func( window.location.pathname.match(/\/([^/]+\/[^/]+)(?:\/tree\/([^/]+))?/) );
*/
