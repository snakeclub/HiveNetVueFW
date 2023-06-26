# MarkdownPreview

MarkdownPreview组件可用于预览Markdown文档，传入的文档内容可以是Markdown文本（用于从数据库获取文档的情况），也可以直接是网络的文本url链接地址。

## 传入文档文本

可以创建一个Vue页面，在项目编译初期通过raw方式加载本地的markdown文档内容文本，当然也可以在运行态从数据库获取对应的文本进行展示，下面的例子是编译初期加载本地文档的展示形式, 将文档文本传入到组件的textVal参数中：

```
<template>
  <markdown-preview :textVal="text" :isStdImagePath="true"></markdown-preview>
</template>

<script>
// raw方式获取md文本
import MarkdownPreview from "@/components/view/MarkdownPreview/index.vue";
import mdText from '!!raw-loader!../../../docs/readme.md';

export default {
  data() {
    return {
      text: mdText
    };
  },

  components: {
    MarkdownPreview,
  }
};
</script>
```

## 传入url方式

可以在运行态直接将要展示的文档url地址进行传入和展示, 注意需要传入指定文档获取类型的参数textType为"url", 参考代码如下:

```
<template>
  <markdown-preview textType="url" :textVal="text" :isStdImagePath="true"></markdown-preview>
</template>

<script>
// raw方式获取md文本
import MarkdownPreview from "@/components/view/MarkdownPreview/index.vue";

export default {
  data() {
    return {
      text: "http://xxx.xxx.com/xxx.md"
    };
  },

  components: {
    MarkdownPreview,
  }
};
</script>
```

## 属性说明

| 属性名            | 类型      | 默认值           | 说明                                                                                       |
| -------------- | ------- | ------------- | ---------------------------------------------------------------------------------------- |
| textVal        | String  |               | 文档获取值, 必传, text情况直接传入text文本, url模式传入连接地址                                                 |
| textType       | String  | text          | 文档传入类型, text - 传入文档文本, url - 传入文档url地址                                                   |
| titleWidth     | String  | 200px         | 目录栏位宽度                                                                                   |
| titleLevel     | Number  | 3             | 生成展示目录级别                                                                                 |
| titlePosition  | String  | right         | 目录栏位位置, left - 栏位在左侧, right - 栏位在右侧                                                      |
| isStdImagePath | Boolean | false         | 是否标准化文档中的图片路径, 如果设置为true, 则会自动将 images/ ./images/ ../images/ 等路径统一替换到stdImagePath属性指定的路径 |
| stdImagePath   | String  | /docs/images/ |                                                                                          |
