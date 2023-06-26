# 输入栏位联动(Linkage)

框架提供了一套处理栏位联动的库，原理是通过watch监控每个栏位绑定的变量，通过监控变量值的变化触发联动计算，并将计算结果填入目标栏位所绑定的变量中。

## 基本使用步骤

### 定义初始化联动规则

可以在组件中定义要初始化的栏位规则数组，数组中每个值都是一个联动操作，示例如下：

```javascript
const linkAageRules = [
    {
      targetField: 'input2', linkageType: 'equal', watchField: 'input1'
    },
    {
      targetField: ['input5', 'input6'], linkageType: 'equal', watchField: ['relation1', 'relation2', 'relation3']
    },
    ...
  ];
```

支持的联动规则参数说明如下：

- targetField {string|Array} - 必填, 联动目标字段, 规则执行计算值将填入该字段(或字段组)
- id {string} - 非必填, 联动规则id, 如果送入则返回的监听对象字典通过该id作为key(当一个联动目标需要配置多个规则的情况使用), 否则使用联动目标字段作为key
- linkageType {string} - 如果没有提供自定义联动函数时必填, 联动规则类型, 默认支持的几个规则如下, 也可以填入扩展规则类型:
    fixed - 填入固定值
    equal - 填入关联字段的相同值
- watchField {string|Array} - 必填, 联动监控字段, 当字段值发生变化触发联动, 可以送入单个字段名, 也可以送入多个字段名的数组
- executeFunc {function} - 选填, 当前规则使用的自定义联动函数(同步), function (currentInstance, rule, newVal, oldVal, dataPrefix) {...}
- asyncExecuteFunc {function} - 选填, 当前规则使用的自定义联动函数(异步), async function (currentInstance, rule, newVal, oldVal, dataPrefix) {...}
- enableFlag {string|boolean} - 选填, 默认为true, 控制联动是否生效的标记, 除设置boolean值以外, 也可支持送入特定表达式, 根据表达式计算结果进行判断
    注1: 表达式应返回boolean值, 例如 '{fieldName} + 10 > 100'
    注2: fileName部分可以使用jsonpath语法, 如果带$.开头代表忽略dataPrefix, 如果没有$开头, 则自动加上'$.dataPrefix.'
    其他参数由具体的联动规则定义
    fixed类型参数: 
  - fixedValue {Object} 必填, 要填入的固定值

## 引入联动库并初始化规则

引入联动库 src/utils/linkage/index.js，并在 mounted 中进行联动规则的初始化。 初始化函数会传出监控变量的watch对象集合，可以在beforeUnmount中关闭变量监控（当然也可以在其他时点主动关闭所有监控）。

```javascript
import { initLinkage, closeLinkageWatchHandlers } from '@/utils/linkage/index';
...

export default {
    ...
    mounted() {
        ...
        // 初始化联动规则
        this.linkageWatchHandler = initLinkage(this, linkAageRules, 'EditFormData');
    },
    beforeUnmount() {
        // 关闭初始化生成的联动监控
        closeLinkageWatchHandlers(this.linkageWatchHandler, 'EditFormData');
    },
}
```

## 运行时动态添加和删除自定义联动规则

可以支持在运行时添加和删除初始化规则以外的联动规则，但规则所生成的watch对象需要组件自行管理。

```javascript
import { addLinkageRule, closeLinkageWatch } from '@/utils/linkage/index';
...

// 在需要添加联动规则的地方
const ruleWatch = addLinkageRule(this, linkageRule, 'EditFormData');

// 需要关闭联动规则的地方
closeLinkageWatch(ruleWatch);
```

## 进阶使用

### 使用自定义联动计算函数

支持在规则中使用自定义的联动计算函数，在规则中指定executeFunc（同步模式）或asyncExecuteFunc（异步模式）为自定义计算函数即可。

自定义函数的格式固定为 function (currentInstance, rule, newVal, oldVal, dataPrefix)

入参说明如下：

- currentInstance {Object} 当前Vue组件的this对象
- rule {JSON} 联动规则
- newVal {Object} 监控对象的新值
- oldVal {Object} 监控对象的老值
- dataPrefix {String} 栏位关联数据名的前缀, 将自动和配置中的字段进行拼接, 例如'EditFormData'

函数可以正常返回要填入目标栏位的值，框架会自动处理界面上栏位的赋值。

此外函数也可以通过currentInstance(Vue组件的this对象)自行处理界面上的元素状态，来实现更复杂的处理, 如果不需要框架继续处理赋值操作, 需要抛出一个空异常： `throw new Error('');` 。

如果函数出现异常，需要界面提示异常信息，可以抛出一个带信息的异常：`throw new Error('xxx')`;

### 扩展内置支持的规则类型

可以对那只支持的规则类型进行扩展，具体步骤如下：

1、在 src/utils/linkage/BuildIn 下创建扩展规则js文件，例如 xxx.js；

2、在js文件开发规则处理函数(参考自定义联动计算函数)，并通过 export default 返回规则配置信息。

export default 的配置信息，key 为 linkageType （联动类型名），value 为 {func: 联动计算函数, isPromise: true/false} ，isPromise用于指示是否异步。

```javascript
/**
 * 填入固定值
 */
async function fixed(currentInstance, rule, newVal, oldVal, dataPrefix) {
  return rule.fixedValue;
};

...

export default {
  // 填入固定值
  'fixed': {
    func: fixed,
    isPromise: true
  },
  ...
};
```
