import React, { useRef, useEffect, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import './Mappanel.css';
import { addVectorLayer,addBldgLayer } from './LayerCreator';
import { LayerOnOffControl,FileReadControl,DialogControl,HelpControl,PanelControl,HomeControl,RouteControl } from './MapControls';
import {DrawerOpenControl} from './Dashboard';
import { parseGeojson } from './DataLoader';
import {imagePop,imageClose} from './Imagepopup';
import { getLayerState } from './MenuList';
import { handleAleartMessage,handleAleartOpen } from './AlertDialog';
import axios from 'axios';
import maplibreglWorker from 'maplibre-gl/dist/maplibre-gl-csp-worker';
maplibregl.workerClass = maplibreglWorker;

const BASE_URL="https://www.termat.net/";
const photo_URL="https://www.termat.net/photo/get/bounds/"
const image_URL="https://www.termat.net/photo/get/image/"
const search_URL="https://www.termat.net/route/"
//const search_URL="http://localhost:4567/route/"

export const loadData=(p)=>{
    clearMarker();
    const url=BASE_URL+"trip/route/"+p;
    (async() => {
        try {
          await axios.get(url)
          .then(function (res) {
            parseGeojson(mapObj,JSON.stringify(res.data));
        });
        } catch (err) {
            handleAleartMessage("例外が発生しました。");
            handleAleartOpen();
        } finally {
        }
    })();
};

export const searchData=(p)=>{
    clearMarker();
    const url=search_URL+p;
    (async() => {
        try {
          await axios.get(url)
          .then(function (res) {
            parseGeojson(mapObj,JSON.stringify(res.data));
        });
        } catch (err) {
            handleAleartMessage("経路探査は東京23区内のみ有効です。");
            handleAleartOpen();
        } finally {}
      })();
};

const TILES={
    version: 8,
    glyphs: 'https://maps.gsi.go.jp/xyz/noto-jp/{fontstack}/{range}.pbf',
    sources: {
        gsi: {
            type: 'raster',
            tiles: [
                'https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg'
            ],
            maxzoom: 18,
            attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
        },
        plat: {
            type: 'raster',
            tiles: [
                'https://gic-plateau.s3.ap-northeast-1.amazonaws.com/2020/ortho/tiles/{z}/{x}/{y}.png',
            ],
            minzoom: 18,
            maxzoom: 19,
            attribution: '<a href="https://www.mlit.go.jp/plateau/">国土交通省Project PLATEAU</a>'
        },
        gsidem: {
            type: 'raster-dem',
            tiles: [
                'gsidem://https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png',
//                'gsidem://platr/dsm/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            maxzoom: 14,
        },
    },
    layers: [
        {
            id: 'gsi',
            type: 'raster',
            source: 'gsi',
        },
        {
            id: 'hills',
            type: 'hillshade',
            source: 'gsidem',
            layout: { visibility: 'visible' },
            paint: { 'hillshade-shadow-color': '#473B24' }
        }
    ],
    terrain: {
        source: 'gsidem',
        exaggeration: 1.2,
    },
};

const gsidem2terrainrgb = (r, g, b) => {
    let height = r * 655.36 + g * 2.56 + b * 0.01;
    if (r === 128 && g === 0 && b === 0) {
        height = 0;
    } else if (r >= 128) {
        height -= 167772.16;
    }
    height += 100000;
    height *= 10;
    const tB = (height / 256 - Math.floor(height / 256)) * 256;
    const tG =
        (Math.floor(height / 256) / 256 -
            Math.floor(Math.floor(height / 256) / 256)) *
        256;
    const tR =
        (Math.floor(Math.floor(height / 256) / 256) / 256 -
            Math.floor(Math.floor(Math.floor(height / 256) / 256) / 256)) *
        256;
    return [tR, tG, tB];
};

maplibregl.addProtocol('gsidem', (params, callback) => {
    const image = new Image();
    image.crossOrigin = '';
    image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height,
        );
        for (let i = 0; i < imageData.data.length / 4; i++) {
            const tRGB = gsidem2terrainrgb(
                imageData.data[i * 4],
                imageData.data[i * 4 + 1],
                imageData.data[i * 4 + 2],
            );
            imageData.data[i * 4] = tRGB[0];
            imageData.data[i * 4 + 1] = tRGB[1];
            imageData.data[i * 4 + 2] = tRGB[2];
        }
        context.putImageData(imageData, 0, 0);
        canvas.toBlob((blob) =>
            blob.arrayBuffer().then((arr) => callback(null, arr, null, null)),
        );
    };
    image.src = params.url.replace('gsidem://', '');
    return { cancel: () => {} };
});

let mapObj;
export const jumpTo=(data)=>{
    mapObj.setPitch(30);
    mapObj.fitBounds([
        [data[0]-0.005, data[1]-0.005],
        [data[0]+0.005, data[1]+0.005]
    ]);
};

const initLayer=()=>{
    const tmp=["bldg","bridge","bldg-lod0","mvt-road","vector-road","vector-rail","vector-water","mvt-pad","dis-land","dis-tsunami"];
    tmp.forEach(function(id){
        if(getLayerState(id)){
            mapObj.setLayoutProperty(id,'visibility','visible');
        }else{
            mapObj.setLayoutProperty(id, 'visibility', 'none');
        }
    });
};

