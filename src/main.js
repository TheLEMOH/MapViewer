import Vue from 'vue'
import App from './App.vue'
import router from './router'
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/css/bootstrap.css";
import 'vuelayers/lib/style.css'
import { Map } from "vuelayers";
import VueLayers from 'vuelayers'

Vue.use(VueLayers);

Vue.use(Map);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
