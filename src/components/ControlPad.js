import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { setPitchVal,setBearingVal,setZoomVal} from './Mappanel';
import {setSpeed} from './DataLoader';

const name=["Normal","Fast","Fastest","Slowest","Slow"];
let spId=0;
let zoom=14;
let timerId=0;

export default function ControlPad(){
    const [state, setState] = useState({hovered:false,downed:false});
    const [speed,setSp] =useState("Normal")

    const onMouseEnterHandler=()=>{
        setState({
          hovered: true
        })
      };
    
    const onMouseLeaveHandler=()=>{
        setState({
          hovered: false
        })  
    }

    const speedChange=()=>{
        spId=(spId+1)%5;
        setSp(name[spId]);
        if(spId===0){
            setSpeed(1.0);
        }else if(spId===1){
            setSpeed(2.0);
        }else if(spId===2){
            setSpeed(3.0);
        }else　if(spId===3){
            setSpeed(0.25);
        }else{
            setSpeed(0.5);
        }
    }

    const zoomChange=()=>{
        zoom=zoom+1;
        if(zoom>20)zoom=14;
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
                right:20,
                zindex:255,
                userSelect:"none",
                opacity:state.hovered ? 0.8:0.0
            }}
            onMouseEnter={(e)=>{onMouseEnterHandler(e)}} 
            onMouseLeave={(e)=>{onMouseLeaveHandler(e)}}
        >
            <Stack spacing={1}>
            <Stack direction="row" spacing={1}>
            <Button variant="contained" color="warning" style={{width:"80px"}} onMouseDown={upPress} onMouseUp={release}> UP </Button>
            <Button variant="contained" color="warning" style={{width:"80px"}} onMouseDown={dwPress} onMouseUp={release}>DOWN</Button>
            </Stack>
            <Stack direction="row" spacing={1}>
            <Button variant="contained" color="warning" style={{width:"80px"}} onMouseDown={lePress} onMouseUp={release}>LEFT </Button>
            <Button variant="contained" color="warning" style={{width:"80px"}} onMouseDown={rePress} onMouseUp={release}>RIGHT</Button>
            </Stack>
            <Stack direction="row" spacing={1}>
            <Button variant="contained" color="success" style={{width:"80px"}} onClick={speedChange}>{speed}</Button>
            <Button variant="contained" color="success" style={{width:"80px"}} onClick={zoomChange}>VIEW</Button>
            </Stack>
            </Stack>
        </div>
    );
};