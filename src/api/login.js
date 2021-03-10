import request from '@/utils/request'
import setting from '@/config/defaultSettings'
var qs = require('qs')

export function login (roleId) {
  return request({
    url: setting.url + 'checkRole',
    method: 'post',
    data: qs.stringify({
      rid: roleId
    })
  })
}
