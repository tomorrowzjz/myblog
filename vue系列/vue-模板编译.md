# vue的编译是什么
  编译是把我们写的.vue文件里的template标签包含的html标签变为render函数，可以这么理解template模板是对render的封装，template在vue源码里面会变转化为render函数

  

```
// 在传入的选项对象中判断有没有render函数，没有的话就获取template模板最后通过compileToFunctions编译为render函数
if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns
    }
}    
```

那么compileToFunctions函数里面到底做了什么，为什么能把template模板转化为render函数

```
// 核心代码是把tempalte转化为ast语法树，在把转化出来的ast语法树做一个静态标记(optimize),最后转化为code
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

template如何转化为ast呢，一个普通的标签的形式为  <div class="item" v-if="flag">zs</div>,在转化为ast的时候通过正则和一个栈结构,把标签名  div   类型   children分离出来转化后的ast大概的样子为

```
ast = {
  'type': 1,
  'tag': 'div',
  'attrsList': [],
  'attrsMap': {
    'class': 'item',
    'v-if': 'flag'
  },
  'parent': undefined,
  'children': [{
    'type': 2,
    'text':zs
    }
    ]
  }]
}
```

optimize(ast, options)做的事是吧ast的这个js对象做静态标记，在标签上有vue的指令的使用到组件的data里面的数据可能会相应的都为动态的，所谓的静态是在新老两颗虚拟dom数做比较的时候可以不用比较，他是不会改变的，静态化后的ast样子为

```
 
 ast = {
  'type': 1,
  'tag': 'div',
  'attrsList': [],
  'attrsMap': {
    'class': 'item',
    'v-if': 'flag'
  },
  'parent': undefined,
  'static': false,
  'children': [{
    'type': 2,
    'text':zs,
    'static': false
    }
    ]
  }]
}
```

最后一步执行 const code = generate(ast, options)

```
export function generate (
  ast: ASTElement | void,
  options: CompilerOptions
): CodegenResult {
  const state = new CodegenState(options)
  const code = ast ? genElement(ast, state) : '_c("div")'
  return {
    render: `with(this){return ${code}}`,//这就是最后生成的render函数
    staticRenderFns: state.staticRenderFns
  }
}
```

```
_c('div', {
    staticClass: "item"
    },
    [_v("zs")]
)
```
