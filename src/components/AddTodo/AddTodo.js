import PropTypes from 'prop-types';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

const AddTodo = ({ sx, onClick }) => (
  <Fab sx={sx} color="primary" aria-label="add" onClick={onClick}>
    <AddIcon />
  </Fab>
);

AddTodo.propTypes = {
  sx: PropTypes.object,
  onClick: PropTypes.func.isRequired,
};

AddTodo.defaultProps = {
  sx: null,
};

export default AddTodo;
