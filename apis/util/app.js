const app = require('express')()
require('dotenv').config({path: './'})
const fetch = require('node-fetch')

const theStart100Days = Date.parse('Fri Jul 17 2020 00:00:01 GMT+0530 (India Standard Time)')

app.get('/', (req, res) => {
    res.status(200).send({
        'NOTICE': 'Use a subroute to access a utility',
        '100DaysOfCode': req.baseUrl+'/whatDayIsIt',
        'IP': req.baseUrl+'/whatIsMyIp',
        'IP_Location': req.baseUrl+'/whatIsMyIpLoc',
    })
})

app.get('/whatDatIsIt', (req, res) => {

    let now = ( Date.now() - theStart100Days )/(1000*3600*24)

    res.send(Math.trunc(now))
})

app.get('/whatIsMyIp', (req, res) => {
    res.json({
        forwarded: req.headers['x-forwarded-for'],
        ip: req.ip,
        headers: req.headers,
        remoteAddress: req.connection.remoteAddress
    })
})

app.get('/whatIsMyIpLoc', (req, res) => {
    //TODO - Use geo.ipify.org API for this
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    fetch('https://geo.ipify.org/api/v1?apiKey=YOUR_API_KEY&ipAddress=8.8.8.8',
    {
        /*Parameters to pass ->

        *apiKey Required. Get your personal API KEY on My subscriptions page.

        *ipAddress Optional. IPv4 or IPv6 to search location by.
        If the parameter is not specified, then it defaults to client request's public IP address.

        *domain Optional. Domain name to search location by.
        If the parameter is not specified, then 'ipAddress' will be used.

        *email Optional. Email address or domain name to search location by it's MX servers.
        If the parameter is not specified, then 'ipAddress' will be used.  
        
        
        ** OUTPUT FORMAT -> {ip: '8.8.8.8', location: {...}, domains: [...], as(Autonomous System, only for IPv4): {...}, isp: 'Reliance Inc'}
        */        
    })

    /*GETTING your public IP address-> 
    
    IPv4 -> https://api.ipify.org?format=json       (After 1 Oct 2020, this route will be made IPv6 only, for universal access (for IPv4 too), use api64.... route)
    IPv6 -> https://api6.ipify.org?format=json
    IPv4/6 -> https://api64.ipify.org?format=json
    
        Without the ?format=json  it will just simply return the ip as `text`
        Also... `jsonp` format is supported too
    */

    res.end()
})

module.exports = app
