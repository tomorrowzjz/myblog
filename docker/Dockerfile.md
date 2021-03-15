# 什么是Dockerfile 

* Dockerfile 是一个描述文件,是一个用来构建镜像的文本文件，文本内容包含了一条条构建镜像所需的指令和说明。
# 什么是Docker 镜像
* Docker 镜像可以看作是一个只读的模板，是一个特殊的文件系统，一个独立的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。可以用来创建新的容器。
# 什么是容器
* 类比面向对象,我们可以把镜像看作类，把容器看作类实例化后的对象。

# docker的组成
* Docker 包含三个基本概念，分别是镜像（Image）、容器（Container）和仓库（Repository）。
* Docker仓库用来存放镜像的，类比于git和GitHub

## Dockerfile的基本结构

Dockerfile 一般分为四部分：基础镜像信息、维护者信息、镜像操作指令和容器启动时执行指令，’#’ 为 Dockerfile 中的注释。

## Dockerfile文件(常用命令)说明

**FROM：指定基础镜像，必须为第一个命令**

**MAINTAINER: 维护者信息**

**RUN：构建镜像时执行的命令**

**ADD：将本地文件添加到容器中，tar类型文件会自动解压(网络压缩资源不会被解压)，可以访问网络资源**

**COPY：功能类似ADD，但是是不会自动解压文件，也不能访问网络资源**

**CMD：构建容器后调用，也就是在容器启动时才进行调用。**

**ENV：设置环境变量**

**EXPOSE：指定于外界交互的端口**

**VOLUME：用于指定持久化目录**

**WORKDIR：指定工作目录，类似于cd命令**

**USER: 指定运行容器时的用户名或 UID**

以ant-design-pro的**Dockerfile**说明一下

```
#指定基础镜像
FROM circleci/node:latest-browsers
#确定工作目录
WORKDIR /usr/src/app/
#指定运行容器时的用户名
USER root
#拷贝当前文件下的package.json 到 工作目录/usr/src/app/
COPY package.json ./
#运行yarn 安装项目的全部依赖
RUN yarn
#拷贝当前文件加下的所有文件到工作目录/usr/src/app/
COPY ./ ./
# 运行该命令
RUN npm run test:all
# 运行该命令
RUN npm run fetch:blocks
#在容器启动时进行调用
CMD ["npm", "run", "build"]
```

ant-design-pro的**Dockerfile.hub**

```
# 编译阶段
FROM circleci/node:latest-browsers as builder

WORKDIR /usr/src/app/
USER root
COPY package.json ./
RUN yarn

COPY ./ ./
RUN npm run test:all
RUN npm run fetch:blocks
RUN npm run build

# 运行阶段
FROM nginx
WORKDIR /usr/share/nginx/html/
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
# 这条命令表示从builder也就是编译阶段的结果(/usr/src/app/dist文件夹下的所有文件)拷贝到当前镜像的/usr/share/nginx/html/
COPY --from=builder /usr/src/app/dist  /usr/share/nginx/html/
# 对外暴露的端口
EXPOSE 80
# 为什么要运行这个命令建议看这篇文章 https://blog.csdn.net/youcijibi/article/details/88781014
CMD ["nginx", "-g", "daemon off;"]
```

## 多个 FROM 指令的意义

每一条 FROM 指令都是一个构建阶段，多条 FROM 就是多阶段构建，虽然最后生成的镜像只能是最后一个阶段的结果，但是，能够将前置阶段中的文件拷贝到后边的阶段中，这就是多阶段构建的最大意义。



参考文章

https://www.zhihu.com/question/27561972/answer/230398763

https://www.cnblogs.com/panwenbin-logs/p/8007348.html

https://www.cnblogs.com/leoyang63/articles/13733967.html

