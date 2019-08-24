# myblog
一些学习笔记
## 2018-11-9
## 1.Object.defineProperty(object, propertyname, descriptor) 
### object：要在其上添加或修改属性的对象。
### propertyname：一个包含属性名称的字符串。就是需要定义的属性和方法。
### descriptor:可以包含以下属性，默认情况下， writable， enumerable，configurable值为false
### descriptor 
    * value:属性的值 
    * writable:如果为false，属性的值就不能被重写,只能为只读了。
    * enumerable:是否能枚举，也就是否能在for...in循环中遍历出来或在Object.keys中列举出来。
    * configurable:如果为false，就不能再设置他的（value，writable，configurable）。

## 2.Object.getOwnPropertyDescriptors
这个方法主要的作用是返回属性的描述对象（descriptor）。
## 3. js创建对象的几种方式
### a. 工厂模式
     function createObj(){
        var o = new Object();
        o.name = "zs";
        o.age = 3;
        o.sayName= function() {
            console.log(this.name)
        }
        return o;
        
    }
### b. 构造函数模式
     function Person(){
        
     }
     var person = new Person();
### c. 原型模式

## 4. 在JSX中设置style属性
      在JSX中我们通常是通过 {} 的方式插入值，但是设置style属性需要{{ }} ,否则系统会报错。
## 5. 正则表达式模糊匹配：
        *  横向模糊匹配:一个正则可匹配的字符串的长度不是固定的，可以是多种情况的
        > var regex = /ab{2,5}c/g;
          var string = "abc abbc abbbc abbbbc abbbbbc abbbbbbc";
          console.log( string.match(regex) ); // ["abbc", "abbbc", "abbbbc", "abbbbbc"]
        * 纵向模糊匹配:一个正则匹配的字符串，具体到某一位字符时，它可以不是某个确定的字符
         > var regex = /a[123]b/g;
           var string = "a0b a1b a2b a3b a4b";
           console.log( string.match(regex) ); // ["a1b", "a2b", "a3b"]

## 6. 字符组:[123456abcdefGHIJKLM]，可以写成[1-6a-fG-M]。用连字符"-"来省略和简写
         排除字符组:[^abc]，表示是一个除"a"、"b"、"c"之外的任意一个字符。
         常见的简写形式：
         
         \d 就是[0-9]。表示是一位数字。记忆方式：其英文是digit（数字）。\D 就是[^0-9]。表示除数字外的任意字符。
         \w 就是[0-9a-zA-Z_]。表示数字、大小写字母和下划线。记忆方式：w是word的简写，也称单词字符。
         \W 就是[^0-9a-zA-Z_]。非单词字符。
         \s 就是[ \t\v\n\r\f]。表示空白符，包括空格、水平制表符、垂直制表符、换行符、回车符、换页符。记忆方式：s是space character的首字母。
         \S 就是[^ \t\v\n\r\f]。 非空白符。
         . 就是[^\n\r\u2028\u2029]。通配符，表示几乎任意字符。换行符、回车符、行分隔符和段分隔符除外。记忆方式：想想省略号...中的每个点，都可以理解成占位符，表示任何类似的东西。
## 7. 量词:
        * {m,} 表示至少出现m次。
        * {m} 等价于{m,m}，表示出现m次。
        * ? 等价于{0,1}，表示出现或者不出现。
        * + 等价于{1,}，表示出现至少一次。记忆方式：加号是追加的意思，得先有一个，然后才考虑追加。
        * 等价于{0,}，表示出现任意次，有可能不出现。记忆方式：看看天上的星星，可能一颗没有，可能零散有几颗，可能数也数不过来。
## 8. 多选分支
        * (p1|p2|p3)，其中p1、p2和p3是子模式，用“|”（管道符）分隔，表示其中任何之一
        > var regex = /good|nice/g;
          var string = "good idea, nice try.";
          console.log( string.match(regex) ); // ["good", "nice"]
          
          参考:https://zhuanlan.zhihu.com/p/27338649
