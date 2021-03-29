<template>
  <div class="m-3">
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text">Название проекта</span>
      </div>
      <input type="text" class="form-control" v-model="name" />
    </div>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text">Описание проекта</span>
      </div>
      <textarea
        class="form-control"
        id="exampleFormControlTextarea1"
        rows="3"
      ></textarea>
    </div>
    <div class="row">
      <div class="col">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">Проекция</span>
          </div>
          <select class="form-control" v-model="matrixSelected">
            <option v-for="m in matrix" :key="m.value" v-bind:value="m.value">
              {{ m.text }}
            </option>
          </select>
        </div>
      </div>
      <div class="col">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">Подложка</span>
          </div>
          <select
            class="form-control"
            v-model="substrateSelected"
            placeholder="Required example textarea"
            :disabled="substrateCustomSelected ? true : false"
          >
            <option v-for="s in substrate" :key="s.text" :value="s.url">
              {{ s.text }}
            </option>
          </select>
        </div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">Указать свою</span>
          </div>
          <input
            class="form-control"
            v-model="substrateCustomSelected"
            placeholder="Ссылка"
          />
        </div>
      </div>
    </div>
    <button class="btn btn-primary" @click="Link('/')">Создать</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      matrixSelected: "",
      substrateSelected: "",
      substrateCustomSelected: "",
      matrix: [
        { text: "EPSG:4326", value: "EPSG:4326" },
        { text: "EPSG:3576", value: "EPSG:3576" },
        { text: "EPSG:3395", value: "EPSG:3395" },
        { text: "EPSG:3857", value: "EPSG:3857" },
      ],
      substrate: [
        {
          text: "Mapnik",
          url: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        },
        {
          text: "MapnikGray",
          url: "https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",
        },
      ],
    };
  },
  methods: {
    Link(path) {
      this.$router.push({
        path: path,
        query: {
          project: {
            name: this.name,
            layers: [],
            mapConfig: {
              center: [0, 0],
              zoom: 2,
              matrix: this.matrixSelected,
              substrate: this.substrateCustomSelected
                ? this.substrateCustomSelected
                : this.substrateSelected,
            },
          },
        },
      });
    },
  },
};
</script>

<style>
</style>



