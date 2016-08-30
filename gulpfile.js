var SRC        = 'app' ,
    REQUIREJS  = 'build-requirejs' ,
    DIST       = 'build' ,
    CDN        = 'cdn' ,

    // 如果不是假值，那么这个值会作为 cdn 前缀追加到需要加载的文件里。
    // 注意：最后面的斜线 / 一定要加上
    //CDN_PREFIX = 'https://dn-lmk123.qbox.me/angularjs-requirejs-rjs-md5/' ,
    CDN_PREFIX = 'http://192.168.5.31:8000/angularjs-ionic-lazyload/cdn/' ,
    CDN_PREFIX = false ,
    paths      = {

        // 默认情况下所有 js 文件都是由 requireJS 加载的是不需要加前缀的，所以这里要列出不是由 requireJS 加载的 js 文件
        jsNotLoadByRequireJS : [ 'bootstrap.js' , 'vendor/require/require.js' ] ,

        // 默认情况下所有 css 文件都是要加前缀的，但是由 requireJS 加载的 css 文件不用加
        cssLoadByRequireJS : [ /^styles\/.*/ ] ,

        js : [
            REQUIREJS + '/**/*.js'
        ] ,
        cssFiles : [ REQUIREJS + '/**/*.css' ] ,
        htmlFiles : REQUIREJS + '/**/*.html' ,
        imageFiles : REQUIREJS + '/**/*.{png,jpg,gif}' ,
        copyFiles : [
            REQUIREJS + '/**/*' ,
            '!' + REQUIREJS + '/**/*.{js,css,html}' ,
            '!' + REQUIREJS + '/build.txt' ,
            '!' + REQUIREJS + '/vendor/bootstrap/config.json'
        ]
    } ,

    fs         = require( 'fs' ) ,
    gulp       = require( 'gulp' ) ,
    webserver = require('gulp-webserver'),
    minifyJS   = require( 'gulp-uglify' ) ,
    minifyCSS  = require( 'gulp-minify-css' ) ,
    minifyHTML = require( 'gulp-htmlmin' ) ,

    //changed    = require( 'gulp-changed' ) ,
    concat     = require( 'gulp-concat' ) ,
    deleteFile = require( 'del' ) ,
    revall     = new (require( 'gulp-rev-all' ))( {
        dontRenameFile : [ /^\/index\.html$/g ] ,
        dontSearchFile : [ /^\/vendor\/angular\/.*/g , /^\/vendor\/require\/.*/g ] ,
        transformFilename : function ( file , hash ) {
            return hash + file.path.slice( file.path.lastIndexOf( '.' ) );
        } ,
        transformPath : function ( rev , source , file ) {
            //if ( rev !== file.revPath ) {
            //    console.log( 'debugger here' );
            //}
            if ( CDN_PREFIX ) {
                var filePath = file.revPathOriginal.slice( file.base.length ).replace( /\\/g , '/' ) ,
                    ext      = file.revFilenameExtOriginal;

                // 不是由 requireJS 加载的 js 文件要加前缀，由 requireJS 加载的 css 文件不要加前缀
                if (
                    ('.js' === ext && !matchArray( filePath , paths.jsNotLoadByRequireJS ))
                    ||
                    ('.css' === ext && matchArray( filePath , paths.cssLoadByRequireJS ))
                ) {
                    return rev;
                }

                /**
                 * 为什么要判断文件是否存在？这是不是多此一举？
                 *
                 * 之所以要这么做，是因为如果 css 文件里有引用相对路径的其他资源（比如图片、字体），
                 * 那么产生的路径是错误的，而这些文件其实不需要加 cdn 前缀，因为只要引用它们的 css 文件加了前
                 * 缀，那此 css 所引用的相对路径的文件也会从 cdn 上加载
                 */
                var r;
                try {
                    // 如果文件存在，则加上 cdn
                    fs.statSync( DIST + '/' + source );
                    r = CDN_PREFIX + rev;
                }
                catch ( e ) {
                    // 否则不加
                    r = rev;
                }
                return r;
            } else {
                return rev;
            }
        }
    } );

gulp.task( 'clean' , clean );

gulp.task( 'requirejs' , [ 'clean' ] , requirejs ); //第一步： 从 SRC 把文件合并至 REQUIREJS 文件夹

// 第二步：下面四个操作是并行的，用于将 REQUIREJS 文件夹下的文件精简至 DIST 文件夹
gulp.task( 'js' , [ 'requirejs' ] , js );

gulp.task( 'css' , [ 'requirejs' ] , css );

gulp.task( 'html' , [ 'requirejs' ] , html );

gulp.task( 'copy' , [ 'requirejs' ] , copy );

// 第三步：将 DIST 文件夹下的文件打上 md5 签名并输出到 CDN 文件夹
gulp.task( 'build' , [ 'js' , 'css' , 'html' , 'copy' ] , md5 );

function clean() {
    return deleteFile( [ DIST , REQUIREJS , CDN ] );
}

function js() {
    return gulp.src( paths.js )
        //.pipe( changed( DIST ) )
        .pipe( minifyJS() )
        .pipe( gulp.dest( DIST ) );
}

function css() {
    return gulp.src( paths.cssFiles )
        //.pipe( changed( DIST ) )
        .pipe( minifyCSS() )
        .pipe( gulp.dest( DIST ) );
}

function html() {
    return gulp.src( paths.htmlFiles , { base : REQUIREJS } )
        //.pipe( changed( DIST ) )
        .pipe( minifyHTML( {
            removeComments : true ,
            collapseWhitespace : true
        } ) )
        .pipe( gulp.dest( DIST ) );
}
function copy() {
    return gulp.src( paths.copyFiles )
        //.pipe( changed( DIST ) )
        .pipe( gulp.dest( DIST ) );
}

function md5() {
    return gulp.src( DIST + '/**' )
        .pipe( revall.revision() )
        .pipe( gulp.dest( CDN ) );
    //.pipe( revall.manifestFile() )
    //.pipe( gulp.dest( CDN ) );
}

function requirejs( done ) {
    var r = require( 'requirejs' );
    r.optimize( {
        appDir : SRC ,
        baseUrl : './' ,
        dir : REQUIREJS ,
        optimize : 'none' ,
        optimizeCss : 'none' ,
        removeCombined : true ,
        mainConfigFile : SRC + '/bootstrap.js' ,
        modules : [
            {
                name : "bootstrap"
            }
        ] ,
        logLevel : 1
    } , function () {
        done();
    } );
}

/**
 * 匹配一个数组，数组可能有正则
 * @param {String} value - 要匹配的值
 * @param {Array} arr - 匹配数组
 * @returns {boolean} - 有一个匹配项则返回 true，否则返回 false
 */
function matchArray( value , arr ) {
    return arr.some( function ( v ) {
        if ( 'string' === typeof v ) {
            return v === value;
        }
        return v.test( value );
    } );
}



gulp.task('watch', function() {
  gulp.src('app')
    .pipe(webserver({
        host: '0.0.0.0',
        port: config.port,
        livereload: config.livereload
    }));
});


gulp.task('test', function() {
  gulp.src('release')
    .pipe(webserver({
        host: '0.0.0.0',
        port: config.port
    }));
});

gulp.task('default', ['watch']);
