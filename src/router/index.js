import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Layout from '@/layouts/Layout.vue'
import { render } from 'vue'

const routes = [
  {
    path: '/',
    redirect: '/login',
    name: '/'
  },
  {
    path: '/login',
    children: [{
      path: '/login',
      name: 'Login',
      component: Login
    }]
  },
  {
    path: '/musiMall',
    component: Layout,
    children: [
      {
        path: '/product',
        name: 'Product',
        component: () => import('@/views/product/product.vue')
      },
      {
        path: '/user-center',
        name: 'UserCenter',
        component: () => import('@/views/user/userCenter.vue')
      },
      {
        path: '/order',
        name: 'Order',
        component: () => import('@/views/order/order.vue')
      },
      {
        path: '/order/detail/:id',
        name: 'Order-Detail',
        component: () => import('@/views/order/components/OrderDetail.vue')
      },
      {
        path: '/cart',
        name: 'Cart',
        component: () => import('@/views/cart/cart.vue')
      }
    ]
  },

]

const router = createRouter({
  history: createWebHistory('/MusiMall-FrontEnd-User'),
  routes
})

export default router