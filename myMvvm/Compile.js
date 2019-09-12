class Compile {
  constructor(vm,el){
    console.log(vm, el);
    this.el = this.isElementNode(el)?el:document.querySelector(el)
    this.vm = vm;
    if (this.el) {
      let fragment = this.node2fragment(this.el);
      this.compile(fragment);
      this.el.appendChild(fragment)
    }
  }
  isElementNode(el){
    return el.nodeType === 1
  }
  node2fragment(el){
    let fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = el.firstChild){
      fragment.appendChild(firstChild)
    }
    return fragment
  }
  compile(fragment){
    let childNodes = fragment.childNodes;
    Array.from(childNodes).forEach(node=>{
      if (this.isElementNode(node)) {
        this.compile(node);
      }else {
        this.compileText(node);
      }
    })
  }
  compileText(node){

  }

}
