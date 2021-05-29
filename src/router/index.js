import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import NotFound404 from '../views/NotFound404.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  { path: '*', component: NotFound404 },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
