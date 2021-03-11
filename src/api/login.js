import request from '@/utils/request'
import setting from '@/config/defaultSettings'
var qs = require('qs')

export function checkLogin (email, password) {
  return request({
    url: setting.url + 'login',
    method: 'post',
    data: qs.stringify({
      email: email,
      password: password
    })
  })
}

export function login (roleId) {
  return request({
    url: setting.url + 'checkRole',
    method: 'post',
    data: qs.stringify({
      rid: roleId
    })
  })
}
