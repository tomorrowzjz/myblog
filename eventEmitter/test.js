let eventEmitter = require('./eventEmitter')
let obj = new eventEmitter()
obj.on('say',(e)=>{
  console.log(111);
  console.log(e);
})
obj.emit('say',222);
obj.emit('say',232);
