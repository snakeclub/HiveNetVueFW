<template>
  <div class="icons-container">
    <el-tabs type="border-card">
      <el-tab-pane label="SVG Icons">
        <div class="demo-icon-item">
          <div class="demo-icon-title">SVG Icons ({{ generateIconCode("icon-name") }})</div>
          <ul class="demo-icon-list">
            <li class="icon-item" v-for="item of svgIcons" :key="item">
              <span class="demo-svg-icon">
                <svg-icon :icon-class="item" style="font-size: 20px;" />
                <span class="icon-name">{{ item }}</span>
              </span>
            </li>
          </ul>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Element-UI Icons">
        <div class="demo-icon-item" v-for="(value, key) in elementIcons" :key="key">
          <div class="demo-icon-title">{{ key }} ({{ generateElementIconCode("iconName") }})</div>
          <ul class="demo-icon-list">
            <li class="icon-item" v-for="item of value" :key="item">
              <span class="demo-svg-icon">
                <svg-icon :icon-class="`el-icon-${getKebabCase(item)}`" style="font-size: 20px;" />
                <span class="icon-name">{{ getKebabCase(item) }}</span>
              </span>
            </li>
          </ul>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Use Demo">
        <div class="demo-icon-title">图标大小(Size)</div>
        <div class="demo-icon-use-container">
          <div class="demo-icon-use-item">
            <svg-icon icon-class="bug" style="font-size: 50px;" />
            <span class="demo-icon-use-span">{{`<svg-icon icon-class="bug" style="font-size: 50px;" />`}}</span>
          </div>
          <div class="demo-icon-use-item">
            <svg-icon iconClass="bug" style="font-size: 30px;" />
            <span class="demo-icon-use-span">{{`<svg-icon iconClass="bug" style="font-size: 30px;" />`}}</span>
          </div>
          <div class="demo-icon-use-item">
            <svg-icon icon-class="el-icon-info-filled" style="font-size: 20px;" />
            <span class="demo-icon-use-span">{{`<svg-icon icon-class="el-icon-info-filled" style="font-size: 20px;" />`}}</span>
          </div>
          <div class="demo-icon-use-item">
            <svg-icon iconClass="el-icon-info-filled" style="font-size: 14px;" />
            <span class="demo-icon-use-span">{{`<svg-icon iconClass="el-icon-info-filled" style="font-size: 14px;" />`}}</span>
          </div>
        </div>
        <br />
        <br />
        <div class="demo-icon-title">图标颜色(Color)</div>
        <div class="demo-icon-use-container">
          <div class="demo-icon-use-item">
            <svg-icon icon-class="bug" style="color: #f30505;" />
            <span class="demo-icon-use-span">{{`<svg-icon icon-class="bug" style="color: #f30505;" />`}}</span>
          </div>
          <div class="demo-icon-use-item">
            <svg-icon icon-class="el-icon-info-filled" style="color: #f30505;" />
            <span class="demo-icon-use-span">{{`<svg-icon icon-class="el-icon-info-filled" style="color: #f30505;" />`}}</span>
          </div>
        </div>
        <br />
        <br />
        <div class="demo-icon-title">图标CSS样式类(Class)</div>
        <div class="demo-icon-use-container">
          <div class="demo-icon-use-item">
            <svg-icon icon-class="bug" class-name="demo-icon-class" />
            <span class="demo-icon-use-span">{{`<svg-icon icon-class="bug" class-name="demo-icon-class" />`}}</span>
          </div>
          <div class="demo-icon-use-item">
            <svg-icon icon-class="el-icon-info-filled" class-name="demo-icon-class" />
            <span class="demo-icon-use-span">{{`<svg-icon icon-class="el-icon-info-filled" class-name="demo-icon-class" />`}}</span>
          </div>
        </div>
        <br />
        <br />
        <div class="demo-icon-title">使用el-icon的is-loading类(自动旋转)</div>
        <div class="demo-icon-use-container">
          <div class="demo-icon-use-item">
            <svg-icon icon-class="bug" class-name="demo-icon-class is-loading" />
            <span class="demo-icon-use-span">{{`<svg-icon icon-class="bug" class-name="demo-icon-class is-loading" />`}}</span>
          </div>
          <div class="demo-icon-use-item">
            <svg-icon icon-class="el-icon-info-filled" class-name="demo-icon-class is-loading" />
            <span class="demo-icon-use-span">{{`<svg-icon icon-class="el-icon-info-filled" class-name="demo-icon-class is-loading" />`}}</span>
          </div>
        </div>
        <br />
        <br />
        <div class="demo-icon-title">与element-plus元素结合使用</div>
        <div class="demo-icon-use-container">
          <div class="demo-icon-use-item">
            <el-button type="primary">
              <svg-icon icon-class="bug" style="vertical-align: middle" />
              <span style="vertical-align: middle"> Bug </span>
            </el-button>
            <span class="demo-icon-use-span">
              <br />
              {{ `<el-button type="primary">` }} <br />
              {{ `<svg-icon icon-class="bug" style="vertical-align: middle" />` }} <br />
              {{ `<span style="vertical-align: middle"> Bug </span>` }} <br />
              {{`</el-button>`}}
            </span>
          </div>
          <div class="demo-icon-use-item">
            <el-button type="primary">
              <svg-icon icon-class="el-icon-info-filled" style="vertical-align: middle" />
              <span style="vertical-align: middle"> Info </span>
            </el-button>
            <span class="demo-icon-use-span">
              <br />
              {{ `<el-button type="primary">` }} <br />
              {{ `<svg-icon icon-class="el-icon-info-filled" style="vertical-align: middle" />` }} <br />
              {{ `<span style="vertical-align: middle"> Info </span>` }} <br />
              {{`</el-button>`}}
            </span>
          </div>
        </div>
        <br />
        <br />
        <div class="demo-icon-title">直接按@element-plus/icons-vue方式使用</div>
        <br />
        <span>
          1、导入单个图标组件的方式使用, 需要在 script 中 import 图标并在当前页中引入图标组件: <br />
          {{ `<script>` }} <br />
          {{ `  import { Search } from '@element-plus/icons-vue';` }} <br />
          {{ `  ...` }} <br />
          {{ `  export default {` }} <br />
          {{ `    components: { Search, ... },` }} <br />
          {{ `    setup() { return { Search, ... }; }, // 要加上这段 el-input 组件才能引用` }} <br />
          {{ `    ...` }} <br />
          {{ `  }` }} <br />
          {{ `</script>` }} <br />
        </span>
        <div class="demo-icon-use-container">
          <div class="demo-icon-use-item">
            <el-icon size="16px" color="#f30505"><search></search></el-icon>
            <span class="demo-icon-use-span">{{ `<el-icon size="16px" color="#f30505"><search></search></el-icon>` }}</span>
          </div>
          <div class="demo-icon-use-item">
            <el-icon><component is="Search"></component></el-icon>
            <span class="demo-icon-use-span">{{ `<el-icon><component is="Search"></component></el-icon>` }}</span>
          </div>
          <div class="demo-icon-use-item">
            <el-input v-model="input1" placeholder="Please Input" :prefix-icon="Search" />
            <span class="demo-icon-use-span">{{ `el-input v-model="input1" placeholder="Please Input" :prefix-icon="Search" />` }}</span>
          </div>
        </div>
        <br />
        <span>
          2、项目默认将图标按i-xxx-xxx的格式进行了批量导入, 因此可以更方便地直接使用图标：
        </span>
        <div class="demo-icon-use-container">
          <div class="demo-icon-use-item">
            <el-icon size="16px" color="#f30505"><i-search></i-search></el-icon>
            <span class="demo-icon-use-span">{{ `<el-icon size="16px" color="#f30505"><i-search></i-search></el-icon>` }}</span>
          </div>
          <div class="demo-icon-use-item">
            <el-icon><component is="i-search"></component></el-icon>
            <span class="demo-icon-use-span">{{ `<el-icon><component is="i-search"></component></el-icon>` }}</span>
          </div>
          <div class="demo-icon-use-item">
            <el-input v-model="input1" placeholder="Please Input" prefix-icon="i-search" />
            <span class="demo-icon-use-span">{{ `<el-input v-model="input1" placeholder="Please Input" prefix-icon="i-search" />` }}</span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import svgIcons from './svg-icons';
