# Vue3.0 响应式API原理 解析

首先先看一下响应式api都有哪些

## 响应性基础 API

## `reactive`

返回对象的响应式副本，响应式转换是“深层”的，返回的proxy不等于原对象

```
const obj = { count: 0 }
const retObj = reactive(obj)
console.log(obj === retObj)//false
```

实现

```
function reactive(target: object) {
  if (target && target.__v_isReactive) {
    return target
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers
  )
}
function createReactiveObject(
  target,
  isReadonly,
  baseHandlers,
  collectionHandlers
) {
  const proxyMap = isReadonly ? readonlyMap : reactiveMap
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  // only a whitelist of value types can be observed.
  const targetType = getTargetType(target)
  if (targetType === TargetType.INVALID) {
    return target
  }
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  )
  proxyMap.set(target, proxy)
  return proxy
}
```



## `readonly`

获取一个对象 (响应式或纯对象) 或 [ref](https://v3.cn.vuejs.org/api/refs-api.html#ref) 并返回原始 proxy 的只读 proxy。只读 proxy 是深层的：访问的任何嵌套 property 也是只读的。

```
const original = reactive({ count: 0 })
const copy = readonly(original)
// 变更original 会触发侦听器依赖副本
original.count++
// 变更副本将失败并导致警告
copy.count++ // 警告!是只读的不能set
```



## `isProxy`

## `isReactive`

## `isReadonly`

## `toRaw`

## `markRaw`

## `shallowReactive`

## `shallowReadonly`

## Refs

## `ref`

## `unref`

## `toRef`

## `toRefs`

## `isRef`

## `customRef`

## `shallowRef`

## `triggerRef`

