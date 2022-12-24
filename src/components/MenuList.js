import * as React from 'react';
import Box from '@mui/material/Box';
import LayerControl from './LayerControl';

export const getLayerState=(id)=>{
    const val=localStorage.getItem(id);
    if(!val){
        if(id.indexOf("dis")>=0){
            return false;
        }else{
            return true;
        }
    }
    return JSON.parse(val);
};

export default function MenuList() {
    return (
        <div>
        <Box sx={{ lineHeight: 1,fontSize: 'small' }}>
        <LayerControl width={180} checked={getLayerState("vector-bldg")} title={"建物"} layerId={["vector-bldg","vector-brid"]} opacity={90} type={'fill-extrusion-opacity'} />
        <LayerControl width={180} checked={getLayerState("vector-road")} title={"道路線"} layerId={["vector-road"]} opacity={100} type={'line-opacity'} />
        <LayerControl width={180} checked={getLayerState("vector-rail")} title={"鉄道"} layerId={["vector-rail"]} opacity={80} type={'line-opacity'} />
        <LayerControl width={180} checked={getLayerState("vector-water")} title={"水域"} layerId={["vector-water"]} opacity={25} type={'fill-opacity'} />
        <LayerControl width={180} checked={getLayerState("mvt-pad")} title={"農地"} layerId={["mvt-pad"]} opacity={40} type={'fill-opacity'} />
        <LayerControl width={180} checked={getLayerState("dis-land")} title={"土砂災害警戒"} layerId={["dis-land"]} opacity={40} type={'fill-opacity'} />
        <LayerControl width={180} checked={getLayerState("dis-tsunami")} title={"津波浸水想定"} layerId={["dis-tsunami"]} opacity={40} type={'fill-opacity'} />
        </Box>
        </div>
    );
};