import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from 'mui-rff';
import { Form } from 'react-final-form';

const TodoForm = ({
  isOpen,
  initialValues,
  onSubmit,
  onClose,
}) => (
  <Dialog open={isOpen} onClose={onClose}>
    <Form
      initialValues={initialValues}
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} noValidate>
          <DialogTitle>
            {initialValues && initialValues.id ? 'Edit todo' : 'Add todo'}
          </DialogTitle>
          <DialogContent>
            <TextField label="Title" name="title" required sx={{ mb: 2 }}/>
            <TextField label="Description" name="description" required />
          </DialogContent>
          <DialogActions>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      )}
    />
  </Dialog>
);

TodoForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

TodoForm.defaultProps = {
  initialValues: null,
};

export default TodoForm;
