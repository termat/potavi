import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export let handleAleartOpen;
export let handleAleartClose;
export let handleAleartMessage;

export default function AlertDialog() {
  const [open, setOpen] = React.useState(false);
  const [message,setMessage]= React.useState("");

  handleAleartOpen = () => {
    setOpen(true);
  };

  handleAleartClose = () => {
    setOpen(false);
  };

  handleAleartMessage =(mes)=>{
    setMessage(mes);
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleAleartClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Info"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAleartClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}