# 表单校验（validate）

## 使用框架的校验库

框架对element-plus的校验进行了二次封装，可以通过封装的方法更便捷地进行栏位的校验规则设置和校验处理，添加自己的校验方法函数，以及支持告警校验的场景。

### 使用步骤

1、在Vue中直接引入 ValidateMixin

```javascript
...
<script>
import ValidateMixin from '@/components/view/mixins/ValidateMixin';
...

export default {
  mixins: [ValidateMixin, ...],
  ...
};
</script>
```

2、如果需要支持告警风格设置（输入框背景色为黄色）, 请为 el-form 的添加 custom-form 的样式类，同时注意要添加ref的引用名（调用方法需要用到）：

```html
<el-form ref="EditForm" :model="EditFormData" :rules="rules"
  class="custom-form"
>
  ...
</el-form>
```

3、对于需要支持告警风格设置的栏位，以及需要和校验栏位共同进行联动设置校验风格的栏位，徐奥添加与prop相同名称的ref引用名：

```html
<el-form-item :label="$t('Input') + '1'" prop="input1" ref="input1">
  <el-input v-model="EditFormData.input1" :placeholder="$t('Please input')"
     prefix-icon="i-search" maxlength="10" show-word-limit clearable>
    
  </el-input>
</el-form-item>
```

4、在 Vue 的 mounted 阶段设置表单的校验规则，这是由于框架需要通过rule规则传入Vue组件的this对象，如果在 data 中设置校验规则无法获取this：

```javascript
...
mounted() {
  ...
  this.rules = {
    input1: [
      { ...具体规则 },
      ...
    ],
    ...  
  },
},
```

5、在提交form数据前执行统一的校验处理：

```javascript
submitForm(formName) {
  this.validateForm(formName, (valid, invalidFields, warnFields) => {
    if (valid) {
      alert('submit! has warning: ' + warnFields.length);
    } else {
      alert('error submit!!');
      return false;
    }
  });
},
```

详细定义可以参考 ValidateMixin 的 validateForm 方法。

6、其他进行校验格式处理的函数包括：

- setFieldValidateState - 设置输入栏位的验证样式

- clearFieldValidateState - 清除栏位的验证样式

- resetFields - 重置所有栏位初始值

7、可以在data修改ValidateMixin的控制参数：

- autoScrollToErrorItem - 校验失败时自动滚动到失败对象位置

- autoSetFieldSuccessState - 自动设置无校验的栏位为成功状态



### 规则配置说明

框架支持element-plus原生的设置方法，如果不需要用到框架的特殊规则功能，可以直接按照标准的校验规则进行设置。如果要使用框架的特性规则，比如告警规则、联动校验样式设置，或者使用自定义规则，请按照以下方式设置：

（1）规则的 asyncValidator 参数固定使用 asyncValidateExtendFun 函数，该函数可以支持标准规则，也可以支持自定义规则的使用；

（2）如果是标准规则，可以直接按原生标准设置规则参数，除了以下2个参数需要按框架要求进行调整：

* validator 参数名修改为 nativeValidator

* asyncValidator 参数名修改为 nativeAsyncValidator

（3）如果使用自定规则，必须传入扩展规则的参数：

- extendName {string} - 校验规则名, 必送, 框架会根据这个规则名匹配找到对应的处理函数, 优先级为先找本地扩展, 再找集成扩展
* localExtend {JSON} - 可选，本地的扩展校验规则配置, 格式跟集成的格式一致
  
  * key 为 extendName（扩展校验规则名）
  
  * value 为 {func: 校验函数对象, isPromise: true/false}

* 其他参数, 具体根据实际校验函数的要求传入

（4）原生规则和自定义规则都支持框架的封装特性，使用框架特性可以使用以下规则参数：

- warn {boolean} 默认为false, 指定规则是否警告(校验通过, 但有警告信息), 原则上警告规则应该配置在错误校验规则之后添加
* warnId {string} 告警规则id, 用于放入告警堆栈, 如果不设置将默认使用field名作为id（注意如果一个栏位有多个告警类规则, 如果不设置独立id，告警堆栈信息将会相互覆盖）

