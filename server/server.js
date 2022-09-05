const express = require('express');
const uuid4 = require('uuid4');
const cors = require('cors');
require('dotenv').config();

let todos = require('./fixtures');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/todos', (_, res) => res.json(todos));

app.post('/todos', (req, res) => {
  const todo = { ...req.body, id: uuid4() };
  todos.push(todo);

  res.json(todo);
});

app.patch('/todos/:id', (req, res) => {
  const { params: { id }, body } = req;

  const todoIndex = todos.findIndex((todo) => todo.id === id);
  const updatedTodo = { ...todos[todoIndex], ...body, id };

  todos = [...todos.slice(0, todoIndex), updatedTodo, ...todos.slice(todoIndex + 1)];

  res.json(updatedTodo);
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  todos = todos.filter((todo) => todo.id !== id);

  res.sendStatus(204);
});

app.listen(process.env.PORT, () => console.log('Server started'));
