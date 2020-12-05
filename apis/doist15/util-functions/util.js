const { omit } = require("underscore");

const checkStatus = (res) => {
	//3xx -> Redirection
	/*We needed to check this, since
    NOTE: 3xx-5xx responses are NOT exceptions, and should be handled in then()
    (so, even unautherised requests, wont throw any exception)*/
	if(res.ok)  //ie. res.status>=200 && res.status<300
	{return res;}
	else throw new Error("⚠ Contains client(4xx) or server(5xx) error status code ->", res.status);
};

let supportedToFormats = {
	"todoist": {
		"title": "content", //ie. when converting FROM mongo TO todoist, 'title' key will be changed to 'content'
		"category": "project_id = findOne({name: category}).id",   //Actually 'category' is the name of category, while 'project_id' should have been NUmber
		"due": "due.date = YYYY-MM-DD"

	},
	"mongo": ["title", "content", "due", "completed", "priority", "colour", "category", "childs", "parent"]
};
/**
 *         "id": 3329489299,
        "project_id": 2214805101,
        "section_id": 0,
        "order": 5,
        "content": "Exercise everyday",
        "completed": false,
        "label_ids": [],
        "priority": 1,
        "comment_count": 0,
        "created": "2019-08-06T02:01:38Z",
        "due": {
            "recurring": true,
            "string": "every day",
            "date": "2020-05-06"
        },
        "url": "https://todoist.com/showTask?id=3329489299"

 */

const convertTo = (todo, destinationFormat) => {
	if(destinationFormat === "mongo"){  //original format is considered to be of todoist
		todo.title = todo.content;
		todo.category = todo.project_id;
		if(todo.due){
			let dateStr = todo.due.date;
			delete todo.due;
			todo.due = new Date(dateStr);
		}
		todo = omit(todo, ["id", "content","project_id", "section_id", "order", "label_ids", "comment_count", "created", "url"]);
		//NOTE- For now todo.project_id to be ignored, and all to be saved in default category 'General'
	}

	return todo;
};

const containsTodo = (multipleTODOS, todo) => {
	for (const i of multipleTODOS) {
		if(i.title === todo.title && i.content === todo.content){
			if(i.due !== todo.due){
				todo.due = i.due > todo.due ? i.due : todo.due;
				return true;
			}
		}
	}
	return false;
};

const createTodo = (obj) => {
	if(!obj)  throw new Error("Object is null, can't create todo from it");

	let keys = ["title", "content", "due", "completed", "priority",
		"colour", "category", "childs", "parent"
	];
	let todo = {};
	for (const key of keys) {
		if( !obj[key] !== false && !obj[key] )
		{todo[key] = obj[key];}
	}

	return todo;
};

//returns a pair of array of label_ids and an array of collection_ids
const parseTodo = (todo) => {
	let labels = [];
	if(!todo)   return labels;
	if(typeof(todo) === "string"){
		if(todo.search("#") !== -1){
			let words = todo.split(" ");
			for (const word of words) {
				if(word[0] === "#")
				{labels.push(word.replace("#",""));}   //only replaces first found string, ie. only starting
			}
		}
	}else{
		labels.concat( parseTodo(todo.title) );
		labels.concat( parseTodo(todo.content) );
	}

	return labels;

};

const logError = (probId, collection, route, addMsg="") => {
	if(!addMsg) addMsg = "";
	if (probId === 0) { //read error
		console.error("❗❗ Error while reading from", collection, ". At route: ", route + "  " + addMsg);
	}else if (probId === 1) {   //create error
		console.error("❗❗ Error while creating doc in", collection, ". At route: ", route + "  " + addMsg);
	}else if (probId === 2) {   //update error
		console.error("❗❗ Error while updating doc in", collection, ". At route: ", route + "  " + addMsg);
	}else if (probId === 3) {   //delete error
		console.error("❗❗ Error while deleting doc from", collection, ". At route: ", route + "  " + addMsg);
	}else{   //something different
		console.error("❗❗", addMsg, ". In ", collection, ". At route: ", route);
	}
};

exports.checkStatus = checkStatus;
exports.parseTodo = parseTodo;
exports.logError = logError;
exports.createTodo = createTodo;
exports.containsTodo = containsTodo;
exports.convertTo = convertTo;
