const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
  console.log(1);
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

// 输出
// 1
// 1614932795751
// 2
// 3
// 3after       
// 2after       
// 1after       
// GET / - 3ms