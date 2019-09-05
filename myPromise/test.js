let Promise = require('./promiseA+')
let p = new Promise((resolve,reject)=>{
  setTimeout(()=>{
    resolve('err1')
  },1000)
  // throw new Error('test')
  // resolve('nihao');
})
p.then((res)=>{
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve(res)
    },1000)
  }).then((zjzj)=>{
    console.log('1'+zjzj);
  },err=>{
    console.log(err);
  })
},(err)=>{
  console.log(err);
  return 1
}).then((zjz)=>{
  console.log(zjz);
  return 2
},(err)=>{
  console.log(err);
}).then(ss=>{
  console.log(ss);
},(err)=>{
  console.log(err);
})
