# icon图标使用

本项目通过 svg-sprite-loader 插件加载 svg 图标资源，并将 SvgIcon 组件全局注册为 'svg-icon' 便于应用，同时也支持全局加载的element-plus图标的直接使用。

## 添加自定义的svg图标

要求自定义的svg图标必须是一个文件一个图标（不支持一个svg文件包含多个图标的情况），图标文件名就是最后要引用的icon-name。

在编译工程之前，把图标文件直接放到 ./src/assets/icons/svg 目录下即可。

**注意：如果遇到导入的图标颜色无法修改的情况，可以打开对应的svg文件，看看是否指定了fill属性，可以将该属性删除解决问题。**

## 使用图标

参考以下代码即可：

```html
<!-- 本地图标 -->
<svg-icon icon-class="phone" />
<svg-icon iconClass="phone" />

<!-- element-plus图标, “el-icon-”开头 -->
<svg-icon icon-class="el-icon-location" />

<!-- 网络图标 -->
<svg-icon icon-class="http://xxx.xxx.xxx/xx.svg" />

<!-- 指定图标大小和颜色 -->
<svg-icon icon-class="phone" style="font-size: 20px; color: #f30505;" />

<!-- 指定图标CSS类 -->
<svg-icon icon-class="message" class-name="card-panel-icon class2" />
<svg-icon iconClass="message" className="card-panel-icon class2" />
```

**注1：icon-class 指定图标名，实际上就是文件名；class-name为需指定的css样式类名。**

**注2：图标的属性传递可以使用小写形式 icon-class, 也可以使用大写形式 iconClass, 两种形式都可以正常显示。 **

**注3：如无特殊情况建议直接使用element-plus图标。**

## 使用原生的@element-plus/icons-vue图标

默认的element-plus图标使用的是@element-plus/icons-vue图标，可以根据官方文档按不同的方式使用。

### 按需导入单个图标进行使用

在Vue文件中，需要导入图标组件，参考如下：

```javascript
<script>
  import { Search } from '@element-plus/icons-vue';
  ...
  export default {
    components: { Search, ... },
    setup() { 
      return { Search, ... }; 
    }, // 要加上这段 el-input 组件才能引用
    ...
  }
</script>
```

在HTML文档中使用图标：

```html
<!-- 直接使用组件 -->
<el-icon size="16px" :color="#f30505"><search></search></el-icon>

<!-- 动态指定要使用的图标 -->
<el-icon><component is="Search"></component></el-icon> <!-- 注意需要使用string传入 -->

<!-- 在el-input组件中使用，注意需要使用Component对象方式传入 -->
<el-input :prefix-icon="Search" />
```

### 使用自动导入的i图标组件

项目默认将图标按i-xxx-xxx的格式进行了批量导入，因此可以方便地直接使用图标，无需提前导入图标，方法如下：

```html
<!-- 直接使用组件 -->
<el-icon :size="size" :color="color"><i-search></i-search></el-icon>

<!-- 动态指定要使用的图标 -->
<el-icon><component is="i-search"></component></el-icon> <!-- 注意需要使用string传入 -->

<!-- 在el-input组件中使用，注意直接使用文本方式传入 -->
<el-input prefix-icon="i-search" />
```

## 图标使用示例

[icon示例页面](/sys-portal/Example/IconsDemo)