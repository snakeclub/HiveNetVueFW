<template>
  <div>
    <markdown-preview textType="url" :textVal="url" :isStdImagePath="isStdImagePath" :stdImagePath="stdImagePath"></markdown-preview>
  </div>
</template>

<script>
import MarkdownPreview from "@/components/view/MarkdownPreview/index.vue";

export default {
  components: {
    MarkdownPreview,
  },

  props: {
    // 文档信息, text情况直接传入text文本, url模式传入连接
    url: {
      type: String,
      required: true
    },
    // 是否标准化图片路径, 将 images/ ../images/等统一替换到/docs/images/目录下
    isStdImagePath: {
      type: Boolean,
      default: false,
      required: false
    },
    // 标准化的图片路径
    stdImagePath: {
      type: String,
      default: '/docs/images/'
    }
  }
};
</script>
