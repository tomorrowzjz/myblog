class Promise{
  constructor(excutor){
    this.value = '';
    this.reason = '';
    this.status = 'padding'
    let resolve = (value)=>{
      this.status = 'fulfilled'
      this.value = value
    };
    let reject = (reason)=>{
      this.status = 'rejected'
      this.reason = reason
    };
    /* 当发生异常是捕获异常 */
    try{
      excutor(resolve,reject)
    }catch (e){
      reject(e)
    }
  }
  then(resolve,reject){
    if(this.status == 'fulfilled'){
      resolve('zjz:'+this.value)
    }
    if(this.status == 'rejected'){
      reject('zjz:'+this.reason)
    }
  }
}
// module.exports = Promise
module.exports = Promise
