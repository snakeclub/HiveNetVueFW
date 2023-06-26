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
