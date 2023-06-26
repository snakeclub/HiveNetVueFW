# Iframe通讯框架

如果是要实现的是单页面应用，则无需使用iframe，组件直接访问应用的各类函数及变量即可；但如果要实现的是跨域的多平台应用，则需使用iframe嵌入其他平台页面的方案，实现多平台页面的组合应用模式。

项目提供了一套iframe通讯框架，实现主框架页面（Layout）和iframe页面（其他平台页面）的相互调用，以此优化嵌入页面和主框架的操作一致性体验。

### 整体方案

iframe通讯框架基于浏览器的postMessage方案实现通讯，主框架和子页面都添加对消息的监控和处理，采用异步方式实现请求调用和反馈信息的获取。

通用的消息格式为：

```javascript
// 请求消息格式
{
  type: 'iframe-send', // 消息类型
  id: nanoid(), // 请求id，用于匹配返回消息
  name: name, // 请求消息事件名
  para: para // 请求消息事件参数
  ...
}

// 返回消息格式
{
  type: 'iframe-back', // 消息类型
  id: '', // 请求id
  code: '00000', // 处理结果码，'00000'-代表成功
  msg: 'success', // 处理结果说明
  ... // 根据事件约定其他要返回的消息信息
}
```

针对通用消息格式和处理机制，封装了一个通讯框架基础库“src/utils/iframe/IframeMessage.js”，提供自定义消息事件处理函数管理、支持消息获取及返回值处理的统一消息监听事件、支持送入返回消息处理事件的通用消息发送函数等。

使用Iframe通讯框架基础库可以实现页面之间消息的底层处理，大致的使用步骤如下：

1、按规范开发消息处理事件函数，格式为：

```javascript
function pMessageDealFun(e) {
   const eventName = e.data.name; // 请求事件名称
   const eventPara = e.data.para; // 请求事件参数
   ... // 自己的业务逻辑
   return result; // 如果返回undefined，代表无需返回消息，否则返回 { code: '', msg: '', ...} 格式的返回信息
}
```

2、调用addMessageEvent把处理函数和事件名绑定；

```javascript
IframeMessage.addMessageEvent('eventName', pMessageDealFun);
```

3、在页面中调用AddMessageListener监听所有接收消息；

4、需要向其他页面发消息时，调用sendMessage发送请求，同时可指定回调函数获取返回的信息。

### Layout父框架的封装

基于IframeMessage基础库，本项目对Layout父框架调用iframe通讯功能进行了简化封装，开发消息处理事件的整体步骤跟IframeMessage差不多，只是换回使用“src/utils/iframe/IframeParent.js”框架，大体步骤如下：

```javascript
// 按规范开发消息处理事件函数，该函数收到其他页面的指定消息名的消息时将被执行，并返回处理结果
function pMessageDealFun(e) {
   const eventName = e.data.name; // 请求事件名称
   const eventPara = e.data.para; // 请求事件参数
   ... // 自己的业务逻辑
   return result; // 如果返回undefined，代表无需返回消息，否则返回 { code: '', msg: '', ...} 格式的返回信息
}

// 在需要的地方（例如mounted）初始化监听，第2个参数为收到消息的处理函数字典
initIframeParent(undefined, {pEventName: pMessageDealFun});
...

// 在需要请求子页面的地方，向iframe子页面发送消息
sendMessage(fEventName, eventPara, iframeId, feedbackEvent, overtime);
```



当前父框架已封装好可供子框架调用的功能包括：

**1、获取框架信息（请求事件名：pGetLayoutInfo）**

按请求参数的不同，获取不同的信息

（1）{ infoType: 'iframeInfo' } ：获取iframe自身的信息，返回 {sysId: , iframeId: , size: , lang: }

（2）{ infoType: 'themes' } ：获取主题颜色信息，返回主框架的主题颜色字典



**2、显示主框架的modal消息框（请求事件名：pShowModal）**

