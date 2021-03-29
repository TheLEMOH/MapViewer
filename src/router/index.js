import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Applications from '../components/Applications.vue'
import CreatingProject from '../components/CreatingProject.vue'
import SecondPage from '../components/SecondPage.vue'

const routes = [
  { path: '/', component: Home, meta: { layout: 'second' }, props: true },
  { path: '/login', component: Login, meta: { layout: 'empty' }, },
  { path: '/second', component: SecondPage, meta: { layout: 'second' } },
  { path: '/menu', component: Applications, meta: { layout: 'systemMenu' }, props: true },
  { path: '/create', component: CreatingProject, meta: { layout: 'systemMenu' } },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
Vue.use(VueRouter)
export default router
