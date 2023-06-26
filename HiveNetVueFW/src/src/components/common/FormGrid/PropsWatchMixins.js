/**
 * FormGrid 监听 props 变化的 mixins
 */
import WebTools from '@/utils/base/WebTools';
import StringTools from '@/utils/base/StringTools';

export default {
  data() {
    return {
      // 设置要监控的属性
      WatchProps: [],
      // 自定义处理样式的属性
      SelfDealProps: [],
      // 设置样式的ref对象名
      StyleObjRefName: ''
    };
  },
  mounted() {
    this.setGridStyle();
  },
  watch: {
    /**
     * 监听props的传参变化, 发现有变化重新刷新样式
     * 注意必须在setup中返回整个props对象, 供统一监听变化使用
     */
    props: {
      deep: true, // 深度监听
      handler(newValue, oldValue) {
        // 检查变更的参数清单
        const listenProps = this.WatchProps.slice();
        const changeProps = [];
        listenProps.forEach(propName => {
          if (newValue[propName] !== oldValue[propName]) {
            changeProps.push(propName);
          }
        });

        // 对有变更的参数执行样式变化处理
        if (changeProps.length > 0) {
          this.setGridStyle(changeProps);
        }
      }
    }
  },
  methods: {
    // 设置自身的CSS样式参数
    setGridStyle(changeProps) {
      // 获取设置清单
      let setStyleList = changeProps;
      if (setStyleList === undefined) {
        setStyleList = this.WatchProps.slice();
      }

      // 遍历处理设置
      const el = this.$refs[this.StyleObjRefName];
      setStyleList.forEach(propName => {
        let cssList = [];
        if (this.SelfDealProps.includes(propName)) {
          // 自定义处理
          const selfRet = this.selfSetGridStyle(el, propName);
          if (selfRet) {
            cssList = selfRet;
          }
        } else {
          // 通用处理
          cssList.push({
            cssName: '--formGrid' + StringTools.firstCase(propName, true),
            cssValue: this[propName] !== undefined ? String(this[propName]) : undefined
          });
        }

        // 处理样式
        cssList.forEach(cssItem => {
          if (cssItem.cssValue === undefined) {
            WebTools.removeStyle(el, cssItem.cssName);
          } else {
            WebTools.addStyle(el, cssItem.cssName, cssItem.cssValue);
          }
        });
      });
    },

    // 组件自定义的样式处理, 返回要处理的样式数组[{cssName: xxx, cssValue: xxx}]
    // cssValue 如果设置为 undefined 代表删除样式
    // 返回 [] 代表不处理
    selfSetGridStyle(el, propName) {
      const cssList = [];
      if (propName === 'autoWrap') {
        cssList.push({
          cssName: '--formGrid' + StringTools.firstCase(propName, true),
          cssValue: this[propName] === undefined ? undefined : this[propName] ? 'wrap' : 'nowrap'
        });
      } else if (propName == 'hPaddingDirection') {
        // 要设置为类
        WebTools.addClass(el, 'h-padding-direction-' + this[propName]);
      } else if (propName == 'autoSwitchMobileMode') {
        // 要设置为类
        if (this[propName]) {
          WebTools.addClass(el, 'auto-switch-mobile-mode');
        } else {
          WebTools.removeClass(el, 'auto-switch-mobile-mode');
        }
      }
      return cssList;
    }
  }
};
