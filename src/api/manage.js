import request from '@/utils/request'
import notification from 'ant-design-vue/es/notification'
import setting from '@/config/defaultSettings'
var qs = require('qs')

/**
 * 全局统一请求
 * @param {Object} schemaName
 * @param {Object} methodName
 * @param {Object} id
 * @param {Object} data
 */
export function executeUnify (schemaName, methodName, id, data) {
  return request({
    url: setting.url + 'executeUnify',
    method: 'post',
    data: qs.stringify({
      schemaName: schemaName,
      methodName: methodName,
      id: id,
      data: JSON.stringify(data)
    })
  })
}

/**
 * 全局统一·数据导出请求
 * @param {Object} schemaName
 * @param {Object} methodName
 * @param {Object} id
 * @param {Object} data
 */
export function exportFile (schemaName, methodName, id, data) {
  return request({
    url: setting.url + 'exportFile',
    method: 'post',
    responseType: 'blob',
    data: qs.stringify({
      schemaName: schemaName,
      methodName: methodName,
      id: id,
      data: JSON.stringify(data)
    })
  })
}

/**
 * 导出excel
 * @param {Object} res
 * @param {Object} fileName
 */
export function exportData (res, fileName) {
  if (!res) {
    return
  }
  const blob = new Blob([res], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  const url = window.URL.createObjectURL(blob)
  fileName = fileName + '.xlsx'
  if ('download' in document.createElement('a')) {
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(a.href)
    document.body.removeChild(a)
  } else {
    navigator.msSaveBlob(blob, fileName)
  }
}

/**
 * 对请求结果进行统一处理
 * @param {Object} response
 */
export function dataClean (response) {
  const success = response.result
  if (success === 'NAC') {
    this.$router.push({
      name: 'err404'
    })
  } else {
    if (success === 1 || success === '1') {
      return response.resultData
    } else {
      notification.error({
         message: '错误提示',
         description: response.resultData
      })
      return null
    }
  }
}

/**
 * 通用信息成功提示框
 * @param {Object} tips  提示信息
 */
export function success (tips) {
  notification.success({
     message: '提示',
     description: tips
  })
}
