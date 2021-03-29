<template>
  <div class="card p-0 m-1">
    <div class="card-body p-0 m-0">
      <input
        type="checkbox"
        v-model="checked"
        @click="Check(layer.id, checked)"
      />
      <span>{{ layer.name }}</span>
      <p class="p-0 m-0" @click="Open(layer.id)">Настройки</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["layer"],
  data() {
    return {
      checked: true,
    };
  },
  methods: {
    Open(id, mode) {
      this.$emit("open", id, mode);
    },
    Check(id, e) {
      this.$emit("check", id, !e);
    },
  },
};
</script>

<style scoped>
.icon {
  width: 15px;
  height: 15px;
}
.card-body {
  height: 50px;
}
</style>