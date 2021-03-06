# 开发时
  $ npm install -g cnpm --registry=https://registry.npm.taobao.org (如果没全局安装)
  $ cnpm install -g gulp (如果没全局安装)
  $ cnpm install
  $ cp _config.js config.js
  $ vi config.js (配置打包端口)
  $ cp app/config/_config.js app/config/config.js
  $ vi app/config/config.js (配置api)
  $ npm start
  $ 在浏览器打开 http://192.168.X.XX:XXXX

# 打包生产包
  $ npm install -g cnpm --registry=https://registry.npm.taobao.org (如果没全局安装)
  $ cnpm install -g gulp (如果没全局安装)
  $ cnpm install
  $ cp _config.js config.js
  $ vi config.js (配置打包端口)
  $ cp app/config/_config.js app/config/config.js
  $ vi app/config/config.js (配置api)
  $ gulp build -P(打包生产包)
  $ (域名指向) release/index.html
# 测试生产包
  $ gulp build -P
  $ gulp test
  $ 在浏览器打开 http://192.168.X.XX:XXXX

# 调试手机网页 weinre

  使用npm安装weinre,在node.js安装目录输入以下命令
  npm install weinre
  node node_modules/weinre/weinre --boundHost -all-
  node node_modules/weinre/weinre --boundHost  192.168.X.XX

  需调试的页面加入JS脚本
  <script src="http://192.168.X.XX:8080/target/target-script-min.js#jiaoye"></script>
  在PC端使用webkit浏览器打开控制台
  http://192.168.X.XX:8080/client/#jiaoye
  其中 #后面为识别码,识别码仅仅是为了识别多个需调试的项目时使用，可供多用户操作。

### 添加 cdn 前缀

在 gulpfile.js 里指定 `CDN_PREFIX` 变量的值，那么 `gulp` 命令会给所有的路径（例如代码里的 `templateUrl` 模板路径、html 文件里引用的图片、脚本、样式表等文件）添加这个前缀；[app/index.html] 里的 [data-main](http://requirejs.org/docs/api.html#data-main) 也会加上这个前缀，所以 [baseUrl](http://requirejs.org/docs/api.html#config-baseUrl) 会被自动设为这个值。

### 它是怎么做到按需加载控制器、指令、过滤器等文件的？
见 [app/bootstrap.js](https://github.com/mzl1988/angularjs-ionic-lazyload/blob/master/app/bootstrap.js)。

### 它是怎么用 gulp 来处理源文件的？

`gulp` 命令执行了下面这些操作：

1. 使用 r.js 将 [app] 文件夹下的小文件按照模块的划分合并成一个个单独的文件，然后输出至 `build-requirejs` 文件夹；
2. 把 `build-requirejs` 文件夹下的所有文件精简之后输出到 `build` 文件夹；
3. 最后使用 gulp-rev-all 将 `build` 文件夹下的文件全部根据文件内容重命名成 md5 的格式，并输出到 [cdn] 文件夹。

在 [gulpfile.js]可以看到上面的这一过程是怎么实现的。

### 项目结构

```
app：项目源码。开发的时候代码写在这里。
 |--directives：整个网站公用的指令写在这里面
 |--images：存放图片
 |--modules：用于存放各个模块，例如一个网站可以分成主页、用户中心等模块
 |--services：整个网站公用的服务写在这里面
 |--styles：整个网站公用的样式
 |--vendor：存放第三方代码库
 |--views：存放并不属于某个模块的模板，例如整个网站都会用到的页头和页脚
 |--app.js：路由表、config()、run()等代码块写在这里面
 |--bootstrap.js：程序的启动文件，用于配置 requireJS 的配置及启动应用
 |--index.html：应用入口页面
cdn：经过处理之后的、用于生产环境的代码。不能直接编辑。
docs：用于存放各种文档
gulpfile.js：根据 app 文件夹里的源码生成适合生产环境使用的代码。会精简文件并重命名为 md5 文件名
package.json：用于声明 gulpfile.js 会用到的各种模块
```

[app/modules]里面的子模块包含各自的模板、指令等代码。如果某个指令、服务等会在其他模块里用到，你应该考虑把它加入到 [app/directives]等文件夹中。

若一个子模块也包含子模块，那么也应该根据此规则进行分割。例如项目有 _用户中心_ 模块，但这个模块还包含 _基本信息_、_收货地址_ 、_好友列表_ 等模块，那么就应该是这样的结构：

```
app/modules/customer：用户中心模块
 |--basic：基本信息模块
 |--address：收货地址模块
 |--friends：好友列表模块
 |--common.js：上面这些模块都用得到的代码，比如 API 接口
```

这样的结构易于将项目拆分，但是在声明路由的时候会比较麻烦：因为公用文件必须得先加载。上面的结构可能就需要这样声明路由：

```js
$stateProvider
  .state( 'nav.customer' , { // 一个父状态用来加载公用文件
    abstract : true ,
    template : '<div ui-view></div>' ,
    resolve : {
      loadModule : asyncLoad( [ 'modules/customer/common' ] ) // 公用文件
    }
  } )
  .state( 'nav.customer.basic' , { // 子状态来加载各自的模板与代码
    url : '/customer/basic' ,
    templateUrl : 'modules/customer/basic/index.html' ,
    controller : 'CustomerBasicController' ,
    resolve : {
      loadModule : asyncLoad( [ 
        'modules/customer/basic/index',
         // .css 后缀需要带上，否则 gulp-rev-all 不会更新引用
        'css!./styles/xxxx.css' // 依赖的 css 可以写在这里
      ] ) // 子状态自己的代码
    }
  } )
  // ...
```

## 代码注意事项

项目使用 gulp 及其它一些插件来完成源文件的合并、精简及重命名为 md5 hash 的操作，但有一点要特别注意：文件里不要出现与文件名相同的字符串。

例如 `vendor/require/require.js` 里面有一段代码：`this.map.isDefine ? 'define' : 'require'`，_gulp-rev-all_ 在把 require.js 重命名的时候，也会把这段代码里面的 _require_ 给一并重命名掉，这是很多 bug 出现的根源。所以我在 gulpfile.js 中声明 `dontSearchFile : [ /^\/vendor\/.*/ ]` 忽略了 `vendor` 文件夹下的文件。

### License
MIT
