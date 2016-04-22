/**
 * Created by Administrator on 2016/4/14.
 */
var gulp = require('gulp');

//引入组件
var concat = require('gulp-concat');           //合并
var jshint = require('gulp-jshint');           //js规范验证
var uglify = require('gulp-uglify');           //压缩
var rename = require('gulp-rename');          //文件名命名
var amdOptimize = require("amd-optimize");           //require优化
var watch = require('gulp-watch');
var replace = require('gulp-replace')
var livereload = require('gulp-livereload') //需要安装chrome插件
var del = require('del')
var vinylPaths = require('vinyl-paths')
var rd = require('rd')
var fs = require('fs')
var minifyCSS = require('gulp-minify-css')
var Q = require('q')
var RevAll = require('gulp-rev-all')

var paths = {
    copyCss: './modules/**/*.css',
    scripts: './scripts/**/*.js'
}
var DIST = 'dist'

//脚本检查
gulp.task('lint', function () {
    gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
});

/*
 * r.js合并入口
 *
 * 参数 --debug 只合并不混淆
 *
 * */
gulp.task('rjs', rjs)

/*
 *  监听文件变化 刷新页面
 *   */
gulp.task('default', mydefault)

gulp.task('copy', copy)

gulp.task('dist', ['clean', 'rjs', 'm'], copy)
/*
 合并模块
 */
gulp.task('m', m)

/*清理dist,cdn 目录 及index.html,index.dist.html*/
gulp.task('clean', clean)

/*
 * 生成cdn目录*/
gulp.task('cdn', ['dist'], cdn);


function mydefault() {
    livereload.listen()
    gulp.watch([paths.scripts, 'modules/**/*.*'], function () {       //当js文件变化后，自动检验
        gulp.start('lint')
    }).on('change', livereload.changed);
}

function cdn() {
    
    
    var revAll = new RevAll({
            hashLength: 4,
            dontRenameFile: [/^\/favicon.ico$/g, '.html'],
            transformPath: function (rev, source, file) {
                return rev.replace('/img', '/images');
            }
        }),
        indexjs;
    
    gulp.src(['dist/**'])
        .pipe(revAll.revision())
        .on('data', function (file) {
            console.log('cdn 1 dest-->', file.path)
            if (file.path.indexOf('index.min.') > -1)
                indexjs = file.path.split('/').pop()
            
        })
        .pipe(gulp.dest('cdn'))
    
    setTimeout(function () {
        
        //生成 index.html
        gulp.src(['./index.dist.html'])
            .on('data', function (file) {
                console.log('cdn 2 index-->', file.path)
            })
            .pipe(replace('dist/js/index.min.js', 'cdn/js/' + indexjs))
            .pipe(replace('./dist/', './cdn/'))
            .pipe(rename('index.html'))
            .pipe(gulp.dest('./'))
    }, 100)
    
    setTimeout(function () {
        //模块define名称要手动改
        rd.eachSync('./cdn/modules/', function (f, s) {
            var file = fs.statSync(f);
            if (!file.isDirectory() && f.indexOf('.js') > -1) {
                
                var file = f.replace(__dirname, '')
                
                var i = file.lastIndexOf('\\')
                var fileName = file.substr(i + 1)
                var module = fileName.replace('.js', '')
                var _module = module.split('.')[0] + '.js'
                
                var fileNameMin = fileName.replace('.js', '.min.js')
                var moduleDir = file.split('\\')[3]
                
                console.log('cdn 3 replace module name-->', _module, ' to ', fileName)
                
                //配合hax，重写模块名
                gulp.src(f)
                    .pipe(replace('./dist/modules/' + moduleDir + '/' + _module, './cdn/modules/' + moduleDir + '/' + fileName))
                    .pipe(gulp.dest('cdn/modules/' + moduleDir))
            }
        })
    }, 100)
}


function m() {
    var deferred = Q.defer();
    
    rd.eachSync('./modules/', function (f, s) {
        var file = fs.statSync(f);
        
        if (!file.isDirectory()) {
            
            if (f.indexOf('.js') > -1) {
                
                var file = f.replace(__dirname, '')
                
                var i = file.lastIndexOf('\\')
                var fileName = file.substr(i + 1)
                var module = fileName.replace('.js', '')
                
                var fileNameMin = fileName.replace('.js', '.min.js')
                var moduleDir = file.split('\\')[2]
                
                gulp.src(f)
                    .pipe(amdOptimize(module, {
                        paths: {
                            common: 'scripts/common/main',
                            services: 'scripts/services',
                            css: 'bower_components/require-css/css'
                        }
                    }))
                    .on('data', function (file) {
                        console.log('modules-->', file.path)
                    })
                    .pipe(concat(fileName))
                    .pipe(replace('define(\'' + module + '\',', 'define(\'./' + DIST + '/modules/' + moduleDir + '/' + fileName + '\',')) //配合路由，重写模块名
                    
                    // .pipe(gulp.dest(DIST + '/modules/' + moduleDir))
                    // .pipe(rename(fileNameMin)) 
                    .pipe(uglify())
                    .pipe(gulp.dest(DIST + '/modules/' + moduleDir));
                
                
                setTimeout(function () {
                    deferred.resolve();
                }, 1000)
                
            }
        }
    });
    
    return deferred.promise;
}

function copy() {
    
    return gulp.src(paths.copyCss)
        .on('data', function (file) {
            console.log('copy css-->', file.path)
        })
        .pipe(minifyCSS())
        .pipe(gulp.dest(DIST + "/modules"))
    
}

function clean() {
    return del([
        DIST + '/**/*',
        'cdn/**/*',
        'index.html',
        'index.dist.html'
    ]);
}

function rjs() {
    var INJECT_JS
    
    if (gulp.env.debug) {
        INJECT_JS = DIST + '/js/index.js'
    } else {
        INJECT_JS = DIST + '/js/index.min.js'
    }
    
    gulp.src(paths.scripts)
        .pipe(amdOptimize("main", {
            paths: {                    //如果某个前缀的依赖不是按照baseUrl拼接这么简单，就需要在这里指出
                director: 'bower_components/director/build/director.min',
                zepto: 'bower_components/zepto/zepto.min',
                underscore: 'bower_components/underscore/underscore-min',
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
            }
        }))
        .on('data', function (file) {
            console.log('rjs-->', file.path)
        })
        .pipe(concat("index.js"))
        .pipe(gulp.dest(DIST + '/js'))
        
        .pipe(rename("index.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest(DIST + "/js"))
    
    //生成 dist首页
    return gulp.src(['src/index.html'])
        .on('data', function (file) {
            console.log(file.path)
        })
        .pipe(replace('<!-- inject:js -->', INJECT_JS))
        .pipe(replace('<!-- inject:dist -->', DIST))
        .pipe(rename('index.dist.html'))
        .pipe(gulp.dest('./'));
}