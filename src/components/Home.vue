<template>
  <div class="body__AppSystem">
    <div class="navbar navbar-light bg-light header__AppSystem">
      <div class="container-fluid row">
        <div class="col">
          <span class="navbar-brand">{{ project.name }}</span>
        </div>
        <div class="col-auto text-right">
          <span v-for="widget in widgets" :key="widget.id">{{
            widget.name
          }}</span>
          <router-link class="nav-link" to="/menu">Проекты</router-link>
        </div>
      </div>
    </div>
    <!-- Слои -->

    <div class="sidebar_AppSystem">
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <a
            class="nav-item nav-link active"
            id="nav-layers-tab"
            data-toggle="tab"
            href="#nav-layers"
            role="tab"
            aria-controls="nav-layers"
            aria-selected="true"
            >Слои</a
          >
          <a
            class="nav-item nav-link"
            id="nav-widgets-tab"
            data-toggle="tab"
            href="#nav-widgets"
            role="tab"
            aria-controls="nav-widgets"
            aria-selected="false"
            >Виджеты</a
          >
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <div
          class="tab-pane fade show active"
          id="nav-layers"
          role="tabpanel"
          aria-labelledby="nav-layers-tab"
        >
          <div class="card">
            <div class="card-body layerCard p-0 m-0">
              <LayerCard
                v-for="layer in layers"
                :key="layer.id"
                :layer="layer"
                @open="Open"
                @check="Check"
              />
            </div>
            <div class="card-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-toggle="modal"
                data-target="#exampleModal"
              >
                + Добавить слой
              </button>
            </div>
          </div>
        </div>
        <div
          class="tab-pane fade"
          id="nav-widgets"
          role="tabpanel"
          aria-labelledby="nav-widgets-tab"
        >
          <Widgets class="widgetsCard" />
        </div>
        <button @click="Download()">Запросить</button>
        <button @click="Calculated()">Вычислить</button>
      </div>
      <Catalog :layers="layers" />
    </div>
    <Custom
      :layer="selectedLayer"
      @rewriting="Rewriting"
      @cancel="Cancel"
      :style="{ visibility: displayC }"
    />
    <div class="mapBox__AppSystem">
      <div
        class="container-fluid widgets_group"
        :style="{ visibility: displayW }"
      >
        <div class="row">
          <div class="col-auto">
            <Datapicker class="m-2" @update-date="UpdateDates" />
          </div>
          <div class="col">
            <Timeline class="m-2" :dates="dates" @update-time="UpdateTime" />
          </div>
          <div class="col-auto">
            <select class="form-control m-1">
              <option>Взвешенные частицы PM2.5</option>
              <option>Температура</option>
            </select>
          </div>
        </div>
      </div>

      <Map
        :layers="calculatedLayers"
        :mapConfig="mapConfig"
        :style="{ visibility: displayM }"
      />
    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import LayerCard from "./LayerCard";
import Catalog from "./Catalog";
import Map from "./Map";
import Custom from "./Сustomization";
import Widgets from "./Widgets";
import Timeline from "./widgets/Timeline";
import Datapicker from "./widgets/Datapicker";

async function XML2JSON(e) {
  const r = e.text().then((e) => {
    const dom = new DOMParser();
    const xml = dom.parseFromString(e, "text/xml");
    const aggvalues = xml.getElementsByTagName("aggvalue");
    let result = [];
    aggvalues.forEach((element) => {
      const site = element.getAttribute("site");
      const indicator = element.getAttribute("indicator");
      const time = element
        .getAttribute("time")
        .substring(0, element.getAttribute("time").length - 3)
        .split(" ")[0];
      const value = Number(
        element.getElementsByTagName("avg")[0].innerHTML
      ).toFixed(4);
      result.push({
        site: site,
        indicator: indicator,
        time: time,
        value: value,
      });
    });
    return result;
  });

  return r;
}

