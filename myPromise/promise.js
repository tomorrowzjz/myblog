class Promise{
  constructor(excutor){
    this.value = '';
    this.reason = '';
    this.status = 'padding'
    let resolve = (value)=>{
      /*2.这个判断是为了status不可逆 只能从 padding转化为 成功或者失败*/
      if (this.status == 'padding') {
        this.status = 'fulfilled'
        this.value = value
      }
    };
    let reject = (reason)=>{
      /*2.这个判断是为了status不可逆 只能从 padding转化为 成功或者失败*/
      if (this.status == 'padding') {
        this.status = 'rejected'
        this.reason = reason
      }
    };
    /*1. 当发生异常是捕获异常 */
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
    if(this.status == 'padding'){
      console.log("进行中");
      reject('zjz:padding')
    }
  }
}
// module.exports = Promise
module.exports = Promise
