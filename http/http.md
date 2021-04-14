## HTTP1.0和HTTP1.1的区别
1.持久连接
    HTTP1.1支持长连接，在一个TCP连接上可以传送多个HTTP请求和响应，支持断点传输，以及增加了Host字段
2.HTTP管道
    持久HTTP可以让我们重用已有的连接来完成多次请求，但这些请求需要满足先进先出的队列顺序,响应也是按照之前请求的顺序依次到达。在HTTP1.1中严格串行的返回响应，它不允许多个数据交错到达，只能等待一个响应完全返回后，下一个响应才能发送，无论下一个响应是否早于前一个响应完成处理，这也叫做队首阻塞
3.增强的缓存机制
    在HTTP1.0中主要使用header里的If-Modified-Since,Expires来做为缓存判断的标准
        Expires
          Expires 返回的HTTP状态为200 是HTTP 1.0提出的一个表示资源过期时间的header，它描述的是一个绝对时间，由服务器返回
        If-Modified-Since
          1.服务器在返回这个资源的同时，在response的header加上Last-Modified的header，这个header表示这个资源在服务器上的最后修改时间
          2.浏览器再次跟服务器请求这个资源时，在request的header上加上If-Modified-Since的header，这个header的值就是上一次请求时返回的Last-Modified的值 
          3.服务器判断   If-Modified-Since的值是否一致 ，一致返回304，复用浏览器的信息 如果没有命中Last-Modified Header在重新加载的时候会被更新
    HTTP1.1则引入了更多的缓存控制策略例如Entity tag，If-Unmodified-Since, If-Match, If-None-Match等更多可供选择的缓存头来控制缓存策略。
       Cache-Control 是HTTP 1.1的时候，提出了的一个新的header是一个相对时间，在配置缓存的时候，以秒为单位，用数值表示
       如：Cache-Control:max-age=315360000
       ETag返回的是 一个字符串 只要内容修改了ETag一定会改变，这样就不会出现 Last-Modified的情况了，原理和Last-Modified基本一致  命中返回304 复用浏览器缓存
    详细的缓存可以看这篇文章  https://www.jianshu.com/p/3078d2d06905
4.节约带宽
       HTTP1.0中存在一些浪费带宽的现象，例如客户端只是需要某个对象的一部分，而服务器却将整个对象送过来了，并且不支持断点续传功能。HTTP1.1支持只发送header信息（不带任何body信息），如果服务器认为客户端有权限请求服务器，则返回100请求body了节约了带宽。
5. 状态码
  在HTTP1.1中新增了24个错误状态响应码，如409（Conflict）表示请求的资源与资源的当前状态发生冲突；410（Gone）表示服务器上的某个资源被永久性的删除。
6.HOST域
       在HTTP1.0中认为每台服务器都绑定一个唯一的IP地址，因此，请求消息中的URL并没有传递主机名（hostname），HTTP1.0没有host域。随着虚拟主机技术的发展，在一台物理服务器上可以存在多个虚拟主机（Multi-homed Web Servers），并且它们共享一个IP地址。HTTP1.1的请求消息和响应消息都支持host域，且请求消息中如果没有host域会报告一个错误（400 Bad Request）

## HTTP1.1和HTTP2.0的区别
  二进制分帧
    在应用层（HTTP）和传输层（TCP）之间增加一个二进制分帧层。
  首部压缩
    请求头的压缩
  流量控制

  多路复用
    在HTTP1.1中，浏览器客户端在同一时间，针对同一域名下的请求有一定数量的限制。
超过限制数目的请求会被阻塞。而HTTP2.0中的多路复用优化了这一性能。
基于二进制分帧层，HTTP2.0可以在共享TCP链接的基础上同时发送请求和响应。
  请求优先级
  服务器推送
    服务器除了对最初请求的响应外，服务器还可以额外的向客户端推送资源，而无需客户端明确的请求

## 总结
    HTTP1.0

    无状态、无连接

    HTTP1.1

    持久连接

    请求管道化

    增加缓存处理（新的字段如cache-control）

    增加Host字段、支持断点传输等

    HTTP2.0

    二进制分帧

    多路复用（或连接共享）

    头部压缩

    服务器推送

    http2.0主要是流化（流-消息-帧）


## HTTTP3.0
  HTTP2和HTTP3的传输层是完全不同的协议，HTTP3的传输层是UDP协议。与TCP协议相比，UDP更为轻量，但是错误校验也要少得多。UDP往往效率更高，但是可靠性比不上TCP。QUIC很好地解决了安全性，和低延迟。
  QUIC协议
  QUIC（Quick UDP Internet Connection）是谷歌制定的一种基于UDP的低时延的互联网传输层协议。QUIC很好地解决了当今传输层和应用层面临的各种需求，包括处理更多的连接，安全性，和低延迟。相比TCP建立安全可靠的链接，QUIC只需要1RTT（Round-Trip Time）(一来一回的时间)的延迟，TCP需要1.5次，QUIC同时复用了HTTP/2协议的多路复用功能（Multiplexing），避免了HTTP/2的线头阻塞（Head-of-Line Blocking）问题。
  HTTP3如何工作。首先要建立好HTTP2连接，然后发送HTTP2扩展帧，这个帧包含IP和端口，浏览器收到扩展帧，使用该IP和端口，使用QUIC建立连接，如果成功，断开HTTP2，升级为HTTP3。


参考文章  
https://blog.csdn.net/u010953880/article/details/89668269
https://blog.csdn.net/ailunlee/article/details/97831912
https://juejin.cn/post/6844903489596833800
https://www.jianshu.com/p/dd9719c4c2c1
https://www.jianshu.com/p/5895b3d62bf2