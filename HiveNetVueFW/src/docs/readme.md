# HiveNetVueFW

一个前端开发框架，用于简化管理后台类网站的前端开发。

## 部署及运行项目

```
# 下载源码到本地目录
cd ${root_path}
git clone https://github.com/snakeclub/HiveNetVueFW.git

# 初始化项目
cd HiveNetVueFW/HiveNetVueFW/src
npm install

# 编译并启动服务（开发模式）
npm run serve

# 编译打包 - prod版本
npm run build --mode prod

# 编译打包 - staging版本
npm run build --mode staging

```

注:在node.js V17以前一些可以正常运行的的应用程序,但是在 V17 及以上版本可能会抛出以下异常:

error:0308010C:digital envelope routines::unsupported
出现这个错误是因为 node.js V17版本中最近发布的OpenSSL3.0, 而OpenSSL3.0对允许算法和密钥大小增加了严格的限制，可能会对生态系统造成一些影响.

该问题可以将node降级到V16版本，或增加以下环境变量解决：export NODE_OPTIONS=--openssl-legacy-provider


## 依赖包关联

### 添加新的依赖包

扩展功能时，可以通过npm install命令在项目中添加新的依赖包，例如：

```
"element-plus": "^2.2.18",
npm install @element-plus/icons-vue --save
npm install axios --save
npm install babel-plugin-dynamic-import-node --save
npm install core-js --save
npm install element-plus@2.2.18 --save
npm install element-resize-detector --save
npm install vue-grid-layout --save
npm install jsonpath --save
```

### 升级项目的依赖包版本

**注: 如果需要考虑使用最新的依赖包，可以按以下步骤检查依赖包的最新版本，并判断是否变更依赖包。**

步骤参考如下：

```
# 1、设置使用淘宝源
npm config set registry https://registry.npm.taobao.org

# 2、安装检查工具
npm install -g npm-check

# 3、进入源码目录
cd ./HiveNetVueFW/HiveNetVueFW/src

# 4、检查可更新的包
npm-check

# 5、逐个检查, 选择进行更新
npm-check -u
```

## 关键引用开源包

## 必选开源包

[element-plus](https://element-plus.gitee.io/zh-CN/) : 界面UI框架

[async-validator](https://github.com/yiminghe/async-validator) : 表单校验库

[Vue Grid Layout](https://jbaysolutions.github.io/vue-grid-layout/zh/)：栅格布局组件

https://www.npmjs.com/package/jsonpath

## 可选开源包

[v-md-editor](https://code-farmer-i.github.io/vue-markdown-editor/zh/) : 处理markdown编辑器和预览

安装: npm i @kangc/v-md-editor@next -S

![abcd](images/404.png)

AI生成logo：https://brandmark.io/

png转icon：https://png2icojs.com/zh/

![abcd](images/404.png)

在线图片编辑工具：https://www.gaituya.com/

右键菜单：

https://gitee.com/longxinziyan/vue3-menus

https://github.com/vuesomedev/awesome-vue-3

Joints VISO功能的js库

https://resources.jointjs.com/tutorial/hello-world
