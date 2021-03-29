<template>
  <div class="form-group">
   <!--  <h6>Таймлайн</h6> -->
    <input
      type="range"
      class="form-control-range"
      id="formControlRange"
      list="tickmarks"
      v-model="selectedIndex"
      :min="min"
      :max="max"
      step="1"
      value="0"
      @change="UpdateTime"
    />
  </div>
</template>

<script>
export default {
  props: ["dates"],
  data() {
    return { selectedIndex: 0 };
  },
  computed: {
    min: function () {
      return 0;
    },
    max: function () {
      return this.dates.length - 1;
    },
    selectedTime: function () {
      return this.dates[this.selectedIndex];
    },
  },
  methods: {
    UpdateTime() {
      this.$emit("update-time", this.selectedIndex, this.selectedTime);
    },
  },
};
</script>

<style>
</style>