<template>
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
              <a
                class="nav-link active"
                id="catalog-tab"
                data-toggle="tab"
                href="#catalog"
                role="tab"
                aria-controls="catalog"
                aria-selected="true"
                >Управление данными</a
              >
            </li>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link"
                id="monitoring-tab"
                data-toggle="tab"
                href="#monitoring"
                role="tab"
                aria-controls="monitoring"
                aria-selected="false"
                >Оперативный мониторинг</a
              >
            </li>
          </ul>
        </div>
        <div class="modal-body">
          <div class="container-fluid viewer">
            <div class="tab-content" id="myTabContent">
              <div
                class="tab-pane fade show active"
                id="catalog"
                role="tabpanel"
                aria-labelledby="catalog-tab"
              >
                <v-jstree
                  :data="data"
                  multiple
                  show-checkbox
                  whole-row
                  @item-click="itemClick"
                ></v-jstree>
              </div>
              <div
                class="tab-pane fade"
                id="monitoring"
                role="tabpanel"
                aria-labelledby="monitoring-tab"
              >
                <v-jstree
                  :data="dataProject"
                  multiple
                  show-checkbox
                  whole-row
                  @item-click="itemClick"
                ></v-jstree>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VJstree from "vue-jstree";
import proj4 from "proj4";

proj4.defs("EPSG:3857");
proj4.defs("EPSG:4326");

const key = localStorage.getItem("KCS_SID_SYSTEM");

async function Query(url) {
  const responce = await fetch(url, {
    method: "GET",
  });
  const text = await responce.text();
  const result = JSON.parse(text);
  if (result.status.code === -1) {
    console.log(result.status);
    return 0;
  } else {
    return result.data;
  }
}
/* 
async function RequestParent() {
  const url =
    "http://gis.krasn.ru/catalog/api/2.0/objects/root/children?sid=" +
    key +
    "&aid=gp.web";
  const data = await Query(url);
  return data;
} */

async function QueryXML(url, mode) {
  const responce = await fetch(url);
  const text = await responce.text();
  const result = [];
  const dom = new DOMParser();
  const xml = dom.parseFromString(text, "text/xml");
  if (mode == "project") {
    const data = xml.getElementsByTagName("project");
    data.forEach((data) => {
      result.push({ id: data.id, name: data.textContent, mode: mode });
    });
  }
  if (mode == "site") {
    const data = xml.getElementsByTagName("site");
    const project = xml.getElementsByTagName("project")[0].id;
    data.forEach((data) => {
      const children = data.children;
      const location = proj4("EPSG:4326", "EPSG:3857", [
        Number(children[1].getAttribute("x")),
        Number(children[1].getAttribute("y")),
      ]);
      result.push({
        id: data.id,
        name: data.textContent,
        location: location,
        attributes: {
          project: project,
          radius: 10,
          fill: "blue",
          stroke: "blue",
        },
        mode: mode,
      });
    });
  }
  return result;
}

async function RequestIndicators(project) {
  const url = `https://gis.krasn.ru/sc/api/1.0/projects/${project}?key=654hblgm9gl8367h`;
  const data = await QueryXMLIndicators(url);
  return data;
}

async function QueryXMLIndicators(url) {
  const responce = await fetch(url);
  const text = await responce.text();
  const dom = new DOMParser();
  const xml = dom.parseFromString(text, "text/xml");
  const result = [];
  const data = xml.getElementsByTagName("indicator");
  data.forEach((data) => {
    result.push({
      id: data.id,
      name: data.getElementsByTagName("name")[0].innerHTML,
      units: data.getElementsByTagName("units")[0].innerHTML,
    });
  });

  return result;
}

async function RequestCatalogs() {
  const url = "https://gis.krasn.ru/sc/api/1.0/projects?key=654hblgm9gl8367h";
  const data = await QueryXML(url, "project");
  return data;
}

async function RequestChild(node) {
  let data = "";
  if (node.model.type != "project") {
    const url =
      "http://gis.krasn.ru/catalog/api/2.0/objects/" +
      node.model.id +
      "/children?sid=" +
      key +
      "&aid=gp.web";
    data = await Query(url);
  } else {
    const url = `https://gis.krasn.ru/sc/api/1.0/projects/${node.model.id}/sites?key=654hblgm9gl8367h`;
    data = await QueryXML(url, "site");
  }
  return data;
}

