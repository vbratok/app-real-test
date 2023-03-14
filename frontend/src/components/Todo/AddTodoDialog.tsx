import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

type AddTodoDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (text: string) => void;
};

const AddTodoDialog: React.FC<AddTodoDialogProps> = ({
  onConfirm,
  onClose,
  open,
}) => {
  const [text, setText] = useState('');
  const handleClose = () => {
    onClose();
  };
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(text);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add Todo Item</DialogTitle>
      <Box
        component="form"
        onSubmit={submitForm}
        noValidate
        sx={{ mt: 1, p: 2 }}
      >
        <label>Todo Text:</label>
        <TextField
          margin="normal"
          required
          fullWidth
          id="text"
          name="text"
          autoFocus
          onChange={(e) => setText(e.target.value)}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Add
        </Button>
      </Box>
    </Dialog>
  );
};

export default AddTodoDialog;
