function deepClone(target) {
  if (typeof target == 'object') {
    let obj = Array.isArray(target)?[]:{}
    for(const key in target){
      obj[key] = deepClone(target[key])
    }
    return obj
  }else {
    return target
  }
}
