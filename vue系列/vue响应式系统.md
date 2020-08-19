# vue响应式原理

要说vue响应式原理首先要说的是Object.defindProperty(),这个是响应式原理的基础。[mdn](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

下面我举个栗子

```js
    let obj = {
        name: "zs",
        age:10
    }
    Object.keys(obj).forEach(item=>{
      let val = obj[item]
      Object.defineProperty(obj,item,{
        get() { 
          console.log(`访问了${item}属性`);
          return val; 
        },
        set(newValue) { 
          console.log(`新值是${newValue}`);
          val = newValue; 
        },
        enumerable : true,
        configurable : true
      })
    })
    console.log(obj.age);
    console.log(obj.name);
    obj.age = 20
    obj.name = "ls"
```
操作结果
![企业微信截图_15978227336863](C:\Users\zhangjianzhong\Desktop\企业微信截图_15978227336863.png)

(如果看不到图请看当前文件夹下的img/1.png)

从上面的例子可以看出如果没使用Object.defindProperty()直接访问obj.age也可以得到10的值，如果我想在访问obj.age属性的时候做一些其他的事，例如年龄不能超过500,如果超过500直接返回500，这个需求对于直接访问obj的对应属性是没办法办到了，这个时候需要我们访问obj对应的key的时候触发一个方法，或者说我们可以代理访问obj的key,这个时候Object.defindProperty()这个api完美的解决了这个问题。在访问和设置对应的属性的时候可以劫持这个属性的访问，这也是vue响应式原理的基础。

## vue响应式原理

```
...
<div id="app">
  {{obj.name}}
  <button @click="modify">修改</button>
</div>
<script>
new Vue({
  el: '#app',
  data: {
    obj:{name:"zs"}
  },
  methods:{
	modify(){
		this.obj.name = "lisi"
	}
  }
})
...
```

当我们点击添加按钮后,修改obj.name这个属性，页面自动更改了，这个就是vue响应式所做的工作



到底如何实现的当数据发生变化后，页面自动更新的？

下面我们来从new Vue开始分析

```
//1.new Vue的时候会执行_init方法
function Vue (options) {
  this._init(options)
}
//2. init方法调用initState
Vue.prototype._init = function (options?: Object) {
   ...
    initState(vm)
    // 调用钩子函数
    callHook(vm, 'created')
    // 当传入挂载点时，渲染页面
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
    ...
  }
  //3.initState方法调用initData
  function initState (vm: Component) {
      const opts = vm.$options
      // 获取配置对象中的data属性进行初始化
      if (opts.data) {
        initData(vm)
      }
  }
  //4.initData方法调用observe
  initData (vm: Component) {
      let data = vm.$options.data
      // 使传入的数据变为响应式的,也就是劫持对象的set和get，方便依赖收集
      observe(data, true /* asRootData */)
  }
  //5. 
  function observe (value: any, asRootData: ?boolean): Observer | void {
      let ob: Observer | void
      ob = new Observer(value)
      return ob
  }
  //6. 真正对数据进行递归劫持的Observer类
  export class Observer {
      value: any;
      dep: Dep;
      vmCount: number; // number of vms that has this object as root $data
      constructor (value: any) {
        this.value = value
        // 初始化依赖收集器（可以理解为微信公众号）
        this.dep = new Dep()
        // 判断是否为数组,
        if (Array.isArray(value)) {
          const augment = hasProto
            ? protoAugment
            : copyAugment
          augment(value, arrayMethods, arrayKeys)
          this.observeArray(value)
        } else {
          循环劫持对像的属性
          this.walk(value)
        }
      }
      walk (obj: Object) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
          defineReactive(obj, keys[i])
        }
      }
      observeArray (items: Array<any>) {
        for (let i = 0, l = items.length; i < l; i++) {
          observe(items[i])
        }
      }
  }
  //7.
  export function defineReactive (
      obj: Object,
      key: string,
      val: any,
      customSetter?: ?Function,
      shallow?: boolean
    ) {
      // 初始化依赖收集器（可以理解为微信公众号）
      const dep = new Dep()
      val = obj[key]
      // 递归劫持
      let childOb = observe(val)
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter () {
          const value = getter ? getter.call(obj) : val
          // 当Dep.target为真时依赖收集（什么时候为真看下方分析）
          if (Dep.target) {
            dep.depend()
          }
          return value
        },
        set: function reactiveSetter (newVal) {
          if (setter) {
            setter.call(obj, newVal)
          } else {
            val = newVal
          }
          // 将传入的新值变为响应式的
          childOb =  observe(newVal)
          // 当对应的值改变的时候派发更新（也就是使用到这个值的每一个地方都替换为新值）
          dep.notify()
        }
      })
  }
```

上面是new Vue 到数据变为响应式的整个过程，然而上面的流程只能让数据变为响应式的，当数据发生变化后页面如何更新，依赖是如何收集的，什么时候会触发依赖收集，

当我们访问obj.name 的时候会触发 Object.defineProperty()的get访问器，在get访问器中有一个Dep.target,其中Dep是依赖收集器，Dep.target是Dep类上面的一个静态属性 类型为Watcher，下面讲一下Dep和Watcher的关系

Dep相当于我们的微信公众号，Watcher 相当于关注者，本质上他们是多对多的关系 ，当一个人想收到某个公众号推送的消息，那么他必须关注这个公众号，也就是订阅这个公众号，这个订阅也就是“收集依赖”的一个过程，当公众号有新的文章之后，可以推送给关注他的人，这个关注者就能收到这个变化，也就是代码中当获取obj的属性的时候也就是触发get方法中进行依赖收集（dep.depend()）也就是记录一下那几个地方使用了该属性，在改变值的时候派发更新（dep.notify()）也就是使用到该属性的地方地需要改变为新值。

什么时候进行依赖收集？

看上面的get方法当Dep.target为真的时候才进行依赖收集，那么什么时候Dep.target为真呢？看下面源码的解析

```
export default class Watcher {
  ...
  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    this.cb = cb
    this.id = ++uid // uid for batching
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.getter = expOrFn
    this.value = this.get()
  }
  // 真正进行依赖收集的方法
  get () {
    pushTarget(this)
    let value
    const vm = this.vm
    // 执行传入的方法也就是vm._update(vm._render(), hydrating)进行渲染,vm._render()最后的返回值是一个虚拟节点,vm._update方法真正进行diff算法更改dom
    value = this.getter.call(vm, vm)
    return value
  }
  // 使watcher记录下每一个dep(订阅器)(微信公众号)
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }
  // 清空dep
  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }
  // 派发更新真正要执行的
  update () {
     queueWatcher(this)
  }
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }
}

```

```
class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;
  constructor () {
    this.id = uid++
    this.subs = []
  }
  // 收集依赖
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  // 循环派发更新(通知每一个订阅者)
  notify () {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
Dep.target = null
const targetStack = []

export function pushTarget (_target: ?Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget () {
  Dep.target = targetStack.pop()
}
```

可以看到当调用pushTarget方法后 Dep.target变为_target，也就是在Watcher类里面的get方法被调用的时候Dep.target变为_target,那么什么时候get被调用呢，就是在watcher的构造函数中执行，也就是new Watcher 的时候执行，那么什么时候会new一个Watcher对象呢

```
// 1. new Vue()
// 2. Vue.prototype._init(option)
// 3. vm.$mount(vm.$options.el)
// 4. render = compileToFunctions(template) 将vue中的template模板编译为render函数
// 5. Vue.prototype.$mount 在init方法里面有这么一句话 if (vm.$options.el) {vm.$mount(vm.$options.el)}当有挂载点的时候会执行$mount方法
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
// 6. mountComponent
function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  // 执行beforeMount钩子函数
  callHook(vm, 'beforeMount')
  let updateComponent
  updateComponent = () => {
  	vm._update(vm._render(), hydrating)
  }
  // 这个时候会new 一个 渲染watcher 当创建对象的时候会执行updateComponent方法进而执行 vm._update(vm._render(), hydrating)进行渲染
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
    //vm.$vnode 表示 Vue 实例的父虚拟 Node，所以它为 Null 则表示当前是根 Vue 的实例。
  if (vm.$vnode == null) {
    //表示这个实例已经挂载了，
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}

```

从上面我们可以看到当用户new Vue的时候传了$el 也就是挂载点的时候 会执行vm.$mount(vm.$options.el)，进而调用mountComponent方法，在这个方法里面new  Watcher的时候执行 watcher构造函数里的get方法使的Dep.target为真并调用传入的getter方法也就是 vm._update(vm._render(), hydrating)进行渲染，渲染模板的时候会获取模板中的数据,从而触发对象的属性访问器get,而这个时候Dep.target恰好为真，利用了闭包，调用dep.depend()将依赖收集起来（也就是点击了订阅），在改变值的时候派发更新

