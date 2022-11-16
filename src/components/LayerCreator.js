import {MapboxLayer} from '@deck.gl/mapbox';
import {Tiles3DLoader} from '@loaders.gl/3d-tiles';
import {Tile3DLayer} from '@deck.gl/geo-layers';

export const createTile3DLayer=(url)=>{
    const mapboxLayer = new MapboxLayer({
        id: 'tile-3d-layer',
        type: Tile3DLayer,
        data: url,
        loader: Tiles3DLoader,
        onTilesetLoad: (tileset) => {
//          const { cartographicCenter } = tileset;
//          const [longitude, latitude] = cartographicCenter;
          },
      });

      return mapboxLayer;
};

const VECTOR={
    type: "vector",
    glyphs: "https://maps.gsi.go.jp/xyz/noto-jp/{fontstack}/{range}.pbf",
    tiles: [
        "https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf"
    ],
    minzoom:6,
    maxzoom:16
};

export const addVectorLayer=(mapobj)=>{
    if (!mapobj.getSource('vector')){
        mapobj.addSource('vector', VECTOR);
        mapobj.addLayer({
            "id": "vector-road",
            "type": "line",
            "source": "vector",
            "source-layer": "road",
            "paint": {
                    'line-opacity': 1.0,
                    'line-color': 'rgb(180, 180, 180)',
                    'line-width': 2
                }
        });
        mapobj.addLayer({
            "id": "vector-rail",
            "type": "line",
            "source": "vector",
            "source-layer": "railway",
            "paint": {
                    'line-opacity': 0.8,
                    'line-color': '#ffaaaa',
                    'line-width': [
                        'interpolate',
                        ['linear'],
                        ["zoom"],
                            10,1.0,
                            13,2.0,
                            14,4.0,
                            15,6.0,
                            16,8.0],
                }
        });
        mapobj.addLayer({
            "id": "vector-water",
            "type": "fill",
            "source": "vector",
            "source-layer": "waterarea",
            "paint": {
                    'fill-opacity': 0.25,
                    'fill-color': 'rgb(0, 128, 255)',
                }
        });
        mapobj.addLayer({
            "id": "bldg-lod0",
            "type": "fill-extrusion",
            "source": "vector",
            "source-layer": "building",
            "paint": {
                "fill-extrusion-height":[
                    'interpolate',
                    ['linear'],
                    ["get", "ftCode"],
                        3101,8.0,
                        3102,16.0,
                        3103,32.0,
                        3111,4.0,
                        3112,8.0],
                "fill-extrusion-color": [
                    'interpolate',
                    ['linear'],
                    ["get", "ftCode"],
                        3101,'#444455',
                        3102,'#666677',
                        3103,'#888899',
                        3111,'#aaaabb',
                        3112,'#aaaabb'],
                'fill-extrusion-opacity': 0.9
            }
        });
        mapobj.addLayer({
            "id": "map-label",
            "type": "symbol",
            "source": "vector",
            "source-layer": "label",
            "layout": {
                'text-size': 12,
                "text-rotate":["case",["==",["get","arrng"],2],["*",["+",["to-number",["get","arrngAgl"]],90],-1],["*",["to-number",["get","arrngAgl"]],-1]],
                "text-field":["get","knj"],
                "text-font":["NotoSansCJKjp-Regular"],
                "text-allow-overlap": true,
                "text-keep-upright":true,
                "text-allow-overlap":false, // eslint-disable-line
                "symbol-z-order":"auto",
                "text-max-width":60,
                'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                'text-justify': 'auto',
                "symbol-placement": "point"
            },
            "paint": {
                "text-color": "black",
                "text-opacity": 1.0,
                "text-halo-color": "rgba(255,255,255,0.95)",
                "text-halo-width": 1.5,
                "text-halo-blur": 1
            }
        });
    }
};

const agent=()=>{
    if(navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i)){
        return 15;
    }else{
        return 13;
    }
}

