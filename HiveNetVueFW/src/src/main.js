import { createApp } from 'vue';
import { localCache } from '@/plugins/cache';
import { importComponents, importDirectives } from '@/utils/base/DynamicInit'; // 自动全局初始化

// 支持的浏览器没有实现 Promise (比如 IE)的情况
// import 'es6-promise/auto';

// 创建vue应用
import App from './App.vue';
const app = createApp(App);

// element-plus配置
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css'; // 添加暗黑模式的支持

import VueI18n from './i18n'; // 加载多国语言支持
import router from './router';
import store from './store';
import plugins from './plugins';
import Layout from '@/components/view/layout/index'; // 首页主框架组件
import './permission/default.js'; // 导入登录权限控制

// 需要加载的样式表
import '@/assets/css/layout/layout.scss';
import '@/assets/css/custom.scss';

// 导入@element-plus/icons-vue图标支持
import * as ElIconModules from '@element-plus/icons-vue';
/**
 * 将el-icon的组件名转换为i-xxx-xxx形式
 * @param {string} iconName - 组件名
 * @returns {string} - 转换后的形式名
 *   例如: Switch -> i-switch, ArrowDownBold -> i-arrow-down-bold
 */
function transElIconName(iconName) {
  return 'i' + iconName.replace(/[A-Z]/g, (match) => '-' + match.toLowerCase());
}
// 统一注册el-icon图标
for (const iconName in ElIconModules) {
  app.component(transElIconName(iconName), ElIconModules[iconName]);
}

// 自定义的svg文件形式的icon图标的处理
import '@/assets/icons'; // icon

// 注册全局组件(目录在 @/components/global 下)
const globalComponents = [
  require.context('@/components/global', false, /(\\|\/)([A-Z]|[a-z])\w+\.(vue|js)$/), // 非文件夹模式的组件
  require.context('@/components/global', true, /\.(\\|\/)\w+(\\|\/)index\.(vue|js)$/) // 文件夹模式的组件
];
importComponents(app, globalComponents);

// 将views目录下的组件注册为全局组件, 传参(其组件目录的相对路径, 是否查询其子目录, 匹配基础组件文件名的正则表达式)
// 注1: 匹配的文件名是以搜索目录作为根目录的相对路径, 例如在 views 目录下, 不包含搜索目录本身, 文件名为 './abc.vue' 或 './path/index.vue'
// 注2: 如果需要添加当前目录下的所有vue和js文件（不含子目录）, 传入参数: (path, false, /(\\|\/)([A-Z]|[a-z])\w+\.(vue|js)$/)
// 注3: 如果需要添加当前目录的子目录的组件(组件以文件夹方式体现), 传入参数: (path, true, /\.(\\|\/)\w+(\\|\/)index\.(vue|js)$/)
// 注3: require.context 不支持传入变量
const requireComponents = [
  require.context('@/views', false, /(\\|\/)([A-Z]|[a-z])\w+\.(vue|js)$/),
  require.context('@/views/template', false, /(\\|\/)([A-Z]|[a-z])\w+\.(vue|js)$/),
  require.context('@/views/AuthCenter', true, /(\\|\/)([A-Z]|[a-z])\w+\.(vue|js)$/),
  require.context('@/views/demo', true, /(\\|\/)([A-Z]|[a-z])\w+\.(vue|js)$/),
  require.context('@/components/view', false, /(\\|\/)([A-Z]|[a-z])\w+\.(vue|js)$/)
];
importComponents(app, requireComponents);

// 将directives目录下的组件注册为全局自定义指令
const requireDirectives = [
  require.context('@/directives', false, /([A-Z]|[a-z])\w+\.js$/)
];
importDirectives(app, requireDirectives);

// 注册其他模块
app.use(plugins); // plugins插件，支持this.$modal/this.$cache/this.$download的使用
app.component('Layout', Layout); // 注册框架页面
app.use(ElementPlus, {
  size: localCache.get('size') || 'default',
  locale: VueI18n.global.messages[VueI18n.global.locale]
});

// 全局封装对话框的支持，this.$dialog的支持
import MDialog from '@/components/common/Dialog';
MDialog._context = app._context;
app.use(MDialog);

// 可选组件v-md-editor, markdown编辑预览
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';

VMdPreview.use(githubTheme, {
  Hljs: hljs
});

app.use(VMdPreview);

// 其他组件的装载
app.use(store).use(router).use(VueI18n).mount('#app');

export default app;
