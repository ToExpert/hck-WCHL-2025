import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';
import Create from '../views/Create.vue';
import Detail from '../views/Detail.vue'; // <-- 1. IMPORT KOMPONEN DETAIL
import Edit from '../views/Edit.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/create', name: 'Create', component: Create },

  // 2. TAMBAHKAN RUTE DINAMIS
  // :id adalah parameter dinamis
  { path: '/detail/:id', name: 'Detail', component: Detail, props: true },
   { path: '/edit/:id', name: 'Edit', component: Edit },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;