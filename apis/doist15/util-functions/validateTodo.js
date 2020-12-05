function validateTodo(todo) {    //works for both, whether todo or a list of todos
	let keys = ["title", "content", "due", "completed", "priority",
		"colour", "category", "childs", "parent"
	];

	if(  Array.isArray(todo) ){
		todo.forEach(validateTodo);
	} else{
		for (const key in todo) {
			if(!keys.includes(key))
			{delete todo[key];}
		}
	}
}

module.exports = validateTodo;