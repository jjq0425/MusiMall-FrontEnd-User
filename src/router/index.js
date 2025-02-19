import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Layout from '@/layouts/Layout.vue'

const routes = [
  {
    path: '/',
    redirect: '/login',
    name: '/'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/product',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Product',
        component: () => import('@/views/product/product.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory('/MusiMall-FrontEnd-User'),
  routes
})

export default router