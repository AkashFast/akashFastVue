import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'
import setting from '@/config/defaultSettings'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const allowList = ['login'] // no redirect allowList
const loginRoutePath = '/user/login'
const defaultRoutePath = '/sys_akash/user'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`))
  if (setting.accessLogin) {
    /* has token */
    if (storage.get(ACCESS_TOKEN)) {
      if (to.path === loginRoutePath) {
        next({
          path: defaultRoutePath
        })
        NProgress.done()
      } else if (to.path === '/user/checkRole') {
        next()
        NProgress.done()
      } else if (allowList.includes(to.name)) {
        // 在免登录名单，直接进入
        next()
      } else {
        // check login user.roles is null
        if (store.getters.roles.length === 0) {
          // request login userInfo
          store
            .dispatch('GetInfo')
            .then(res => {
              const roles = res.menu
              // generate dynamic router
              store.dispatch('GenerateRoutes', { roles }, router).then(() => {
                // 根据roles权限生成可访问的路由表
                // 动态添加可访问路由表
                router.addRoutes(store.getters.addRouters)
                // 请求带有 redirect 重定向时，登录自动重定向到该地址
                const redirect = decodeURIComponent(from.query.redirect || to.path)
                if (to.path === redirect) {
                  // set the replace: true so the navigation will not leave a history record
                  next({ ...to, replace: true })
                } else {
                  // 跳转到目的路由
                  next({ path: redirect })
                }
              })
            })
            .catch((err) => {
              notification.error({
                message: '错误',
                description: err.loginTips
              })
              // 当前用户存在
              if (err.roleList) {
                // 如果是多权限
                if (err.roleList.length > 0) {
                  router.push('user/checkRole')
                  NProgress.done()
                } else {
                  // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
                  store.dispatch('Logout').then(() => {
                     notification.error({
                       message: '错误',
                       description: '登陆失败「暂未获得授权信息」'
                     })
                     setTimeout(() => {
                        router.push({ path: '/user/login' })
                        NProgress.done()
                     }, 3000)
                  })
                }
              } else {
                 store.dispatch('Logout').then(() => {
                    notification.error({
                      message: '错误',
                      description: '登陆失败「暂未获得授权信息」'
                    })
                    router.push({ path: '/user/login' })
                    NProgress.done()
                 })
              }
            })
        } else {
          // 检测路由变化状态
          if (store.getters.change) {
            // 检测到路由「权限」发生变化
            router.addRoutes(store.getters.addRouters)
            store
              .dispatch('setChange')
              .then(res => {
              })
            next(to.path)
          } else {
            next()
          }
        }
      }
    } else {
      if (allowList.includes(to.name)) {
        // 在免登录名单，直接进入
        next()
      } else {
          store
            .dispatch('LoginAccess')
            .then(res => {
              router.push('user/checkRole')
            })
            .catch(() => {
             next({
               path: loginRoutePath,
               query: {
                 redirect: to.fullPath
               }
             })
            })
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
      }
    }
  } else {
     next()
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