* setFieldWarnState {boolean} 默认为false, 是否设置输入栏位样式为告警样式

* relationFields {JSON} 错误或告警情况, 需要关联提示的栏位信息, 格式为
  
  ```javascript
  {  
    [fieldname]: undefined/message, // undefined代表使用与校验字段相同的信息, 传入message代表使用自定义信息 
    ...
  }
  ```

* currentInstance {Object} 当前Vue组件的this对象, 对于setFieldWarnState为true, 以及设置了relationFields的情况必传





## 原生栏位校验方法

element-plus 的表单集成了 async-validator 用于表单栏位的校验，要实现表单输入栏位的校验，只需要按照以下操作处理：

1、为表单的每个输入栏位的 el-form-item 组件的 prop 属性设置要校验的标识，集成的 async-validator 会自动根据 prop 属性找到对应栏位的输入对象，关联data中的绑定对象实现值的校验；

2、创建校验规则JSON对象，规则对象可以放在 data 中供表单引用，也可以直接在表单上进行设置，对象的格式参考如下：

```javascript
// 放在 data 中的校验规则对象
rules: {
    // 要校验的prop属性标识
    prop1: [
        // 校验规则, 可以设置多个, 按顺序执行规则校验
        {
            required: true,
            message: this.$t('validateRules.required', [this.$t('Input') + '1']),
            trigger: 'blur',
        },
        ...
    ],
    prop2: [
        ...
    ],
    ...
}
```

3、在表单的 el-form 对象上添加 :rules="rules" 属性, 引用 data 中的校验规则对象作为校验规则；当然也可以直接在表单对象上直接添加校验对象(不推荐):

4、你也可以直接在 el-form-item 组件上添加该组件的校验规则，例如：

```html
<el-form-item
    prop="email"
    label="Email"
    :rules="[
    {
        required: true,
        message: 'Please input email address',
        trigger: 'blur',
    },
    {
        type: 'email',
        message: 'Please input correct email address',
        trigger: ['blur', 'change'],
    },
    ]"
>
    ...
</el-form-item>
```

5、动态添加的表单栏位也可以设置校验规则：

```html
<el-form-item
    v-for="(domain, index) in dynamicValidateForm.domains"
    :key="domain.key"
    :label="'Domain' + index"
    :prop="'domains.' + index + '.value'"
    :rules="{
        required: true,
        message: 'domain can not be null',
        trigger: 'blur',
    }"
>
    ...
</el-form-item>
```

6、在提交按钮中执行以下校验控制：

```javascript
this.$refs[formName].validate((valid) => {
  if (valid) {
    // 校验通过，执行提交动作
    ...
  } else {
    // 校验失败，中断提交
    return false;
  }
});
```



## 原生栏位校验技巧

**1、type校验**

可以通过规则的 type 参数指定校验的数据类型，例如可以通过 type: 'number' 指定要校验的栏位为数字，但要注意对应的input组件和绑定的变量都必须为number类型，组件指定输出的类型可以通过v-model后面添加类型指定：

```html
<el-input v-model.number="EditFormData.input4"></el-input>
```

**2、单栏位的校验**

element-plus支持对单个输入栏位进行校验，可以直接执行el-form表单对象的validateField方法，指定输入栏位进行校验：

```javascript
this.$refs[formName].validateField('input1', valid => {
  if (valid) {
    alert('验证input1通过!');
  } else {
    alert('验证input1失败!');
  }
});
```

**3、Js中为栏位主动添加校验失败提示**

只要将el-form-item的error属性赋值即可，但需要注意的是，如果执行了el-form的resetFields方法或clearValidate方法，或者执行了el-form-item的resetField和clearValidate方法，此时error属性的值将自动被清除，需要重新设置才能重新显示校验失败提示。



