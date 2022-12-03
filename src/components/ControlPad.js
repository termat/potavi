import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { setPitchVal,setBearingVal,setZoomVal,getMap} from './Mappanel';
import {setSpeed} from './DataLoader';

let spId=3;
let zoom;
let timerId=0;

export let showPanel;
const srate=[0.125,0.25,0.5,1.0,2.0,3.0,4.0];

export default function ControlPad(){
    const [visible, setVisible] = useState(true);

    const speedChangeUp=()=>{
        spId=Math.min(spId+1,6);
        setSpeed(srate[spId]);
    }

    const speedChangeDn=()=>{
        spId=Math.max(spId-1,0);
        setSpeed(srate[spId]);
    }

    showPanel=()=>{
        setVisible(!visible);
    };

    const zoomChangeUp=()=>{
        zoom=getMap().getZoom();
        zoom=Math.min(zoom+1,20)
        setZoomVal(zoom);
    };

    const zoomChangeDn=()=>{
        zoom=getMap().getZoom();
        zoom=Math.max(zoom-1,13)
        setZoomVal(zoom);
    };

    const upPress=()=>{
        clearInterval(timerId);
        timerId=setInterval(function(){setPitchVal(2);},50);
    };

    const release=()=>{
        clearInterval(timerId);
    };

    const dwPress=()=>{
        clearInterval(timerId);
        timerId=setInterval(function(){setPitchVal(-2);},50);
    };

    const lePress=()=>{
        clearInterval(timerId);
        timerId=setInterval(function(){setBearingVal(5)},50);
    };

    const rePress=()=>{
        clearInterval(timerId);
        timerId=setInterval(function(){setBearingVal(-5)},50);
    };

    return (
        <div id="controller" style={
            {
                float: "left",
                width: "160px", 
                height: "130px",
                border: "none",
                position: "absolute",
                bottom: 100,
                right: 20,
                zindex:255,
                userSelect:"none",
                visibility: visible ? "visible" : "hidden"
            }}
        >
            <Stack spacing={1}>
            <Stack direction="row" spacing={1}>
            <Button variant="contained" color="warning" style={{width:"80px"}} onMouseDown={dwPress} onMouseUp={release} onTouchStart={dwPress} onTouchEnd={release}> UP </Button>
            <Button variant="contained" color="warning" style={{width:"80px"}} onMouseDown={upPress} onMouseUp={release} onTouchStart={upPress} onTouchEnd={release}>DOWN</Button>
            </Stack>
            <Stack direction="row" spacing={1}>
            <Button variant="contained" color="warning" style={{width:"80px"}} onMouseDown={lePress} onMouseUp={release} onTouchStart={lePress} onTouchEnd={release}>LEFT </Button>
            <Button variant="contained" color="warning" style={{width:"80px"}} onMouseDown={rePress} onMouseUp={release} onTouchStart={rePress} onTouchEnd={release}>RIGHT</Button>
            </Stack>
            <Stack direction="row" spacing={1}>
            <Button variant="contained" color="success" style={{width:"35px",minWidth:"35px"}} onClick={speedChangeUp}>∧</Button>
            <Button variant="contained" color="success" style={{width:"35px",minWidth:"35px"}} onClick={speedChangeDn}>∨</Button>
            <Button variant="contained" color="secondary" style={{width:"35px",minWidth:"35px"}} onClick={zoomChangeUp}>＋</Button>
            <Button variant="contained" color="secondary" style={{width:"35px",minWidth:"35px"}} onClick={zoomChangeDn}>－</Button>
            </Stack>
            </Stack>
        </div>
    );
};