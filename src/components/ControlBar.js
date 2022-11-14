import React, { Component} from 'react';
import ListItem from '@mui/material/ListItem';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import {targetRoute,running,setPhase,run,stop,setSpeed} from './DataLoader';
import { setZoomVal } from './Mappanel';

export let setSlider;
export let endRunning;
let setRunning;

let spId=0;
let speedChange;
let zoomChange;
let zoom=14;

export default class ControlBar extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
          play_state: "開始",
          val:0,
          label:"３速",
          zoom:"視点",
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
        speedChange=()=>{
            spId=(spId+1)%5;
            if(spId===0){
                this.setState({label:"３速"});
                setSpeed(1.0);
            }else if(spId===1){
                this.setState({label:"４速"});
                setSpeed(2.0);
            }else if(spId===2){
                this.setState({label:"５速"});
                setSpeed(3.0);
            }else　if(spId===3){
                this.setState({label:"１速"});
                setSpeed(0.25);
            }else{
                this.setState({label:"２速"});
                setSpeed(0.5);
            }
        };
        zoomChange=()=>{
            zoom=zoom+1;
            if(zoom>20)zoom=14;
            setZoomVal(zoom);
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
                    opacity:this.state.hovered ? 1:0.3
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
        <Button variant="contained" color="primary" style={{marginLeft:"20px"}} onClick={speedChange}>{this.state.label}</Button>
        <Button variant="contained" color="primary" style={{marginLeft:"20px"}} onClick={zoomChange}>{this.state.zoom}</Button>
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
