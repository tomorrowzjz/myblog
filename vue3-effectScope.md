## vue官网介绍

## effectScope()[​](https://cn.vuejs.org/api/reactivity-advanced.html#effectscope)

创建一个 effect 作用域，可以捕获其中所创建的响应式副作用 (即计算属性和侦听器)，这样捕获到的副作用可以一起处理。对于该 API 的使用细节，请查阅对应的 [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md)

## **示例**

### 示例1 （基本用法）

```
        const scope = effectScope()

        scope.run(() => {
          const doubled = computed(() => counter.value * 2)

          watch(doubled, () => console.log(doubled.value))

          watchEffect(() => console.log('Count: ', doubled.value))
        })

        // 处理掉当前作用域内的所有 effect
        scope.stop()
```        

### 示例2   (嵌套作用域)

嵌套作用域也应该由其父作用域收集。当父作用域被释放时，其所有后代作用域也将被停止。

```
    const scope = effectScope()

    scope.run(() => {
      const doubled = computed(() => counter.value * 2)

      // not need to get the stop handler, it will be collected by the outer scope
     // 不需要获取子作用域的引用，它将由外部范围收集
      effectScope().run(() => {
        watch(doubled, () => console.log(doubled.value))
      })

      watchEffect(() => console.log('Count: ', doubled.value))
    })

    // 销毁所有响应式效果，包括nestedScope
    scope.stop()
```    

有一种需求是调用这个scope.stop() 是不希望切套的子effectScope作用域停止那么就需要看下面的例子了

### 示例3

```
    let nestedScope

    const parentScope = effectScope()

    parentScope.run(() => {
      const doubled = computed(() => counter.value * 2)

      // 使用 detected flag,当detected为true
      // 这个作用域将不被父级作用域收集和销毁
      nestedScope = effectScope(true /* detached */)
      nestedScope.run(() => {
        watch(doubled, () => console.log(doubled.value))
      })

      watchEffect(() => console.log('Count: ', doubled.value))
    })

    // 销毁所有响应式效果，不包括nestedScope
    parentScope.stop()

    // 停止子作用域 nestedScope 的响应式效果 
    nestedScope.stop()
```

###

## 为什么需要这个api&#x20;

在Vue的组件中`setup()`，响应效果将被收集并绑定到当前实例。当实例被卸载时，效果将自动释放。这是一个方便且直观的功能。

然而，当我们在组件之外或作为独立包使用它们时，我们如何停止`computed` 和 `watch` 的响应式效果呢？

下面的例子中写了在组件外**没有**effectScope  API的时候如何停止响应效果

```

function stop(effect) {
  // 在这里执行停止计算属性响应的操作
  // 例如，可以调用effect.stop()方法来停止响应效果
  effect.stop();
}
const disposables = []

const counter = ref(0)
const doubled = computed(() => counter.value * 2)

disposables.push(() => stop(doubled.effect))

const stopWatch1 = watchEffect(() => {
  console.log(`counter: ${counter.value}`)
})

disposables.push(stopWatch1)

const stopWatch2 = watch(doubled, () => {
  console.log(doubled.value)
})

disposables.push(stopWatch2)

// 停止影响
disposables.forEach((f) => f())
disposables = []
```

从上面的代码可以看出在组件外使用。需要自己收集需要停止的响应效果。在不需要的时候停止响应，这也就是这个api出现的时机。

## 实现原理

```
// 当前正在执行的scope
let activeEffectScope: EffectScope | undefined
// 记录栈
const effectScopeStack: EffectScope[] = []

export class EffectScope {
  // 是否是激活态
  active = true
  // 记录的effects
  effects: ReactiveEffect[] = []
  // 用户注入的清除函数
  cleanups: (() => void)[] = []
  // 父级
  parent: EffectScope | undefined
  // 子级scopes
  scopes: EffectScope[] | undefined
  
  // 索引，记住当前scope在父级中的位置
  private index: number | undefined

  // 是否需要阻断
  constructor(detached = false) {
    // 如果不阻断，则要记录父级关系
    if (!detached && activeEffectScope) {
      // 当前正在使用的effect作用域作为父级
      this.parent = activeEffectScope
      // 记住当前作用域在父级中的位置   push 会返回当前数组的长度，长度减1正好是当前元素在数组中的位置索引
      this.index =
        (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this
        ) - 1
    }
  }

  // 用户执行操作
  run<T>(fn: () => T): T | undefined {
    if (this.active) {
      try {
        // 打开effect收集
        this.on()
        // 执行用户方法
        return fn()
      } finally {
        // 关闭收集
        this.off()
      }
    } else if (__DEV__) {
      warn(`cannot run an inactive effect scope.`)
    }
  }

  // 开启收集
  on() {
    if (this.active) {
      // 将当前scope入栈，并设置为当前effect
      effectScopeStack.push(this)
      activeEffectScope = this
    }
  }

  // 关闭收集
  off() {
    if (this.active) {
      // 出栈，并恢复正在使用的effectScope
      effectScopeStack.pop()
      activeEffectScope = effectScopeStack[effectScopeStack.length - 1]
    }
  }

  // 统一停止收集到的effect监听，传入是否是父级删除标志
  stop(fromParent?: boolean) {
    if (this.active) {
      // 停止所有effect
      this.effects.forEach(e => e.stop())
      // 执行用户注册的清除函数
      this.cleanups.forEach(cleanup => cleanup())

      // 停止所有子级scope，并传入是父级停止
      if (this.scopes) {
        this.scopes.forEach(e => e.stop(true))
      }

      // 停止监听，如果是自身停止，也要从父级中删除，防止内存泄漏
      if (this.parent && !fromParent) {
        // 直接从父级中删除一个，判断是否是当前，如果不是则跟当前替换位置
        const last = this.parent.scopes!.pop()
        if (last && last !== this) {
		  // 使用感叹号（!）进行断言，表示告知TypeScript编译器，this.parent.scopes和this.index都不会为null或undefined
          this.parent.scopes![this.index!] = last
          last.index = this.index!
        }
      }
      // 标识当前已经停止
      this.active = false
    }
  }
}

// 创建effect作用域对象
export function effectScope(detached?: boolean) {
  return new EffectScope(detached)
}

```

上面讲了  EffectScope 这个类如何实现的，当调用stop 的时候会停止监听，那么能停止监听，调用  this.effects.forEach(e => e.stop()) 停止监听，那么this.effects数组什么时候push的数据？

    export function recordEffectScope(
      effect: Watcher,
      scope: EffectScope | undefined = activeEffectScope
    ) {
      if (scope && scope.active) {
        scope.effects.push(effect)
      }
    }
    // 在watch类的构造函数里面通过recordEffectScope 函数将依赖push到scope的scope.effects.push(effect)
    export default class Watcher implements DepTarget {

      ...
      constructor(
        vm: Component | null,
        expOrFn: string | (() => any),
        cb: Function,
        options?: WatcherOptions | null,
        isRenderWatcher?: boolean
      ) {
        recordEffectScope(
          this,
          // if the active effect scope is manually created (not a component scope),
          // prioritize it
          activeEffectScope && !activeEffectScope._vm
            ? activeEffectScope
            : vm
            ? vm._scope
            : undefined
        )
        ...
        ...
      }

      ...	
    }

而 computed watch watchEffect 的实现都会在内部实例化一个 new Watcher 也就是会执行scope.effects.push(effect)，讲到这里我相信大家都对effectScope 有了了解



参考  <https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md>
