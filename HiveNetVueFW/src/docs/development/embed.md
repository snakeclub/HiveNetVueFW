# 内部集成动作(Embed)

框架实现了一个便于菜单调用的内部集成动作扩展模块(embed)，可以按自己的需要扩展菜单点击动作的实际执行逻辑，同时该扩展模块也同样可以便捷地在不同的组件或JS代码中调用。

## 扩展自定义集成动作

1、在 src/embed/BuildIn/ 目录下添加自己要增加的扩展功能模块js文件，例如 demo.js ；

2、在 demo.js 文件中编写自定义的扩展函数，可以支持多个扩展函数放在一个扩展功能模块文件中，例如：

```javascript
/**
 * 同步扩展函数
 * @param {string} embedAction - 传入集成动作名称
 * @param {JSON} embedPara - 传入集成动作的参数, 可自定义
 * @param {bool} autoShowError - 传入是否显示错误信息的指示
 * @returns {JSON} - 返回执行结果: {
 *     success: true/false,  // 是否执行成功
 *     data: data // 函数返回的结果数据 
 #   }
 */
function syncFunc(embedAction, embedPara, autoShowError) {
  // 内部处理逻辑
  ...
  const resData = myFunc(embedPara);
  return { success: true, data: resData };
};

/**
 * 异步扩展函数1
 * @param {string} embedAction - 传入集成动作名称
 * @param {JSON} embedPara - 传入集成动作的参数, 可自定义
 * @param {bool} autoShowError - 传入是否显示错误信息的指示
 * @returns {JSON} - 返回执行结果: {
 *     success: true/false,  // 是否执行成功
 *     data: data // 函数返回的结果数据 
 #   }
 */
async function asyncFunc1(embedAction, embedPara, autoShowError) {
  // 使用async语法糖实现简化版的Promise异步处理
  ...
  const resData = myFunc(embedPara);
  return { success: true, data: resData };
};

/**
 * 异步扩展函数2
 * @param {string} embedAction - 传入集成动作名称
 * @param {JSON} embedPara - 传入集成动作的参数, 可自定义
 * @param {bool} autoShowError - 传入是否显示错误信息的指示
 * @returns {JSON} - 返回执行结果: {
 *     success: true/false,  // 是否执行成功
 *     data: data // 函数返回的结果数据 
 #   }
 */
function asyncFunc2(embedAction, embedPara, autoShowError) {
  // 使用Promise异步处理
  return new Promise((resolve, reject) => {
      const resData = myFunc(embedPara);
      resolve({ success: true, data: resData });
  }));
};

// 必须返回集成动作的配置字典
export default {
  // 同步扩展函数
  'syncFunc': { func: syncFunc, isPromise: false },
  // 异步扩展函数1
  'asyncFunc1': { func: asyncFunc1, isPromise: true },
  // 异步扩展函数1
  'asyncFunc2': { func: asyncFunc2, isPromise: true }
};
```

注1：配置字典的key为集成动作名，参数包含对应执行的函数，以及指示该函数是否异步的标志。

注2：扩展函数可以支持同步或异步函数，但如果是异步函数，动作配置参数的isPromise必须设置为true

3、在 src/embed/BuildIn/ 目录下的js文件都会自动加载，因此重新编译打包后，就可以直接通过 callEmbed 函数直接执行对应的动作函数了。

## 执行集成动作

1、在JS代码中执行集成动作

```javascript
// 引入函数
import callEmbed from '@/embed';

// 执行JS代码, 入参分别为动作名、动作参数、是否自动显示执行异常(返回data的情况用warning方式提示)
callEmbed('runJsCode', { code: '...' }, false).then(res => {
  // 处理执行结果, res为{success: true, data: data} 或 {success: false, data: data}
  ...
}).catch(res => {
  // 处理异常情况, res为{success: false, error: error}
  ...
});
```

2、在菜单配置点击执行

左侧菜单和右上角菜单均可支持配置点击执行集成动作，涉及的配置项包括：

```javascript
menuType: 'embed',  // 菜单类型为执行集成动作
embedAction: 'runJsCode',  // 指定动作名
// 送入集成动作函数参数
embedPara: { code: 'globalObj.this.$modal.messageSuccess("Test Embed Action - Run JS Code");' }
```

## 内嵌的默认集成动作

### 公共类集成动作

#### 执行js代码 - runJsCode

- 动作名embedAction： runJsCode

- 参数embedPara： 传入要执行的代码，格式为：{ code: '要执行的js代码' }

- 特殊说明：
  
  - js代码可以支持执行多语句, 注意语句之间用结束分号 “ ; ” 间隔即可；
  
  - 在js代码中可以通过globalObj变量引入公共对象，目前支持的公共对象包括
    
    - this ：页面中上下文的this对象

### 菜单类集成动作

#### 点击菜单 - clickMenu

- 动作名embedAction： clickMenu

- 参数embedPara： 传入要点击的菜单信息，格式为:
  
  ```javascript
  {
     type: 'sidebar/right', // 左边菜单还是右上角菜单
     name: 'xxx', // 要执行的菜单名(与namePath传其中一个即可)
     namePath: 'xx/xx/xx', // 菜单的名字路径索引，'parentName/myName' 样式的逐层索引(与name传其中一个即可)
  }
  ```

- 特殊说明：
  
  - 可以通过name或namePath指定要点击的菜单。

### Layout框架类集成动作

#### 显示/隐藏主页风格设置框 - showHideLayoutSettings

- 动作名embedAction： showHideLayoutSettings

- 参数embedPara： 传入是否显示信息，格式为:{ show: true }
