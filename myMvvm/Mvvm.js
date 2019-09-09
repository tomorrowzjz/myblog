class Mvvm{
  constructor(options){
    this.$data = options.data||{};
    this.$el = options.el;
    if (this.$el) {
      new Observer(this.$data)
      new Compile(this,this.$el)
    }
  }
}
