#知识拓展

## 判断一个字符串是不是回文字符串
    > function run(input){
        if(typeof != 'string') return false;
        return input.split('').reverse('').join('') === input;
    }
    
## 实现效果，点击容器内的图标，图标边框变成border 1px solid red，点击空白处重置。(用事件委派)
    * 事件委派例子
    > <div id="box">
        <input type="button" id="add" value="添加" />
        <input type="button" id="remove" value="删除" />
    </div>
    window.onload = function(){
        var oBox = document.getElementById("box");
        oBox.onclick = function (ev) {
            var ev = ev || window.event;
            var target = ev.target || ev.srcElement;
            if(target.nodeName == 'INPUT'){
                switch(target.id){
                    case 'add' :
                        alert('添加');
                        break;
                    case 'remove' :
                        alert('删除');
                        break;
                   
                }
            }
        }
        
    }
    
## vue 项目不兼容ie ‘Promise 未定义的错误’
    1. 　npm install babel-polyfill --save
    2. 　在main.js中 import "babel-polyfill"
    3.    vuex的index.js文件中  import "babel-polyfill"
## 如果需要通过 childNodes 属性 遍历子节点，那么一定不要忘记浏览器间的这一差别
    for (var i=0, len=element.childNodes.length; i < len; i++){ 
        if (element.childNodes[i].nodeType == 1){
                 //执行某些操作 
        
        }
    }
## 事件委派 event.target与event.srcElement
　　target 事件属性可返回事件的目标节点（触发该事件的节点），如生成事件的元素、文档或窗口。
　　在标准浏览器下我们一般使用event.target解决，然而低版本IE浏览器不兼容，这时候就得使用event.srcElement。
    if(event.target){ // IE10及以下版本浏览器不能识别
        // do something...
    }else if(event.srcElement){   // IE10及以下版本会执行该代码
        // do something...
    }
## Cross Site Request Forgery[ˈfɔ:dʒəri]  (跨站点请求伪造)   
    >伪装可信用户的请求来攻击信任该用户的网站。
    防御：
    ###Synchronizer token pattern
    令牌同步模式（Synchronizer token pattern，简称STP）是在用户请求的页面中的所有表单中嵌入一个token，在服务端验证这个
    token的技术。token可以是任意的内容，但是一定要保证无法被攻击者猜测到或者查询到。攻击者在请求中无法使用正确的token，
    因此可以判断出未授权的请求。
    
    ###Cookie-to-Header Token
    对于使用Js作为主要交互技术的网站，将CSRF的token写入到cookie中，然后使用javascript读取token的值，在发送http请求的时
    候将其作为请求的header，最后服务器验证请求头中的token是否合法。
    
    ###验证码
       验证码被认为是对抗 CSRF 攻击最简洁而有效的防御方法。
    ###Referer Check
       根据 HTTP 协议，在 HTTP 头中有一个字段叫 Referer，它记录了该 HTTP 请求的来源地址。通过 Referer Check，
       可以检查请求是否来自合法的"源"。
    参考：https://github.com/zz1211/Doraemon/issues/24
          https://github.com/dwqs/blog/issues/68
##XSS，即 Cross Site Script，中译是跨站脚本攻击；
    >用某种方法让用户的Client端执行指定的一段Javascript脚本，来完成攻击。总体来说，分三类：存储型XSS、反射型XSS和DOM-XSS。
    防御：
    Http-Only禁止Cookie被Client端Javascript获取。
    Client端对用户的输入进行转译过滤。
    Client端对服务器返回的展示的数据进行转译过滤，因为可能中间被代理改包，都是有可能的。
    服务端对Client端返回的数据进行转译再保存到数据库或者缓存，因为攻击的人可以直接调接口不通过前端输入。
    【恩，原则就是前后端彼此不完全信任对方】
    
##
    防御 XSS 攻击
    HttpOnly 防止劫取 Cookie
    用户的输入检查
    服务端的输出检查
    防御 CSRF 攻击
    验证码
    Referer Check
    Token 验证
##sql注入
   参考https://bbs.ichunqiu.com/thread-9518-1-1.html
   
   fabric.js
   
