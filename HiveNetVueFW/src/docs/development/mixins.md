# 页面混入代码

## ViewFunsMixin

### 使用方法

该混入代码为框架的页面提供最基本的计算变量和方法。混入的方式是在Vue页面的代码中增加以下混入代码：

```javascript

<script>
  ...
  import ViewFunsMixin from '@/components/view/mixins/ViewFunsMixin.js';

  export default {
    mixins: [ViewFunsMixin, ...],
    ...
  }
</script>

```

### 计算变量清单

- routeMeta : 获取当前页面路由的meta对象(Layout框架展示的页签嵌入页面都有meta信息, 存放着页面展示较为关键的信息内容)
- isLayoutTag : 判断当前页面是否Layout页面下的页签页面(单页面应用下的嵌入页面, 如果是外部页面该值为false, 采用iframe方式嵌入)

### 公共函数清单

#### moveNextFocus (输入栏位焦点切换公共处理函数)

支持输入栏位焦点切换的公共处理函数, 可以支持实现回车快捷键实现栏位间的顺序切换。具体使用方法如下：

1、在焦点的跳转的目标对象上添加 tab-index 和 tab-scope 两个属性：

- tab-index: 定义该对象的跳转顺序，可按定义的顺序从小大到进行切换，跳转的顺序可以为不连续的数字
- tab-scope: 定义该对象所属的跳转范围，可以设置为不同值来支持不同输入栏位的分组，让焦点跳转在分组范围内处理

2、在触发的目标时间上绑定 moveNextFocus 函数执行跳转，moveNextFocus函数的参数定义如下：

- event - 元素自身事件对象，可直接传入 $event，函数将自动从 $event.srcElement 来获取当前触发事件自身
- formRefName - 搜索的表单引用名, 用于控制所搜索的表单范围（表单对象上必须绑定 ref="xxxx" 的引用名），如果不送入代表整个页面范围搜索
- tabIndex - 指定要跳转到的元素的索引值, 如果不送代表获取当前元素的索引值 + 1
- scope - 指定要跳转到的元素的范围标识, 如果不送代表获取当前元素的'tab-scope'属性

可以将函数绑定在输入栏位的回车事件中：@keyup.enter.native="moveNextFocus($event, 'EditForm', ...)"，这样通过输入回车实现对下一个栏位的焦点切换。

不同传参可以实现不同的控制：

- moveNextFocus($event) ：在整个所有元素范围进行焦点的切换，自动获取当前触发元素的 tab-index 和 tab-scope 属性, 找到对应scope范围的下一个 tab-index 的对象进行切换；
- moveNextFocus($event, 'EditForm') ：推荐方式，仅在 EditForm 指定的表单范围内进行焦点的切换，自动获取 tab-index 和 tab-scope 属性进行切换处理；
- moveNextFocus($event, 'EditForm', 1, 'newScope') ：当需要从一个scope范围跳转到下一个scope范围时，或者需要明确指定要跳转到的序号时，可以采用这种指定跳转的方式。

参考代码如下：
```html
<el-form ref="EditForm">
  <!-- 不指定scope的方式, 等同于tab-scope="" -->
  ...
  <el-input tab-index="1" @keyup.enter.native="moveNextFocus($event, 'EditForm')" />
  ...
  <el-input tab-index="2" @keyup.enter.native="moveNextFocus($event, 'EditForm')" />
  ...
  <el-input tab-index="3" @keyup.enter.native="moveNextFocus($event, 'EditForm')" />
  ...
  <!-- 跳转到下一个scope -->
  <el-input tab-index="3" @keyup.enter.native="moveNextFocus($event, 'EditForm', 1 'myScope')" />
  ...
  <!-- 指定scope的方式 -->
  ...
  <el-input tab-index="1" tab-scope="myScope" @keyup.enter.native="moveNextFocus($event, 'EditForm')" />
  ...
  <el-input tab-index="2" tab-scope="myScope" @keyup.enter.native="moveNextFocus($event, 'EditForm')" />
  ...
  <el-input tab-index="3" tab-scope="myScope" @keyup.enter.native="moveNextFocus($event, 'EditForm')" />
  ...
</el-form>

```
