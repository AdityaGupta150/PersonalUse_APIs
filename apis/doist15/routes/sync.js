//This route syncs between, mongodb, and the provided database route

const router = require('express').Router()
const fetch = require('node-fetch')
const checkStatus = require('../util-functions/util')

router.get('/', (req, res) => {
    
    //in it call all the available sub-routes
    // fetch('/firebase')
    // fetch('/todoist')

    res.sendStatus(204)
})

    //returns the number of todos, at a source... requires params, for eg. firebase config path, in case of firebase

router.get('/todoist', (req, res) => {
        //TODO - Add logic to fetch documents from mongo
    let mongoTodos = []

        //DEPRECATED -> This way hasn't been used, since it will repeatedly have to make fetch request
    // mongoTodos.forEach(element => {
    //     //make a fetch request to /tasks/:id... then check if res.statusCode is 200/204, if not make a POST request to /tasks
    // })

        //Instead, will just fetch all todos from both sources, and POST the diff b/w them to /tasks
    let todoistTodos = await fetch(
        'https://api.todoist.com/rest/v1/tasks',
        {
            headers : {
                'Authorization': 'Bearer ' + process.env.TODOIST_API_TOKEN
            }
        }
    )
    .then(checkStatus)
    .then(data => data.json())
    .catch(err => {
        console.error('Error in fetching todos from Todoist');
        return res.status(500).send('Error in fetching todos from Todoist')
    })

    res.sendStatus(204)
})

router.get('/firebase', (req, res) => {
    //TODO - Put logic to sync mongodb 'todos' collection firebase
    res.sendStatus(204)
})

module.exports = router
