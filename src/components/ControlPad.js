import React, { useState } from 'react';
import { setPitchVal,setBearingVal} from './Mappanel';

let timerId;

export default function ControlPad(){
    const [state, setState] = useState({hovered:false,downed:false});

    const onMouseEnterHandler=(e)=>{
        setState({
          hovered: true
        })
      }
    
    const onMouseLeaveHandler=(e)=>{
        setState({
          hovered: false
        })  
      }

    const onMouseDownHandler=(e)=>{
        setState({
           downed: true
        })
        const elem = document.getElementById("controller");
        let xx=e.clientX-elem.offsetLeft;
        let yy=e.clientY-elem.offsetTop;
        if(xx>yy){
            if(yy>256-xx){
                clearInterval(timerId);
                timerId=setInterval(function(){setBearingVal(5)},50);
            }else{
                clearInterval(timerId);
                timerId=setInterval(function(){setPitchVal(2);},50);
            }
        }else{
            if(yy>256-xx){
                clearInterval(timerId);
                timerId=setInterval(function(){setPitchVal(-2);},50);
            }else{
                clearInterval(timerId);
                timerId=setInterval(function(){setBearingVal(-5)},50);
            }
        }
    }

    const onMouseUpHandler=(e)=>{
        setState({
           downed: false
        });
        clearInterval(timerId);
        timerId=-1;
    }

    return (
        <div id="controller" style={
            {
                float: "left",
                width: "256px", 
                height: "256px",
                border: "none",
                position: "absolute",
                bottom: 100,
                right:40,
                zindex:255,
                userSelect:"none",
                border: "2px solid #000000",   // eslint-disable-line
                borderRadius:"20px 20px 20px 20px",
                opacity:state.hovered | state.downed ? 0.9:0.3
            }}
            onMouseEnter={(e)=>{onMouseEnterHandler(e)}} 
            onMouseLeave={(e)=>{onMouseLeaveHandler(e)}}
            onTouchStart={(e)=>{onMouseUpHandler(e)}} 
            onMouseDown={(e)=>{onMouseDownHandler(e)}}
            onMouseUp={(e)=>{onMouseUpHandler(e)}}
            onTouchEnd={(e)=>{onMouseUpHandler(e)}}
        >
        </div>
    );
};