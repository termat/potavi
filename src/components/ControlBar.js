import React, { Component} from 'react';
import ListItem from '@mui/material/ListItem';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import {targetRoute,running,setPhase,run,stop,setSpeed} from './DataLoader';

export let setSlider;
export let endRunning;
let setRunning;

export let zoomChange;

export default class ControlBar extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
          play_state: "開始",
          val:0,
          hovered:false
        }
        setSpeed(1.0);
    };

    componentDidMount(){
        setSlider=(value)=>{
            this.setState({val:Math.ceil(value*100)});
        };
        endRunning=()=>{
            this.setState({play_state: "開始"});
        };
        setRunning=()=>{
            if(targetRoute){
                if(this.state.play_state==="開始"){
                    this.setState({play_state: "停止"});
                    run();
                }else{
                    this.setState({play_state: "開始"});
                    stop();
                }
            }
        };
    }

    onMouseEnterHandler(){
        this.setState({
          hovered: true
        })
      }
    
    onMouseLeaveHandler(){
        this.setState({
          hovered: false
        })  
    }

    render() {
        return <div style={
                {
                    float: "left",
                    width: "96%", 
                    lineHeight: "32px",
                    borderRadius: 4,
                    border: "none",
                    padding: "0px 20px 0px 20px",
                    color: "#fff",
                    background: "#ffffff88",
                    position: "absolute",
                    bottom: 35,
                    left: "2%",
                    zindex:255,
                    opacity:this.state.hovered ? 1:0.0
                }
            }
            onMouseEnter={()=>{this.onMouseEnterHandler()}} 
            onMouseLeave={()=>{this.onMouseLeaveHandler()}}
            onTouchStart={()=>{this.onMouseEnterHandler()}} 
        >
        <ListItem>
        <Button variant="contained" color="primary" style={{marginRight:"20px"}} onClick={setRunning}>{this.state.play_state}</Button>
        <Slider
          value={this.state.val}
          getAriaValueText={onChangeProgress}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={100}
          onChange={onChangeVal}
        />
        </ListItem>
        </div>;
    };
}

const onChangeProgress=(value)=>{

};

const onChangeVal=(val)=>{
    if(!running)setPhase(val.target.value/100.0);
};

/*
const bar_style = {
    float: "left",
    width: "96%", 
    lineHeight: "32px",
    borderRadius: 4,
    border: "none",
    padding: "0px 20px 0px 20px",
    color: "#fff",
    background: "#ffffff88",
    position: "absolute",
    bottom: 35,
    left: "2%",
    zindex:255,
}; 
*/
