/*NOTES ABOUT THE DATA ->
    . i will have 'category_id'==='project_id' instead of 'section_id'

    . keys to parse -> 'id', project_id (as category_id), content, completed, label_ids, priority, created
*/

const todos = require('./todoist.json')

//LEARNT-> JSON is like an array of objects... not a dictionary/map
/**LEARNT -
 * Promise is in one of the 3 states -> pending, fulfilled, rejected
 * As the Promise.prototype.then(), Promise.prototype.catch(), and Promise.prototype.finally()
   methods return promises, so they can be chained
 * It's better to have a single catch() at end of promise chain. Sometimes, there is no choice, bcz an error must be handled immediately
 * A .then() in the chain, can also return a Promise, in which case, the promise gets dynamically inserted into the chain
 * We will call resolve(...) if fulfilled, else if some Error happens in code (like inside catch block)) then reject(...)

 * The basic construct of a Promise is... it takes 2 parameters, as callbacks (functions to call later depending on what happened)
 * A Promise is NOT a function, (You can't pass parameters to it... it just does somethings prefeined to do)

 * Always wrap the promise, with a function... bcz as soon as you create a promise with new Promise(), IT STARTS EXECUTING... there is no need to call, since it's not a funtion
   In general practise its better to have `return new Promise(...)` inside the wrapping function... so that the function returns a promise

 * An async function is a Promise, itself... try `const something = fun()`, where fun is an async function once, and then a usual function
   If we returned '2' in an async function... it will actually return `Promise{ '2' }`
   In above case, we can get the actually returned, just add .then(data => {--work with the data here--})
   NOTE - In the above case just doing 
                `let d = callPromise().then(data => {return data})`
            will still return a promise... since then ,.then() and .catch() return promises too...
            so in case of promises, we have to work inside the .then() itself... or if we want the data to pertain the equate some higher scope variable to it...
        instead     `callPromise().then(data => d=data)`    //this assigns the data to 'd'

 */
const getKeys = async (json) => {
    return new Promise( (resolve, reject) => {
        if(json.forEach == undefined){
            reject('IncompatibleFormat: Passed object is not an array, required a JSON mapping (an array of objects)')
        }

        const foundKeys = {}
        for (const iterator of json) {
            for (const key in iterator) {
                if(foundKeys.hasOwnProperty(key)){
                    foundKeys[key] += 1
                }else
                    foundKeys[key] = 1
            }
        }
        
        console.log('going to resolve')
        setTimeout(() => {
            console.log('wait complete')
        }, 500);
        resolve(foundKeys)
    })
}

const getKeysSync = async (json) => {   //blocking
    let retVal
    await getKeys(json).then((val) => {retVal = val});
    return retVal
}

let keys = [
    'title',
    'completed',
    'due',
    'priority',
    'category_id',  //will be replaced by project ids
    'label_ids',
    'children_ids',
    'parent_id',
    'createdAt'
]
