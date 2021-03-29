<template>
  <div class="classes_appSystem">
    <div class="name_class">
      <input type="text" class="form-control-plaintext" v-model="c.name" />
    </div>
    <form class="condition_class">
      <label class="mr-1">Условия</label>
      <button
        type="button"
        class="btn badge badge-success badge-pill"
        @click="AddCondition"
      >
        +
      </button>
      <div
        v-for="condition in c.conditions"
        :key="condition.id"
        class="form-row"
      >
        <div class="form-group col-3">
          <select class="form-control">
            <option v-for="indicator in checkedIndicators" :key="indicator">
              {{ indicator }}
            </option>
          </select>
        </div>
        <div class="form-group col-6">
          <select class="form-control" v-model="condition.sign">
            <option value="=">Равно</option>
            <option value="<">Меньше</option>
            <option value=">">Больше</option>
            <option value="<=">Меньше или равно</option>
            <option value=">=">Больше или равно</option>
          </select>
        </div>
        <div class="form-group col-2">
          <input type="text" class="form-control" v-model="condition.value" />
        </div>
        <div class="form-group col">
          <button
            type="button"
            class="btn badge badge-danger badge-pill"
            @click="DeleteCondition(condition.id)"
          >
            -
          </button>
        </div>
        <!-- <div class="form-group col-3" v-if="c.conditions.length % 2 == 0">
          <select class="form-control">
            <option>И</option>
            <option>ИЛИ</option>
          </select>
        </div> -->
      </div>
    </form>
    <form class="style_class">
      <div class="form-row">
        <div class="form-group col">
          <label>Заливка</label>
          <input type="color" class="form-control" v-model="c.fill.color" />
        </div>
        <div class="form-group col">
          <label>Радиус</label>
          <input
            type="text"
            class="form-control"
            v-model="c.properties.radius"
          />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col">
          <label>Обводка</label>
          <input type="Color" class="form-control" v-model="c.stroke.color" />
        </div>
        <div class="form-group col">
          <label>Ширина</label>
          <input type="text" class="form-control" v-model="c.stroke.width" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col">
          <label for="inputCity">Размер</label>
          <input type="text" class="form-control" v-model="c.text.font" />
        </div>
        <div class="form-group col">
          <label for="inputState">Обводка</label>
          <input type="text" class="form-control" v-model="c.text.width" />
        </div>
        <div class="form-group col">
          <label for="inputState">Цвет</label>
          <input type="color" class="form-control" v-model="c.text.color" />
        </div>
        <div class="form-check">
          <label for="textEnableButton">Включить</label>
          <input type="checkbox" class="form-control" v-model="c.text.enable" />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: ["c", "checkedIndicators"],
  methods: {
    AddCondition() {
      const idC = this.c.conditions.length;
      this.c.conditions.push({
        id: idC,
        name: "new condition",
        sign: "=",
        value: "0",
        enable: false,
      });
    },
    DeleteCondition(id) {
      const index = this.c.conditions.findIndex((e) => e.id == id);
      this.c.conditions.splice(index, 1);
    },
  },
};
</script>

<style>
</style>