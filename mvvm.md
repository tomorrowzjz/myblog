## 编译
 > 编译是将浏览器解析不了的 自定义指令，自定义组件，{{}} 替换为在data,computed.props 中的数据，
   (在获取data，props中的值时会触发 get方法，这个时候也是进行依赖收集的时候。)，在编译中创建观
    察者对象
 > 在创建观察者（new Watcher) 的时候 ，会触发对象属性的getter 获取旧值, 在更改值的时候回触发对
   象属性的setter方法，在setter方法中回调用订阅器dep的notify方法通知每一个订阅者，更新视图。
 > mvvm 对象将observer响应式对象和compile编译的过程结合起来
   