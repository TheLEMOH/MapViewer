<template>
    <div class="card shadow-lg">
      <div class="card-header">
        <h5 class="text-center">Вход</h5>
        <h6 class="errors text-center">{{ errors }}</h6>
      </div>
      <div class="card-body">
        <div class="input-group mb-3">
          <span class="input-group-text">Логин</span>
          <input type="text" class="form-control" v-model="login" />
        </div>
        <div class="input-group">
          <span class="input-group-text">Пароль</span>
          <input type="password" class="form-control" v-model="password" />
        </div>
      </div>
      <div class="card-footer">
        <button class="btn btn-primary" @click="GetSession(login, password)">
          Войти
        </button>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      login: "",
      password: "",
      user: "",
      errors: "",
    };
  },
  methods: {
    async GetSession(login, password) {
      const formData = new FormData();
      formData.append("login", login);
      formData.append("password", password);
      const responce = await fetch(
        `http://gis.krasn.ru/catalog/api/2.0/session?aid=gp.web`,
        {
          method: "POST",
          body: formData,
          contentType: "multipart/form-data",
        }
      );
      const text = await responce;
      const result = JSON.parse(await text.text());
      if (result.status.code != 1) {
        this.errors = result.status.message;
      } else {
        localStorage.setItem("KCS_SID_SYSTEM", result.data.sid);
        this.$router.push("/");
      }
    },
  },
};
</script>

<style>
.errors {
  color: red;
}
</style>