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


    
    
    