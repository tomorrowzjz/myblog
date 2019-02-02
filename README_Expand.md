#知识拓展

## 判断一个字符串是不是回文字符串
    > function run(input){
        if(typeof != 'string') return false;
        return input.split('').reverse('').join('') === input;
    }
    
## 实现水平垂直居中的方法
    * 不需要知道具体的宽高
    > .wrapper{
        position:relative;
        .inner{
            position:absolute;
            top:50%;
            left:50%;
            transform:translate(-50%,-50%)
        }
    }
    .wrapper{
        position:relative;
        .inner{
            position:absolute;
            top:50%;
            left:50%;
            width:100px;
            height:100px;
            margin:-50% 0 0 -50%
        }
    }
    * flex布局
    .wrapper{
        display: flex;
        align-items:center;
        justify-content:center;
        height: 100%;
    }
    .wrapper .inner{
        height: 200px;
        width: 200px;
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
## git 多人开发
    git checkout dev//切分支
    git push origin dev//要推送其他分支（dev分支）
    git branch //查看当前分支
    //方法一
    $ git fetch origin master //从远程的origin仓库的master分支下载代码到本地的origin master
    
    $ git log -p master.. origin/master//比较本地的仓库和远程参考的区别
    
    $ git merge origin/master//把远程下载下来的代码合并到本地仓库，远程的和本地的合并
    
    //方法二
    $ git fetch origin master:temp //从远程的origin仓库的master分支下载到本地并新建一个分支temp
    
    $ git diff temp//比较master分支和temp分支的不同
    
    $ git merge temp//合并temp分支到master分支
    
    $ git branch -d temp//删除temp
    
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



    
    
    