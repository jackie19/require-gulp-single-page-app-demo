'use strict';
(function () {
    
    define(['text!modules/goods/goods-list.html', 'common'], function (tpl, common) {
        
        var controller = function (name) {
            appView.html(_.template(tpl)({name: name ? name : 'vivi'}));
            
            common.setTitle('商品列表')
            
            $('button').on('click', function clickHandler() {
                alert('go to goods detail')
                router.setRoute('goods/123') //跳转
            });
            
            controller.onRouteChange = function (key) {
                console.log('change 2', key)      //可以做一些销毁工作，例如取消事件绑定
                $('button').off('click')   //解除所有click事件监听
            };
        };
        
        return controller;
    })
})()