import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/users-list/index'),
        meta: { title: '首页', icon: 'dashboard' },
      },
    ],
  },
]
export const asyncRoutes = [
  {
    path: '/users',
    component: Layout,
    children: [
      {
        path: 'users-list',
        name: 'UsersList',
        component: () => import('@/views/users-list/index'),
        meta: { title: '用户列表', icon: 'user' },
      },
    ],
  },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: 'Permission',
  //     icon: 'lock',
  //   },
  //   children: [
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'Role Permission',
  //         icon: 'lock',
  //       },
  //     },
  //   ],
  // },
  {
    path: '/user-setting',
    component: Layout,
    redirect: '/user-setting/change-password',
    name: 'UserSetting',
    meta: {
      title: '用户设置',
      icon: 'el-icon-setting',
    },
    hidden: true,
    children: [
      {
        path: 'change-password',
        name: 'ChangePassword',
        component: () => import('@/views/change-password/index'),
        meta: { title: '修改密码', icon: 'password' },
      },
    ],
  },
  {
    path: '/shops',
    component: Layout,
    redirect: '/shops/shop-categories',
    alwaysShow: true, // will always show the root menu
    meta: { title: '商铺管理', icon: 'shangpu' },
    children: [
      {
        path: 'shop-categories',
        name: 'ShopCategories',
        component: () => import('@/views/shops/shop-categories/index'),
        meta: { title: '商铺分类' },
      },
      {
        path: 'shop-list',
        name: 'ShopList',
        component: () => import('@/views/shops/shop-list/index'),
        meta: { title: '商铺列表' },
      },
    ],
  },
  {
    path: '/introduction',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Introduction',
        component: () => import('@/views/introduction/index'),
        meta: { title: '公司简介', icon: 'dashboard' },
      },
    ],
  },
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' },
  //     },
  //   ],
  // },
  {
    path: '/main-swiper',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'MainSwiper',
        component: () => import('@/views/main-swiper/index'),
        meta: { title: '轮播图', icon: 'lunboxiaoguo' },
      },
    ],
  },
  {
    path: '/admin',
    component: Layout,
    meta: {
      roles: ['ROOT'],
    },
    children: [
      {
        path: 'admin-accounts',
        name: 'AdminAccounts',
        component: () => import('@/views/admin-accounts/index'),
        meta: { title: '管理员列表', icon: 'guanliyuan' },
      },
    ],
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
]
const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
