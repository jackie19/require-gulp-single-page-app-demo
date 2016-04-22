
define(['text!modules/goods/goods-detail.html','common','services'], function (tpl, common,services) {

    var controller = function (name) {
        appView.html(_.template(tpl)({name: name?name:'detail'}));

        common.setTitle('商品详情')

        $('button').on('click', function clickHandler() {
            alert('hello');
        });

        controller.onRouteChange = function (key) {
            console.log('change 2', key);      //可以做一些销毁工作，例如取消事件绑定
            $('button').off('click');   //解除所有click事件监听
        };

        
    };

    return controller;
});