Function.prototype.mycall = function (context) {
  context = context || window;
  context.fn = this;
  var args = [];
  for(var i = 1, len = arguments.length; i < len; i++) {
    args.push(arguments[i]);
  }
  let result = context.fn(...args);
  delete context.fn;
  return result
}