按请求参数不同处理，相关参数与 "src/plugins/modal.js" 定义的一致：

（1）{ modalType: 'showMessage', modalPara: $modal对应参数 } ：显示提示信息，无返回值

（2）{ modalType: 'showAlert', modalPara: $modal对应参数 } : 显示告警消息框，无返回值

（3）{ modalType: 'showNotification', modalPara: $modal对应参数 } : 显示右边通知消息，无返回值

（4）{ modalType: 'showMessageBox', modalPara: $modal对应参数 } : 显示消息框，返回 { code: '00000', msg: 'success', id: id, action: action }，其中action为ElMessageBox的返回动作值

（5）{ modalType: 'loading' }：显示loading的加载遮罩，无返回值

（6）{ modalType: 'transparentLoading' }：显示完全透明的加载遮罩，无返回值

（7）{ modalType: 'closeLoading' }：关闭打开的加载遮罩



**3、进行主框架的页面操作（请求事件名：pPageAction）**

按请求参数不同处理：

（1）{ actionType: 'openView', actionPara: "src/utils/actions/PageAction.js"的openViewInner第一个参数 }：打开Layout框架下的视图，返回 { ..., tagName: 所打开的页签名 }

（2）{ actionType: 'openLink', actionPara: "src/utils/actions/PageAction.js"的openLinkInner前两个参数的数组 }：打开Layout框架下的url，返回 { ..., tagName: 所打开的页签名 }

（3）{ actionType: 'openRefresh', actionPara: "src/utils/actions/PageAction.js"的openRefresh第一个参数 }：在主页面刷新打开url，无返回值

（4）{ actionType: 'toTag', actionPara: tagName }：跳到指定的标签页，返回标准结果{ code: '00000', msg: 'success', id: id }

（5）{ actionType: 'refreshTag', actionPara: tagName }：刷新指定的标签页，返回标准结果{ code: '00000', msg: 'success', id: id }

（6）{ actionType: 'closeTag', actionPara: tagName }：关闭指定的标签页，返回标准结果{ code: '00000', msg: 'success', id: id }



### iframe子页面框架的封装

基于IframeMessage基础库和Layout父框架所提供的功能，同样对iframe页面调用通讯框架的功能进行了封装，尽量简化子页面访问框架的难度，封装的库为“src/utils/iframe/IframeChild.js”，大体的使用步骤和父框架的方式相似。

不过为了简化子页面的使用，子页面框架可以使用集成度更高的封装函数，通过框架可以自动实现如主题颜色变更同步刷新、组件大小同步刷新、语言变更同步刷新、iframe页面大小改变通知父页面（避免出现两个滚动条）等功能，使用方式说明如下。

#### 嵌入框架功能（底层原生方法）

1、在页面的mounted环节装载iframe框架，同时在页面销毁的地方执行销毁框架的函数：

```javascript
mounted() {
  IframeChild.onMounted(this); // 装载框架，如果需要自定义消息处理事件函数，也可以在参数中传入设置
  ...
},
destroyed() {
  ...
  IframeChild.onDestroyed(this);  // 卸载iframe框架
},
```

2、通过watch监控 store.state.iframePageInfo 的相关变量（如主题颜色、语言等），并调用封装好的处理函数自动进行处理：

```javascript
// 需要先在computed中设置要计算的store的变量，才能在watch进行监控变化
computed: {
  ...
  // layout的主题信息
  layoutThemes() {
    return this.$store.state.iframePageInfo.themes;
  },
  // 语言信息
  layoutLang() {
    return this.$store.state.iframePageInfo.lang;
  },
  // 组件大小
  layoutSize() {
    return this.$store.state.iframePageInfo.size;
  },
  ...
},
...
// 监听变量变化，调用框架方法执行处理
watch: {
  // 监听框架主题，当发生变化时进行刷新
  layoutThemes(newValue, oldValue) {
    IframeChild.onWatchLayoutThemes(this, newValue);
  },
  // 监听语言，当发生变化时进行刷新
  layoutLang(newValue, oldValue) {
    IframeChild.onWatchLayoutLang(this, newValue);
  },
  // 监听组件大小，当发生变化时进行刷新
  layoutSize(newValue, oldValue) {
    IframeChild.onWatchLayoutSize(this, newValue);
  },
  ...
},
...
```

