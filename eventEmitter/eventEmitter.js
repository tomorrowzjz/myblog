class EventEmitter {

  constructor(){
    this.eventList = {}
  };
  on(type,handler){
    this.eventList[type] = []
    this.eventList[type].push(handler)
  };
  emit(type,params){
    let arr = this.eventList[type];
    arr.forEach(handler=>{
      handler.call(this,params);
    })
  }
}
module.exports = EventEmitter