export default {
  components: {
    LayerCard,
    Catalog,
    Map,
    Custom,
    Widgets,
    Timeline,
    Datapicker,
  },
  props: ["theme"],
  data() {
    return {
      time1: null,
      timeNow: "",
      layers: [],
      project: "",
      selectedLayer: "",
      loaded: false,
      displayC: "hidden",
      displayM: "visible",
      displayW: "visible",
      widgets: "",
      dates: "",
      receivedData: [],
      selectedData: [],
      selectedDate: "",
      selectedWidgets: ["Timeline", "Datapicker"],
      mapConfig: {
        center: [0, 0],
        zoom: 2,
        matrix: "EPSG:3857",
        substrate: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
      },
    };
  },
  mounted() {
    if (this.$route.query.project) {
      const takenProject = this.$route.query.project;
      const takenLayers = takenProject.layers ? takenProject.layers : [];
      this.layers = takenLayers;
      this.project = takenProject;
      this.mapConfig = takenProject.mapConfig;
    }
  },
  methods: {
    Calculated() {
      const result = [];
      const testValue = 23;
      this.layers.forEach((layer) => {
        const classes = layer.classes;
        classes.forEach((c, index) => {
          const conditions = c.conditions;
          const checkingConditions = [];
          conditions.forEach((condition) => {
            switch (condition.sign) {
              case "=":
                if (testValue == condition.value) {
                  checkingConditions.push(1);
                } else {
                  checkingConditions.push(0);
                }
                break;
              case "<":
                if (testValue < condition.value) {
                  checkingConditions.push(1);
                } else {
                  checkingConditions.push(0);
                }
                break;
              case ">":
                if (testValue > condition.value) {
                  checkingConditions.push(1);
                } else {
                  checkingConditions.push(0);
                }
                break;
              case "<=":
                if (testValue <= condition.value) {
                  checkingConditions.push(1);
                } else {
                  checkingConditions.push(0);
                }
                break;
              case ">=":
                if (testValue >= condition.value) {
                  checkingConditions.push(1);
                } else {
                  checkingConditions.push(0);
                }
                break;
            }
          });
          let checkingEnd = checkingConditions.reduce(function (a, b) {
            return a * b;
          });
          if (checkingEnd == 1) {
            result.push({
              id: layer.id,
              style: layer.classes[index],
              location: layer.location,
              visible: layer.visible,
              matrixSet: layer.matrixSet,
              type: layer.type,
            });
          }
        });
      });

      console.log(result);
      return result;
    },
    Open(id) {
      const index = this.layers.findIndex((i) => i.id == id);
      this.selectedLayer = this.layers[index];
      this.ShowsCustom();
    },
    Check(id, e) {
      const index = this.layers.findIndex((i) => i.id == id);
      this.layers[index].visible = e;
    },
    Rewriting(data, indicators) {
      this.selectedLayer.checkedIndicators = indicators;
      this.CloseCustom();
    },
    Cancel() {
      this.CloseCustom();
    },
    ShowsCustom() {
      this.displayC = "visible";
      this.displayM = "hidden";
      this.displayW = "hidden";
    },
    CloseCustom() {
      this.displayC = "hidden";
      this.displayM = "visible";
      this.displayW = "visible";
    },
    Download() {
      const key = "654hblgm9gl8367h";
      this.layers.forEach((layer) => {
        const project = layer.attributes.project;
        const site = layer.id;
        let indicators = "";
        layer.checkedIndicators.forEach((i) => {
          indicators += `${i},`;
        });
        const url = `https://gis.krasn.ru/sc/api/1.0/projects/${project}/aggvalues?&sites=${site}&key=${key}&time_begin=${this.selectedDate[0]}&time_end=${this.selectedDate[1]}&indicators=${indicators}&time_interval=1day&limit=30000`;
        const responce = fetch(url);
        responce.then((e) =>
          XML2JSON(e).then((r) => {
            this.receivedData.push(r);
          })
        );
      });
      console.log(this.receivedData);
    },
    UpdateDates(selectedDate, dataArray) {
      this.selectedDate = selectedDate;
      this.dates = dataArray;
    },
    UpdateTime(index, time) {
      this.timeNow = index;
      this.selectedData = this.receivedData.map((site) => {
        let data = site.find((obj) => obj.time == time);
        return data;
      });
      console.log(this.selectedData);
    },
    /*     AddCondition() {
      const idC = this.selectedLayer.conditions.length;
      this.c.conditions.push({
        id: idC,
        name: "new condition",
        sign: "=",
        value: "0",
        enable: false,
      });
    },
    DeleteCondition(id) {
      this.selectedLayer.conditions.splice(id, 1);
    }, */
  },
  computed: {
    calculatedLayers: function () {
      const result = [];
      try {
        this.layers.forEach((layer) => {
          const data = this.selectedData.find((o) => (o.site = layer.id));
          const testValue = data.value;
          const classes = layer.classes;
          classes.forEach((c, index) => {
            const conditions = c.conditions;
            const checkingConditions = [];
            conditions.forEach((condition) => {
              switch (condition.sign) {
                case "=":
                  if (Number(testValue) == Number(condition.value)) {
                    checkingConditions.push(1);
                  } else {
                    checkingConditions.push(0);
                  }
                  break;
                case "<":
                  if (Number(testValue) < Number(condition.value)) {
                    checkingConditions.push(1);
                  } else {
                    checkingConditions.push(0);
                  }
                  break;
                case ">":
                  if (Number(testValue) > Number(condition.value)) {
                    checkingConditions.push(1);
                  } else {
                    checkingConditions.push(0);
                  }
                  break;
                case "<=":
                  if (Number(testValue) <= Number(condition.value)) {
                    checkingConditions.push(1);
                  } else {
                    checkingConditions.push(0);
                  }
                  break;
                case ">=":
                  if (Number(testValue) >= Number(condition.value)) {
                    checkingConditions.push(1);
                  } else {
                    checkingConditions.push(0);
                  }
                  break;
              }
            });

            let checkingEnd = checkingConditions.reduce(function (a, b) {
              return a * b;
            });
            console.log(checkingEnd);
            if (checkingEnd == 1) {
              layer.classes[index].text.text = testValue;
              result.push({
                id: layer.id,
                style: layer.classes[index],
                location: layer.location,
                visible: layer.visible,
                matrixSet: layer.matrixSet,
                type: layer.type,
              });
            }
          });
        });
      } catch {
        console.log("Слоев нет");
      }
      return result;
    },
  },
};
</script>

<style scoped>
.widgets_group {
  position: absolute;
  background: rgba(100, 100, 100, 0.1);
  z-index: 1;
}

.mapBox__AppSystem {
  grid-area: mapBox;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.header__AppSystem {
  grid-area: header;
}

.sidebar_AppSystem {
  grid-area: sidebar;
}

.body__AppSystem {
  position: relative;
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: "header header" "sidebar mapBox";
  height: 100vh;
}

.layerCard {
  height: 250px;
  overflow-x: hidden;
  overflow-y: scroll;
  background: #dcdcdc;
}
.widgetsCard {
  height: 500px;
  overflow-x: hidden;
  overflow-y: scroll;
  background: #dcdcdc;
}
/* .layerCard::-webkit-scrollbar {
  width: 10px;
} */
</style>