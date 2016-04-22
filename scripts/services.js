/**
 * Created by Administrator on 2016/4/15.
 */

define(['module'], function (module) {

    var HTTP_REMOTE = module.config().HTTP_REMOTE

    return {
        ShopListService: {
            get: function (params, cb) {
                console.info('HTTP_REMOTE', HTTP_REMOTE, params)
                //todo ajax
                
                cb({
                    code: 200,
                    data: [{
                        name: 'bill'
                    }, {
                        name: 'Filii'
                    }, {
                        name: 'Kimmy'
                    }]
                })
            }
        },
        ShopDetailService: {}
    }

})