export const layerOnOff=(id)=>{
    const visibility = mapObj.getLayoutProperty(id,'visibility');
    if (visibility === 'visible') {
        mapObj.setLayoutProperty(id, 'visibility', 'none');
    } else {
        mapObj.setLayoutProperty(id,'visibility','visible');
    }
};

export const getMap=()=>{
    return mapObj;
};

const agent=()=>{
    var ua = navigator.userAgent;
    if(ua.match(/(iPhone|iPad|iPod|Android)/i)){
        return 45;
    }else{
        ua=ua.toLowerCase()
        if((ua.indexOf("macintosh") > -1 && "ontouchend" in document)){
            return 45;
        }else{
            return 70;
        }
    }
}

const keyDown=(e)=>{
    if(e.keyCode===68){
        setBearingVal(5);
    }else if(e.keyCode===65){
        setBearingVal(-5);
    }else if(e.keyCode===87){
        let zoom=getMap().getZoom();
        zoom=Math.min(zoom+1,20)
        setZoomVal(zoom);
    }else if(e.keyCode===88){
        let zoom=getMap().getZoom();
        zoom=Math.max(zoom-1,13)
        setZoomVal(zoom);
    }else if(e.keyCode===69){
        setPitchVal(2);
    }else if(e.keyCode===81){
        setPitchVal(-2);
    }
};

export let setBearingVal;
export let setBearingVal2;
export let setPitchVal;
export let setZoomVal;

export default function Mappanel(props) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(139.7588499);   // eslint-disable-line
    const [lat, setLat] = useState(35.6769883);    // eslint-disable-line
    const [zoom, setZoom] = useState(12); 
    const [pitch, setPitch] = useState(0.0); 
    const [bearing, setBearing] = useState(0.0);

    setBearingVal=(v)=>{
        setBearing(bearing+v);
        mapObj.setBearing(bearing);
    };

    setBearingVal2=(v)=>{
        setBearing(v);
        mapObj.setBearing(v);
    };

    setPitchVal=(v)=>{
        setPitch(Math.min(Math.max(pitch+v,0),70));
        mapObj.setPitch(pitch);
    };

    setZoomVal=(v)=>{
        setZoom(v);
        mapObj.setZoom(v);
    };

    useEffect(() => {
        if (map.current) return; 
        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: TILES,
            center: [lng, lat],
            zoom: zoom,
            pitch:pitch,
            bearing:bearing,
            hash:true,
            maxPitch:agent(),
            interactive: true,
            localIdeographFontFamily: false,
        });
        map.current.addControl(new maplibregl.FullscreenControl());
        map.current.addControl(new maplibregl.NavigationControl({visualizePitch: true}));
        map.current.addControl(new maplibregl.GeolocateControl({
            positionOptions: {
            enableHighAccuracy: true
            },
            trackUserLocation: true
        }));
        var scale = new maplibregl.ScaleControl({
            maxWidth: 80,
            unit: 'metric'
            });
        map.current.addControl(scale); 
        map.current.addControl(new LayerOnOffControl("/potavi/images/label01.png","map-label","地名表示"), 'top-right');
        map.current.addControl(new LayerOnOffControl("/potavi/images/hill01.png",'hills',"ヒルシェイド"), 'top-right');
        map.current.addControl(new DrawerOpenControl("/potavi/images/toggle.png","サイドパネル"), 'top-left');
        map.current.addControl(new HomeControl("/potavi/images/home.png","ホーム"), 'top-left');
        map.current.addControl(new FileReadControl("/potavi/images/open.png","データ読み込み"), 'top-left');
        map.current.addControl(new DialogControl("/potavi/images/cycle.png","データ一覧"), 'top-left');
        map.current.addControl(new PanelControl("/potavi/images/land.png",'操作パネル'), 'top-right');
        map.current.addControl(new RouteControl("/potavi/images/road.png",'経路検索'), 'top-left');
        map.current.addControl(new HelpControl("/potavi/images/help.png",'ヘルプ'), 'top-left');
        mapObj=map.current;
        mapObj.loadImage(
            '/potavi/images/camera.png',(error, image) => {
                if (error) throw error;
                mapObj.addImage('custom-marker', image);
            }
        );
        setNote();
        document.addEventListener("keydown", keyDown, false);
    });
 
    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('load',()=>{
            addBldgLayer(map.current);
            addVectorLayer(map.current);
            if(props.page){
                setTimeout(loadData(props.page),1000);
            }
            initLayer();
        });
        map.current.on('move', () => {

        });
        map.current.on('contextmenu', (e)=>{
            const marker = new customMarker().setLngLat(e.lngLat);
            const p=marker.getLngLat();
            if(!list_point.has(p.lat+","+p.lng)){
                list_point.add(p.lat+","+p.lng);
                list_marker.add(marker);
                marker.addTo(mapObj);
                marker.on("click",()=>{});
            }
        });
        map.current.on("touchstart", (e)=>{
            if(e.originalEvent.touches.length>1)return;
            flgTouch=true;
            const func=()=>{
                if(!flgTouch)return;
                const marker = new customMarker().setLngLat(e.lngLat);
                const p=marker.getLngLat();
                if(!list_point.has(p.lat+","+p.lng)){
                    list_point.add(p.lat+","+p.lng);
                    list_marker.add(marker);
                    marker.addTo(mapObj);
                    marker.on("click",()=>{});
                }
                flgTouch=false;
            };
            setTimeout(func,2000);
        });
        map.current.on("touchend", (e)=>{
            flgTouch=false;
        });
        map.current.on("touchmove", (e)=>{
            flgTouch=false;
        });
    });

    return (
        <div ref={mapContainer} className="map" >
            <input type="file" accept=".geojson,.gpx,.tcx" id="file" style={{ display: 'none'}}></input>
        </div>
    );
};