import elementIcons from './element-icons';
// 转换FooBar为foo-bar
import kebabCase from 'lodash/kebabCase';
// 导入图标组件
import { Search } from '@element-plus/icons-vue';

export default {
  /**
   * 展示所有可用图标的页面视图
   */
  name: 'Icons',
  components: {
    Search,
  },
  setup() {
    return {
      Search
    }
  },
  data() {
    return {
      input1: '',
      svgIcons,
      elementIcons
    }
  },
  methods: {
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },
    generateElementIconCode(symbol) {
      return `<svg-icon class="el-icon-${symbol}" />`
    },
    getKebabCase(text) {
      return kebabCase(text);
    }
  }
}
</script>

<style lang="scss" scoped>

.demo-icon-item {
    margin-top: 24px;
}

.demo-icon-title {
    font-weight: 400;
    font-size: 18px;
    line-height: 26px;
}

.demo-icon-list {
    overflow: hidden;
    list-style: none;
    padding: 0!important;
    border-top: 1px solid var(--el-border-color);
    border-left: 1px solid var(--el-border-color);
    border-radius: 4px;
    display: grid;
    grid-template-columns: repeat(7,1fr);
}

.demo-icon-list .icon-item {
    text-align: center;
    color: var(--el-text-color-regular);
    height: 90px;
    font-size: 13px;
    border-right: 1px solid var(--el-border-color);
    border-bottom: 1px solid var(--el-border-color);
    transition: background-color var(--el-transition-duration);
}

.demo-icon-list .icon-item .demo-svg-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    cursor: pointer;
}

.demo-icon-list .icon-item .demo-svg-icon .icon-name {
    margin-top: 8px;
}

.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;
}

.demo-icon-use-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  // justify-content: center;
}

.demo-icon-use-item {
  margin-right: 20px;
  margin-top: 20px;
  display: block;
  // border: 1px solid #0639f3;
}

.demo-icon-use-span {
  margin-left: 10px;
  margin-right: 20px;
}

.demo-icon-class {
  font-size: 18px;
  color: #0639f3;
}
</style>
