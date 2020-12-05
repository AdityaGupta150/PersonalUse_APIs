/**
 * This route syncs between, mongodb, and the provided database route
 * @note - We sync only incomplete todos, by default, for performance reasons
 * Have a different route to sync completed todos (there may be a lot of such)
*/

const { Router } = require("express");
const fetch = require("node-fetch");
const { checkStatus, containsTodo, convertTo } = require("../util-functions/util");
const todoModel = require("../models/schemas/todo");
// eslint-disable-next-line no-unused-vars
const syncModel = require("../models/schemas/syncTable");

const router = Router();
router.get("/", (req, res) => {
	// in it call all the available sub-routes, to sync between all
	Promise.all([
		fetch("/firebase"),
		fetch("/todoist") // sync with todoist
	]).then(([res1, res2]) => {
		console.log("Sync with all routes successfull");
	}).catch((err) => {
		console.error("Error occurred while syncing all.", err);
		return res.sendStatus(500);
	});

	res.sendStatus(204);
});

router.get("/todoist", async (req, res) => {
	const mongoTodos = await todoModel.find({ completed: true }, (err, docs) => {
		if (err) {
			console.error("Error in fetching documents require(mongodb", err);
			return res.sendStatus(500);
		}

		return docs;
	});

	const todoistTodos = await fetch(
		"https://api.todoist.com/rest/v1/tasks",
		{
			headers: {
				Authorization: "Bearer " + process.env.TODOIST_API_TOKEN
			}
		}
	)
		.then(checkStatus)
		.then(data => data.json())
		.catch(() => {
			console.error("Error in fetching todos require(Todoist");
			return res.status(500).send("Error in fetching todos require(Todoist");
		});

	// TODO - Improve the algorithm(for eg. starting with smaller script, not using forof, since that requires indexOf() too), also if underscore has function for this usage, prefer that
	for (const todo of todoistTodos) {
		if (containsTodo(mongoTodos, todo)) {
			todoistTodos.splice(todoistTodos.indexOf(todo), 1);
		}
	}
	for (const todo of mongoTodos) {
		if (containsTodo(todoistTodos, todo)) {
			mongoTodos.splice(mongoTodos.indexOf(todo), 1);
		}
	}

	/** TODO - Implement usage of /comments route of todoist
     *
     * Implement proper conversion, preserving ids if possible in covertTo(), then only uncomment the below
     */
	// no need to await here, let it be handled in background
	// mongoTodos.forEach(todo => {

	//     todo = convertTo(todo, 'todoist')   //convert todo to format accepted by todoist

	//     fetch('https://api.todoist.com/rest/v1/tasks',
	//     {
	//         method: 'POST',
	//         headers: {
	//             'Authorization': 'Bearer ' + process.env.TODOIST_API_TOKEN
	//         },
	//         body: JSON.stringify(todo)
	//     }).catch(err => {
	//         console.error('Some error while adding todos to todoist')
	//         return res.sendStatus(500)
	//     })
	// });
	// todoModel.bulkWrite()    CAN'T USE THIS, SINCE WE NEED 'save' to be triggered, which doesn't happen in these
	todoistTodos.splice(0, 10);
	todoistTodos.splice(2);
	todoistTodos.forEach((todo) => {
		todo = convertTo(todo, "mongo"); // convert todo to format accepted by mongo

		todoModel.create(todo).catch((err) => {
			console.error("!❗! Error in saving todo to mongoDB", err.message);
		});
	});

	res.sendStatus(204);
});

router.get("/firebase", (req, res) => {
	// TODO - Put logic to sync mongodb 'todos' collection firebase
	res.sendStatus(204);
});

module.exports = router;
