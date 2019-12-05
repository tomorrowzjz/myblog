1.重启 nginx    service nginx reload
        重启nginx服务器步骤 
        1.  cd /usr/local/nginx/sbin
        2.  ./nginx -s reload
2 遍历某目录下，所有文件，查找源代码的某一个函数方法
       > grep -rn "查找内容" --exclude-dir="root" *
         -r 是递归遍历
         -n 是具体哪一个行
         --exclude-dir 排除某个目录的查找
3.kill nginx
      查询nginx主进程号
      ps -ef | grep nginx
      在进程列表里 面找master进程，它的编号就是主进程号了。 
      kill -QUIT 主进程号 