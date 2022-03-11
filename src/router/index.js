import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/mapChart'

  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/mapChart',
    name: 'mapChart',
    component: () => import('../views/mapChart.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
