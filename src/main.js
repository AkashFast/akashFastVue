// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import VCharts from 'v-charts'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'
import { checkLogin } from '@/api/login'
import { executeUnify, dataClean, success, exportFile, exportData } from '@/api/manage'
import { FormModel, Tree, Anchor, TreeSelect, Rate } from 'ant-design-vue'
import VueClipboard from 'vue-clipboard2'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
// import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use' // use lazy load components
import './permission' // permission control
import './utils/filter' // global filter
import './global.less' // global style

Vue.config.productionTip = false
Vue.prototype.executeUnify = executeUnify
Vue.prototype.dataClean = dataClean
Vue.prototype.success = success
Vue.prototype.exportFile = exportFile
Vue.prototype.exportData = exportData
Vue.prototype.checkLogin = checkLogin

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
Vue.use(FormModel)
Vue.use(Tree)
Vue.use(Anchor)
Vue.use(TreeSelect)
Vue.use(VCharts)
Vue.use(Rate)
Vue.use(VueClipboard)
// use pro-layout components
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)

window.umi_plugin_ant_themeVar = themePluginConfig.theme

Vue.directive('title', {
  update: function (el, binding) {
    document.title = el.dataset.title
  }
})

new Vue({
  router,
  store,
  i18n,
  // init localstorage, vuex
  created: bootstrap,
  components: {
    App
  },
  render: h => h(App)
}).$mount('#app')
