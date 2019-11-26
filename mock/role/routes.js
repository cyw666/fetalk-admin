// Just a mock data

export const constantRoutes = [
  {
    path: '/redirect',
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
      },
    ],
  },
  {
    path: '/login',
    hidden: true,
  },

  {
    path: '/404',
    hidden: true,
  },

  {
    path: '/',
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard' },
      },
    ],
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
]
export const asyncRoutes = [
  {
    path: '/permission',
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'], // you can set roles in root nav
    },
    children: [
      {
        path: 'role',
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin'],
        },
      },
    ],
  },
  {
    path: '/users',
    children: [
      {
        path: 'users-list',
        name: 'UsersList',
        meta: { title: '用户列表', icon: 'user' },
      },
    ],
  },
  {
    path: '/user-setting',
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
        meta: { title: '修改密码', icon: 'password' },
      },
    ],
  },
  {
    path: '/introduction',
    children: [
      {
        path: 'index',
        name: 'Introduction',
        meta: { title: '公司简介', icon: 'dashboard' },
      },
    ],
  },
  // {
  //   path: 'external-link',
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' },
  //     },
  //   ],
  // },
]
