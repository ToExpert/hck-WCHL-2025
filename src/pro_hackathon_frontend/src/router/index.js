import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';
import Create from '../views/Create.vue';
import Detail from '../views/Detail.vue';
import Edit from '../views/Edit.vue';
import Masuk from '../views/Masuk.vue';
import Daftar from '../views/Daftar.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/create', name: 'Create', component: Create },
  { path: '/detail/:id', name: 'Detail', component: Detail },
  { path: '/edit/:id', name: 'Edit', component: Edit },
  { path: '/login', name: 'Masuk', component: Masuk },
  { path: '/register', name: 'Daftar', component: Daftar },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;