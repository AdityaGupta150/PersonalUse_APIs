const { Router } = require('express')

const router = Router()

const ENDPOINTS = {
    glassdoor: 'http://api.glassdoor.com/api/api.htm',  //requires query params -> [v, format, t.p, t.k, userip, useragent]
    indeed: 'https://api.indeed.com/ads/apisearch'
}

const ENDPOINTS = {
    glassdoor: 'http://api.glassdoor.com/api/api.htm',  //requires query params -> [v, format, t.p, t.k, userip, useragent]
    indeed: 'https://api.indeed.com/ads/apisearch'
}

router.get('/indeed', async (req, res) => {
    /**Endpoint data needed 
     * publisher*    -> publisher ID
     * v*    -> version of API, must be 2
     * userip*   -> IP address of enduser, who will view jobs results
     * useragent*-> `User-Agent` of enduser, can be acquired from request's header
     * 
     * others -> q=java+developer&l=austin%2C+tx&sort=&radius=&st=&jt=&start=&limit=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4
     */



})

router.get('/glassdoor', async (req, res) => {
    /**Endpoint data needed Glassdoor
     * v        |    The API version. The current version is 1 except for jobs, which is currently version 1.1    |    Yes
     * format   |    Either xml or json as you prefer    |    Yes
     * t.p      |    Your partner id, as assigned by Glassdoor    |    Yes
     * t.k      |    Your partner key, as assigned by Glassdoor    |    Yes
     * userip   |    The IP address of the end user to whom the API results will be shown    |    Yes
     * useragent|    The User-Agent (browser) of the end user to whom the API results will be shown. Note that you can can obtain this from the "User-Agent" HTTP request header from the end-user    |    Yes
     * callback |    If json is the requested format, you may specify a jsonp callback here, allowing you to make cross-domain calls to the glassdoor API from your client-side javascript. See the JSONP wikipedia entry for more information on jsonp.    |    No
     * action   |    The particular API call that you would like to make - see jobs, reviews, salaries, etc. sub-sections for details    |    Yes
     * other    |    Each API action will require different parameters - in the example above, an employerId is passed in order to retrieve reviews.    |    Varies
     */
    await fetch(ENDPOINTS.glassdoor + '?v=1.1' + )

    res.send({
        attribution: "<a href='https://www.glassdoor.com/index.htm'>powered by <img src='https://www.glassdoor.com/static/img/api/glassdoor_logo_80.png' title='Job Search' /></a>",
        
    })
})

module.exports = router
