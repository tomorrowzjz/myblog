let Promise = require('./promise')
let p = new Promise((resolve,reject)=>{
  setTimeout(()=>{
    reject('err')
  },1000)
  // throw new Error('test')
  // resolve('nihao');
})
p.then((data)=>{
  console.log(data);
},(err)=>{
  console.log(err);
})
