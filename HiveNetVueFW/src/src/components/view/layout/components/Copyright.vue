<template>
<div class="copyright">{{copyright}}</div>
</template>
<script>
/**
 * 每个页面底部的版权说明
 */
import settings from '@/settings';
export default {
  name: 'Copyright',
  data() {
      return {
        copyright: settings.app.copyrightText
      }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/themes.scss';
.copyright {
  display: flex;
  width: 100%;
  max-width: 100%;
  height: $copyrightHeight;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  font-size: var(--el-font-size-small);
  color: var(--label-font-color);
}
</style>