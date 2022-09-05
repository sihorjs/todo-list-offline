import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import apiClient from 'api/axios';
import AddTodo from 'components/AddTodo';
import TodoForm from 'components/TodoForm';

const Todos = () => {
  const [todos, setTodos] = useState([]);

  const [isModalOpen, setModal] = useState(false);
  const [editedTodo, setEditedTodo] = useState(null);

  useEffect(() => {
    apiClient
      .get('/todos')
      .then(({ data }) => setTodos(data));
  }, []);

  const handleCloseModal = () => {
    setModal(false);
    setEditedTodo(null);
  };

  const handleOpenEditTodo = (todo) => {
    setEditedTodo(todo);
    setModal(true);
  };

  const handleAddTodo = (values) => {
    apiClient
      .post('/todos', values)
      .then(({ data }) => setTodos(prevTodos => [...prevTodos, data]));
  };

  const handleDeleteTodo = (id) => {
    apiClient
      .delete(`/todos/${id}`)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter((todo) => todo.id !== id))
      });
  };

  const handleEditTodo = (id, values) => {
    apiClient
    .patch(`/todos/${id}`, values)
    .then(({ data }) => {
      setTodos(prevTodos => prevTodos.map((todo) => todo.id === id ? data : todo))
    });
  };

  const handleSubmitForm = (values) => {
    const { id, ...todoData } = values;

    id ? handleEditTodo(id, todoData) : handleAddTodo(todoData);
    handleCloseModal();
  };

  return (
    <div>
      <AddTodo sx={{ mb: 4 }} onClick={() => setModal(true)} />

      <Grid container spacing={2}>
        {todos.map((todo) => (
          <Grid key={todo.id} item xs={4}>
            <Card>
              <CardContent>
                <Typography variant="h4">{todo.title}</Typography>
                <Typography variant="body1">{todo.description}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleOpenEditTodo(todo)}>Edit</Button>
                <Button size="small" onClick={() => handleDeleteTodo(todo.id)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <TodoForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialValues={editedTodo}
        onSubmit={handleSubmitForm}
      />
    </div>
  );
};

export default Todos;
