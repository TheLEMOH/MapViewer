<template>
  <vl-map
    :load-tiles-while-animating="true"
    :load-tiles-while-interacting="true"
    :data-projection="mapConfig.matrix"
    ref="map"
    @click="Test"
    @singleclick="clickCoord = $event.coordinate"
    @pointermove="Hover"
  >
    <vl-view :zoom="mapConfig.zoom" :center="mapConfig.center"></vl-view>

    <vl-layer-tile id="osm">
      <vl-source-xyz
        :url="mapConfig.substrate"
        :crossOrigin="'anonymous'"
      ></vl-source-xyz>
    </vl-layer-tile>

    <vl-layer-tile v-for="layer in layers" :key="layer.id">
      <vl-source-wms
        v-if="layer.type == 'CUSTOM_LAYER' && layer.visible == true"
        :url="layer.url"
        :layer-name="layer.name"
        :id="layer.id"
        :layers="'region_project'"
        :matrix-set="layer.matrixSet"
        :crossOrigin="layer.crossOrigin"
      ></vl-source-wms>

      <vl-feature v-if="layer.type == 'VECTOR_LAYER' && layer.visible == true">
        <vl-geom-point
          :coordinates="layer.location"
          :matrix-set="layer.matrixSet"
        ></vl-geom-point>
        <vl-style-box>
          <vl-style-circle :radius="Number(layer.style.properties.radius)">
            <vl-style-fill :color="layer.style.fill.color"></vl-style-fill>
            <vl-style-stroke
              :color="layer.style.stroke.color"
              :width="Number(layer.style.stroke.width)"
            ></vl-style-stroke>
          </vl-style-circle>
          <vl-style-text
            :text="layer.style.text.text"
            :font="layer.style.text.font + ' sans-serif'"
            v-if="layer.style.text.enable"
          >
            <vl-style-fill :color="layer.style.text.color"></vl-style-fill>
            <vl-style-stroke
              :color="layer.style.text.color"
              :width="Number(layer.style.text.width)"
            ></vl-style-stroke>
            ></vl-style-text
          >
        </vl-style-box>
      </vl-feature>
    </vl-layer-tile>
    <vl-overlay v-if="clickCoord" :position="clickCoord" class="popup"
      ><div class="popup-content">{{ content }}</div>
      <button @click="clickCoord = undefined">close</button></vl-overlay
    >
  </vl-map>
</template>

<script>
async function Xml2Text(text) {
  const dom = new DOMParser();
  const xml = dom.parseFromString(text, "text/xml");
  const data = xml.getElementsByTagName("layer0_feature");
  data[0].childNodes.forEach((e) => {
    if (e.nodeName != "#text") console.log(e);
  });
}

export default {
  props: ["layers", "mapConfig"],
  data() {
    return {
      rotation: 0,
      clickCoord: undefined,
      content: "",
    };
  },
  methods: {
    Test(e) {
      const map = this.$refs.map;
      const coordinates = map.getCoordinateFromPixel(e.pixel);
      const viewResolution = map.getView().getResolution();
      const viewProjection = map.getView().getProjection();
      map.forEachLayerAtPixel(e.pixel, (layer) => {
        if (layer.getProperties().id != "osm") {
          const url = layer
            .getSource()
            .getGetFeatureInfoUrl(coordinates, viewResolution, viewProjection, {
              INFO_FORMAT: "application/vnd.ogc.gml",
            });
          fetch(url)
            .then((e) => {
              return e.text();
            })
            .then((e) => {
              this.content = e;
              Xml2Text(e);
            });
        }
      });
    },
    Hover(e) {
      const map = this.$refs.map;
      map.forEachLayerAtPixel(e.pixel, (layer) => {
        if (layer.getProperties().id != "osm") {
          console.log(e.coordinate);
          this.clickCoord = e.coordinate;
        }
      });
    },
  },
};
</script>

<style>
.popup {
  width: 300px;
  height: 100px;
  overflow-x: hidden;
  overflow-y: scroll;
  background: white;
  word-wrap: break-word;
  padding: 3px;
}
.ol-control {
  visibility: hidden;
}
</style>