## js reduce
    reduce(callback,initiaValue)会传入两个变量，回调函数(callback)和初始值(initiaValue)。
    假设函数有4个传入参数，prev和next，index和array。 Prev和next是你必须要了解的。
    当没有传入初始值时，prev是从数组中第一个元素开始的，next数组是第二个元素。
    但是当传入初始值（initiaValue）后,第一个prev将是initivalValue，next将是数组中的第一个元素。
    
    作者：liwuwuzhi
    链接：https://www.jianshu.com/p/d00ca61026d7
## cors (Cross-origin resource sharing) 跨域资源共享
    https://zhuanlan.zhihu.com/p/24411090
##  统一资源标识符（英语：Uniform Resource Identifier，或URI)  URI的最常见的形式是统一资源定位符（URL）
##  http协议是应用层协议，一般建立在tcp协议的基础之上（当然你的实现非要基于udp也是可以的），
    也就是说http协议的数据收发是通过tcp协议的。
##Load 和 DOMContentLoaded 区别
  Load 事件触发代表页面中的 DOM，CSS，JS，图片已经全部加载完毕。
  
  DOMContentLoaded 事件触发代表初始的 HTML 被完全加载和解析，不需要等待 CSS，JS，图片加载。
##在vue文件中的<style>内填写需要引用的文件
@import "./css/indexTest.css";

## ljdm
    mounted() {
        this.$refs['my-tag'].addEventListener(this.myEvent,() => {
             // Some logic..
        });
    },
    beforeDestroy() {
        this.$refs['my-tag'].addEventListener(this.myEvent,() => {
             // Some logic..
        });
    }
##递归组件
　　组件在它的模板内可以递归地调用自己，只有当它有 name 选项时才可以。 
##  
参数或查询的改变并不会触发进入/离开的导航守卫。你可以通过观察 $route 对象来应对这些变化，或使用 beforeRouteUpdate 的组件内守卫。

## vueRouter  滚动行为

    const router = new VueRouter({
      routes: [...],
      scrollBehavior (to, from, savedPosition) {
        // return 期望滚动到哪个的位置
      }
    })
    
    ###如果你要模拟“滚动到锚点”的行为：
    
    scrollBehavior (to, from, savedPosition) {
      if (to.hash) {
        return {
          selector: to.hash
        }
      }
    }
## VUE 父子组件 props
    1.Vue.component('my-component', {
      props: {
        // 基础的类型检查 (`null` 匹配任何类型)
        propA: Number,
        // 多个可能的类型
        propB: [String, Number],
        // 必填的字符串
        propC: {
          type: String,
          required: true
        },
        // 带有默认值的数字
        propD: {
          type: Number,
          default: 100
        },
        // 带有默认值的对象
        propE: {
          type: Object,
          // 对象或数组默认值必须从一个工厂函数获取
          default: function () {
            return { message: 'hello' }
          }
        },
        // 自定义验证函数
        propF: {
          validator: function (value) {
            // 这个值必须匹配下列字符串中的一个
            return ['success', 'warning', 'danger'].indexOf(value) !== -1
          }
        }
      }
    })
    2.Vue.component('blog-post', {
        // 在 JavaScript 中是 camelCase 的
        props: ['postTitle'],
        template: '<h3>{{ postTitle }}</h3>'
      })
##for in   for of
    for..of和for..in均可迭代一个列表；但是用于迭代的值却不同，for..in迭代的是对象的 键 的列表，
    而for..of则迭代对象的键对应的值。
    另一个区别是for..in可以操作任何对象；它提供了查看对象属性的一种方法。 
    但是 for..of关注于迭代对象的值。内置对象Map和Set已经实现了Symbol.iterator方法，让我们可以访问它们保存的值。
    >let pets = new Set(["Cat", "Dog", "Hamster"]);
     pets["species"] = "mammals";
     
     for (let pet in pets) {
         console.log(pet); // "species"
     }
     
     for (let pet of pets) {
         console.log(pet); // "Cat", "Dog", "Hamster"
     }
