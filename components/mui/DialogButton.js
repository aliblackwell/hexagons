import { useState } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import { Button } from '@material-ui/core';


export default function DialogButton({ className, label, text, children }) {


  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>

      <Button
        variant="contained"
        color="secondary"
        className={className}
        startIcon={<AddIcon />}
        onClick={handleOpen}
      >
        {label}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        
        <DialogContent>
        <Typography gutterBottom={true} id="form-dialog-title" variant="h2" component="h4">{label}</Typography>
          <DialogContentText>
            {text}
          </DialogContentText>
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog >
    </>
  );
}