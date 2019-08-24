class Promise{
  constructor(excutor){
    this.value = '';
    this.reason = '';
    this.status = 'padding'
    this.onFulfilledCallback = []
    this.onRejectedCallback = []
    let resolve = (value)=>{
      /*2.这个判断是为了status不可逆 只能从 padding转化为 成功或者失败*/
      if (this.status == 'padding') {
        this.status = 'fulfilled'
        this.value = value
        /*3.当转态改变的时候依次执行队列里面储存的then函数里面对应的回调*/
        this.onFulfilledCallback.forEach(fn=>{
          fn()
        })
      }
    };
    let reject = (reason)=>{
      /*2.这个判断是为了status不可逆 只能从 padding转化为 成功或者失败*/
      if (this.status == 'padding') {
        this.status = 'rejected'
        this.reason = reason
        /*3.当转态改变的时候依次执行队列里面储存的then函数里面对应的回调*/
        this.onRejectedCallback.forEach(fn=>{
          fn()
        })
      }
    };
    /*1. 当发生异常是捕获异常 */
    try{
      excutor(resolve,reject)
    }catch (e){
      reject(e)
    }

  }
  then(onFulfilled,onRejected){
    if(this.status == 'fulfilled'){
      onFulfilled('zjz:'+this.value)
    }
    if(this.status == 'rejected'){
      onRejected('zjz:'+this.reason)
    }
    if(this.status == 'padding'){
      /*3.当excutor为异步的时候先把then方法里面的回调储存在失败或者成功的队列里面*/
      this.onFulfilledCallback.push(()=>{
        //这里可以写其他的代码对resolve做一层封装todo
        onFulfilled('zjz:'+this.value)
      })
      this.onRejectedCallback.push(()=>{
        onRejected('zjz:'+this.reason)
      })
    }
  }
}
module.exports = Promise
