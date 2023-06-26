/**
 * 加载指定路径控件的工具
 */
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

/**
 * 导入并注册控件
 * @param {Object} app - Vue的App对象
 * @param {array} requireComponents - 需要注册的控件数组，对象类型为require.context
 */
export function importComponents(app, requireComponents) {
  for (let i = 0; i < requireComponents.length; i++) {
    const requireComponent = requireComponents[i];

    requireComponent.keys().forEach(fileName => {
      // 获取组件配置
      const componentConfig = requireComponent(fileName);

      // 获取组件名称
      let componentName;
      if (componentConfig.default && componentConfig.default.name) {
        // 以组件自己定义的name进行注册
        componentName = componentConfig.default.name;
      } else {
        // 获取组件的 PascalCase 命名
        const paths = fileName.split('/');
        let fileNameNoExt = paths.pop().replace(/\.\w+$/, '');
        if (fileNameNoExt === 'index') {
          // 如果是index.vue, 要获取目录名作为组件名
          fileNameNoExt = paths.pop();
        }
        componentName = upperFirst(camelCase(fileNameNoExt));
      }

      // 全局注册组件
      app.component(
        componentName,
        // 如果这个组件选项是通过 `export default` 导出的，
        // 那么就会优先使用 `.default`，
        // 否则回退到使用模块的根。
        componentConfig.default || componentConfig
      );
      console.debug('fileName: ' + fileName);
      console.debug('import component: ' + componentName);
    });
  }
}

/**
 * 导入并注册自定义指令
 * @param {Object} app - Vue的App对象
 * @param {array} requireDirectives - 需要注册的自定义组件数组，对象类型为require.context
 */
export function importDirectives(app, requireDirectives) {
  for (let i = 0; i < requireDirectives.length; i++) {
    const requireDirective = requireDirectives[i];

    requireDirective.keys().forEach(fileName => {
      // 获取组件配置
      const directiveConfig = requireDirective(fileName);

      // 获取组件名称
      let directiveName;
      if (directiveConfig.default && directiveConfig.default.name) {
        // 以组件自己定义的name进行注册
        directiveName = directiveConfig.default.name;
      } else {
        // 获取组件的文件名
        directiveName = fileName.split('/').pop().replace(/\.\w+$/, '');
      }

      // 全局注册组件
      app.directive(
        directiveName, directiveConfig.default || directiveConfig
      );
    });
  }
}
