# JS库 - 内置插件

内置的plugins插件，支持在代码中通过 `this.$插件名` 的方式直接使用, 也可以通过 `import 插件名 from '@/plugins/插件名'` 这种方式加载后使用;。

代码路径: src/plugins

## $cache

提供对浏览器Storage缓存数据的操作封装方法，主要有两类浏览器缓存:

- sessionCache : 浏览器会话级缓存的操作方法集合, 会话关闭(浏览器关闭)会自动删除缓存

- localCache : 浏览器本地缓存, 缓存数据将一直保存, 不会删除

使用方法如下(具体函数支持参考源码):

```javascript
// 设置会话缓存
this.$cache.sessionCache.set('cache name', 'cache value');

// 设置本地缓存
this.$cache.localCache.set('cache name', 'cache value');
```

## $modal 模态框插件

提供包括加载遮罩、提示类消息、消息对话框的通用调用函数。

插件的部分显示样式可以在 settings.js 配置文件中进行修改。模态框插件是对 element-plus UI框架的模态框功能封装，如果需要自定义样式, 也可以直接使用 element-plus 的原生模块。

### 加载遮罩

主要用于界面长时间后台处理（例如与后端通讯）时遮挡界面，提示用户正在处理中，并避免用户执行其他不可预知的操作。

**注: 加载遮罩封装了对iframe嵌入页面的支持, 允许嵌入的iframe页面发起完整窗口的遮罩处理。**

当前有两种遮罩：

- loading : 普通遮罩, 有透明阴影和加载动画, 以及可以设置提示文字。

- transparentLoading : 完全透明的遮罩, 主要是为了处理过程避免鼠标误触元素引发误操作(例如拖动元素)。

遮罩的通常使用方法如下：

```javascript
// 点击按钮函数定义
doXXX() {
  // 启动遮罩
  this.$modal.loading('正在加载');

  apiCall(
    'xxxx', {}
  ).then(resData => {
    // 执行成功
    ...
  }).catch(errorInfo => {
    // 出现异常
    ...
  }).finally(() => {
    // 完成操作
    ...
    // 关闭遮罩
    this.$modal.closeLoading();
  });
};
```

### 提示类信息

在界面上方的提示，用于操作后的成功、失败等提示。

各类提示信息示例如下：

```javascript
// 通用提示, 可直接送入文本(默认类型为info), 或者送入element-plus的ElMessage的参数对象
this.$modal.message('info message'); // 不带其他参数的形式
this.$modal.message({message: 'message', type: 'info', ... }); // 带其他参数的形式

// 成功提示
this.$modal.messageSuccess('success message');

// 失败提示
this.$modal.messageError('error message');

// 告警提示
this.$modal.messageWarning.messageError('warnings message');
```

### 通知类消息

通知类消息是右边冒泡的通知信息, 可以用于站内通知信息提示。

各类通知信息示例如下：

```javascript
// 通用通知, 可直接送入文本(默认类型为info), 或者送入element-plus的ElNotification的参数对象
this.$modal.notify('notify message');
this.$modal.notify({ message: 'message', title: 'title', type: 'info', ...});

// 成功通知
this.$modal.notifySuccess('success notify message');

// 错误通知
this.$modal.notifyError('error notify message');

// 告警通知
this.$modal.notifyWarning('warning notify message');
```

### 告警框消息

弹出的告警信息消息框。

各类告警信息消息框示例如下：

```javascript
// 通用告警框, 第3个参数可以传入element-plus的ElMessageBox的参数
this.$modal.alert('alert content');
this.$modal.alert('alert content', 'title');  // 也可以使用i18n多语言的方式$t('Alert')
this.$modal.alert('alert content', 'title', { type: 'success' });

// 也可以使用以下几个简化的封装函数, 入参和通用告警框一致
this.$modal.alertSuccess('alert content');
this.$modal.alertError('alert content');
this.$modal.alertWarning('alert content');
```

### 弹出消息框

弹出可支持信息交互的消息框。

目前有两个主要函数：

- messageBox : 该函数实际上是直接对ElMessageBox的封装, 入参与ElMessageBox的入参一致，但增加了支持iframe模式下的弹出主界面消息框的支持。

- confirm : 基于messageBox封装的确认提示窗口,

## $dialog 全局对话框插件

element-plus的Dialog组件并没有实现全局封装，无法通过this.$dialog的方式动态创建和使用，因此对该组件做了封装（组件源码：src/components/common/Dialog），同时在Vue中做了全局注册，方便使用。

打开一个对话框的简单代码如下：

```javascript
this.$dialog.show('LoginForm', {
  dialogProps: {
    dialogStyle: {
      '--el-dialog-padding-primary': '0px'
    }
  }
});
```

### 参数详细说明

对话框函数定义为 this.$dialog.show(component, options = {})

#### component

对话框内容的组件，可以传入组件对象，或者组件名称（字符串）。需要注意传入的组件必须在当前Vue页面中可以访问，通过以下两种方式之一支持：

1、在当前页面中引入组件，例如：

```javascript
import LoginForm from "./components/LoginForm.vue";

export default {
  ...
  components: { LoginForm, ... },
  ...
};
```

2、在main.js中加载为全局组件，例如：

```javascript
const globalComponents = [
  require.context('@/components/global', false, /(\\|\/)([A-Z]|[a-z])\w+\.(vue|js)$/),  // 非文件夹模式的组件
  require.context('@/components/global', true, /\.(\\|\/)\w+(\\|\/)index\.(vue|js)$/),  // 文件夹模式的组件
]
importComponents(app, globalComponents);
```

#### options

对话框控制参数JSON对象，可以支持传入的参数如下：

- id ：打开内容组件的id，便于删除组件时快速找到组件

- dialogProps：element-plus的Dialog组件的原生属性（JSON对象），可支持的属性直接参考element-plus的官方文档，除了原生组件属性以外，还支持以下的自定义属性
  
  - dialogStyle：自定义要控制的Dialog组件的样式字典，除了可设置一般样式以外，也可以在该参数中传入element-plus的变量，控制对话框的展示样式

- subComponentProps：所打开的内容组件的属性（JSON对象）

options的样例：

```javascript
{
    id: 'myId',
    // 对话框组件的props
    dialogProps: {
        // 原生属性
        title: '对话框标题',
        fullscreen: true, // 全屏展示
        ...
        // 自定义属性
        dialogStyle: {
            '--el-dialog-padding-primary': '0px', // 对话框内容padding设置为0
            ...
        }
    },
    // 内容组件的props
    subComponentProps: {
        name: 'xxx',
        ...
    }
}
```

## 文件下载插件

this.$download , 待补充
