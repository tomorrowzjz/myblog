# IntersectionObserver

参考：

- **[MDN IntersectionObserver](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)**
- **[阮一峰 IntersectionObserver API 使用教程](https://link.zhihu.com/?target=https%3A//www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html)**

IntersectionObserver 监听元素是否进入了可视区域。

在没有这个api的时候为了实现监听元素是否进入了可视区域需要监听`scroll`事件，得到它对应于视口的坐标，再判断是否在视口之内。

用法：

```javascript
var io = new IntersectionObserver(callback, option);
```

`IntersectionObserver`是浏览器原生提供的构造函数，接受两个参数：`callback`是可见性变化时的回调函数，`option`是配置对象（该参数可选）。

构造函数的返回值是一个观察器实例。实例的`observe`方法可以指定观察哪个 DOM 节点。

```
// 开始观察
io.observe(document.getElementById('example'));
// 停止观察
io.unobserve(element);
// 关闭观察器
io.disconnect();
```

话不多说先看下面的例子(滚动加载)

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    html,body{
      height: 100%;
      width: 600px;
      margin: 0 auto;
    }
    #top{
      height: 101%;
      background-color: aqua;
    }
    #observe{
      height: 5px;
      width: 100%;
    }
    .add{
      height: 300px;
      width: 100%;
      background-color: pink;
      border:1px solid aqua;
    }
  </style>
</head>
  <body>
    <div id="top"></div>
    <div id="observe"></div>
    <script>
        var top = document.getElementById('top');
        var observe = document.getElementById('observe')
        function addElement(){
           var c = document.createElement('div');
            c.classList.add("add")
            document.querySelector('body').appendChild(c)
            observe.parentNode.insertBefore(c, observe)
        }
        const intersectionObserver = new IntersectionObserver((entries) => {
            for (entry of entries) {
                // 当observe元素可见时执行加载
                if (entry.target.id == 'observe' && entry.isIntersecting) {
                  addElement()
                }
            }
        });
        // 观测observe
        intersectionObserver.observe(observe);
  </script>
  </body>
</html>
```

当元素在容器里面滚动怎么办？

```javascript
var option = { 
  // 设置根元素  
  root: document.querySelector('.container'),
  // 定义根元素的margin
  rootMargin: "500px 0px" 
};
var observer = new IntersectionObserver(
  callback,
  option
)
```

例子2   图片懒加载

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div>
    <img src="eg.jpg" alt="" data-img="./1.jpg"><br>
    <img src="eg.jpg" alt="" data-img="./2.jpg"><br>
    <img src="eg.jpg" alt="" data-img="./3.jpg"><br>
    <img src="eg.jpg" alt="" data-img="./4.jpg"><br>
    <img src="eg.jpg" alt="" data-img="./5.jpg"><br>
  </div>
  <script>
    const imgs = document.querySelectorAll('[data-img]');
    const intersectionObserver = new IntersectionObserver((entries) => {
        for (entry of entries) {
            if (entry.isIntersecting) {
              console.log(entry.target.dataset.img);
              //当图片可见时把data-img的值赋值给src实现懒加载
              entry.target.src = entry.target.dataset.img;
              intersectionObserver.unobserve(entry.target);
            }
        }
    },{threshold: [0.5]});
    imgs.forEach((item) => {
        intersectionObserver.observe(item)
    });
</script>
</body>
</html>
```

IntersectionObserverEntry 对象（‘entries’是一个数组，每个成员都是一个）

`IntersectionObserverEntry`对象提供目标元素的信息，一共有六个属性。

```
{
    time: 6789.92,
    rootBounds: ClientRect {},
    boundingClientRect: ClientRect {},
    intersectionRect: ClientRect {},
    intersectionRatio: 0.5,
    target: element,
    isIntersecting: true
}
```

每个属性的含义如下。

- `time`：可见性发生变化的时间，是一个高精度时间戳，单位为毫秒
- `target`：被观察的目标元素，是一个 DOM 节点对象
- `rootBounds`：根元素的矩形区域的信息，`getBoundingClientRect()`方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回`null`
- `boundingClientRect`：目标元素的矩形区域的信息
- `intersectionRect`：目标元素与视口（或根元素）的交叉区域的信息
- `intersectionRatio`：目标元素的可见比例，即`intersectionRect`占`boundingClientRect`的比例，完全可见时为`1`，完全不可见时小于等于`0`
- isIntersecting：只读**`isIntersecting`**属性是一个布尔值，它是`true`如果与相交观察者的根目标元素相交。如果是`true`，则`IntersectionObserverEntry`描述转换为相交状态；否则为。如果是`false`，则您知道过渡是从相交到不相交。