## vue 父子组件的生命周期顺序
    父组件 beforecreate ->created ->beforemount -> 子组件beforecreate ->created ->beforemount ->mounted->父组件mounted 
## Css样式书写
    > <div class="color">
          <ul class="color-list"> //类名-具体名字
              <li class="color-tag"><a href="#">
                  <div class="color-block"></div>
                  <span>花色</span></a></li>
          </ul>
      </div>
## 函数柯里化
        function add(a){
            return function(b){
                return function(c){
                    return a+b+c
                }
            }
        }
        add(2)(3)(4);
## backdrop-filter: blur(2px);//为一个元素后面区域添加图形效果（如模糊或颜色偏移）。
## .clearfix
    使用伪元素来清除浮动
    　　　　.clearfix:after{
    　　　　　　content:"";//设置内容为空
    　　　　　　height:0;//高度为0
    　　　　　　line-height:0;//行高为0
    　　　　　　display:block;//将文本转为块级元素
    　　　　　　visibility:hidden;//将元素隐藏
    　　　　　　clear:both//清除浮动
    　　　　　}
    　　　　.clearfix{
    　　　　　　zoom:1;为了兼容IE
    　　　　}
## position
      absolute: 生成绝对定位的元素，相对于 static 定位以外的第一个父元素进行定位。
      fixed: 生成绝对定位的元素，相对于浏览器窗口进行定位。
      relative: 生成相对定位的元素，相对于其正常位置进行定位。
      static :	默认值。没有定位，元素出现在正常的流中
      inherit :	规定应该从父元素继承 position 属性的值。
## addEventLisenter
    使用 addEventListener 函数来监听事件时，第三个参数设置为 false，这样监听事件时只会监听冒泡阶段发生的事件。
         IE 浏览器不支持在捕获阶段监听事件，为了统一而设置的，毕竟 IE 浏览器的份额是不可忽略的。
## 停止事件冒泡（stopPropagation）
    element.addEventListener('click', function(event) {
        event.stopPropagation();
    }, false);
##IE 下绑定事件
  在 IE 下面绑定一个事件监听，在 IE9- 无法使用标准的 addEventListener 函数，而是使用自家的 attachEvent，具体用法：
  
  element.attachEvent(<event-name>, <callback>);
##IE 中 Event 对象需要注意的地方
  IE 中往回调函数中传递的事件对象与标准也有一些差异，你需要使用 window.event 来获取事件对象。所以你通常会写出下面代码来获取事件对象：
  
  event = event || window.event
  此外还有一些事件属性有差别，比如比较常用的 event.target 属性，IE 中没有，而是使用 event.srcElement 来代替。如果你的回调函数需要处理触发事件的节点，那么需要写：
  
  node = event.srcElement || event.target;
## window 的 load 事件，当页面内所有资源全部加载完成之后就会触发。

## 节流和防抖
使用函数 throttle 或者 debounce 技巧来进行优化，throttle 方法大体思路就是在某一段时间内无论多次调用，只执行一次函数
，到达时间就执行；debounce 方法大体思路就是在某一段时间内等待是否还会重复调用，如果不会再调用，就执行函数，如果还有重
复调用，则不执行继续等待。

##js自定义事件

使用自定义事件需要注意兼容性问题，而使用 jQuery 就简单多了：

// 绑定自定义事件
$(element).on('myCustomEvent', function(){});

// 触发事件
$(element).trigger('myCustomEvent');

##调用构造函数new一个对象实际上会经历以下 4 个步骤：
 (1) 创建一个新对象；
 (2) 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）； 
 (3) 执行构造函数中的代码（为这个新对象添加属性）； 
 (4) 返回新对象。
## Immutable
Immutable Data 就是一旦创建，就不能再被更改的数据。对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable
 对象。Immutable 实现的原理是 Persistent Data Structure（持久化数据结构），也就是使用旧数据创建新数据时，要保证旧数据同
 时可用且不变。同时为了避免 deepCopy 把所有节点都复制一遍带来的性能损耗，Immutable 使用了Structural Sharing（结构共享）
 ，即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享
 
 
 ## ES5继承的六种方式
 
 待补充？？？
 
 
 
 ## 什么是CSS Modules？
    > import styles from "./styles.css";
      
      element.innerHTML = 
          `<h1 class="${styles.title}">
              An example heading
            </h1>`;
