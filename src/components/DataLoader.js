import * as turf from '@turf/turf';
import {setSlider,endRunning} from './ControlBar';
import { addPhoto,addAccPoint} from './Mappanel';
import {getMemory} from './TabLeft';

let gpxParser = require('gpxparser');
let tcxParse = require('tcx');
var DOMParser = require('xmldom').DOMParser;

let currentMap;
export let targetRoute;
let routeDistance;
let speed;
let phase=0;
export let start=0;
let mul=1.0;
export let running=false;
let runAni;
export let memoryMode=getMemory();

export const setSpeed=(val)=>{
    mul=val;
};

export const setPhase=(val)=>{
    phase=val;
    if(phase===0.0)start=null;
    if(targetRoute)frame();
};

export const run=()=>{
    if(targetRoute){
        running=true;
        requestAnimationFrame(frame);
    }
};

export const stop=()=>{
    if(running){
        running=false;
        cancelAnimationFrame(runAni);
        start=null;
    }
};

const getElevationOnTerrain=(map,lnglat)=>{
    let terrain = map.style.terrain;
     if(terrain) {
        return map.transform.getElevation(lnglat, terrain) - terrain.elevationOffset * terrain.exaggeration;
    }
    return 0;
}

const trans=(h)=>{
    let box = Math.round(10 * (h + 10000)).toString(16)
    let boxr = parseInt(box.slice(-6, -4), 16)
    let boxg = parseInt(box.slice(-4, -2), 16)
    let boxb = parseInt(box.slice(-2), 16)
    let x=boxr*65536+boxg*256+boxb;
    if(x<8388608){
        return x*0.01;
    }else if(x>8388608){
        return 0.01*(x-16777216);
    }else{
        return 0;
    }
}

export const getElevations=()=>{
    const ret=[];
    if(!targetRoute)return ret;
	const line = turf.lineString(targetRoute);
	const options = {units: 'kilometers'};
	const length = turf.length(line, options);
    let ml=0;

    while(length>ml){
        let along = turf.along(line, ml, options);
		const elevation = getElevationOnTerrain(currentMap,along.geometry.coordinates);
         ret.push({"x":ml,"y":elevation});
		ml=ml+0.05;
    }
    return ret;
};

let fps = 1000 / 24;
let prev;
let counter=0;

export const frame=(time)=>{
    if (!start){
        start = time;
        prev=start;
        if(currentMap.getZoom()<=14){
            currentMap.setZoom(15);
        }
    }else{
        if (typeof time !== "undefined") {
            let dd=time-start;
            start=time;
            prev=start;
            phase=phase+speed*dd*mul*0.5;
        }else{
            start=Date.now();
            prev=start;
        }
    }
    let lp;
    while((lp=Date.now())-prev<fps){}
    prev=lp;
    if (phase >= 1) {
        setTimeout(function () {
            running=false;
            endRunning();
        }, 1500);
    }
    setSlider(phase);
    let alongRoute = turf.along(
        turf.lineString(targetRoute),
        routeDistance * phase
    ).geometry.coordinates;
    const point = {
        'type': 'Point',
        'coordinates': alongRoute
    };
    if(memoryMode){
        // eslint-disable-next-line 
        if((counter=counter+1)%24==0)currentMap.getSource('point').setData(point);
    }else{
        currentMap.getSource('point').setData(point);
    }
    currentMap.setCenter(alongRoute);
    if(running){
        runAni=requestAnimationFrame(frame);
    }else{
        cancelAnimationFrame(runAni);
    }
};

export const fileRead=(map)=>{
    let fileInput = document.getElementById('file');
    let fileReader = new FileReader();
    let fname="";
    fileInput.onchange = () => {
        let file = fileInput.files[0];
        if(!file||!file.name)return;
        fname=file.name.toLowerCase();
        console.log(file.name);
        console.log(file.size);
        fileReader.readAsText(file);
    };
    fileReader.onload = () => {
        fileProc(map,fname,fileReader.result);
    }
    fileInput.click();
  };

const fileProc=(map,fname,obj)=>{
    if(fname.endsWith(".geojson")){
        parseGeojson(map,obj);
    }else if(fname.endsWith(".json")){
        parseGeojson(map,obj);
    }else if(fname.endsWith(".gpx")){
        let gpx=new gpxParser();
        gpx.parse(obj);
        parseGeojson(map,JSON.stringify(gpx.toGeoJSON()));
    }else if(fname.endsWith(".tcx")){
        let doc = new DOMParser().parseFromString(obj);
        let tcx=tcxParse(doc);
        parseGeojson(map,JSON.stringify(tcx));
    }
};

export const parseGeojson=(map,str)=>{
    currentMap=map;
    if (map.getLayer('point'))map.removeLayer('point');
    if (map.getLayer('trace_line'))map.removeLayer('trace_line');
    if (map.getSource('trace'))map.removeSource('trace');
    if (map.getSource('point'))map.removeSource('point');
    let json=JSON.parse(str);
    targetRoute=[];
    let array=json.features;
    array.forEach(e => {
        let c=e.geometry.coordinates;
        if(e.geometry.type==="Point"){
            targetRoute.push(c);
        }else if(e.geometry.type==="LineString"){
            propcLine(c,targetRoute);
        }
    });
    setGeojsonLayer(map,targetRoute);
    fitBounds(map,targetRoute);
    start=null;
    phase=0.0;
    setSlider(0);
};

const propcLine=(c,targetRoute)=>{
    c.forEach(e =>{
        targetRoute.push(e);
    });
}

const setGeojsonLayer=(map,targetRoute)=>{
    if(targetRoute){
        map.addSource('trace', {
            type: 'geojson',
            data: {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': targetRoute
                }
            }
        });
        map.addLayer({
            type: 'line',
            source: 'trace',
            id: 'trace_line',
            paint: {
                'line-color': 'orange',
                'line-width': 6,
                'line-opacity': 0.9,
            },
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            }
        });
        let point = {
            'type': 'Point',
            'coordinates': targetRoute[0]
        };
        map.addSource('point', {
            'type': 'geojson',
            'data': point 
        });
        map.addLayer({
            'id': 'point',
            'source': 'point',
            'type': 'circle',
            'paint': {
                'circle-color': "#ff4444",
//                'circle-radius':4,
            'circle-radius':[
                    'interpolate',
                    ['linear'],
                    ["zoom"],
                        10,2.0,
                        13,4.0,
                        16,6.0,
                        18,8.0],
                'circle-stroke-width': 4,
                'circle-stroke-opacity': 0.05
            },
        });
    }
    routeDistance = turf.length(turf.lineString(targetRoute));
    speed=1/((routeDistance/10)*60000);
};

const fitBounds=(map,targetRoute)=>{
    if(!targetRoute||targetRoute.length<=3)return;
    let xmin=100000;
    let xmax=-10000;
    let ymin=100000;
    let ymax=-10000;
    targetRoute.forEach(element => {
        xmin=Math.min(xmin,element[0]);
        xmax=Math.max(xmax,element[0]);
        ymin=Math.min(ymin,element[1]);
        ymax=Math.max(ymax,element[1]);
    });
    map.fitBounds([
        [xmin, ymin],
        [xmax, ymax]
    ]);
    if(map.getSource('photo')){
        map.removeLayer('photoId');
        map.removeSource('photo');
    }
    addPhoto(map,xmin-0.005,xmax+0.005,ymin-0.005,ymax+0.005);

    if(map.getSource('acc')){
        map.removeLayer('accid');
        map.removeSource('acc');
    }
    addAccPoint(map,xmin,xmax,ymin,ymax);
};
