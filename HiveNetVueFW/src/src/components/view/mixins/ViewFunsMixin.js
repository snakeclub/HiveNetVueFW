/**
 * 封装通用页面的公共方法，引入mixins即可
 * 用法：
 * export default {
 *   mixins: [ViewFunsMixin],
 *   ...
 * }
 */

export default {
  computed: {
    // 获取当前页面路由的meta对象
    routeMeta() {
      return this.$route.meta || {};
    },
    // 判断页面是否layout页面的页签展示
    isLayoutTag() {
      const meta = this.$route.meta || {};
      const isFixed = meta['isFixed'];
      if (isFixed !== undefined && isFixed) {
        return true;
      }
      const isLayoutTag = meta['isLayoutTag'];
      if (isLayoutTag !== undefined && isLayoutTag) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    /**
         * 移动到下一个焦点栏位函数
         * 要跳转到的栏位添加 tab-scope 属性指定跳转对象分组标识, 添加 tab-index 属性添加跳转顺序
         * 触发跳转的栏位添加 @keyup.enter.native="moveNextFocus($event, 'formRefName', 3, 'abc')" 指定跳转指令
         * @param {*} event - 元素自身事件对象($event)
         * @param {string} formRefName - 搜索的表单引用名, 如果不送入代表整个页面范围搜索
         * @param {int} tabIndex - 指定要跳转到的元素的索引值, 如果不送代表获取当前元素的索引值 + 1
         * @param {string} scope - 指定要跳转到的元素的范围标识, 如果不送代表获取当前元素的'tab-scope'属性
         */
    moveNextFocus(event, formRefName, tabIndex, scope) {
      // 获取搜索元素
      let searchEl;
      if (formRefName) {
        searchEl = this.$refs[formRefName].$el;
      } else {
        searchEl = document;
      }

      // 获取要跳转到的元素index
      let nextIndex = 1;
      if (tabIndex !== undefined) {
        nextIndex = tabIndex;
      } else {
        const currentIndex = event.srcElement.getAttribute('tab-index');
        if (currentIndex !== undefined) {
          nextIndex = parseInt(currentIndex) + 1;
        }
      }

      // 获取要跳转到的元素scope
      let nextScope;
      if (scope) {
        nextScope = scope;
      } else {
        nextScope = event.srcElement.getAttribute('tab-scope');
      }

      // 查找索引+1的匹配元素
      const cssSelector = '[tab-index="' + nextIndex.toString() + '"]';
      let nextItems = searchEl.querySelectorAll(cssSelector);
      let nextMatchItem; // 最后匹配到的元素
      nextItems.forEach(element => {
        if (nextScope) {
          if (nextScope === element.getAttribute('tab-scope')) {
            nextMatchItem = element;
            return;
          }
        } else {
          if (!element.getAttribute('tab-scope')) {
            nextMatchItem = element;
            return;
          }
        }
      });

      if (nextMatchItem) {
        nextMatchItem.focus();
        return;
      }

      // 单元素找不到, 尝试获取所有元素
      if (nextScope) {
        nextItems = searchEl.querySelectorAll('[tab-scope="' + nextScope + '"]');
      } else {
        nextItems = searchEl.querySelectorAll('[tab-index]');
      }

      let minIndex = 1000000000; // 用于登记大于等于要寻找的索引的最小索引
      nextItems.forEach(element => {
        if (!nextScope && element.getAttribute('tab-scope')) {
          return;
        }
        const tempIndex = parseInt(element.getAttribute('tab-index'));
        if (!isNaN(tempIndex) && tempIndex >= nextIndex) {
          if (tempIndex < minIndex) {
            minIndex = tempIndex;
            nextMatchItem = element;
          }
        }
      });

      if (nextMatchItem) {
        nextMatchItem.focus();
      }
    }
  }
};
