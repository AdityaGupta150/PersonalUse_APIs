const { default: fetch } = require('node-fetch')
const router = require('express').Router()

const ENDPOINTS = {
    glassdoor: 'http://api.glassdoor.com/api/api.htm',  //requires query params -> [v, format, t.p, t.k, userip, useragent]
    indeed: 'https://api.indeed.com/ads/apisearch'
}

router.get('/', async (req, res) => {
    /**Preferably use graphQL here, and return all data asked for */
    
})

//Same as the route '/'
router.get('/all', async (req, res) => {
    
})

router.get('/routes', (req, res) => {
    res.send({
        glassdoor: 'jobs/glassdoor',
        indeed: 'jobs/indeed',
        github: 'jobs/github',
        ETC: 'jobs/ETC',
    })
})

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
    await fetch(ENDPOINTS.glassdoor + '?')

    res.send({
        attribution: "<a href='https://www.glassdoor.com/index.htm'>powered by <img src='https://www.glassdoor.com/static/img/api/glassdoor_logo_80.png' title='Job Search' /></a>",
        
    })
})

module.exports = router
