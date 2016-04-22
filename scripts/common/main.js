/**
 * Created by Administrator on 2016/4/14.
 */

define(function () {
    var titlesMap = {}

    var platform = {

        isIos: function () {
            //todo 
            return false
        }

    }

    var obj = {
        setTitle: function (newTitle, state) {

            var isIos = platform.isIos()

            document.title = newTitle

            if (isIos) {
                var $body = $('body');
                // hack在微信等webview中无法修改document.title的情况
                var $iframe = $('<iframe src="/"></iframe>').on('load', function () {
                    setTimeout(function () {
                        $iframe.off('load').remove()
                    }, 0)
                }).appendTo($body);
            }

            if (state) {
                titlesMap.state = newTitle
            }
        },
        appView: {
            history: [],
            html: function (html) {
                //todo 动画
                $('#container').html(html)
            }
        }
    }
    return obj;
});