async function GenerateDataForCatalog(data) {
  let result = [];
  data.forEach((element) => {
    if (element.mode == "project") {
      result.push({
        text: element.name,
        id: element.id,
        type: element.mode,
        attributes: element.attributes ? element.attributes : "none",
        opened: false,
        selected: false,
        loaded: false,
        children: [{}],
      });
    }
    if (element.mode == "site") {
      result.push({
        text: element.name,
        test: element.name,
        id: element.id,
        type: element.mode,
        location: element.location,
        attributes: element.attributes ? element.attributes : "none",
        classes: [
          {
            name: "Новый класс",
            id: 0,
            conditions: [
              {
                id: 0,
                name: "new condition",
                sign: ">=",
                value: "0",
                enable: false,
              },
            ],
            properties: {
              radius: "10",
            },
            fill: {
              color: "#000000",
            },
            stroke: {
              color: "#000000",
              width: 1,
            },
            text: {
              font: "12px",
              width: "1",
              color: "#000000",
              text: "",
              enable: false,
            },
          },
        ],
        action: [
          {
            name: "New action",
            type: "none",
            object: "none",
          },
        ],
        opened: false,
        selected: false,
        loaded: false,
        children: "",
      });
    }
    if (!element.mode) {
      result.push({
        text: element.name,
        id: element.id,
        type: element.type,
        attributes: element.attributes ? element.attributes : "none",
        opened: false,
        selected: false,
        loaded: false,
        children: element.type.indexOf("folder") != -1 ? [{}] : "",
      });
    }
  });
  return result;
}

async function getMeta(node) {
  const url =
    "http://gis.krasn.ru/catalog/api/2.0/resources/" +
    node.model.id +
    "?sid=" +
    key +
    "&aid=gp.web";
  const data = await Query(url);
  console.log(data);
  return data;
}

function getStyle(data) {
  const style = data;
  return JSON.parse(style);
}

export default {
  components: { VJstree },
  props: ["layers"],
  data() {
    return {
      data: [],
      dataProject: [],
    };
  },
  mounted() {
    /* RequestParent().then((e) => {
      GenerateDataForCatalog(e).then((e) => {
        this.data = e;
      });
    }); */
    RequestCatalogs().then((e) => {
      GenerateDataForCatalog(e).then((e) => {
        this.dataProject = e;
      });
    });
  },
  methods: {
    itemClick(node) {
      if (
        node.model.type.indexOf("folder") != -1 ||
        node.model.type.indexOf("project") != -1
      ) {
        node.model.opened = true;
        node.model.selected = false;
        if (node.model.loaded == false) {
          RequestChild(node).then((e) => {
            GenerateDataForCatalog(e).then((e) => {
              node.model.loaded = true;
              node.model.children = e;
            });
          });
        }
      } else {
        let nodeIndex = this.layers.findIndex((e) => e.id == node.model.id);
        if (nodeIndex != -1) {
          this.layers.splice(nodeIndex, 1);
        } else {
          if (node.model.type != "site") {
            getMeta(node).then((meta) => {
              const style = getStyle(meta.style);
              console.log(style);
              this.layers.push({
                id: node.model.id,
                name: node.model.text,
                type: "CUSTOM_LAYER",
                url:
                  "http://gis.krasn.ru/mserver/ogc.php?id=" +
                  node.model.id +
                  "&key=aklwsrms8qw1dd8v&LAYERS=region_project&VERSION=1.1.1",
                params: {
                  LAYERS: "region_project",
                  VERSION: "1.1.1",
                },
                crossOrigin: "anonymous",
                matrixSet: "EPSG:3857",
                attributes: { text: "Здесь пока ничего нет" },
                style: style,
                visible: true,
              });
            });
          } else {
            RequestIndicators(node.model.attributes.project).then(
              (indicators) => {
                this.layers.push({
                  id: node.model.id,
                  name: node.model.text,
                  test: node.model.test,
                  type: "VECTOR_LAYER",
                  matrixSet: "EPSG:3857",
                  attributes: node.model.attributes,
                  classes: node.model.classes,
                  location: node.model.location,
                  visible: true,
                  indicators: indicators,
                  checkedIndicators: [],
                });
              }
            );
          }
        }
      }
    },
  },
};
</script>

<style>
.viewer {
  height: 50vh;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>