## vue keep-alive
    <!-- 失活的组件将会被缓存！-->
    <keep-alive>
     <component v-bind:is="currentTabComponent"></component>
   </keep-alive>
## 由于 JavaScript 的限制，Vue 不能检测以下变动的数组：
   
   当你利用索引直接设置一个项时，例如：vm.items[indexOfItem] = newValue
   当你修改数组的长度时，例如：vm.items.length = newLength
## jQuery mouseover与mouseenter的区别
在我们的页面中经常会用到mouseover与mouseout事件来给页面添加更好的渲染效果，但如果触发mouseover事件的元素有子元素的话，
会造成闪烁的效果，看着很不舒服，这是因为mouseover与mouseout不论鼠标指针穿过被选元素或其子元素，都会触发。而mouseenter
与mouseleave只有在鼠标指针穿过被选元素时，才会触发 mouseenter 事件。

## 数组变异方法  慎用
   eg: pop 会改变元素组 发生未知bug

##这种方式是直接使用数组的indexOf方法来判断，如果元素存在于数组中，那么返回元素在数组中的下标值，如果不存在，那么返回-1，
注意indexOf是区分大小写的，字母O必需大写，不然是会报错的，另外，该方法在某些版本的IE中是不起作用的，因此在使用之前需要
做一下判断，修改后的代码如下所示：

复制代码
/**
 * 使用indexOf判断元素是否存在于数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 */
function isInArray3(arr,value){
    if(arr.indexOf&&typeof(arr.indexOf)=='function'){
        var index = arr.indexOf(value);
        if(index >= 0){
            return true;
        }
    }
    return false;
}

##过渡transition的触发有三种方式，分别是伪类触发、媒体查询触发和javascript触发。
  其中常用伪类触发包括:hover、:focus、:active等
  
  javascript触发：
  ><style>
       .test {
           background-color: red;
           width: 500px;
       }
       .tran{
           transition: all 1s ease;
           width: 300px;
       }
   </style>
   <body>
   <div>
       <div class="test">test</div>
   </div>
   <script>
       let test = document.querySelector('.test');
       test.onclick = function(){
         test.classList.add('tran');
       }
   </script>
   
   伪类触发
   >.test{
        height: 100px;
        width: 100px;
        background-color: pink;
        /*代表持续时间为1s，延迟时间为2s*/
        transition: 1s 2s;
    }    
    .test:hover{
        width: 500px;
    }
    <div class="test"></div>
## @keyframes 动画名box-3d{
    100%{
        transform: rotateX(360deg) rotateY(360deg);
    }
  }
  
  在使用的地方 .box{animation: box-3d 5s infinite ;}
  
##function setName(obj) { 
   obj.name = "Nicholas"; 
   obj = new Object(); 
   obj.name = "Greg"; 
  } 
  var person = new Object(); 
  setName(person); 
  alert(person.name); 

## vue 
   可以用 of 替代 in 作为分隔符，因为它是最接近 JavaScript 迭代器的语法：
   
## vuex 兄弟组件传值，当一个组件改变vuex里面的值后，一般是数组，并且整体替换， 另一个组件里面用到这个值的地方自动改为这
个值(必须深拷贝整体替换,arr,Object)

## vue 子组件在其生命用到父组件异步取回来的值时，回取不到值，一般在父组件调用子组件的地方加v-if  或者在子组件里面添加watch
    监听其值,当改变时重新复制
    
##  多个接口返回转态决定页面状态 checkbox  反显操作问题    可以将多个接口返回的数据结构拼装为一个结构在做处理。

## vue组件封装   一旦一个组件里面会出现2套及以上的相同逻辑可以将相同逻辑封装为一个组件  这样可以避免写重复逻辑
        平台表格列表
## promise 每次使用 then方法都会返回一个新的promise实例

## js 自带base64加密解密函数
   window.btoa("test")；//"dGVzdA=="
   window.atob("dGVzdA==");//"test"
