# koa洋葱模型解析

```js
// 输出
// 1
// 1614932795751
// 2
// 3
// 3after       
// 2after       
// 1after       
// GET / - 3ms
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
  console.log(1);
  // 这里是表示调用下一个中间件  
  await next();
  console.log('1after');
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  console.log(start);
  console.log(2);
  await next();
  console.log('2after');
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(async ctx => {
  console.log('3');
  ctx.body = 'Hello World';
  console.log('3after');
});

app.listen(3000);

```

* 通过上面代码的输出可以看到app.use(async function)   use里面放的是一个函数，函数有两个参数一个是上下文ctx一个是next函数，上下文这个好理解，这个next函数是什么回事，为什么执行这个函数await next();他会执行下一个app.use(async function)里面的方法体，他的下一个是怎么确定的，下面就跟着我看一下Koa源码是怎么实现的。

  ```
  // 当使用app.use()的时候在源码内部到底是怎么做的
  class Application  {
      constructor() {
          super();
          this.middlewares = [];
      }
      use(middleware) {
          // 可以看出.use的时候是吧use里面的函数放到了middlewares数组里
          this.middlewares.push(middleware);
      }
      listen() {
          //...
      }
  }
  
  module.exports = Application
  ```

  * 因为next函数的功能是执行一下中间件(函数)，所以他的代码应该是middlewares[i] (ctx,next(i+1))  ，ctx是对req, res的封装，

  * ```
    const response = require('./response');
    const context = require('./context');
const request = require('./request');
    const Emitter = require('events');
    class Application extends Emitter {
        constructor() {
            super();
            this.context = Object.create(context);
            this.request = Object.create(request);
            this.response = Object.create(response);
            this.middlewares = [];
        }
        use(middleware) {
            this.middlewares.push(middleware);
            // 链式调用
            return this;
        }
        createContext(req, res) {
            let ctx = Object.create(this.context); 
            let request = Object.create(this.request);
            let response = Object.create(this.response);
            ctx.request = request; 
            ctx.req = ctx.request.req = req;
            ctx.response = response;
            ctx.res = ctx.response.res = res;
            return ctx;
        }
        // koa核心代码
        compose(middlewares) {
            return function (ctx){
                let index = -1;
                const dispatch = (i) => {
                    if( i<= index){
                        return Promise.reject(new Error('next() called multiple times'))
                    }
                    index = i;
                    //多次调用next()函数
                    if (i === middlewares.length) return Promise.resolve();
                    let middleware = middlewares[i];
                    // 这里的dispatch(i + 1)就是next函数也就是调用下一个middleware中间件
                    return Promise.resolve(middleware(ctx, () => dispatch(i + 1)));
                }
                return dispatch(0);
            }
        }
        handleRequest(req, res) {
            let ctx = this.createContext(req, res); // 构造上下文
            this.compose(this.middlewares)(ctx).then(() => {
                console.log('success');
            }).catch(err=>{
            })
        }
        listen() {
            const server = http.createServer(this.handleRequest.bind(this));
            server.listen(...arguments)
        }
    }
    
    ```
    
    