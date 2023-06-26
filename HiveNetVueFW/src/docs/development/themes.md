# 主题颜色适配

## 整体方案

本项目框架支持设置自定义的颜色主题，代码框架说明如下：

1、“src/assets/css” 目录下放置了全局样式定义，其中“themes.scss”定义了各类主题颜色变量，“layout”目录下定义了layout框架（含菜单和页签的主页框架）在不同主题下的css样式；目前支持的颜色主题变量可自行查看源码；

2、“src/store/modules/LayoutSettings.js”通过vuex（store）管理的当前页面样式变量，变量中放置最新的颜色主题；

3、“src/utils/actions/LayoutSettings.js”定义了主题设置的公共方法，例如可通过refreshViewThemes函数按最新的颜色主题刷新页面展示；

4、“src/permission.js”在打开路由页面后自动加载当前样式设置（从localStorage中获取用户保存的主题设置），并刷新页面标题。

方案中的核心设计说明如下：

1、主题颜色的修改，是通过修改html对象上stlye中存储的的css自定义颜色属性变量实现，例如：

```
<html style="--systemThemeColor: #0960BD;--systemThemeColorActive: #9cf3ff;--navbarThemeColor: #FFFFFF;--navbarThemeColorActive: #ffffff;--sidebarThemeColor: #001529;">
...
<html>
```

2、两个配套颜色（systemThemeActive、navbarThemeActive）是通过js代码生成的跟主题颜色相近的配色颜色；

3、主题样式的修改，是通过在body上增加相应的class来实现匹配：

- navbar--white ：增加或清除该类，可以控制顶端导航栏的颜色体系（浅色体系/深色体系）
- sidebar--white ： 增加或清除该类，可以控制左侧菜单栏的颜色体系（浅色体系/深色体系）
- night-mode ： 增加或清除该类，可以切换日间模式和夜间模式
- mobile ： 界面会自动判断并设置该类，可以根据该类判断和切换PC和移动端的不同样式

## 页面主题适配开发规范要求

### 页面背景颜色及字体颜色

为了嵌入Layout框架的页面颜色保持一致性，应统一所有页面背景和字体颜色，同时也需要为夜间模式（night-mode）进行颜色适配，最简单的方式是直接使用框架自带的颜色变量，由框架控制对应的颜色和模式。

如果是在 el-main 中嵌入展示的页面，将直接继承通用的背景和字体样式颜色：

```css
.el-main {
  color: var(--label-font-color);
  background-color: $contentBgColor;
  padding: 0px;
}
```

如果是单独展示的页面，应使用以下两个样式颜色变量指定页面背景颜色及字体颜色，例如：

```css
.xxx {
  color: var(--label-font-color);
  background-color: var(--contentBgColor);
}
```

# 页面布局适配

## 页面大小计算

可以直接通过CSS变量获取Layout页面（包含菜单、导航栏布局）的各个元素的高度和宽度，从而计算出展示区域的实际高度和宽度，便于进行精确的布局控制。

Layout页面的相关变量设置在页面根元素下：

```scss
:root {
  ...
  // 用于计算高度的一些设置，可以动态进行修改
  --headerHeight: 50px; // 顶部导航栏高度设置
  --tabsHeight: 30px;  // 页签栏高度
  --copyrightHeight: 20px;  // 版权栏高度
}
```

主页展示区域的宽高可按以下方式用css设置：

```scss
width: calc(100vw - var(--sidebarWidth));
height: calc(100vh - var(--headerHeight) - var(--tabsHeight));
```

或者引入themes.scss文件，用更便捷的方式设置：

```scss
width: calc(100vw - #{$sidebarWidth});
height: calc(100vh - #{$headerHeight} - #{$tabsHeight});
```

**需要特殊注意的是，如果页面缩小到移动手机的尺寸，左边菜单会直接隐藏，但对应的--sidebarWidth参数不会自动设置为0。因此对于这种情况，需要在CSS中增加移动模式的设置，例如：**

```scss
.mobile .xxx {
    width: 100vw;
}
```

如果要在JS代码中处理宽度和高度，可以通过以下方式获取相应的CSS变量：

```javascript
computedStyle = getComputedStyle(document.documentElement);
tagsHeight = parseInt(computedStyle.getPropertyValue('--tabsHeight'));
```

## 滚动区域处理

框架对页面自身宽度和高度都是没有限制的，滚动情况出现在浏览器窗口或者Layout页面的显示区域，因此如果需要处理页面的滚动，需要根据实际滚动条所在的区域进行处理：

1、如果是非嵌入在Layout窗口处理的页面，理论上滚动条区域就是浏览器区域，直接处理window的滚动条即可；

2、如果是Layout的嵌入页面，其滚动条区域是el-main组件的区域，可以通过以下方式获取：

```javascript
const elMain = document.getElementsByClassName('layout-el-main')[0];
```

可以通过 ViewFunsMixin.js 的计算方法直接判断页面是否Layout的嵌入页面：

```javascript
if (this.isLayoutTag) {
  ...
}
```
