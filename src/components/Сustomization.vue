<template>
  <div class="card">
    <div class="card-header">
      <div class="btn-group">
        Настройки
        {{ layer.name }}
      </div>
    </div>
    <div class="card-body customization__AppSystem">
      <div class="row">
        <div class="classes_customization col-sm-2">
          <div class="form-inline">
            <h5 class="mr-2">Классы</h5>
            <button
              type="button"
              class="btn badge badge-success badge-pill"
              @click="AddClass"
            >
              +
            </button>
          </div>
          <ul class="list-group mt-2">
            <li
              v-for="(test, index) in layer.classes"
              :key="index"
              class="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
              @click="ShowClass(test.id)"
            >
              <label>{{ test.name }}</label>
              <button class="btn badge badge-danger badge-pill">-</button>
            </li>
          </ul>
        </div>
        <div class="classes_customization col-4">
          <div v-if="displayC">
            <Class :c="selectedClass" :checkedIndicators="checkedIndicators" />
          </div>
        </div>
        <div class="classes_customization col-auto">
          <h5>Используемые данные</h5>
          <div
            class="form-check"
            v-for="indicator in layer.indicators"
            :key="indicator.id"
          >
            <input
              class="form-check-input"
              type="checkbox"
              :id="indicator.name"
              :value="indicator.id"
              name="indicators"
              v-model="checkedIndicators"
            />
            <label class="link_indicator" :for="indicator.name">{{
              indicator.name
            }}</label>
          </div>
        </div>
        <div class="col-auto">
          <div class="form">
            <h5 class="mr-2">Действия</h5>
            <!--  <button
              type="button"
              class="btn btn-success btn-sm"
              @click="AddAct"
            >
              +
            </button> -->
          </div>
          <div class="form-group mt-2">
            <div class="form-row">
              <div class="form-group col-auto">
                <label class="mr-2">Действие</label>
                <select class="form-control mr-2">
                  <option value="none">Бездействие</option>
                  <option value="hover">Наведение</option>
                  <option value="click">Нажатие</option>
                </select>
              </div>
              <div class="form-group col-auto">
                <label class="mr-2">Информация</label>
                <select class="form-control">
                  <option value="name">Имя</option>
                  <option value="location">Расположение</option>
                  <option value="click">Данные</option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-auto">
              <label class="mr-2">Вид вывода</label>
              <select class="form-control">
                <option value="text">Текст (Без обработки)</option>
                <option value="plain">График</option>
                <option value="pattern">Шаблон (Геопортал)</option>
                <option value="pattern">Шаблон (Пользовательский)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer" style="z-index: 3">
      <button type="button" class="btn btn-success mr-2" @click="Send">
        Сохранить
      </button>
      <button type="button" class="btn btn-secondary" @click="Cancel">
        Отменить
      </button>
    </div>
  </div>
</template>

<script>
import Class from "./Classes.vue";
export default {
  components: { Class },
  props: ["layer"],
  data() {
    return {
      checkedIndicators: [],
      displayD: true,
      displayC: false,
      selectedClass: {
        name: "New Class",
        id: 0,
        conditions: [
          {
            id: 0,
            name: "new condition",
            sign: "=",
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
          font: "0",
          color: "#000000",
          enable: false,
        },
      },
    };
  },
  methods: {
    Send() {
      let inputs = document.querySelectorAll('input[name="custom"]');
      const result = {};
      inputs.forEach((e) => {
        result[e.attributes.controlled.value] = Number(e.value)
          ? Number(e.value)
          : e.value;
      });
      this.$emit("rewriting", result, this.checkedIndicators);
    },
    Cancel() {
      this.$emit("cancel");
    },
    CloseClass() {
      this.displayD = true;
      this.displayC = false;
    },
    ShowClass(id) {
      const index = this.layer.classes.findIndex((i) => i.id == id);
      this.selectedClass = this.layer.classes[index];
      this.displayD = false;
      this.displayC = true;
    },
    AddClass() {
      const id = this.layer.classes.length;
      /*   */
      this.layer.classes.push({
        name: "New Class",
        id: id,
        conditions: [
          {
            id: 0,
            name: "new condition",
            sign: "=",
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
          font: "0",
          color: "#000000",
          enable: false,
        },
      });
    },
    AddAct() {},
  },
};
</script>

<style>
.customization__AppSystem {
  overflow-x: hidden;
  overflow-y: scroll;
  height: 350px;
  z-index: 2;
}
.classes_customization {
  border-right: 1px solid rgb(200, 200, 200);
}
.link_indicator:hover {
  color: #005cc8;
}
.link_indicator {
  padding: 0px;
  margin: 0px;
}
</style>


