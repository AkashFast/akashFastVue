<h1 align="center">Fast Akash - Ant Design Vue Pro</h1>

<div align="center">
基于Ant Design Vue Pro,并契合<a href="https://github.com/AkashFast/fastAkash" target="_blank">「Fast Akash Java Web」</a>的前端开发脚手架.</a>
</div>

<br/> 
<br/> 
<br/>
 
- 首页: 搭建中
- Ant Design组件文档:  [Ant Design Pro组件文档](https://www.antdv.com/docs/vue/introduce-cn/) 

Overview
----

基于[Ant Design Pro](https://pro.ant.design/) 实现的 [Fast Akash - Ant Design Pro](https://) 

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210311162030107.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzI3MDQ3MjE1,size_16,color_FFFFFF,t_70#pic_center)


环境和依赖
----

- node
- yarn
- webpack
- eslint
- @vue/cli ~3
- [ant-design-vue](https://github.com/vueComponent/ant-design-vue) - Ant Design Of Vue 实现
- [vue-cropper](https://github.com/xyxiao001/vue-cropper) - 头像裁剪组件
- [@antv/g2](https://antv.alipay.com/zh-cn/index.html) - Alipay AntV 数据可视化图表
- [Viser-vue](https://viserjs.github.io/docs.html#/viser/guide/installation)  - antv/g2 封装实现

> 请注意，我们强烈建议本项目使用 [Yarn](https://yarnpkg.com/) 包管理工具，这样可以与本项目演示站所加载完全相同的依赖版本 (yarn.lock) 。由于我们没有对依赖进行强制的版本控制，采用非 yarn 包管理进行引入时，可能由于 Pro 所依赖的库已经升级版本而引入了新版本所导致的问题。作者可能会由于时间问题无法及时排查而导致您采用本项目作为基项目而出现问题。



项目下载和运行
----

- 拉取项目代码
```bash
git clone https://github.com/AkashFast/akashFastVue
cd  akashFastVue
```

- 安装依赖
```
yarn install
```

- 开发模式运行
```
yarn run serve
```

- 编译项目
```
yarn run build
```

- Lints and fixes files
```
yarn run lint
```


其他说明
---

-  若需使用项目「系统管理」及其子级菜单功能，请先`clone`并`启动` - [fastAkash for Java](https://github.com/AkashFast/fastAkash) 「当然，您可以可以自行实现相关接口」

-  项目使用的 [vue-cli3](https://cli.vuejs.org/guide/), 请确保你所使用的 vue-cli 是新版，并且已经学习 cli 官方文档使用教程

-  您可在 [Ant Design Vue Pro](https://pro.antdv.com/docs/getting-started)深入学习本脚手架的基础知识


- 关闭 Eslint (`不推荐`) 移除 `package.json` 中 `eslintConfig` 整个节点代码, `vue.config.js` 下的 `lintOnSave` 值改为 `false`

- 组件按需加载 `/src/main.js` L14 相关代码 `import './core/lazy_use'` / `import './core/use'` 

## 浏览器兼容

Modern browsers and IE10.

| </br>IE / Edge | Firefox | Chrome |Safari |Opera |
| --- | --- | --- | --- | --- |
| IE10, Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions |
