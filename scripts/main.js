'use strict';

(function (win, document) {
    //配置baseUrl
    var baseUrl = document.getElementById('main').getAttribute('data-baseurl')


    var config = {
        baseUrl: baseUrl,           //依赖相对路径
        paths: {                    //如果某个前缀的依赖不是按照baseUrl拼接这么简单，就需要在这里指出
            director: 'bower_components/director/build/director',
            zepto: 'bower_components/zepto/zepto',
            underscore: 'bower_components/underscore/underscore',
            text: 'bower_components/text/text',         //用于requirejs导入html类型的依赖
            common: 'scripts/common/main',
            css: 'bower_components/require-css/css',
            services: 'scripts/services'
        },
        shim: {
            zepto: {
                exports: '$'
            },
            director: {
                exports: 'Router'
            }
        },
        // urlArgs: "bust=123",
        config: {
            'services': {
                HTTP_REMOTE: 'http://127.0.0.1:8080'
            }
        }
    };

    require.config(config);
    require(['zepto', 'scripts/router', 'underscore', 'common', 'text', 'css', 'services'], function ($, router, _, common) {

        //暴露全局变量
        //用于各个模块控制视图变化
        win.appView = common.appView
        win.$ = $
        win._ = _
        win.router = router
        win.common = common
        win.DIST = baseUrl

        //设置默认路由
        if(!router.getRoute()[0]){
            router.setRoute('goods')
        }

        //开始监控url变化
        router.init()
    });

})(this, this.document);
