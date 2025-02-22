import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Layout from '@/layouts/Layout.vue'
import { render } from 'vue'
import { Message } from '@arco-design/web-vue'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

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

router.beforeEach((to, from, next) => {
  NProgress.start()
  // 获取token
  const token = localStorage.getItem('token')
  if (to.path === '/login') {
    next()
  } else {
    if (!token) {
      Message.warning('请先登录!')
      next('/login')
    } else {
      next()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router