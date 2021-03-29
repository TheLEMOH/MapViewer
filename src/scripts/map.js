import Map from "ol/Map";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";

let map = '';
function InitializingMap() {
    map = new Map({
        layers: [
            new TileLayer({
                source: new OSM(),
                type: 'BASE_LAYER'
            }),
        ],
        target: "mapBox",
        view: new View({
            center: [0, 0],
            zoom: 2,
        }),
    });
    map.updateSize();
}

export { InitializingMap }