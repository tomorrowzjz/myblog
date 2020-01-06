docker
    1.编写完成 Dockerfile 之后，可以通过 docker build 命令来创建镜像。
    2.Docker 只能运行在64位的系统中。
    3.docker中拉取指定版本的镜像
        docker pull mongo:3.2.4   (https://hub.docker.com/ 搜索指定的版本号)
    4.运行指定版本
        docker run -itd --name zjz-mysql-test -p 3306:3306 -e MYSQL_ROOT_PASSWORD=888888 mysql:5.7.28(使用指定版本号)    