let flgTouch=false;

export const getCoord=()=>{
    let ret="";
    for (let item of list_point){
        ret=ret+item+",";
    }
    if(ret.length>0){
        return ret.substring(0,ret.length-1);
    }else{
        return ret;
    }
};

const list_marker=new Set();
const list_point=new Set();
export const clearMarker=()=>{
    list_point.clear();
    for (let item of list_marker){
        item.remove();
    }
    list_marker.clear();
};

class customMarker extends maplibregl.Marker{
    _onMapClick(e) {
        const targetElement = e.originalEvent.target;
        const element = this._element;
        if (targetElement === element || element.contains((targetElement))) {
            this.remove();
            list_marker.delete(this);
            const p=this.getLngLat();
            list_point.delete(p.lat+","+p.lng);
            console.log(list_point);
          }
    }
}

const showPop=(e)=>{
    const ll=new maplibregl.LngLat(e.features[0].geometry.coordinates[0], e.features[0].geometry.coordinates[1]);
    const prop=e.features[0].properties;
    const divElement = document.createElement('div');
    const pElement = document.createElement('p');
    pElement.innerHTML=prop["title"]+"("+prop["date"]+")";
    const imgElement = document.createElement('img');
    imgElement.setAttribute("src","data:image/png;base64,"+prop["thumbnail"]);
    imgElement.setAttribute("style","width:100%;z-index:100;");
    imgElement.addEventListener('click', (e) => {
        imagePop(image_URL+prop["image"]);
    });
    divElement.appendChild(pElement);
    divElement.appendChild(imgElement);
    imageClose();
    let pop=new maplibregl.Popup({ closeOnClick: false })
    .setLngLat(ll)
    .setDOMContent(divElement)
    .addTo(mapObj);
    const close=()=>{
        pop.remove();
    };
    setTimeout(close,2000);
};

export const addPhoto=(map,xmin,xmax,ymin,ymax)=>{
    const url=photo_URL+xmin+"/"+ymin+"/"+(xmax-xmin)+"/"+(ymax-ymin);
    axios.get(url)
    .then(function (res) {
        map.addSource('photo', {
            'type': 'geojson',
            'data': res.data
        });
        map.addLayer({
            'id': 'photoId',
            'source': 'photo',
            'type': 'symbol',
            'layout': {
                'icon-image': 'custom-marker',
                'text-size': 12,
                "text-field":["get","title"],
                "text-font":["NotoSansCJKjp-Regular"],
                "text-allow-overlap": true,
                "text-keep-upright":true,
//                "text-allow-overlap":false,
                "symbol-z-order":"auto",
                "text-max-width":60,
                'text-variable-anchor':  ['top', 'bottom', 'left', 'right'],
                'text-justify': 'auto',
                "symbol-placement": "point",
                "icon-offset":[0,32]
            },
            "paint": {
                "text-color": "red",
                "text-opacity": 1.0,
                "text-halo-color": "rgba(255,255,255,0.95)",
                "text-halo-width": 1.5,
                "text-halo-blur": 1
            }
        });

        map.on('touchstart', 'photoId', function(e){showPop(e);});
        map.on('mouseenter', 'photoId', function(e){showPop(e);});
    });
};

export const setNote=()=>{
    mapObj.on("mousemove",noteListener);
};

export const removeNote=()=>{
    mapObj.off("mousemove",noteListener);
};
  
const datapop = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false });
  
const noteListener=(e)=>{
    const fe = mapObj.queryRenderedFeatures(e.point);
    if (!fe.length) {
        datapop.remove();
    }else{
         if(fe[0].properties["class"]){
            datapop.setLngLat(e.lngLat)
            .setHTML('<b>'+fe[0].properties["class"]+'</b>').addTo(mapObj);
        }else if(fe[0].properties["type"]){
            datapop.setLngLat(e.lngLat)
            .setHTML('<b>'+fe[0].properties["type"]+'</b>').addTo(mapObj);
        }else if(fe[0].properties["depth"]){
            datapop.setLngLat(e.lngLat)
            // eslint-disable-next-line
            .setHTML("<b>津波浸水"+fe[0].properties["depth"]+"m未満"+"</b>").addTo(mapObj);
        }else{
            datapop.remove();
        }
    }
  };
  