import storage from 'store'
import { login } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { executeUnify, dataClean } from '@/api/manage'
import { getCookie } from '@/api/cookie'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登陆
    LoginAccess ({ commit }) {
      return new Promise((resolve, reject) => {
         if (getCookie('mt')) {
           storage.set(ACCESS_TOKEN, getCookie('mt'), 7 * 24 * 60 * 60 * 1000)
           commit('SET_TOKEN', getCookie('mt'))
           resolve()
         } else {
           var err = {}
           reject(err)
         }
      })
    },
    // 登录验证
    Login ({ commit }, roleId) {
      return new Promise((resolve, reject) => {
        login(roleId).then(response => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        executeUnify('accessLogin', 'accessLogin', '', {}).then(res => {
          var resData = dataClean(res)
          if (resData !== null) {
            if (resData.isLogin) {
              var roles = resData.menu
              commit('SET_ROLES', roles)
              commit('SET_INFO', resData.role)
              commit('SET_NAME', { name: resData.uname, welcome: welcome() })
              // commit('SET_AVATAR', result.avatar)
              resolve(resData)
            } else {
              // 登陆失败状态，多权限选择界面
              reject(resData)
            }
          }
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        storage.remove(ACCESS_TOKEN)
        resolve()
      })
    }

  }
}

export default user