## 9. react 心得
       * react setState({temp:temp})
            *这个操作是异步的，解决办法：
            > a. 使用回调函数
                  this.setState(theQuery, () => {
                    action.getRefundList(theQuery)
                  } );
              b. 使用setTimeout
                  this.setState({
                    selection: value
                  });
                  
                  setTimeout(this.fireOnSelect, 0);
       * 不要再rander函数里面调用setState();
       * componentWillReceiveProps 
            在组件接收到一个新的 prop (更新后)时被调用。这个方法在初始化render时不会被调用。
## 10. js 原型链
```js
    > function Person () {
      
      }
      let b = new Person();
      console.log(Person.prototype.constructor === Person);//true
      console.log(Object.prototype.__proto__);//null
      b.__proto__ === Person.prototype; // true
      Person.__proto__ === Function.prototype; // true
      Person.prototype.__proto__ === Object.prototype; //true
```
![prototype](https://github.com/tomorrowzjz/myblog/tree/master/img/prototype.jpg) 
## 11. 数组方法 slice()
    > slice() 方法返回一个从已有的数组中截取一部分元素片段组成的新数组（不改变原来的数组！） 
      用法：array．slice(start,end) start表示是起始元素的下标， end表示的是终止元素的下标
## 12. window.location 和 document.location 引用的是同一个对象。
## 13. location.search.substring(1)//获取地址栏的查询字符串
## 14.location.assign("http://www.wrox.com");
      window.location = "http://www.wrox.com"; 
      location.href = "http://www.wrox.com"; 
      location.replace("http://www.wrox.com/"); //导致浏览器位置改变，但不会在历史记录中生成新记录。
      location.reload(); //重新加载（有可能从缓存中加载）
      location.reload(true); //重新加载（从服务器重新加载）
## 15. element.getAttribute(attributename) 
        ele.getAttribute('class')//获取dom元素对应的类名
        ele.className='username';
## 16. 兼容
       > .svg-bg { 
           background: url("example.png"); /* 兼容*/
           background-image: url("example.svg"); 
       }
       // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
       if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
           Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
               confirmButtonText: '确定'
           });
       }else{
           next();
       }
## 17 NodeList  HTMLCollection
     NodeList 、NamedNodeMap 和 HTMLCollection，这三个集合都是“动态的”，每当文档结构发生变化时，它们都会得到更新
## 18  classList 
     add(value)：将给定的字符串值添加到列表中。如果值已经存在，就不添加了。
     contains(value)：表示列表中是否存在给定的值，如果存在则返回 true，否则返回 false。
     remove(value)：从列表中删除给定的字符串。
     toggle(value)：如果列表中已经存在给定的值，删除它；如果列表中没有给定的值，添加它。
    
    渲染页面的模式: 标准、混杂
    标准模式下，document.compatMode 的 值等于"CSS1Compat"
    混杂模式下，document.compatMode 的值等于"BackCompat"
    
     head 属性 作为对 document.body 引用文档的<body>元素的补充，HTML5新增了 document.head 属性， 引用文档的<head>元素。
     要引用文档的<head>元素，可以结合使用这个属性和另一种后备方法。 
    var head = document.head || document.getElementsByTagName("head")[0]; 
## 19 vue mixins
        Vue 组件中可复用功能的方式,可以将每个组件中共有的方法(逻辑相同的)抽离出来，在使用时将其混入  
【进阶 1 期】 调用堆栈
【进阶 2 期】 作用域闭包
【进阶 3 期】 this 全面解析
【进阶 4 期】 深浅拷贝原理
【进阶 5 期】 原型 Prototype
【进阶 6 期】 高阶函数
【进阶 7 期】 事件机制
【进阶 8 期】 Event Loop 原理
【进阶 9 期】 Promise 原理
【进阶 10 期】Async/Await 原理
【进阶 11 期】防抖/节流原理
【进阶 12 期】模块化详解
【进阶 13 期】ES6 重难点
【进阶 14 期】计算机网络概述
【进阶 15 期】浏览器渲染原理
【进阶 16 期】webpack 配置
【进阶 17 期】webpack 原理
【进阶 18 期】前端监控
【进阶 19 期】跨域和安全
【进阶 20 期】性能优化
【进阶 21 期】VirtualDom 原理
【进阶 22 期】Diff 算法
【进阶 23 期】MVVM 双向绑定
【进阶 24 期】Vuex 原理
【进阶 25 期】Redux 原理
【进阶 26 期】路由原理
【进阶 27 期】VueRouter 源码解析
【进阶 28 期】ReactRouter 源码解析

