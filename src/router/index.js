import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout'

// 导航栏路由
export const navigationRoutes = [
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/home/index'),
        name: 'Home',
        meta: { title: '排盘首页' },
      },
    ],
  },
  {
    path: '/paipan',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/paipan/index'),
        name: 'Paipan',
        meta: { title: '八字排盘' },
      },
    ],
  },
  {
    path: '/record',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/record/index'),
        name: 'Record',
        meta: { title: '记录案例' },
      },
    ],
  },
  {
    path: '/celebrity',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/celebrity/index'),
        name: 'Celebrity',
        meta: { title: '名人案例' },
      },
    ],
  },
  {
    path: '/hepan',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/hepan/index'),
        name: 'Hepan',
        meta: { title: '八字合盘' },
      },
    ],
  },
  // {
  //   path: '/wealth',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/wealth/index'),
  //       name: 'Wealth',
  //       meta: { title: '八字论财' },
  //     },
  //   ],
  // },
  {
    path: '/book',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/book/index'),
        name: 'Book',
        meta: { title: '学习课堂' },
      },
    ],
  },
  {
    path: '/vip-page',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/vip/index'),
        name: 'VipPage',
        meta: { title: '会员中心' },
      },
    ],
  }
]

const otherRoutes = [
  {
    path: '/privacy',
    component: () => import('@/views/protocol/privacy'),
    name: 'Privacy',
  },
  {
    path: '/protocol',
    component: () => import('@/views/protocol/protocol'),
    name: 'Protocol',
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    name: 'Login',
  },
  {
    path: '/hepan-result',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/hepan-result/index'),
        name: 'HepanResult',
      },
    ],
  },
  {
    path: '/paipan-result/index',
    name: 'PaipanResult',
    component: () => import('@/views/paipan-result/index'),
  },
  {
    path: '/wealth-result',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/wealth-result/index'),
        name: 'WealthResult',
      },
    ],
  },
  {
    path: '/vip-page',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/vip/index'),
        name: 'VipPage',
      },
    ],
  },
  {
    path: '/windowphone',
    component: () => import('@/views/window-phone/index'),
    name: 'WindowPhone',
  },
  {
    path: '/test',
    component: () => import('@/views/test/index'),
    name: 'Test',
  }
]

const routes = [
  ...navigationRoutes,
  ...otherRoutes,
  {
    path: '/',
    redirect: '/home/index',
  },
  // {
  //   path: '/:catchAll(.*)',
  //   redirect: '/',
  // },
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  routes,
})

export default router
