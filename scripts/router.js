/**
 *
 * https://github.com/flatiron/director
 */
define(['director', 'underscore'], function (Router, _) {
    var byId = function(id){
        return document.getElementById(id)
    }

    var dist =  byId('main').getAttribute('data-baseurl') || ''
   
    //先设置一个路由信息表，可以由html直出，纯字符串配置
    var routes = {
        'goods': dist + 'modules/goods/goods-list.js',
        'goods/:id': dist + 'modules/goods/goods-detail.js',
        'shops': dist + 'modules/shops/shop-list.js'
//        'module2/?([^\/]*)/?([^\/]*)': 'module2/controller2.js'    //可缺省参数的写法，其实就是正则表达式,括号内部分会被抽取出来变成参数值。
        //  “ /?([^\/]*) ”  这样的一段表示一个可选参数，接受非斜杠/的任意字符
    };
    
    var currentController = null;
    
    //用于把字符串转化为一个函数
    var routeHandler = function (config, key) {
        return function () {
            var url = config
            var params = arguments;
            require([url], function (controller) {
                if (currentController && currentController !== controller) {
                    currentController.onRouteChange && currentController.onRouteChange(key);
                }
                currentController = controller;
                controller.apply(null, params);
            });
        }
    };
    
    for (var key in routes) {
        routes[key] = routeHandler(routes[key], key);
    }
    
    return Router(routes);
});