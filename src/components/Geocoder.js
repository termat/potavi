import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';
import {jumpTo} from './Mappanel';

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

export default function Geocoder() {
    const [list, setList] = useState(initialList);
  
    handleAdd=(data)=>{
      setList(data);
    }
  
    const itemClick=(pos)=>{
      jumpTo(pos);
    }
  
    return (
      <div>
          <TextField
              autoFocus
              margin="dense"
              id="name"
              label="検索"
              type="search"
              fullWidth
              variant="standard"
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  search(e.target.value);
                }
              }}
            />
          <List aria-label="basic-list">
          {list.map((item) => (
            <ListItemButton component="a" href="#simple-list" key={item.id} onClick={() => itemClick(item.pos)} sx={{ height: 18}}>
              <ListItemText primary={item.title} primaryTypographyProps={{fontSize:12, fontWeight: 'medium'}} sx={{ height: 18}} />
            </ListItemButton>
          ))}
          </List>
      </div>
    );
  }