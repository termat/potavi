import * as React from 'react';
import Box from '@mui/material/Box';
import LayerControl from './LayerControl';

export default function MenuList() {
    return (
        <div>
        <Box sx={{ lineHeight: 1,fontSize: 'small' }}>
        <LayerControl width={170} checked={true} title={"構造物"} layerId={["bldg","bridge","bldg-lod0"]} opacity={90} type={'fill-extrusion-opacity'} />
        <LayerControl width={170} checked={true} title={"道路面"} layerId={["mvt-road"]} opacity={70} type={'fill-opacity'} />
        <LayerControl width={170} checked={true} title={"道路線"} layerId={["vector-road"]} opacity={100} type={'line-opacity'} />
        <LayerControl width={170} checked={true} title={"鉄道"} layerId={["vector-rail"]} opacity={80} type={'line-opacity'} />
        <LayerControl width={170} checked={true} title={"水域"} layerId={["vector-water"]} opacity={25} type={'fill-opacity'} />
        <LayerControl width={170} checked={true} title={"水域"} layerId={["vector-water"]} opacity={25} type={'fill-opacity'} />
        <LayerControl width={170} checked={true} title={"農地"} layerId={["mvt-pad"]} opacity={40} type={'fill-opacity'} />
        </Box>
        </div>
    );
};