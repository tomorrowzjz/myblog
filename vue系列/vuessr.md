# vueSSR

## 什么是ssr

​         服务端渲染(ssr)，相比客户端渲染，服务端返回的dom一般为<div id="app"></div>，剩下的渲染过程都是在客户端进行的，而服务端渲染做的就是，在服务器返回到客户端以前就把页面渲染好，页面不在是单一的id=app的div了。

## 为什么需要ssr

​			说起服务端渲染可能有一些伙伴比较陌生，现在的vue，react都是客户端渲染，后台返回的dom一般为<div id="app"></div>,当浏览器向服务端发起请求后，讲静态资源返回，浏览器会解析js文件，动态往id=app的节点挂载解析出来的html节点，在服务器向浏览器返回，以及浏览器解析js挂载到id=app节点之前，浏览器会出现一段时间的空白，这样的用户体验会很不友好，除此之外，客户端渲染的seo非常不好，爬虫只能爬取到dom一般为<div id="app"></div>的节点，这样对一些新闻类的网站，或者做seo的网站不友好。而服务端渲染完美解决了这两个问题。

##  ssr的缺点（来自vuessr官网 https://ssr.vuejs.org/zh/ ）

​		1.及构建设置和部署的更多要求。与可以部署在任何静态文件服务器上的完全静态单页面应用程序 (SPA) 不同，服务器渲染应用程序，需要处于 Node.js server 运行环境。

​		2.更多的服务器端负载。在 Node.js 中渲染完整的应用程序，显然会比仅仅提供静态文件的 server 更加大量占用 CPU 资源 (CPU-intensive - CPU 密集)，因此如果你预料在高流量环境 (high traffic) 下使用，请准备相应的服务器负载，并明智地采用缓存策略。

​		3.开发条件所限。浏览器特定的代码，只能在某些生命周期钩子函数 (lifecycle hook) 中使用；一些外部扩展库 (external library) 可能需要特殊处理，才能在服务器渲染应用程序中运行。

##  vuessr

​			在服务器返回到客户端以前就解析好某个路由的dom并挂载到<div id="app"></div>的dom上，这样的话服务端(一般指的是node服务端）就需要一个能把vue组件解析为对应html的库，vue提供了这样一个库[vue-server-renderer](https://www.npmjs.com/package/vue-server-renderer)

### vue-server-renderer用法

```
const Vue = require('vue')

const renderer = require('vue-server-renderer').createRenderer()
// vue对象
const vm = new Vue({
  render (h) {
    return h('div', 'helloworld')
  }
})
// renderToString接收两个参数第一个是vue的对象，第二个是回调参数
renderer.renderToString(vm, (err, html) => {
  // html为Vue实例解析完的字符串
  console.log(html) // -> <div server-rendered="true">helloworld</div>
})
```

vuessr在koa中的使用

```
const Vue = require('vue');
const VueServerRenderer = require('vue-server-renderer');
const Koa = require('koa');
const fs = require('fs');
const Router = require('@koa/router');
let app = new Koa(); // 创建一个服务实例
let router = new Router(); // 创建路由实例
const template = fs.readFileSync('./public/index.ssr.html','utf8');
const serverBundle = require('./dist/vue-ssr-server-bundle.json');
// 这个manifest 存client-entry端打包的信息     为了避免客户端激活在index.client.html手动引入<script src="client.bundle.js"></script>
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
const static = require('koa-static');
const path = require('path');
let render = VueServerRenderer.createBundleRenderer(serverBundle,{
    template,
    // 会自动在index.client.html手动引入<script src="client.bundle.js"></script>
    clientManifest
})
router.get('*',async ctx =>{
    try{
        ctx.body = await new Promise((resolve,reject)=>{
            render.renderToString({url:ctx.url},(err,html)=>{
                // 当 server-entry.js 执行reject() 错误在这里
                if(err){
                    console.log(err);
                }
                if(err && err.code == 404){
                    resolve('Page Not Found')
                }
                resolve(html);
            });
        })
    }catch(e){
        console.log(e)
    }
})
// 静态服务中间件
app.use(static(path.resolve(__dirname,'dist')))
app.use(router.routes()); 
app.listen(3000, () => {
  console.log("服务器启动成功");
}); 
```

![avatar](./img/ssr.png)

上面这个是vuessr构建的图片，从图片中可以看到source 里面有两个入口一个为Serverentry服务端打包入口，Cliententry客户端打包入口，通过webpack可以打包出两份配置，一份用于客户端，一份用于服务端，打包出的serverBundle在服务端使用，ClientBundle在客户端使用。

