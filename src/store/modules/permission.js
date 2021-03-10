import {
  asyncRouterMap
} from '@/config/router.config'
// 从lodash中引入深拷贝
import cloneDeep from 'lodash.clonedeep'

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param roles
 * @param route
 * @returns {boolean}
 */
function hasPermission (roles, route) {
  if (route.meta) {
    for (let i = 0, len = roles.length; i < len; i++) {
      if (route.name === undefined || route.name === 'index' || route.name === roles[i]) {
        return true
      }
    }
    return false
  }
  return true
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole (roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id)
  } else {
    return true
  }
}

function filterAsyncRouter (routerMap, roles) {
   const accessedRouters = routerMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length > 0) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

function spliceNoChild (accessedRouters, i) {
  const routers = accessedRouters.filter(route => {
    if (route && route.children && route.children.length > 0) {
      if (i < 1) {
        i = i + 1
        route.children = spliceNoChild(route.children, i)
      }
      return true
    } else if (route.name === 'err404') {
      return true
    }
    return false
  })
  return routers
}

const permission = {
  state: {
    addRouters: [],
    change: false
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
    },
    SET_CHANGE: (state) => {
      state.change = !state.change
    }
  },
  actions: {
    setChange ({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_CHANGE')
        resolve()
      })
    },
    GenerateRoutes ({
      commit
    }, data) {
      return new Promise(resolve => {
        var roles = data.roles === undefined ? data : data.roles
        const routerMap = cloneDeep(asyncRouterMap)
        var err = {
          path: '*',
          redirect: '/404',
          hidden: true,
          name: 'err404'
        }
        routerMap.push(err)
        const accessedRouters = filterAsyncRouter(routerMap, roles)
        commit('SET_ROUTERS', spliceNoChild(accessedRouters, 0))
        commit('SET_CHANGE')
        resolve(accessedRouters)
      })
    }
  }
}

export default permission
