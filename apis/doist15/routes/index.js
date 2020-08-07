const router = require('express').Router()
const fetch = require('node-fetch')

const checkStatus = require('../util-functions/util')

    //returns all todos, stored in mongoDB
router.get('/', (req, res) => {
    //NOTE - Only get the docs with {'completed': false}
})

    //posts a todo
router.post('/', (req, res) => {

})

router.get('/complete/:id', (req, res) => {
    //how to redirect, but to a post request
    //TODO - Post {'completed' : true} to '/:id', to update the todo's details to completed
})

router.get('/getRemote', async (req, res) => {
    res.redirect('todoist/tasks')
})

    //returns all DISTINCT todos from all sources, supported at the time (Initially, it will be just todoist and mongodb)
router.get('/getAll', (req, res) => {
    let todoistTodos = await fetch(
        'https://api.todoist.com/rest/v1/tasks',
        {
            headers: {
                'Authorization': 'Bearer ' + process.env.TODOIST_API_TOKEN
            }
        }
    )
    .then(checkStatus)
    .then(data => data.json())
    .catch(err => {
        console.error('Some error while fetching todos from Todoist API');
        return res.status(500).send('Some error while fetching todos from Todoist API')
    })

    //TODO - Get all todos from mongo
    let mongoTodos = []
    
    let [smallerList, biggerList, idStr, otherId] = todoistTodos.length > mongoTodos.length ?
        [mongoTodos, todoistTodos, '_id', 'id'] :
        [todoistTodos, mongoTodos, 'id', '_id']

    smallerList.forEach(element => {
        if(biggerList[otherId] != element[idStr]){
            biggerList.push(element)
        }
    });

    res.json(biggerList)
})

router.get('/:todoId', (req, res) => {
    
})

router.post('/:todoId', (req, res) => {
    
})

router.delete('/:todoId', (req, res) => {
    
})

module.exports = router
