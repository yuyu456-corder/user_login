import Vue from 'vue'
import VueRouter from 'vue-router'
import Frontend from '../views/Frontend.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Frontend',
    component: Frontend
  },
  {
    path: '/AdministratorPage',
    name: 'AdministratorPage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AdministratorPage.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/update',
    name: 'update',
    component: () => import(/* webpackChunkName: "about" */ '../views/Update.vue')
  },
  {
    path: '/myPage/:id',
    name: 'myPage',
    component: () => import(/* webpackChunkName: "about" */ '../views/MyPage.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
