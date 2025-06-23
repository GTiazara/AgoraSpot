import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '@/views/HomePage.vue'
import Policy from '@/views/Policy.vue'


const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   redirect: '/home'
  // },
  {
    path: '',
    component: HomePage
  },

  {
    path: '/:optionParam?',
    name: 'HomeWithParam',
    component: HomePage
  },

  {
    path: '/policy',
    name: 'Policy',
    component: Policy
  }


]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
