# 

​		使用vue的同学都知道使用keep-alive包裹的组件当再次访问该组件时不会再次走生命周期函数了，取而代之的是[activated](https://cn.vuejs.org/v2/api/#activated)和[deactivated](https://cn.vuejs.org/v2/api/#deactivated) 不走生命周期说明 在离开该组件的时候没有走[destroyed](https://cn.vuejs.org/v2/api/#destroyed)  ，那么说明被keep-alive组件包裹的组件当访问其他路由组件的时候没有被销毁而是被缓存起来了，   

在说keep-alive之前我先抛出几个问题

1.keep-alive 包裹的组件使用什么机制让他没有被销毁的

2.keep-alive 是抽象组件 ，那么抽象组件和正常组件的区别是什么。

问题一   keep-alive 包裹的组件使用什么机制让他没有被销毁的

```
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
   ...
  },
  prepatch: function prepatch (oldVnode, vnode) {
    ...
  },
  insert: function insert (vnode) {
    ...
  },
  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      // 当keepAlive为true 的时候不执行销毁方法
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};
```

通过上面代码我们知道 当 vnode.data.keepAlive为true的时候不执行组件的销毁方法，那么keepAlive什么时候变为true的，答案就在keep-alive 这个抽象组件里面

```
export default {
  name: 'keep-alive',
  abstract: true,
  ...
  render () {
  	 const slot = this.$slots.default
     const vnode: VNode = getFirstComponentChild(slot)
      // 被keep-alive包裹的组件会把组件的vnode.data.keepAlive设置为true
      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}

```

通过上面的代码我们看到，keep-alive 是一个抽象组件，在其render方法中将keepAlive设置为true

问题2  keep-alive 是抽象组件 ，那么抽象组件和正常组件的区别是什么。

```
let parent = options.parent
if (parent && !options.abstract) {
  while (parent.$options.abstract && parent.$parent) {
    parent = parent.$parent
  }
  parent.$children.push(vm)
}
vm.$parent = parent
```

通过上面代码我们知道当options.abstract也就是组件为抽象组件的时候，在组件实例建立父子关系的时候会被忽略，也就是说被抽象组件包裹的组件的$parent是其不为抽象组件的父组件，抽象组件是不会被渲染出来的。



下面我们开始看keep-alive 组件的源码（再看源码之前请先确保[keep-alive](https://cn.vuejs.org/v2/api/#keep-alive)的用法已经没有问题了）

```
export default {
  name: 'keep-alive',
  abstract: true,
  // include - 字符串或正则表达式。只有名称匹配的组件会被缓存。
  // exclude - 字符串或正则表达式。任何名称匹配的组件都不会被缓存。
  // max - 数字。最多可以缓存多少组件实例
  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created () {
    this.cache = Object.create(null)
    this.keys = []
  },

  destroyed () {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },

  render () {
    const slot = this.$slots.default
    // 如果 keep-alive 存在多个子元素，keep-alive 只会渲染第一个子元素
    const vnode: VNode = getFirstComponentChild(slot)
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

​      const { cache, keys } = this
​      const key: ?string = vnode.key == null
​        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
​        : vnode.key
​      if (cache[key]) {
​        vnode.componentInstance = cache[key].componentInstance
​        // make current key freshest
​        remove(keys, key)
​        keys.push(key)
​      } else {
​        cache[key] = vnode
​        keys.push(key)
​        // prune oldest entry
​        if (this.max && keys.length > parseInt(this.max)) {
​          pruneCacheEntry(cache, keys[0], keys, this._vnode)
​        }
​      }

​      vnode.data.keepAlive = true
​    }
​    return vnode || (slot && slot[0])
  }
}
```

keep-alive 是直接使用render函数返回vnode的，render函数最终会返回VNode虚拟节点

```
 // 获取组件的默认插槽也就是 获取keep-alive标签包裹的元素也就是插槽
 // <keep-alive>
 // <component :is="view"></component>
 // </keep-alive>
 const slot = this.$slots.default   
 // 如果 keep-alive 存在多个子元素，keep-alive 只会渲染第一个子元素,通过getFirstComponentChild获取第一个虚拟节点
 const vnode: VNode = getFirstComponentChild(slot)
 // 获取节点的组件选项
 const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
 //  根据传入进来的插槽(虚拟节点的数组)返回其第一个节点
 getFirstComponentChild (children: ?Array<VNode>): ?VNode {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      const c = children[i]
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}
```

keep-alive真正核心的算法(LRU: Least recently used，最近最少使用)如下：

```
// cache为存放缓存组件的对象  this.cache = Object.create(null)
const { cache, keys } = this
// key为每个组件唯一的key是组件的cid和组件名,是唯一的
const key: ?string = vnode.key == null
    ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
    : vnode.key
// 判断组件是否被缓存
if (cache[key]) {
    // 被缓存直接获取被缓存组件的实例对象componentInstance
    vnode.componentInstance = cache[key].componentInstance
    remove(keys, key)
    keys.push(key)
} else {
	// 没有缓存过，先添加缓存
    cache[key] = vnode
    keys.push(key)
    // prune oldest entry
    // 有最大个数限制的情况下删除最久没有使用过的组件
    if (this.max && keys.length > parseInt(this.max)) {
    
    	pruneCacheEntry(cache, keys[0], keys, this._vnode)
    }
}

--------
// cache 缓存对象可以理解为map   key 组件的唯一标识   keys组件key的数组   current 当前组件
function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  // 获得缓存组件
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    // 手动调用销毁函数
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}
```

下面看当include和exclude变化时keep-alive 组件进行了那些操作

```
 mounted () {
    // 监听include和exclude变化和直接写watch选项一样
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },

----------------

  // 通过组件选项对象获取组件名字
  function getComponentName (opts: ?VNodeComponentOptions): ?string {
      return opts && (opts.Ctor.options.name || opts.tag)
  }
// pattern 是include [String, RegExp, Array]选项 可以是字符串，正则表达式，数组   name 当前活跃组件的名称
// 返回值为是否匹配的boolean值 
function matches (pattern: string | RegExp | Array<string>, name: string): boolean {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}
  // keepAliveInstance: keepalive组件实例, filter 函数 (matches函数)返回值是是否包含当前组件的Boolean值
  function pruneCache (keepAliveInstance: any, filter: Function) {
      const { cache, keys, _vnode } = keepAliveInstance
      // 遍历缓存对象,判断缓存是否应该删除
      for (const key in cache) {
        const cachedNode: ?VNode = cache[key]
        if (cachedNode) {
          const name: ?string = getComponentName(cachedNode.componentOptions)
          // 当前组件的名称存在 且没有包含在include中或者包含在exclude中
          if (name && !filter(name)) {
            // 销毁组件
            pruneCacheEntry(cache, key, keys, _vnode)
          }
        }
      }
  }
 /**
 * 去除对应数组中的某一项
 */
export function remove (arr: Array<any>, item: any): Array<any> | void {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
```