#### 嵌入框架功能（mixins方法）

另外一种嵌入框架的更简单方法，是直接使用mixins进行嵌入，达到的效果和前面的方法一样：

```javascript
// 实际页面定义
import IframeChildMixins from '../../utils/iframe/IframeChildMixins';
export default {
  mixins: [IframeChildMixins],
  ...
}
```

如果需要自定义消息处理函数，可以自行在mouted函数中调用接口进行新增：

```javascript
// 实际页面定义
import IframeChildMixins from '../../utils/iframe/IframeChildMixins';
import IframeChild from '../../utils/iframe/IframeChild';
export default {
  mixins: [IframeChildMixins],
  mouted: {
    IframeChild.addMessageEvent('myMessageEventName', myMessageEventFunction);
    ...
  },
  ...
}
```

框架中自带了页面内容大小改变的监控，并会自动调整iframe容器的高度，如果页面中同样需要监控界面大小并执行处理，可以自行在mouted函数中调用接口新增自己的处理函数：

```javascript
// 实际页面定义
import IframeChildMixins from '../../utils/iframe/IframeChildMixins';
import IframeChild from '../../utils/iframe/IframeChild';
export default {
  mixins: [IframeChildMixins],
  mouted: {
    IframeChild.addResizeEvent('test', (el) => {console.debug(el.scrollWidth);});
    ...
  },
  ...
}
```

#### 嵌入iframe页面大小控制框架（mixins方法）

对于iframe页面的展示大小控制（解决浮动元素定位、滚动条等问题），可以在页面中嵌入大小控制框架，嵌入框架后，可以支持按设置对iframe页面及主框架的展示组件的大小自动联动控制，让iframe页面的展示效果更接近原生vue页面的嵌入方式。

```javascript
// 实际页面定义
import IframeChildMixins from '../../utils/iframe/IframeChildMixins';
import IframeSizeMixins from '../../utils/iframe/IframeSizeMixins';
export default {
  mixins: [IframeChildMixins, IframeSizeMixins],
  ...
}
```

注意：IframeSizeMixins依赖IframeChildMixins，因此需要两个同时且按顺序嵌入。



嵌入框架以后，可以通过设置不同大小控制类型参数，让iframe页面展示不同的效果：

```javascript
// 实际页面定义
export default {
  data() {
      return {
        // 指定iframe页面内容自适应主框架的展示区域大小，这样滚动条出现在iframe页面内部，页面浮动元素位置不会出现问题（推荐）
        iframeSizeType: 'fit',
        ...
      };
   },
   ...
}
```

注：如果将iframeSizeType 设置为'none'，则代表主框架显示区域自适应iframe页面高度，滚动条出现在主框架上，这样的好处是主界面的其他页面组件（例如版权信息）可以接在页面后面形成一个页面的感觉，但注意这种模式在页面内部浮动元素位置出现问题。



#### 自主调用框架方法

1、直接调用不同的封装方法访问Layout父框架的功能，例如：

```
getIframeInfo ： 获取iframe的信息
getLayoutThemes ：获取主题信息
openLayoutView ： 打开Layout框架下的视图
... 更多的支持函数可直接看源码
```

2、对于消息提示内容（信息提示、消息框等），可直接使用 "this.$modal.xxx" 的方法，如果页面是iframe的子页面，将自动调用Layout主框架的modal方法，如果为非iframe，则会调用本地自身的modal方法。如果需要改变默认处理模式，可通过修改 “store.state.iframePageInfo.useSelfModal”，将值改为true，则将统一使用本地自身的modal方法。


