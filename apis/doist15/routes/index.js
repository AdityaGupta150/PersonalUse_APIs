/**LEARNT -> 
 * OBJECT SPREAD -> Shallow merge with missing keys values, and undefined key value pairs is different
 * > {...{a:563},...{}}
 *      { a: 563 }
 * > {...{a:563},...{a: undefined}}
 *      { a: undefined } 
 */

/*TODO - tHINGS TO DO TOMMOROW -> 
Check for problems due to `this`
ES6 arrow functions
undefined key value
instance methods
and also, if a response is being sent back or not
*/
const { Router } = require("express")
const fetch = require('node-fetch')

const todoModel = require('../models/schemas/todo.js')
const { checkStatus, logError, createTodo } = require('../util-functions/util')

const router = Router()

router.get('/syncOffline', (req, res) => {
    const doistTodos = require('../offlineData/todoist.json')

    

    res.send(doistTodos)
})

//returns all todos, stored in mongoDB
router.get('/',(req, res) => {
    todoModel.find({'completed': false}, (err, docs) => {
        if(err){
            logError(0, 'todo', req.baseUrl)
            return res.status(500).send('Kuchh gadbad ho gaya server side pe') //English - Some error has happened
        }
        
        res.json(docs)
    })
})

//posts a todo, or a list of todos (json format, inside body.todos)
router.post('/', (req, res) => {
    const isSingleObj = true

    if(req.body.todos)  isSingleObj = false

    if (isSingleObj) {
        let todo = createTodo(req.body)
        //labels won't be decided client side, FOR NOW (Actually better do that on client, as data scales)
            //TODO - Implement logic to work with child and parent todos

        todoModel.create(todo, (err, doc) => { //will actually be a single doc
            if(err){
                logError(1, 'todo', req.baseUrl)
                return res.sendStatus(500)
            }
             res.status(200).send('Todo was added successfully')
        })

    } else {
        todoModel.create(req.body.todos, (err, docs) => {
            if(err){
                logError(1, 'todo', req.baseUrl, 'While adding multiple todos')
                return res.sendStatus(500)
            }
            res.status(200).send('All todos were added successfully')
        })
    }
})

router.post('/complete/:id', (req, res) => {
    //CHECK - Check if it works
    req.body.completed = true
    res.redirect(307, '/' + req.params.id)
})

router.get('/getRemote', async (req, res) => {
    res.redirect('todoist/tasks')
})

    //returns all DISTINCT todos require(all sources, supported at the time (Initially, it will be just todoist and mongodb)
router.get('/getAll', async (req, res) => {
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
        console.error('Some error while fetching todos require(Todoist API');
        return res.status(500).send('Some error while fetching todos require(Todoist API')
    })

    let mongoTodos = await todoModel.find((err, docs) => {
        if(err){
            console.error('Error getting all todos require(mongo', err);
            return res.status(500).send('Some error while fetching todos require(MongoDB')
        }

        return docs
    })
    
    let [smallerList, biggerList] = todoistTodos.length > mongoTodos.length ?
        [mongoTodos, todoistTodos] :
        [todoistTodos, mongoTodos]

    smallerList.forEach(element => {
        if(biggerList.id != element.id){
            biggerList.push(element)
        }
    });

    res.json(biggerList)
})

router.get('/:todoId', async (req, res) => {
    res.json(await todoModel.findById(req.params.todoId, (err, doc) => {
        if(err){
            return new Error('Couldn\'t get a todo with that Id')
        }
        return doc
    }))
})

router.post('/:todoId', async (req, res) => {
    let todo = createTodo(req.body)

    await todoModel.findByIdAndUpdate(req.params.todoId, todo, (err, doc) => {
        if(err){
            return new Error('Couldn\'t get a todo with that Id')
        }
        res.status(500).end()
    })
})

router.delete('/:todoId', async (req, res) => {
    //CAUTION_NOTE -> req.params.todoId will be String, while _id is ObjectId, will query below find the doc??
    await todoModel.findByIdAndDelete(req.params.todoId)
        .then(doc => res.status(204).send('Successfully removed todo with title: '+ doc.title))
        .catch(err => {
            console.error('Couldn\'t delete todo. ', err);
            res.status(500).send('Could not remove the todo')
        })
})

module.exports = router
