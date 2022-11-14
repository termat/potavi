import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';
import {jumpTo} from './Mappanel';
import Geocoder from './Geocoder'

const search=(text)=>{
  const url="https://msearch.gsi.go.jp/address-search/AddressSearch?q="+text;
  axios.get(url)
  .then(function (res) {
    const list=[];
    let id=0;
    res.data.forEach(e => 
      list.push({
        id:id++,
        title:e.properties.title,
        pos:e.geometry.coordinates
      })
    );
    handleAdd(list);
  });
};

const initialList=[];
let handleAdd;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function GeocodeDialog() {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState(initialList);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  handleAdd=(data)=>{
    setList(data);
  }

  const itemClick=(pos)=>{
    handleClose();
    jumpTo(pos);
  }

  return (
    <div>
      <Tooltip title="地理検索" placement="bottom">
      <IconButton color="inherit" onClick={handleClickOpen}>
        <SearchIcon />
      </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
        <Geocoder />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
