const validateTodo = (todo) => {    //works for both, whether todo or a list of todos
    let singleTodo = true
    let keys = ['title', 'content', 'due', 'completed', 'priority',
            'colour', 'category', 'childs', 'parent'
        ]

    if(todo.forEach)    singleTodo = false

    if(singleTodo){
        for (const key in todo) {
            if(!keys.includes(key))
                delete todo[key]
        }
    }
}