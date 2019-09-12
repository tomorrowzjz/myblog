class Observer{
  constructor(data){
    this.observe(data);
  }
  observe(data){
    if(!data || typeof data !== 'object') {
      return;
    }
    Object.keys(data).forEach(key=>{
      this.defineReactive(data,key,data[key])
    })
  }
  defineReactive(data,key,value){
    Object.defineProperty(data,key,{
      enumerable: true,
      configurable: true,
      get(){
        return value
      },
      set(newval){
        if(newval!==value){
          value = newval
        }
      }
    })
  }
}
