/**
 * @learnt ->
 * OBJECT SPREAD -> Shallow merge with missing keys values, and undefined key value pairs is different
 * > {...{a:563},...{}}
 *      { a: 563 }
 * > {...{a:563},...{a: undefined}}
 *      { a: undefined }
 */

const { Router } = require("express");
const fetch = require("node-fetch");

const todoModel = require("../models/schemas/todo.js");
const categoryModel = require("../models/schemas/category.js");
const { checkStatus, logError, createTodo } = require("../util-functions/util");
const { getConnection } = require("../../util/mongoConnection.js");
const { write } = require("fs");

const router = Router();

async function saveOffline (json) {
	const fs = require("fs").promises;

	fs.access("./offlineData/todos.json").then(() => {
		console.log("[DEBUG] Can access it");
		// @Issue - Why is ./ considered doist15/ directory ???
		write("./offlineData/todos.json", JSON.stringify(json))
			.catch((err) => {
				console.error("Problem Saving offline -> ", err);
			});
	}).catch((err) => {
		console.log("[DEBUG] CanNOT access it", err);
	});
}

router.delete("/deleteAll", async (req, res) => {
	// ONLY FOR DEVELOPMENT

	await getConnection("MyDoist15").dropDatabase();
	res.send("Done");
});

// Save the data `from mongo` offline
router.get("/syncOffline", async (req, res) => {
	todoModel.find({ completed: false }).exec()
		.then( (docs) => {
			saveOffline(docs);
			res.json(docs);
		})
		.catch((err) => {
			logError(0, "todo", req.baseUrl);
			return res.status(500).send("Kuchh gadbad ho gaya server side pe. Error Code -> ", err.code);
		});
});

// returns all todos, stored in mongoDB
router.get("/", (req, res) => {
	todoModel.find({ completed: false }, (err, docs) => {
		if (err) {
			logError(0, "todo", req.baseUrl);
			return res.status(500).send("Kuchh gadbad ho gaya server side pe"); // English - Some error has happened
		}

		saveOffline(docs);
		res.json(docs);
	});
});

// posts a todo, or a list of todos (json format, SHOULD BE INSIDE `req.body.todos`)
router.post("/", (req, res) => {
	let isSingleObj = true;

	req.body.todos = [
		{
			title: "Something44",
			category: "somet"
		}, {
			title: "Something55",
			category: "somet"
		}, {
			title: "Something66",
			category: "somet"
		}
	];

	if (req.body.todos) isSingleObj = false;

	console.log(isSingleObj);

	if (isSingleObj) {
		console.log("getting here IF");
		const todo = createTodo(req.body);
		// labels won't be decided client side, FOR NOW (Actually better do that on client, as data scales)
		// TODO - Implement logic to work with child and parent todos

		todoModel.create(todo, (err, doc) => { // will actually be a single doc
			if (err) {
				logError(1, "todo", req.baseUrl);
				return res.sendStatus(500);
			}
			res.status(200).send("Todo was added successfully");
		});
	} else {
		console.log("getting here");
		todoModel.create(req.body.todos, (err, docs) => {
			if (err) {
				logError(1, "todo", req.baseUrl, "While adding multiple todos");
				return res.sendStatus(500);
			}
			res.status(200).send("All todos were added successfully");
		});
	}
	console.log("end here");
});

router.post("/complete/:id", (req, res) => {
	// CHECK - Check if it works
	req.body.completed = true;
	res.redirect(307, "/" + req.params.id);
});

router.get("/getCategories", async (req, res) => {
	await categoryModel.find({}, (err, docs) => {
		if (err) {
			logError(0, "category", req.baseUrl);
			return res.sendStatus(500);
		}

		return res.send(docs);
	});
});

router.get("/getRemote", async (req, res) => {
	res.redirect("todoist/tasks");
});

// returns all DISTINCT todos require(all sources, supported at the time (Initially, it will be just todoist and mongodb)
router.get("/getAll", async (req, res) => {
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
			console.error("Some error while fetching todos require(Todoist API");
			return res.status(500).send("Some error while fetching todos require(Todoist API");
		});

	const mongoTodos = await todoModel.find((err, docs) => {
		if (err) {
			console.error("Error getting all todos require(mongo", err);
			return res.status(500).send("Some error while fetching todos require(MongoDB");
		}

		return docs;
	});

	const [smallerList, biggerList] = todoistTodos.length > mongoTodos.length
		? [mongoTodos, todoistTodos]
		: [todoistTodos, mongoTodos];

	smallerList.forEach((element) => {
		if (biggerList.id !== element.id) 
			biggerList.push(element);
		
	});

	res.json(biggerList);
});

router.get("/:todoId", async (req, res) => {
	res.json(await todoModel.findById(req.params.todoId, (err, doc) => {
		if (err) 
			return new Error("Couldn't get a todo with that Id");
		
		return doc;
	}));
});

router.post("/:todoId", (req, res) => {
	const todo = createTodo(req.body);

	todoModel.findByIdAndUpdate(req.params.todoId, todo)
		.then(() => {})
		.catch((err) => {
			console.error(`Couldn't get a todo with that Id. Error Code -> ${err.code}`);
			res.status(500).send("Couldn't get the todo");
		});
});

router.delete("/:todoId", async (req, res) => {
	// CAUTION_NOTE -> req.params.todoId will be String, while _id is ObjectId, will query below find the doc??
	await todoModel.findByIdAndDelete(req.params.todoId)
		.then(doc => res.status(204).send("Successfully removed todo with title: " + doc.title))
		.catch((err) => {
			console.error("Couldn't delete todo. ", err.code);
			res.status(500).send("Could not remove the todo");
		});
});

module.exports = router;
