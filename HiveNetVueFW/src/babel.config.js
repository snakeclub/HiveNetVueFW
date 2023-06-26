module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],

  // env定义环境模式下插件，此处定义的是development模式
  // dynamic-import-node插件（按需加载），需安装插件: npm install babel-plugin-dynamic-import-node
  env: {
    development: {
      plugins: ['dynamic-import-node']
    }
  }
};