## vue elementui  自定义校验有时执行有时不执行，
        let validCardNo = (rule, value, callback) => {
              if (!value) {
                return callback(new Error('身份证号不能为空'));
              }
              if (!Number.isInteger(parseInt(value))) {
                callback(new Error('请输入数字'));
              } else if(!isCardNo(value)){
                callback(new Error('身份证号码为15位或者18位'));
              }else {
                callback()//必须有不然当校验成功的时候不执行 submit 校验
              }
            };
##   findIndex
        var ages = [3, 10, 18, 20];
         
        function checkAdult(age) {
            return age >= 18;
        }
         
        function myFunction() {
            document.getElementById("demo").innerHTML = ages.findIndex(checkAdult);
        }
        findIndex() 方法返回传入一个测试条件（函数）符合条件的数组第一个元素位置。找不到返回-1
        findIndex() 方法为数组中的每个元素都调用一次函数执行
## vue 组件复用  会默认复用旧组件，（也就是不会执行子组件的生命周期方法，想让他执行，可以给组件一个唯一的id也就是key）

## three.js 绘制3维场景   
   3d.js D3 的全称是（Data-Driven Documents），顾名思义可以知道是一个被数据驱动的文档。一个 JavaScript 的函数库，

## nrm 切换源的npm包

##   
{
"all_tp":[
    {
        "id":1000,
        "name":"淘宝"
    },
    {
        "id":1001,
        "name":"天猫"
    },
    {
        "id":1003,
        "name":"京东"
    },
    {
        "id":1004,
        "name":"拼多多"
    }
],
"tps":[
    {
        "id":1003,
        "name":"京东"
    }
],
}

//输出结果  dialogTpArr = [true,true,false,true];

this.userinfo.all_tp.map((ele,ind)=>{
   this.userinfo.tps.map((e,index)=>{
     if (ele.id == e.id) {
       ele.innerflag = true;
     }
   });
 })
 
 this.userinfo.all_tp.map((ele,ind)=>{
   if (ele.innerflag) {
     this.dialogTpArr.push(true)
   }else {
     this.dialogTpArr.push(false)
   }

 })
 
 ##  定时关闭浏览器窗口
       function closewin(){
               if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") !=-1) {
                 window.location.href="about:blank";
                 window.close();
               } else {
                 window.opener = null;
                 window.open("", "_self");
                 window.close();
               }
       
             }
             setTimeout('closewin();',5000);
  ##   this.$router指路由器，this.$route指当前路由
  
  ## 项目中不要使用魔法字符串
    const CLS_ON = 'on';
    const CLS_HALF = 'half';
    const CLS_OFF = 'off';
 ##  
 所有 JavaScript 对象都有 __proto__ 属性，只有 Object.prototype.__proto__ === null ；
 构造函数的 prototype 属性指向它的原型对象，而构造函数实例的 __proto__ 属性也指向该原型对象
 
 ## document.body.scrollTop || document.documentElement.scrollTop为0
    当前滚动条位置就是在顶部。
    没有产生滚动。
    你当前的滚动条不再属于 html 或者 body。
  ## dpr  设备像素比 device pixel ratio
  
  ##处理rem以及vm的px2rem以及px2viewport     rem  vw vh dp
  
  
  ## Vue.extend( options )
    使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。
    
  ## 扩展运算符 ...
  
    扩展运算符对对象实例的拷贝属于一种浅拷贝。
 
 ## webpack 4.0
 //webpack4.0不支持该写法
 new webpack.optimize.UglifyJsPlugin({
       compress: {
         warnings: false,
         drop_debugger: true, 
         drop_console: true   
       },
       sourceMap: config.build.productionSourceMap,
       parallel: true
     }),
  -------------------------------------------
  //换为这种写法
    optimization: {
       minimizer: [
                new UglifyJSPlugin({
                    uglifyOptions: {
                        output: {
                            comments: false
                        },
                        compress: {
                            warnings: false,
                            drop_debugger: true,
                            drop_console: true
                        }
                    }
                }),
            ]
      },
      
