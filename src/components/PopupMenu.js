import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { getMap } from './Mappanel';
import { searchData } from './Mappanel';
import maplibregl from 'maplibre-gl';
import Divider from '@mui/material/Divider';

export let handlePopUpOpen;
export let handlePopUpClose;
const list_marker=new Set();
const list_point=new Set();
let ev;

const addPoint=()=>{
    const map=getMap();
    const marker = new customMarker().setLngLat(ev.lngLat);
    const p=marker.getLngLat();
    if(!list_point.has(p.lat+","+p.lng)){
        list_point.add(p.lat+","+p.lng);
        list_marker.add(marker);
        marker.addTo(map);
        marker.on("click",()=>{});
    }
    handlePopUpClose();
};

export default function PopupMenu() {
    const [contextMenu, setContextMenu] = React.useState(null);
    handlePopUpOpen = (event) => {
        ev=event;
        event.preventDefault();
        setContextMenu(
          contextMenu === null
            ? {
                mouseX: event.point.x + 2,
                mouseY: event.point.y - 6,
              }
            : 
              null,
        );
    };
    handlePopUpClose = () => {
        setContextMenu(null);
    };

    return (
    <div onContextMenu={handlePopUpOpen} style={{ cursor: 'context-menu' }}>
      <Menu
        open={contextMenu !== null}
        onClose={handlePopUpClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={addPoint}>地点追加</MenuItem>
        <MenuItem onClick={findRoute}>ルート検索</MenuItem>
        <Divider />
        <MenuItem onClick={clearMarker}>地点消去</MenuItem>
      </Menu>
    </div>
      );
}

class customMarker extends maplibregl.Marker{
    _onMapClick(e) {
        const targetElement = e.originalEvent.target;
        const element = this._element;
        if (targetElement === element || element.contains((targetElement))) {
            this.remove();
            list_marker.delete(this);
            const p=this.getLngLat();
            list_point.delete(p.lat+","+p.lng);
          }
    }
}

export const clearMarker=()=>{
    list_point.clear();
    for (let item of list_marker){
        item.remove();
    }
    list_marker.clear();
};

const getCoord=()=>{
    let ret="";
    for (let item of list_point){
        ret=ret+item+",";
    }
    if(ret.length>0){
        return ret.substring(0,ret.length-1);
    }else{
        return ret;
    }
};

const findRoute=()=>{
    const data=getCoord();
    if(data.length>0){
      searchData(data);
    }else{
        clearMarker();  
    }
    handlePopUpClose();
};