##20vue this.$router.push()
    > this.$router.push({name: 'dispatch', params: {data: data1}})
    取数据 this.$route.params.data（数据丢失）
    this.$router.push({path: '/transport/dispatch', query: {data: data1}})
    取数据 this.$route.query.data(刷新页面时数据不丢失)
##vue filter  局部注册  多个 分别单独使用
    >filters: {
           statusFilter(status) {
             const statusMap = {
               'created': '已创建',
               'working': '进行中',
               'self-check': '待自审',
               'admin-check': '待审核',
               'unpaid': '待结算',
               'finished': '已完成'
             }
             return statusMap[status]
           },
           statusFilterButton(status) {
             const statusMapButton = {
               'created':'----',
               'working': '----',
               'self-check': '----',
               'admin-check': '去审核',
               'unpaid': '去结算',
               'finished': '已完成'
             }
             return statusMapButton[status]
           },
         },
##vue父组件异步获取的数据(imagelist)传到子组件，在子组件的生命周期函数获取不到其值
    >  <op-list :isContent="isContent" :isCheckout="isCheckout" :imagelist="imagelist" v-if="imagelist.length"></op-list>
## sessionStorage
    通过点击链接（或者用了 window.open）打开的新标签页之间是属于同一个 session 的，
    但新开一个标签页总是会初始化一个新的 session，即使网站是一样的，它们也不属于同一个 session。
##  new ExtractTextWebpackPlugin({ // 在plugins中配置属性
       allChunks: false // true表示会把所有的css都提取出来，false只会把初始化的提取，默认是false
   })
##  navigator.onLine
    navigator.onLine ，这个属性值为 true 表示设备能上网，值为 false 表示设备离线。
## IndexedDB
 Indexed Database API，或者简称为 IndexedDB，是在浏览器中保存结构化数据的一种数据库。 
## 暂时性死区
    在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称TDZ）。
    if (true) {
      // TDZ开始
      tmp = 'abc'; // ReferenceError
      console.log(tmp); // ReferenceError
    
      let tmp; // TDZ结束
      console.log(tmp); // undefined
    
      tmp = 123;
      console.log(tmp); // 123
    }
    上面代码中，在let命令声明变量tmp之前，都属于变量tmp的“死区”。
    ------------------------
    typeof x; // ReferenceError
    let x;
    上面代码中，变量x使用let命令声明，所以在声明之前，都属于x的“死区”，只要用到该变量就会报错。因此，typeof运行时就会
    抛出一个ReferenceError。
    
    作为比较，如果一个变量根本没有被声明，使用typeof反而不会报错。
    typeof undeclared_variable // "undefined"
    ----------------------------------
    let b = 1;
    function test4() {
        console.log(b);  //报错 Uncaught ReferenceError: b is not defined
        let b = 2;
    }
    test4()
## vue filter 中this指向的不是vue实例 

## img onload 事件this指向问题
     let firstImg = new Image();
      firstImg.src = url
      let that = this
      firstImg.onload = function() {
        //this指向当前元素即 img标签
        console.log(this);
        that.enlargeUrl = url
      }
      
## box-sizing:content-box /*（标准盒模型）*/ 标准盒模型中， width = 内容的宽度、height = 内容的高度
   box-sizing:border-box /*（IE盒模型）*/  width = border + padding + 内容的宽度,height = border + padding + 内容的高度
   
## nodeType 属性返回以数字值返回指定节点的节点类型。  //document.body.nodeType;
   
   如果节点是元素节点，则 nodeType 属性将返回 1。
   
   如果节点是属性节点，则 nodeType 属性将返回 2。
   
   
## forEach 只支持同步代码。所有不能使用async await

## webpack 的 vue-loader 事先把模板编译成 render函数。

## require 加载模块的时候是同步 
    在一个 node 执行一个文件时，会给这个文件内生成一个 exports 和 module 对象，
    而module又有一个 exports 属性。都指向一块{}内存区域。
