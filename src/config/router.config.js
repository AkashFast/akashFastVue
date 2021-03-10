// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/business/has-Teacher',
    children: [
      // 系统管理
      {
        path: '/sys_akash',
        redirect: '/sys_akash/user',
        component: RouteView,
        meta: {
          title: '系统管理',
          icon: 'setting',
          permission: ['form']
        },
       children: [
         {
           path: '/dashboard/analysis/:pageNo([1-9]\\d*)?',
           name: 'Analysis',
           component: () => import('@/views/dashboard/Analysis'),
           meta: {
             title: '驾驶舱',
             keepAlive: false,
             permission: [ 'dashboard' ]
           }
         },
         {
           path: '/sys_akash/menu',
           name: 'Menu',
           component: () => import('@/views/system/menu/menu'),
           meta: {
             title: '菜单管理',
             keepAlive: true,
             permission: ['form']
           }
         },
         {
         path: '/sys_akash/campus',
         name: 'Campus',
         component: () => import('@/views/system/role/role'),
         meta: {
           title: '权限管理',
           keepAlive: true,
           permission: ['form']
         }
        },
        {
         path: '/sys_akash/user',
         name: 'User',
         component: () => import('@/views/system/user/user'),
         meta: {
           title: '用户管理',
           keepAlive: true,
           permission: ['form']
         }
       },
       {
          path: '/sys_akash/log',
          name: 'Log',
          component: () => import('@/views/system/log/log'),
          meta: {
            title: '日志管理',
            keepAlive: true,
            permission: ['form']
          }
        }
       ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    name: 'err404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      },
      {
       path: 'checkRole',
       name: 'checkRole',
       component: () => import('@/views/system/login/Login'),
       meta: {
         title: '选择角色',
         keepAlive: true,
         permission: ['form']
       }
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
