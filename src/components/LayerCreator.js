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

  const MVT_FUDE={
    type: "vector",
    glyphs: "https://maps.gsi.go.jp/xyz/noto-jp/{fontstack}/{range}.pbf",
    tiles: ["https://www.termat.net/fude/{z}/{x}/{y}"],
    minzoom: 13,
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

export const addVectorLayer=(mapobj)=>{
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
                    'fill-opacity': 0.9,
            }
        });
    }
};