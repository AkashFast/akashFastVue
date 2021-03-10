import antd from 'ant-design-vue/es/locale-provider/zh_CN'
import momentCN from 'moment/locale/zh-cn'

const components = {
  antLocale: antd,
  momentName: 'zh-cn',
  momentLocale: momentCN
}

const locale = {
  'message': '-',
  'menu.home': '主页',
  'menu.dashboard': '仪表盘',
  'menu.dashboard.analysis': '驾驶舱',
  'menu.dashboard.monitor': '监控页',
  'menu.dashboard.workplace': '工作台',
  'app.setting.pagestyle': '页面风格设置',
  'app.setting.pagestyle.light': '白',
  'app.setting.pagestyle.dark': '黑',
  'app.setting.pagestyle.realdark': '纯黑',
  'app.setting.themecolor': '主题色',
  'app.setting.navigationmode': '导航模式',
  'app.setting.content-width': '内容宽度',
  'app.setting.fixedheader': '固定顶部栏',
  'app.setting.fixedsidebar': '固定菜单栏',
  'app.setting.sidemenu': '侧边菜单栏',
  'app.setting.topmenu': '顶部菜单栏',
  'app.setting.content-width.fixed': '固定布局',
  'app.setting.content-width.fluid': '流式布局',
  'app.setting.othersettings': '其他设置',
  'app.setting.weakmode': '睡眠模式',
  'app.setting.copy': '保存当前风格',
  'app.setting.loading': '正在切换',
  'app.setting.copyinfo': '自定义风格保存功能开发中，敬请期待',
  'app.setting.production.hint': '自定义风格保存功能开发中，敬请期待'
}

export default {
  ...components,
  ...locale
}
