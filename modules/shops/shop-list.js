define(['text!modules/shops/shop-list.html', 'services', 'css!modules/shops/shops.css'], function (tpl, services) {
    
    var controller = function () {
        
        common.setTitle('店铺列表')
        services.ShopListService.get({page: 1}, function (dt) {
            
            console.log(dt)
            appView.html(_.template(tpl)({datas:dt.data}))
        });

    };
    
    return controller;
});