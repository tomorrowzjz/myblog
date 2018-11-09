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
    > function createObj(){
        
    }
### b. 构造函数模式
### c. 原型模式

