# vue系列---vue-diff

## 1.vue-diff 是什么？

   提到vue的diff算法就不得不提一个名词 虚拟dom(Virtual DOM) ,什么是虚拟dom,我的理解是使用js对象来描述dom节点，是js和html的中间层，是一层对真实 DOM 的抽象。以前传统的开发直接使用js操作dom,现在使用js操作js对象(虚拟dom),在合适的时机将虚拟dom转化为真实dom节点

为什么需要虚拟dom?

​	为什么需要虚拟dom,直接操作dom不是更方便吗？实际上真正的 DOM 元素是非常庞大的，里面有非常多的属性，当我们频繁的去做 DOM 更新，会产生一定的性能问题。而虚拟dom使用js对象来描述dom节点，所以它比创建一个 DOM 的代价要小很多。

​	**虚拟DOM的最终目标是将虚拟节点渲染到视图上**。但是如果直接使用虚拟节点覆盖旧节点的话，会有很多不必要的DOM操作。例如，在一个dom元素非常多的页面你只改里其中的一个地方，这种情况下如果使用新的虚拟节点覆盖旧节点的话，造成了性能上的浪费，这个时候就需要比较计算新老虚拟节点的不同，差量的更新。所以这个时候vue-diff 就出现了。

## 2.虚拟dom的优势

​	也许有人会问，当我们要更新页面上的某个元素，直接操作指定位置的dom不是更方便吗？实际上虚拟dom的优势不在于单次的操作，而是在大量、频繁的操作下能够对视图进行合理、高效的更新。熟悉vue的同学应该知道，vue的更新是异步的这也意味着，使用虚拟dom可以将一定时间内对dom的操作，反应在最终将虚拟dom映射为真实dom上。当然虚拟dom的优势不仅仅在此，将真实dom抽象为虚拟dom,这样就可以使用虚拟dom进行同构，在不同的场景下映射为不同的表现层("dom"), 比如说浏览器平台、Weex、ssr等。

## 3.手写mini版 vue-diff

​		Vue的diff算法是基于snabbdom改造过来的，**仅在同级的vnode间做diff，最终实现整个DOM树的更新**。这样可以大大降低时间复杂度(从O(n3)变成O(n)）。

```
// 虚拟节点中所包含的属性
export default class VNode {
  tag: string | void; // 标签名
  data: VNodeData | void; // 数据
  children: ?Array<VNode>; // 子节点数组
  text: string | void;  // 真实节点所对应的文本
  elm: Node | void;  // 对应的真实dom
  key: string | number | void; // 元素上定义的key
  parent: VNode | void; // component placeholder node
  isStatic: boolean; // hoisted static node  // 是否是静态节点
  isComment: boolean; // 是否是注释节点
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?  // 是否是v-once的节点
}
```



```
// params: 老节点和新节点
function patch (oldVnode, vnode) {
	// 老节点不存在为第一次渲染
    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true
      // 根据vnode生成新元素
      createElm(vnode)
    } else {
      // 判断新老节点是否值得比较
      if (sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode)
      } else {
         const oEl = oldVnode.el // 当前oldVnode对应的真实元素节点
         let parentEle = api.parentNode(oEl)  // 获取父节点
         createEle(vnode)  // 根据Vnode生成新元素
         if (parentEle !== null) {
            api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl)) // 将新元素添加进父元素
            api.removeChild(parentEle, oldVnode.el)  // 移除以前的旧元素节点
            oldVnode = null
         }
      }
    }
}
```

```
// key节点唯一标识 tag(标签名)  isComment(是否为注释节点)
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      )
    )
  )
}
```

```
  // 判断两个节点是否值得比较
  function patchVnode (oldVnode, vnode) {
    if (oldVnode === vnode) {
      return
    }
    // 找到老节点的真实dom, elm
    const elm = vnode.elm = oldVnode.elm
    // 找到新老节点的孩子节点 
    const oldCh = oldVnode.children
    const ch = vnode.children
    // 新节点没有文本
    if (isUndef(vnode.text)) {
      // 新老节点的孩子节点都为真
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) 
        	// 比较两个孩子节点
        	updateChildren(elm, oldCh, ch)
      } else if (isDef(ch)) {
      	// 新节点孩子为真 老节点有文本 清空文本
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        // 将新节点的孩子节点加入到真是dom上
        addVnodes(elm, null, ch, 0, ch.length - 1)
      } else if (isDef(oldCh)) {
        // 老节点的子节点为真 新节点的子节点为假 删除老节点
        removeVnodes(elm, oldCh, 0, oldCh.length - 1)
      } else if (isDef(oldVnode.text)) {
      	// 老节点有文本 清空文本
        nodeOps.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) {
      // 新老节点都有文本，直接使用新文本替换老文本
      nodeOps.setTextContent(elm, vnode.text)
    }
  }
```


```
// 判断虚拟节点的子节点数组是否要比较
function updateChildren (parentElm, oldCh, newCh) {
	// 定义两个指针分别指向两个子节点数组的开始
    let oldStartIdx = 0
    let newStartIdx = 0
    // 分别获取新老子节点数组的长度和四个开始和结束节点
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm
	// 当新老节点都没有对比完一直循环
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      // 老节点的开始节点不存在，则直接进行下次循环
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
        
      }
      // 老节点的结束节点不存在，则直接进行下次循环
      else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
      }
      // 判断新老子节点的开始节点是否值比较
      else if (sameVnode(oldStartVnode, newStartVnode)) {
      	// 递归比较两个节点
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
        // 移动两个指针
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      }
      // 同上
      else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      }
      // 首尾比较
      else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode)
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      }
      // 首尾比较
      else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode)
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      }
      // 使用v-for 建议添加key 当两首两尾首尾都不值得比较，这个时候如果定义了key就会通过key查找是否值得比较
      else {
        if (isUndef(oldKeyToIdx)) 
        	// createKeyToOldIdx会返回一个map key就是老元素的key值是老元素的索引(oldKeyToIdx)
        	oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        // findIdxInOld方法 (在老的里面查找出值得比较的元素)
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        // idxInOld (老子节点数组中值得比较的节点的索引位置)
        if (isUndef(idxInOld)) { // New element
         // 说明新子节点在老子节点数组中不存在，直接创建新的元素
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        } else {
          vnodeToMove = oldCh[idxInOld]
          // 值得比较
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
            oldCh[idxInOld] = undefined
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
          } else {
            // key 相同但是元素不同，按新元素处理
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
          }
        }
        // 移动指针
        newStartVnode = newCh[++newStartIdx]
      }
    }
    // 新的子节点数组长度长 添加新增的
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx)
    } else if (newStartIdx > newEndIdx) {
      //老的子节点数组长度长 删除多余的
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
  }
```

