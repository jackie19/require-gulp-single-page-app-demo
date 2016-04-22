# require-gulp-single-page-app-demo

- 基于requirejs ,director ,zepto ,underscore的单页webapp
- bower 管理第三方资源
- 使用gulp 一键打包
- r.js 合并资源
- 异步加载模块
- 在cdn目录里，根据 hax 生成文件
- gulp-livereload 自动刷新调试



##安装
    安装 nodejs ,gulp ,bower

    npm install
    bower install

##打包合并
    gulp cdn

##监听文件变动
- 依赖 gulp-livereload ，需要安装 chrome 插件


    gulp default


##访问
- debug 源文件
`
  debug.html
`
- dist 文件
` index.dist.html `

- cdn 文件
`index.html`

##遵守
- 模块文件夹名 modules
- 模块下只能有一级目录


##todo

- 压缩图片
- Iconfont
