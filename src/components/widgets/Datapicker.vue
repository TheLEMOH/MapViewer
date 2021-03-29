<template>
  <div>
   <!--  <h6>Календарь</h6> -->
    <date-picker
      range
      v-model="selectedData"
      valueType="format"
      style="width: 250px"
      @change="UpdateDates"
    ></date-picker>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
export default {
  data() {
    return {
      selectedData: "",
    };
  },
  components: {
    DatePicker,
  },
  computed: {
    dataArray: function () {
      const result = [];
      if (this.selectedData) {
        const day1 = this.selectedData[0];
        const day2 = this.selectedData[1];
        const startDay = new Date(
          day1.split("-")[0],
          day1.split("-")[1]-1,
          day1.split("-")[2],
          0,
          0,
          0
        );
        const endDay = new Date(
          day2.split("-")[0],
          day2.split("-")[1]-1,
          day2.split("-")[2],
          0,
          0,
          0
        );
        while (startDay.getTime() <= endDay.getTime()) {
          result.push(this.formatDate(startDay));
          startDay.setDate(startDay.getDate() + 1);
        }
      }
      return result;
    },
  },
  methods: {
    UpdateDates() {
      this.$emit("update-date", this.selectedData, this.dataArray);
    },
    formatDate(date) {
      var dd = date.getDate();
      if (dd < 10) dd = "0" + dd;

      var mm = date.getMonth() + 1;
      if (mm < 10) mm = "0" + mm;

      var yy = date.getFullYear();
      if (yy < 10) yy = "0" + yy;

      return yy + "-" + mm + "-" + dd;
    },
  },
};
</script>

<style>
</style>