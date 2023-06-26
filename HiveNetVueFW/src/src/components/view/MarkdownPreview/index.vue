<template>
    <div ref="wrapper" :class="`markdown-preview-wrapper title-position-${titlePosition}`"
      :style="`--markdown-preview-title-width:${titleWidth};`"
    >
      <el-aside class="title-wrapper" :width="titleWidth">
        <el-card>
          <div class="title-content">
            <h3 class="title-content__heading">{{ $t('Contents') }}</h3>
            <ul class="title-items">
              <li v-for="anchor in titles" class="title-item">
                <a
                  class="title-link" href="#"
                  @click="handleAnchorClick(anchor)"
                  :style="`padding-left: ${anchor.indent * 10}px;`"
                >
                  {{ anchor.title }}
                </a>
              </li>
            </ul>
          </div>
        </el-card>
      </el-aside>
      <div class="content-container">
        <div class="content">
            <v-md-preview :text="text" ref="preview" />
        </div>
      </div>
    </div>
</template>

<script>
  /**
   * 预览文本格式的markdown文档内容
   */
  import {getUrlFileContent} from '@/utils/base/NetTools';
  import ViewFunsMixin from '@/components/view/mixins/ViewFunsMixin.js';

  export default {
    mixins: [ViewFunsMixin],
    name: 'MarkdownPreview',
    props: {
      // 指定markdown文档类型, 支持text, url两种传入方式
      textType: {
        type: String,
        default: 'text'
      },
      // 文档信息, text情况直接传入text文本, url模式传入连接
      textVal: {
        type: String,
        required: true
      },
      // 目录栏位宽度
      titleWidth: {
        type: String,
        default: '200px'
      },
      // 展示目录级别
      titleLevel: {
        type: Number,
        default: 3
      },
      // 目录栏位位置, 支持 left, right
      titlePosition: {
        type: String,
        default: 'right'
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
    },
    data() {
      return {
        text: '',
        titles: [],
      }
    },
    mounted() {
      // 装载文档
      this.loadMarkdown();
    },
    watch: {
      // 监听markdown文档发生变化时执行的操作
      text: function() {
        // 获取锚点和标题, 需要使用nextTick等待dom更新后再处理
        this.$nextTick(() => {
          // 重建控件
          this.createAnchorInfo();
        });
      },
    },
    methods: {
      // 装载markdown文档信息
      loadMarkdown() {
        if (this.textType == 'text') {
          // 直接是文本格式
          if (this.isStdImagePath) {
            this.text = this.setStdImagePath(this.textVal);
          } else {
            this.text = this.textVal;
          }
        } else {
          // 需要加载url文档, 采用异步方式, 先打开遮罩
          this.$modal.loading(this.$t('Loading doc contents'));
          getUrlFileContent(
            this.textVal, this.getFileCallback,
            (errorInfo) => {this.$modal.messageError(errorInfo.toString());},
            () => {this.$modal.closeLoading();}
          );
        }
      },

      // 替换markdown文档中的图片链接, 将 images/ ../images/等统一替换到images目录下
      setStdImagePath(text) {
        return text.replace(/(?!\!\[.*\]\()(\.\/)*(\.\.\/)*images\/(?!.*\).*$)/g, this.stdImagePath);
      },

      // 获取url文件信息的相关处理函数
      getFileCallback(text) {
        if (this.isStdImagePath) {
          this.text = this.setStdImagePath(text);
        } else {
          this.text = text;
        }
      },

      // 生成目录信息
      createAnchorInfo() {
        let levelArray = [];
        for (let i = 1; i <= this.titleLevel; i++) {
          levelArray.push('h' + i.toString());
        }
        const anchors = this.$refs.preview.$el.querySelectorAll(levelArray.join(','));
        const titles = Array.from(anchors).filter((title) => !!title.innerText.trim());

        if (!titles.length) {
          this.titles = [];
          return;
        }

        const hTags = Array.from(new Set(titles.map((title) => title.tagName))).sort();

        this.titles = titles.map((el) => ({
          title: el.innerText,
          lineIndex: el.getAttribute('data-v-md-line'),
          indent: hTags.indexOf(el.tagName),
        }));
      },

      // 点击目录的跳转函数
      handleAnchorClick(anchor) {
        const { preview } = this.$refs;
        const { lineIndex } = anchor;
        const heading = preview.$el.querySelector(`[data-v-md-line="${lineIndex}"]`);

        // 获取文档滚动对应的容器
        let container = window;  // 非 Layout 情况，视为独立窗口, 滚动条在window对象上
        if (this.isLayoutTag) {
          const elMain = document.getElementsByClassName('layout-el-main');
          if (elMain.length > 0) {
            // 有获取到layout信息
            container = elMain[0];
          }
        }

        if (heading) {
          preview.scrollToTarget({
            target: heading,
            scrollContainer: container,
            top: 60,
          });
        }
      },
    },
  };
</script>


<style lang="scss" scoped>
@import '@/assets/css/themes.scss';

// Start ----------文档展示容器样式----------
.markdown-preview-wrapper {
    padding: 0px;
}

.markdown-preview-wrapper .content-container {
    z-index: 1;
    max-width: calc(100vw - #{$sidebarWidth});
}

.mobile .markdown-preview-wrapper .content-container {
  max-width: 100vw;
}

// 当屏幕大小大于1440px时, 控制大小(留出空间显示目录)
@media screen and (min-width: 768px) {
    .markdown-preview-wrapper {
        display: flex;
    }
    .markdown-preview-wrapper .content-container {
        z-index: 1;
        max-width: calc(100vw - #{$sidebarWidth} - var(--markdown-preview-title-width) - 10px);
    }

    // 目录栏位在右边的配置
    .markdown-preview-wrapper {
      &.title-position-right {
        flex-direction: row-reverse;
      }
    }
}

// End ----------文档展示容器样式----------

// Start ----------目录栏位样式----------
.markdown-preview-wrapper .title-wrapper {
    display: none;
    padding-left: 10px;

    .el-card {
      position: fixed;
      margin-top: 10px;
      z-index: 2;
      width: calc(var(--markdown-preview-title-width) - 10px);
    }
}

@media screen and (min-width: 768px) {
  .markdown-preview-wrapper .title-wrapper {
      display: block;
  }

  // 目录栏位在右边的配置
  .markdown-preview-wrapper {
      &.title-position-right {
        .title-wrapper {
          padding-left: 0px;
          padding-right: 0px;
        }
      }
    }
}

.markdown-preview-wrapper .title-content {
    display: block;
}


.markdown-preview-wrapper .title-wrapper .title-content__heading {
    font-size: 16px;
    color: var(--label-font-color);
    font-weight: 600;
    text-transform: uppercase;
    margin-top: 0;
}

.markdown-preview-wrapper .title-wrapper .title-content .title-items {
    list-style: none;
    padding: 0;
    margin: 12px 0 0;
    line-height: 1.2;
}

.markdown-preview-wrapper .title-wrapper .title-content .title-items .title-item {
    margin-top: 10px;
    font-size: 11px;
    color: var(--label-font-color);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: inherit;
}

.markdown-preview-wrapper .title-wrapper .title-content .title-items .title-item .title-link {
    position: relative;
    color: var(--label-font-color);;
    transition: color var(--el-transition-duration);
}

.markdown-preview-wrapper .title-wrapper .title-content .title-items .title-item .title-link:hover {
  color: $systemThemeLight1;
  font-weight: bold;
}

.markdown-preview-wrapper .title-wrapper .title-content .title-items .title-link.active {
    color: $systemThemeLight1;
    font-weight: bold;
}
// Ends ----------目录栏位样式----------

</style>