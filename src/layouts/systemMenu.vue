<template>
  <div class="container-fluid p-0 m-0 menu__AppSystem">
    <nav class="navbar navbar-light bg-light header__AppSystem">
      <a class="navbar-brand" href="#">Управление контентом</a>
    </nav>
    <div class="row p-0 m-0 full__AppSystem">
      <div class="col-2 sidebar__AppSystem">
        <router-link class="nav-link" to="/menu">Проекты</router-link>
        <router-link class="nav-link" to="/create">Создать новый проект</router-link>
      </div>
      <div class="col content__AppSystem"><router-view /></div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    Link(e) {
      this.$router.push(e);
    },
  },
};
</script>

<style>
.menu__AppSystem {
  height: 100vh;
}
.full__AppSystem {
}
.header__AppSystem {
  box-shadow: 5px 2px 2px rgba(0, 0, 0, 0.3);
  z-index: 10;
}
.sidebar__AppSystem {
  background: white;
  z-index: 9;
}
.content__AppSystem {
  background: white;
}
</style>