<template>
  <component :is="layout"></component>
</template>

<script>
import empty from "./layouts/empty";
import systemMenu from "./layouts/systemMenu";
import second from "./layouts/second";
export default {
  computed: {
    layout() {
      return this.$route.meta.layout;
    },
  },
  mounted() {
    this.CheckSid(this.$router);
  },
  methods: {
    CheckSid: async () => {
      /*   const sid = local.getItem("KCS_SID_SYSTEM");
      const currentPath = e.history.current.path;
      if (!sid && currentPath != "/login") {
        e.push("/login");
      }
      const responce = await fetch(
        `http://gis.krasn.ru/catalog/api/2.0/session?sid=${sid}&aid=gp.web`,
        {
          sid: sid,
        }
      );
      const result = JSON.parse(await responce.text());
      if (result.status.code != 1 && currentPath != "/login") {
        e.push("/login");
      } */
    },
  },
  components: {
    empty,
    systemMenu,
    second,
  },
};
</script>
<style>
.full {
  height: 100vh;
}
</style>
