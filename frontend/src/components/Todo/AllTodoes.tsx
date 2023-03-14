import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Grid from '@mui/material/Grid';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Todo } from '../../dto/todo.dto';
import { AuthContext } from '../../App';
import AddTodoDialog from './AddTodoDialog';
import ReactTimeAgo from 'react-time-ago';

import './AllTodoes.css';
import DeleteTodoDialog from './DeleteTodoDialog';

export enum Filters {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

const AllTodoes: React.FC = () => {
  const { login } = useContext(AuthContext);
  const [filter, setFilter] = useState<Filters>(Filters.Active);
  const [todoes, setTodoes] = useState<Todo[]>([]);
  const [openAdd, setOpenAdd] = React.useState(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const [openDel, setOpenDel] = React.useState(false);
  const handleOpenDel = () => setOpenDel(true);
  const handleCloseDel = () => setOpenDel(false);

  const isLoading = useRef(false);
  const loadTodoes = useCallback(() => {
    if (isLoading.current) return;
    isLoading.current = true;

    axios
      .get<Todo[]>(`http://localhost:3001/todo/${filter}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setTodoes(response.data);
        }
      })
      .catch((error) => {
        const data = error?.response?.data;
        if (data.statusCode === 401) {
          login();
        }
      })
      .finally(() => (isLoading.current = false));
  }, [filter, login]);

  useEffect(() => loadTodoes(), [loadTodoes]);

  const reloadTodoesLocaly = () => setTodoes([...todoes]);

  const addItemHandler = async (text: string) => {
    if (text.length === 0) return;

    const form = { text: text };
    const { data } = await axios.post('http://localhost:3001/todo', form, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      validateStatus: (status) => status < 500,
    });
    if (data.statusCode === 401) {
      login();
    }
    handleCloseAdd();
    loadTodoes();
  };

  const sendUpdate = async (t: Todo) => {
    const form = { _id: t._id, completed: t.completed, text: t.text };
    const { data } = await axios.patch('http://localhost:3001/todo', form, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      validateStatus: (status) => status < 500,
    });
    if (data.statusCode === 401) {
      login();
    }
  };

  const handleCompleteChanged = async (t: Todo, checked: boolean) => {
    t.completed = checked;
    await sendUpdate(t);
    if (filter === Filters.All) {
      reloadTodoesLocaly();
    } else {
      loadTodoes();
    }
  };

  const handleTextChanged = async (
    e: React.ChangeEvent<HTMLInputElement>,
    t: Todo,
  ) => {
    if (t.text === e.target.value) return;
    t.text = e.target.value;
    reloadTodoesLocaly();
  };

  const handleTextBlured = async (
    e: React.FocusEvent<HTMLInputElement>,
    t: Todo,
  ) => {
    await sendUpdate(t);
  };

  const itemToDelete = useRef<{ item: Todo | null }>({ item: null });
  const showDeleteDialog = (t: Todo) => {
    itemToDelete.current.item = t;
    handleOpenDel();
  };

  const deleteConfirmed = async () => {
    const { data } = await axios.delete(
      `http://localhost:3001/todo/${itemToDelete.current.item?._id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        validateStatus: (status) => status < 500,
      },
    );
    if (data.statusCode === 401) {
      login();
    }
    itemToDelete.current.item = null;
    handleCloseDel();
    loadTodoes();
  };

  return (
    <div>
      <div>
        <Grid container spacing={2} sx={{ padding: 1 }}>
          <Grid item xs={2} className="filter-label">
            <label>Filter: </label>
          </Grid>
          <Grid item xs={10}>
            <ButtonGroup aria-label="outlined button group">
              <Button
                variant={filter === Filters.All ? 'contained' : undefined}
                onClick={() => setFilter(Filters.All)}
              >
                All
              </Button>
              <Button
                variant={filter === Filters.Active ? 'contained' : undefined}
                onClick={() => setFilter(Filters.Active)}
              >
                Active
              </Button>
              <Button
                variant={filter === Filters.Completed ? 'contained' : undefined}
                onClick={() => setFilter(Filters.Completed)}
              >
                Completed
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 300 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>✅</TableCell>
              <TableCell align="center">Text</TableCell>
              <TableCell>Created</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todoes.length > 0 ? (
              todoes.map((t, idx) => (
                <TableRow
                  key={idx}
                  className={t.completed ? 'todo-completed' : ''}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={t.completed}
                      onChange={(e, checked: boolean) =>
                        handleCompleteChanged(t, checked)
                      }
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      fullWidth
                      required
                      value={t.text}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleTextChanged(e, t)
                      }
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                        handleTextBlured(e, t)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <ReactTimeAgo date={new Date(t.createdDate)} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="delete"
                      onClick={() => showDeleteDialog(t)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow
                key={0}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell colSpan={5} align="center">
                  No items to display
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab
        sx={{ position: 'fixed', right: 50, bottom: 50 }}
        color="primary"
        aria-label="add"
        onClick={handleOpenAdd}
      >
        <AddIcon />
      </Fab>
      <AddTodoDialog
        open={openAdd}
        onConfirm={addItemHandler}
        onClose={handleCloseAdd}
      />
      <DeleteTodoDialog
        open={openDel}
        onConfirm={deleteConfirmed}
        onClose={handleCloseDel}
      />
    </div>
  );
};

export default AllTodoes;