## async-validator 自带的校验规则

### 校验规则参数

| 属性             | 类型                   | 说明                                                                     |
| -------------- | -------------------- | ---------------------------------------------------------------------- |
| type           | String               | 用于验证数据类型，默认类型为’string’                                                 |
| required       | boolean              | 是否必填                                                                   |
| pattern        | regexp/string        | 字段值匹配正则表达式才能通过验证                                                       |
| min和max        | number               | 对于字符串和数组类型，将根据长度进行比较，对于数字类型，数字不得小于min，也不得大于max                         |
| len            | number               | 对于字符串和数组类型，对length属性执行比较，对于数字类型，此属性指示数字的完全匹配，len属性与min和max属性组合，则len优先。 |
| enum           | array                | type必须设置为enum，值必须包含在从可能值列表中才能通过验证                                      |
| whitespace     | boolean              | type必须设置为string，要为仅包含空格的字符串可以将whitespace设置为true                        |
| transform      | function             | 在验证之前转换值                                                               |
| defaultField   | array/object         | type为数组或对象类型时一起使用，用来验证数组或对象中包含的所有值，进行深层验证                              |
| fields         | object               | type为数组或对象类型时一起使用，分别验证array/object类型的数据中的值，实现深度验证                      |
| validator      | function             | 验证器，可以为指定字段自定义验证函数：function(rule, value, callback)                     |
| asyncValidator | function             | 异步验证器，可以为指定字段自定义异步验证函数 function(rule, value, callback)                 |
| message        | string/jsx/function等 | 根据需要将提示消息分配给规则                                                         |

**1、type属性**

type属性用来验证数据类型，async-validator中能够验证的类型包括：

- string: 值必须是 String 类型。

- number: 值必须是 Number 类型。

- boolean: 值必须是 Boolean 类型。

- method: 必须是 Function 类型。

- regexp: 必须是 RegExp 的实例或在创建新 RegExp 时不生成异常的字符串。

- integer: 必须是 Number 和整数类型。

- float: 必须是 Number 和浮点数类型。

- array: 必须是由array.isarray确定的数组。

- object: 必须是 Object 类型，而不是Array.IsArray类型。

- enum: 值必须存在于枚举中。

- date: 必须是 Date 类型。

- url: 必须是url类型。

- hex: 必须是十六进制类型。

- email: 必须是电子邮件类型。

- any: 可以是任何类型



### 自定义规则函数

async-validator支持执行自定义的校验函数，通过配置 validator 或 asyncValidator 参数为自定义的校验函数即可。

自定义函数格式为：function(rule, value, callback, source, options)

- `rule`: The validation rule in the source descriptor that corresponds to the field name being validated. It is always assigned a `field` property with the name of the field being validated.
- `value`: The value of the source object property being validated.
- `callback`: A callback function to invoke once validation is complete. It expects to be passed an array of `Error` instances to indicate validation failure. If the check is synchronous, you can directly return a `false` or `Error` or `Error Array`.
- `source`: The source object that was passed to the `validate` method.
- `options`: Additional options.
- `options.messages`: The object containing validation error messages, will be deep merged with defaultMessages.



常见的自定义校验函数定义参考如下：

```javascript
  // 同步自定义验证函数
  const selfValidateFun = (rule, value, callback, source, options) => {
    console.debug(rule, value, source, options);
    if (!value || value === '') {
      callback(new Error(rule.message));
    } else {
      // 校验通过
      callback();
    }
  };

  // 异步的校验规则示例
  const asyncSelfValidateFun = async (rule, value, callback, source, options) => {
    if (!value || value === '') {
      callback(new Error(rule.message));
    } else {
      // 校验通过
      callback();
    }
  };

  // promise形式的异步的校验规则示例
  const promiseSelfValidateFun = async (rule, value, callback, source, options) => {
    return new Promise((resolve, reject) => {
      if (!value || value === '') {
        callback(new Error(rule.message));
      } else {
        callback();
      }
    });
  };
```