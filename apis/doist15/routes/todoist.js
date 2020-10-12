//Only get routes for now... will later set post routes too, if and when needed, for eg. syncing, or setting section_id to project_id etc

const fetch = require('node-fetch')
const router = require('express').Router()

const checkStatus = require('../util-functions/util')

router.get('/sample/tasks', async (req, res) => {
    let data = require('../offlineData/todoist.json')

    res.json(data)
})

/**@todo Add logic to work with Todoist APIs */
router.get('/tasks', async (req, res) => {
    console.log(req.baseUrl);

    let data = await fetch(
        'https://api.todoist.com/rest/v1/tasks',
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer '+process.env.TODOIST_API_TOKEN
            }
        }
    )
    .then(checkStatus)
    .then((res) => res.json())
    .catch((err) => {
        console.error('some error with fetch');
        return res.status(500).send('Server Error in fetching data')
    })

    res.json(data)
})

router.get('/projects', async (req, res) => {
    let data = await fetch(
        'https://api.todoist.com/rest/v1/projects',
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer '+ process.env.TODOIST_API_TOKEN
            }
        }
    )
    .then(checkStatus)
    .then(data => data.json())
    .catch((err) => {
        console.error('Couldn\'t complete request to todoist projects API');
        return res.status(500).send('Server Error in fetching data')
    })

    res.json(data)
})

//Premium Feature
router.get('/labels', async (req, res) => {
    console.log('received request');
    let data = await fetch(
        'https://api.todoist.com/rest/v1/labels',
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer '+ process.env.TODOIST_API_TOKEN
            }
        }
    )
    .then(checkStatus)
    .then(data => data.json())
    .catch(err => {
        console.error('Couldn\'t complete request to todoist labels API');
        return res.status(500).send('Server error in fetching data')
    })

    if(data.length == 0){
        return res.status(200).send('0 labels returned... Maybe you are not a premium member of todoist (This version is free for all, i am talking of todoist\'s own api)')
    }
    res.json(data)
})

module.exports = router
