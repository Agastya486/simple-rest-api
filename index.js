const express = require('express');
const fs = require('fs');
const app = express();

const port = 3000;

app.use(express.json());

function getTodos(){ // read todos from file
        const data = fs.readFileSync('./todos.json', 'utf8');
        return JSON.parse(data);
}

function saveTodo(todos){
        fs.writeFileSync('./todos.json', JSON.stringify(todos, null, 2));
}

//GET all todos
app.get('/todos', (req, res) =>{
        const todos = getTodos();
        res.json(todos);
});

//POST a new todo
app.post('/todos', (req, res) =>{
        const todos = getTodos();
        const newTodos = {
                id: Date.now(),
                date: new Date().toISOString(),
                task: req.body.task,
                done: false,
        };
        todos.push(newTodos);
        saveTodo(todos);
        res.status(201).json(newTodos);
});

//DELETE todos
app.delete('/todos/:id', (req, res) => {
        let todos = getTodos();
        todos = todos.filter(todos => todos.id != req.params.id);
        saveTodo(todos);
        res.status(204).end();
});

app.put('/todos/:id/done', (req, res) => {
        const todos = getTodos();
        const index = todos.findIndex(todo => todo.id == Number(req.params.id));
        if(index === -1) return res.status(404).json({error: "Todo not found"});

        todos[index].done = true;
        saveTodo(todos);
        res.json(todos[index]);

});

app.listen(port, () =>{
        console.log("connected");
});