const MVT_PLAT={
    type: "vector",
    glyphs: "https://maps.gsi.go.jp/xyz/noto-jp/{fontstack}/{range}.pbf",
    tiles: ["https://www.termat.net/bldg/{z}/{x}/{y}"],
    minzoom: agent(),
    maxzoom: 16,
    attribution: '<a href="https://www.mlit.go.jp/plateau/">国土交通省Project PLATEAU</a>'
  };

  const MVT_FUDE={
    type: "vector",
    glyphs: "https://maps.gsi.go.jp/xyz/noto-jp/{fontstack}/{range}.pbf",
    tiles: ["https://www.termat.net/fude/{z}/{x}/{y}"],
    minzoom: agent(),
    maxzoom: 16,
    attribution: '<a href="https://open.fude.maff.go.jp/">農林水産省筆ポリゴン</a>'
  };

  const MVT_DIS={
    type: "vector",
    glyphs: "https://maps.gsi.go.jp/xyz/noto-jp/{fontstack}/{range}.pbf",
    tiles: ["https://www.termat.net/dis/{z}/{x}/{y}"],
    minzoom: 13,
    maxzoom: 16,
    attribution: '<a href="https://nlftp.mlit.go.jp/ksj/">国土数値情報</a>'
  };

export const addBldgLayer=(mapobj)=>{
    if (!mapobj.getSource('mvt_plat')){
        mapobj.addSource("mvt_plat", MVT_PLAT);
        mapobj.addLayer({
            "id": "mvt-road",
            "type": "fill",
            "source": "mvt_plat",
            "source-layer": "ROAD",
            "paint": {
                "fill-color": "#666666",
                'fill-opacity': 0.7,
            }
        });
        mapobj.addLayer({
            "id": "bldg",
            "type": "fill-extrusion",
            "source": "mvt_plat",
            "source-layer": "BUILDING",
            "paint": {
                "fill-extrusion-color": [
                    'interpolate',
                    ['linear'],
                    ["get", "height"],
                        0,'#444455',//'blue',
                        10,'#555577',//'royalblue',
                        20,'#666699',//'cyan',
                        40,'#7777aa',//'lime',
                        80,'#8888bb',//'yellow',
                        120,'#9999cc',//'orange',
                        160,'#aaaadd',//'orange',
                        200,'#bbbbee',//'orange',
                        240,'#ccccff',//'orange',
                        280,'#ddddff'],//'red'],
                        "fill-extrusion-height": ["get", "height"],
                'fill-extrusion-opacity': 0.9,
            }
        });
        mapobj.addLayer({
            "id": "bridge",
            "type": "fill-extrusion",
            "source": "mvt_plat",
            "source-layer": "BRIDGE",
            "paint": {
                "fill-extrusion-color": "#bbbbee",
                "fill-extrusion-height": ["get", "height"],
                'fill-extrusion-opacity': 0.9,
            }
        });
    }
    if (!mapobj.getSource('mvt_fude')){
        mapobj.addSource("mvt_fude", MVT_FUDE);
        mapobj.addLayer({
            "id": "mvt-pad",
            "type": "fill",
            "source": "mvt_fude",
            "source-layer": "FUDE",
            "paint": {
                "fill-color": ["match",["get", "class"],"田","#f5bf56","#e0b5d3"],
                'fill-opacity': 0.4,
            }
        });
    }
    if (!mapobj.getSource('mvt_dis')){
        mapobj.addSource("mvt_dis", MVT_DIS);
        mapobj.addLayer({
            "id": "dis-land",
            "type": "fill",
            "source": "mvt_dis",
            "source-layer": "LANDSLIDE",
            "paint": {
                "fill-color": ["match",["get", "type"],"急傾斜地崩壊","#ff4500","#ffd700"],
                'fill-opacity': 0.4,
            }
        });
        mapobj.addLayer({
            "id": "dis-tsunami",
            "type": "fill",
            "source": "mvt_dis",
            "source-layer": "TUNAMI",
            "paint": {
                "fill-color": [
                    'interpolate',
                    ['linear'],
                    ["get", "depth"],
                        0.3,'#2b83ba',
                        0.5,'#64abb0',
                        1,'#9dd3a6',
                        2,'#c7e8ad',
                        3,'#ecf7b9',
                        4,'#ffedaa',
                        5,'#fec980',
                        10,'#f99d59',
                        20,'#e85b3b',
                        50,'#d7191c'],
                    'fill-opacity': 0.5,
            }
        });
    }

};