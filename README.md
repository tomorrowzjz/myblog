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