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
         \d 就是[0-9]。表示是一位数字。记忆方式：其英文是digit（数字）。
         \D 就是[^0-9]。表示除数字外的任意字符。
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
## js 原型链
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
![avatar](data:image/jpeg;base64,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) 