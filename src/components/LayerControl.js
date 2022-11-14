
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import { getMap } from './Mappanel';

export default function LayerControl(props) {
    const [opacity, setOpacty] = useState(props.opacity);
    const [checked, setChecked] = useState(props.checked);

    const handleChange=(e)=>{
        setChecked(e.target.checked);
        const map=getMap();
        if(e.target.checked){
            props.layerId.forEach(function(elem){
                map.setLayoutProperty(elem, 'visibility', 'visible');
             });
        }else{
            props.layerId.forEach(function(elem){
                map.setLayoutProperty(elem, 'visibility', 'none');
             });
        }
    }

    const handleValChange=(e)=>{
        setOpacty(e.target.value);
        const map=getMap();
        props.layerId.forEach(function(elem){
            map.setPaintProperty(elem, props.type, Number(e.target.value / 100));
         });
    }

    return (
        <Box width={props.width} sx={{ lineHeight: 0}}>
            <FormControlLabel aria-label="Small" control={<Checkbox size="small" checked={checked} onChange={handleChange} />} label={props.title} />
            <Slider
                size="small"
                width={props.width}
                value={opacity}
                aria-label="Small"
                onChange={handleValChange}
                valueLabelDisplay="auto"
             />
            <Divider />
        </Box>
      );
}
