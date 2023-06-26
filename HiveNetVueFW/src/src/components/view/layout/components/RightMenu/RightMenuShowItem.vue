<template>

  <svg-icon v-if="item.showType === 'icon'"
    :id="'right-menu-' + item.name"
    :icon-class="item.icon"
    class-name="navbar-icon"
    :style="item.css === undefined ? '' : item.css"
    :disabled="item.realDisabled"
  />

  <el-link v-else-if="item.showType === 'link'"
  :underline="false"
  class="navbar-link"
  :style="item.css === undefined ? '' : item.css"
  :disabled="item.realDisabled"
  >
    <svg-icon v-if="item.icon"
      :id="'right-menu-' + item.name + '-icon'"
      class-name="navbar-icon"
      :icon-class="item.icon"
    />
    <span>{{$t(item.showName)}}</span>
  </el-link>

  <component v-else-if="item.showType === 'component'"
    :id="'right-menu-' + item.name"
    :is="item.component"
    v-bind="item.componentProps || {}"
    :disabled="item.realDisabled"
    :style="item.css === undefined ? '' : item.css"
    :class="componentClass"
    :menuItem="item"
  ></component>
</template>

<script>
  /**
  * 右上角菜单项显示模版
  * 注：不包含toolTip的处理
   */
  import HeaderSearch from './components/HeaderSearch';
  import SizeSelect from './components/SizeSelect'
  import Screenfull from './components/Screenfull';
  import Avatar from './components/Avatar';
  import LangSelect from './components/LangSelect';

  export default {
    components: {
      HeaderSearch, Screenfull, SizeSelect, Avatar, LangSelect
    },
    name: 'RightMenuShowItem',
    data() {
      return {};
    },
    props: {
      // 传入的菜单对象
      item: {
        type: Object,
        required: true
      },
      // 是否下拉列表对象
      dropDownItem: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    computed: {
      // 如果是下拉框，不再增加菜单样式
      componentClass() {
        if (this.dropDownItem) {
          return '';
        } else {
          return 'right-menu-item hover-effect';
        }
      }
    }
  }
</script>


