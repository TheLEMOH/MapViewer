<template>
  <div class="row m-2">
    <div class="col-md-auto m-1" v-for="p in projects" :key="p.id">
      <div class="card" style="width: 18rem; height: 14rem">
        <div class="card-body">
          <h5 class="card-title">{{ p.name }}</h5>
          <h6 class="card-subtitle mb-2 text-muted">{{ p.author }}</h6>
          <p class="card-text">{{ p.description }}</p>
        </div>
        <div class="card-footer">
          <a class="card-link" href="#" @click="Link('/', p)">Перейти</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projects: [
        {
          id: "1",
          name: "Карта для тестирования",
          description: "Отображение нескольких постов мониторинга",
          author: "Карась Максим",
          widgets: {},
          mapConfig: {
            center: [10339114.522696082, 7554808.5259930035],
            zoom: 10,
            substrate: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
          },
          layers: [
            {
              id: "3815",
              attributes: {
                fill: "blue",
                project: "8",
                radius: 10,
                stroke: "blue",
              },
              location: [10339114.522696082, 7554808.5259930035],
              matrixSet: "EPSG:3857",
              name: "Krasnoyarsk.neboCвердловская",
              type: "VECTOR_LAYER",
              visible: true,
            },
            {
              id: "3860",
              attributes: {
                fill: "blue",
                project: "8",
                radius: 10,
                stroke: "blue",
              },
              location: [10325531.429748975, 7566494.644148807],
              matrixSet: "EPSG:3857",
              name: "Krasnoyarsk.neboБотанический",
              type: "VECTOR_LAYER",
              visible: true,
            },
            {
              id: "3831",
              attributes: {
                fill: "blue",
                project: "8",
                radius: 10,
                stroke: "blue",
              },
              location: [10325530.093915086, 7557369.107719182],
              matrixSet: "EPSG:3857",
              name: "Krasnoyarsk.neboАкадемгородок",
              type: "VECTOR_LAYER",
              visible: true,
            },
          ],
        },
        {
          id: "2",
          name: "Енисей. Речные бассейны",
          description: "Отображение речных бассейнов Красноярского края",
          author: "Бобр Петр",
          widgets: {},
        },
        {
          id: "3",
          name: "Отображение точек",
          description: "Случайные точки в векторе с полигонами",
          author: "Мангуст Эдуард",
          widgets: {},
        },
      ],
    };
  },
  methods: {
    Link(path, project) {
      this.$router.push({
        path: path,
        query: { project: project },
      });
    },
  },
};
</script>

<style>
</style>