import * as turf from '@turf/turf';
import {setSlider,endRunning} from './ControlBar';
import { addPhoto, setBearingVal2 } from './Mappanel';

let gpxParser = require('gpxparser');
let tcxParse = require('tcx');
var DOMParser = require('xmldom').DOMParser;

let currentMap;
export let targetRoute;
let routeDistance;
let speed;
let phase=0;
let start=0;
let mul=1.0;
export let running=false;
let runAni;
let isTrace=false;
let prePos;
let preAng;
let amt=0.05;

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

export const frame=(time)=>{
    if (!start){
        start = time;
    }else{
        if (typeof time !== "undefined") {
            let dd=time-start;
            start=time;
            phase=phase+speed*dd*mul*0.5;
        }else{
            start=Date.now();
        }
    }
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
    currentMap.setCenter(alongRoute);
    let point = {
        'type': 'FeatureCollection',
        'features': [{
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'Point',
                'coordinates': alongRoute
            }
        }]
    };
    let src=currentMap.getSource('point');
    if(src)src.setData(point);
    if(running){
        runAni=requestAnimationFrame(frame);
    }else{
        cancelAnimationFrame(runAni);
    }
    if(isTrace){
        if(!preAng)preAng=currentMap.getBearing();
        if(prePos){
            const vec=[alongRoute[0]-prePos[0],alongRoute[1]-prePos[1]]
            const ang=180-Math.atan2(vec[1],vec[0])*360/Math.PI;
            const val=(1 - amt) * preAng + amt * ang;
            setBearingVal2(val);
            preAng=ang;
        }
        prePos=[alongRoute[0],alongRoute[1]];
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
            'type': 'FeatureCollection',
            'features': [{
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'Point',
                    'coordinates': targetRoute[0]
                }
            }]
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
    addPhoto(map,xmin,xmax,ymin,ymax);
};