##  页面可编辑：contentEditable   API 可以使页面所有元素成为可编辑状态，使浏览器变成你的编辑器。
    data:text/html, <html contenteditable>
    
##  根据CSS3规范，视口单位主要包括以下4个：
          1.vw：1vw等于视口宽度的1%。
          2.vh：1vh等于视口高度的1%。
          3.vmin：选取vw和vh中最小的那个。
          4.vmax：选取vw和vh中最大的那个。
          兼容性问题(在移动端 iOS 8 以上以及 Android 4.4 以上获得支持，并且在微信 x5 内核中也得到完美的全面支持)
          
## nuxt asyncData()
    由于asyncData方法是在组件 初始化 前被调用的，所以在方法内是没有办法通过 this 来引用组件的实例对象。 
    
## Promise
    跟传统的try/catch代码块不同的是，如果没有使用catch方法指定错误处理的回调函数，
    Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。
    
## async await
    async function f() {
     await Promise.reject('出错了');
     await Promise.resolve('hello world'); // 不会执行
   }
   
## 去重
// 去除数组的重复成员
[...new Set(array)]//array只能是简单类型,复杂类型不生效  对象总是不相等的
### Array.from方法可以将 Set 结构转为数组。
### function dedupe(array) {
    return Array.from(new Set(array));
  }
  dedupe([1, 1, 2, 3]) // [1, 2, 3]
  
##  map
JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键。
为了解决这个问题，ES6 提供了 Map 数据结构。


##  允许长单词换行到下一行：
    p.test {word-wrap:break-word;}
    
    resize:none;   textarea  规定用户是否可以缩放
##   find  findIndex  includes
var node = tempNode.children.find(e => e.value == name);

数组实例的find方法，用于找出第一个符合条件的数组成员。它的参数是一个回调函数，所有数组成员依次执行该回调函数，
直到找出第一个返回值为true的成员，然后返回该成员。如果没有符合条件的成员，则返回undefined。

数组实例的findIndex方法的用法返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1。

Array.prototype.includes方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的includes方法类似。


## delete obj.name //删除object对象的name属性

##  vue-select-tree 

https://vue-treeselect.js.org/#vuex-support

## vue $route 可以直接用在template的dom上 

## vue 想要在computed属性改变是触发事件，事件里面不能改变computed属性，不然造成循环， 可以封装一个子组件 在子组件生命周
期里面操作


## 递归   （操作的每一步都是为了下一步最终的递归--操作最小单元）

## vue 当页面从#/a/1变为#/a/2 时组件会被复用 不会重新执行生命周期方法，  可以使用 watch 监听 $route 或者  给组件加一个key
    
##  requestAnimationFrame 是浏览器提供的一个专注于实现动画的 API，

##  vue draggable  拖动不生效 -- 数据必须是data里面的，computed里面的可能出现问题

## 不阻止ondragover默认事件就无法触发ondrop函数


## transform: rotate(90deg);
   	transform-origin:100% 100%;   //设定中心位置的初始位置
   	
## arguments不是数组，要先转化一下成为数组 [].slice.call(arguments);

## forEach 无法break和return

## promise  调用resolve或reject并不会终结 Promise 的参数函数的执行。
> new Promise((resolve, reject) => {
    return resolve(1);
    // 后面的语句不会执行
    console.log(2);
  })
 ### 如果没有使用catch方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。
 
 
 ## Object.create(null) vs {}
    {}创建一个空对象但是会继承object 会有一些额外的方法，Object.create(null)创建一个空对象没有父类  (将传入的对象作为创建的对象的原型)。
    
    function create(proto) {
        function F() {};
        F.prototype = proto;
        F.prototype.constructor = F;
        return new F();
    }
  ## 
   Vue 框架就是一个典型的 MVVM 模型的框架。
   Vue 框架其实就是起到 MVVM 模式中的 ViewModel 层的作用。
   
 ## 全灰，原来仅需一行css代码——css 滤镜
 filter: grayscale(100%);  
 
 ## 
    Linux环境下，怎么确定Nginx是以那个config文件启动的？
    
    输入命令行： ps  -ef | grep nginx
    
    master process 后面的就是 nginx的目录。
    
    
    