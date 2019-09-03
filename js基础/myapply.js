Function.prototype.myapply = function (context) {
  context = context || window;
  context.fn = this;
  let result = context.fn(arguments[1]);
  delete context.fn;
  return result
}

