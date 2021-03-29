<template>
  <div class="container-fluid p-1 m-0" style="background: #dcdcdc">
    <div class="card p-0 m-1" v-for="widget in widgets" :key="widget.type">
      <div class="card-body p-0 m-0">
        <input
          type="checkbox"
          :id="widget.type + 'Input'"
          :value="widget.id"
          v-model="checked"
        />
        <label :for="widget.type + 'Input'">{{ widget.name }}</label>
        <div>{{ widget.text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      widgets: [
        {
          id: 0,
          type: "timeline",
          name: "Таймлайн",
          text: "Добавляет линию времени",
        },
        {
          id: 1,
          type: "calendar",
          name: "Календарь",
          text: "Добавляет календарь",
        },
        {
          id: 2,
          type: "scale-line",
          name: "Линейка",
          text: "Добавляет масштабную линейку",
        },
        {
          id: 3,
          type: "attributes",
          name: "Таблица атрибутов",
          text: "Добавляет таблицу атрибутов",
        },
        {
          id: 4,
          type: "manager",
          name: "Менеджер данных",
          text: "Позволяет менять данные, отображаемые на карте",
        },
      ],
      checked: [],
    };
  },
};
</script>

<style scoped>
.p {
  margin-bottom: 0px !important;
  padding: 0px !important;
  line-height: 0.3;
}
</style>
