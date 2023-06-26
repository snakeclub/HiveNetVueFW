# 菜单设置(Menus)

Layout框架的菜单有3部分：

- sidebarMenus：左侧主菜单，如果布局设置了顶端菜单导航栏，左侧主菜单的第一级菜单可以在顶端导航栏展示，结合左侧主菜单简化菜单选中层级；

- rightMenus：右上角菜单，主要以图标、下拉框等方式展示通用的操作菜单；

- fixedTags：固定页签，打开Layout框架时自动设置不可关闭的固定页签，例如首页页签等。

## 设置菜单的获取方式

可以通过 /src/settings.js 的 app.getMenusType 配置设置菜单的获取方式，主要有以下几种菜单的获取方式：

- no ：框架不获取菜单，即框架不处理菜单的获取逻辑，用开发者自行处理菜单获取

- static ：获取静态菜单配置，直接使用 /src/settings.js 的 app.staticMenusConfig 参数作为显示的菜单

- api ：通过菜单查询Api接口获取，使用 getMenusConfig 的接口从服务端获取菜单配置

- login ： 在登录后通过查询用户信息（getUserInfo接口）方式获取所需的菜单信息，注意如果支持匿名（anonymous）的登录模式，该接口同样支持非登录方式返回匿名用户可访问的菜单

## 菜单配置说明

无论是静态菜单还是从服务器获取的菜单，统一都是标准的JSON格式进行设置。

**另外框架在菜单加载时支持自动生成菜单对应的动态路由，因此无须在路由配置中增加菜单的路由，也无需自行生成菜单的动态路由。**

### 左侧主菜单（sidebarMenus）

左侧菜单的JSON配置是一个数组，数组的每一项就是一个菜单配置，主体结构定义如下：

```javascript
sidebarMenus: [
    {
      // 菜单项配置
      ...
      children: [
        {
          // 子菜单项配置, 结构跟主菜单一样, 支持多层嵌套形成多级菜单
          ...
        }，
        ...
      ]
    },
    ...
]
```

每个菜单项可支持的配置项说明如下：

- 主要配置
  
  - name: '', // 必填 char 菜单英文标识，该标识在所有菜单中应唯一
  - path: '', // 必填 char 菜单访问路径, 该标识在同级兄弟菜单中应唯一
  - showName: '', // 必填 char 菜单显示名，支持i18n，可以直接填入i18n配置对应的标识
  - icon: '', // 选填 char 菜单图标标识名, 如填入则代表菜单文本前显示菜单图标，例如 svg格式图标'bug' 或 element-plus图标 'el-icon-plus'
  - hidden: false, // 选填 bool 是否隐藏菜单, 默认为fasle
  - disabled: false, // 选填 bool 是否禁用菜单，默认为false
  - menuType: '', // 必填 char 菜单类型: main-主菜单(不设置点击操作), view-内部页面(./src/views中的页面), link-链接url(含外部url), jsCode-要执行的js代码, embed-已嵌入的动作代码, fixedTag-切换至固定页签
  - successTip: '', // 选填 char 点击菜单执行成功提示内容，支持i18n，如果不设置代表不进行提示
  - order: 1, // 选填 int 同级菜单排序, 数字小的排前面
  - cacheType: '' // 选填 char 缓存类型，仅menuType为view或link，且openType 为 inner时有效，支持的配置包括：none-不缓存（默认），single-单页缓存（使用keepalive，同一个页面不支持打开多个），mutiple-支持多页分别缓存
  - children: [], // 选填 array 子菜单配置, 定义方式相同，支持多层子菜单嵌套

- menuType为view的相关配置
  
  - viewComponentName: '', // menuType为view时必填 char 内部页面控件名（./src/views目录下的全局注册控件, 驼峰格式，不含.vue后缀, 由开发人员确认）
  - viewProps: {}, // 选填 JSON 向view组件传的参数（由开发人员确认）
  - viewQuery: {}, // 选填 JSON 调用vue路由时传入的参数，为?xx=xxxx形式的参数
  - isLayoutTag: false, // 选填 bool 指定是否框架页签(在Layout框架中打开新页签)，如果为true，即使openType为blank或refresh情况，所打开的页面都在Layout框架的页签那；如果为false，则直接打开对应的view页面，不包含Layout框架；注意：当openType为inner时该参数固定为true

- menuType为link的相关配置
  
  - url: '', // link必填 char 要打开的url路径

- menuType为view或link的共同配置
  
  - openType: '', // 选填 char 打开方式, inner-在标签页打开(默认), blank-新窗口打开, refresh-用新页面刷新当前页面
  - blankSpecs: '', // 选填 char 当打开方式为blank时，window.open的打开参数（控制新窗口样式）
  - blankExtendScreen: 0, // 选填 int 预留参数，当打开方式为blank时, 窗口所需放置在的扩展屏，0代表在主屏幕，1代表在第一个扩展屏

- menuType为jsCode的相关配置
  
  - code: '', // jsCode必填 char 要执行的js代码，采用 new Function 模式，函数无入参

- menuType为embed 相关配置
  
  - embedAction: '', // embed必填 char 调用集成的动作
  - embedPara: {}, // 选填 JSON 调用集成动作的参数（由开发人员定义）

- menuType为fixedTag 相关配置
  
  - fixedTagName: '', // fixedTag必填 char 要打开的固定页签的页签名

### 右上角菜单（rightMenus）

右上角菜单的JSON配置是一个数组，数组的每一项就是一个菜单配置，主体结构和左侧菜单相似，定义如下：

```javascript
rightMenus: [
    {
      // 菜单项配置
      ...
      children: [
        {
          // 子菜单项配置, 结构跟主菜单一样, 支持多层嵌套形成多级菜单
          ...
        }，
        ...
      ]
    },
    ...
]
```

每个菜单项可支持的配置项说明如下：

- 主要配置
  
  - name: '', // 必填 char 菜单英文标识，该标识在所有菜单中应唯一
  - path: '', // 必填 char 菜单访问路径, 该标识在同级兄弟菜单中应唯一
  - showType: '', // 必填 char 菜单显示类型, icon-图标, component-Vue组件, link-链接(可含图标)
  - showName: '', // 选填 char 菜单显示名，支持i18n，可以直接填入i18n配置对应的标识
  - icon: '', // 选填 char 菜单图标标识名，showType为icon时必填，例如 svg格式图标'bug' 或 element-plus图标 'el-icon-plus'
  - component: '', // 选填 char Vue组件名，showType为component时必填，为./src/components/view/layout/components/RightMenu/RightMenuShowItem.vue中已加载的组件应用名(小写横杠模式)，例如SizeSelect组件填入'size-select'
  - componentProps: {}, // 选填 JSON 调用Vue组件的props参数
  - toolTip: '', // 选填 char 鼠标悬停提示内容，支持i18n，可以直接填入i18n配置对应的标识
  - css: '', // 选填 char 自定义css样式, 映射到显示对象（icon、component或link）的style属性上
  - hidden: false, // 选填 bool 是否隐藏菜单, 默认为fasle
  - disabled: false, // 选填 bool 是否禁用菜单，默认为false
  - menuType: '', // 必填 char 菜单类型: main-主菜单(下拉列表), view-内部页面(./src/views中的页面), link-链接url(含外部url), jsCode-要执行的js代码, embed-已嵌入的动作代码, fixedTag-切换至固定页签, null-不设置点击（非主菜单的情况）
  - successTip: '', // 选填 char 菜单执行成功提示内容，支持i18n，如果不设置代表不进行提示
  - order: 1, // 选填 int 同级菜单排序, 数字小的排前面
  - cacheType: '' // 选填 char 缓存类型,，仅menuType为view或link，且openType 为 inner时有效，支持的配置包括：none-不缓存（默认），single-单页缓存（使用keepalive，同一个页面不支持打开多个），mutiple-支持多页分别缓存
  - children: [], // 选填 array 子菜单配置, 定义方式相同，支持多层子菜单嵌套

- 下拉菜单的弹出方式配置
  
  - dropDownTrigger: 'hover', // 选填 char 下拉菜单的弹出方式，hover-鼠标移动到上面，click-点击鼠标，contextmenu-右键菜单，默认为hover

- menuType为view的相关配置
  
  - viewComponentName: '', // menuType为view时必填 char 内部页面控件名（./src/views目录下的全局注册控件, 驼峰格式，不含.vue后缀, 由开发人员确认）
  - viewProps: {}, // 选填 JSON 向view组件传的参数（由开发人员确认）
  - viewQuery: {}, // 选填 JSON 调用vue路由时传入的参数，为?xx=xxxx形式的参数
  - isLayoutTag: false, // 选填 bool 指定是否框架页签(在Layout框架中打开新页签)，如果为true，即使openType为blank或refresh情况，所打开的页面都在Layout框架的页签那；如果为false，则直接打开对应的view页面，不包含Layout框架；注意：当openType为inner时该参数固定为true

- menuType为link的相关配置
  
  - url: '', // link必填 char 要打开的url路径

- menuType为view或link的共同配置
  
  - openType: '', // 选填 char 打开方式, inner-在标签页打开(默认), blank-新窗口打开, refresh-用新页面刷新当前页面
  - blankSpecs: '', // 选填 char 当打开方式为blank时，window.open的打开参数（控制新窗口样式）
  - blankExtendScreen: 0, // 选填 int 预留参数，当打开方式为blank时, 窗口所需放置在的扩展屏，0代表在主屏幕，1代表在第一个扩展屏

- menuType为jsCode的相关配置
  
  - code: '', // jsCode必填 char 要执行的js代码，采用 new Function 模式，函数无入参

- menuType为embed的相关配置
  
  - embedAction: '', // embed必填 char 调用集成的动作
  - embedPara: {}, // 选填 JSON 调用集成动作的参数（由开发人员定义）

- menuType为fixedTag的相关配置
  
  - fixedTagName: '', // fixedTag必填 char 要打开的固定页签的页签名

### 固定页签（fixedTags）

固定页签的JSON配置是一个数组，数组的每一项就是一个页签配置，不支持嵌套，主体结构定义如下：

```javascript
fixedTags: [
    {
       // 固定页签项配置
       ...
    },
    ...
]
```

每个固定页签项可支持的配置项说明如下：

- 主要配置
  
  - name: '', // 必填 char 标签英文标识，该标识在所有标签中应唯一
  - showName: '', // 必填 char 标签显示名,支持i18n，可以直接填入i18n配置对应的标识
  - icon: '', // 选填 char 标签图标标识名，例如 svg格式图标'bug' 或 element-plus图标 'el-icon-plus'
  - order: 1, // 选填 int 页签排序, 数字小的排前面
  - tagType: '' // 必填 char 标签类型，view-内部页面(./src/views中的页面), link-链接url(含外部url)
  - cacheType: '' // 选填 char 缓存类型, none-不缓存（默认），single-单页缓存（使用keepalive，同一个页面不支持打开多个），mutiple-支持多页分别缓存

- view 相关配置
  
  - routerPath: '', // view必填 char vue路由的访问路径，以 '/' 开头
  - viewComponentName: '', // view必填 char 内部页面控件名（./src/views目录下的全局注册控件, 驼峰格式，不含.vue后缀, 由开发人员确认）
  - viewProps: {}, // 选填 JSON 向view组件传的参数（由开发人员确认）
  - viewQuery: {}, // 选填 JSON 调用vue路由时传入的参数，为?xx=xxxx形式的参数

- link 相关配置
  
  - url: '', // link必填 char 要打开的url路径

## 修改并生效菜单

菜单配置信息存储在vuex的menus命名空间下，三个菜单配置分别存储在state.menus.sidebarMenus、state.menus.rightMenus、state.menus.fixedTags中，但需要注意直接修改这3个参数值并不能使的菜单生效（存在索引生成和路由生成的逻辑），需要使用mutations或actions的方法进行处理。

设置菜单：

```javascript
// 使用actions的方法设置(异步模式)
this.$store.dispatch('menus/setMenus', {
    sidebarMenus: ..., rightMenus: ..., fixedTags: ...
}).then(() => {
   // 设置成功, 可以添加自定义逻辑
   ...
}).catch(errorInfo => {
  // 设置失败, 可以添加自定义逻辑
  ...
});

// 自行通过mutations设置（同步模式）
this.$store.commit('menus/SET_SIDEBAR_MENUS', sidebarMenus);
this.$store.commit('menus/SET_RIGHT_MENUS', rightMenus);
this.$store.commit('menus/SET_FIXED_TAGS', fixedTags);
this.$store.commit('menus/SET_404_ROUTE'); // 添加路由找不到跳转404的通用路由
this.$store.commit('menus/SET_IS_LOADED', true); // 标记菜单已加载
```

清空所有菜单配置：

```javascript
// 使用actions的方法清空(异步模式)
this.$store.dispatch('menus/clear').then(() => {
   // 清空成功, 可以添加自定义逻辑
   ...
}).catch(errorInfo => {
  // 清空失败, 可以添加自定义逻辑
  ...
});

// 自行通过mutations清空（同步模式）
this.$store.commit('menus/CLEAR_ALL_INFO');
```

## 菜单特殊配置示例

### 打开新页签页面

在Layout的新页签打开页面（openType: 'inner'），适用于左侧菜单和右上角菜单：

```javascript
// 打开已加载的Edit组件
{
    ...
    menuType: 'view',
    viewComponentName: 'Edit',
    openType: 'inner'
},

// 打开内部链接(注意该url应在路由可以匹配上, 可以在router配置静态路由)
{
    ...
    menuType: 'link',
    url: '/TestInnerUrl?id=10',
    openType: 'inner'
},

// 打开外部链接
{
    ...
    menuType: 'link',
    url: 'https://www.baidu.com',
    openType: 'inner'
},
```

### 在新浏览器窗口打开页面

在新窗口打开指定的页面（openType: 'blank'），适用于左侧菜单和右上角菜单：

```javascript
// 打开已加载的Edit组件
{
    ...
    menuType: 'view',
    viewComponentName: 'Edit',
    openType: 'blank',
    blankSpecs: 'height=500, width=800, top=100, left=100, toolbar=no, menubar=no, scrollbars=no,resizable=no, location=no, status=no',
    blankExtendScreen: 1
},
```

**注1：blankSpecs可以设置为window.open函数支持的features字符串**

**注2：blankExtendScreen可以指定新窗口在扩展屏幕打开，1代表第1个扩展屏幕**

### 在当前窗口跳转为新页面

将当前窗口页面刷新为新的页面（openType: 'refresh'），适用于左侧菜单和右上角菜单：

```javascript
// 打开已加载的Edit组件
{
    ...
    menuType: 'view',
    viewComponentName: 'Edit',
    openType: 'refresh'
},
```

### 让打开的页面支持缓存

Vue页面在切换到其他页签以后再切换回来，如果不设置缓存，页面的状态数据不会保留（相当于重新打开），如果需要保留页面状态，则需要在菜单中设置缓存支持，使用cacheType参数，3类菜单均支持：

```javascript
// 支持单页面缓存, 切换页签输入数据不会丢失, 但注意这种情况一个组件只能打开一个页面
{
    ...
    cacheType: 'single',
}

// 支持多页面缓存，切换页签输入数据不会丢失, 允许一个组件打开多个不同路径的页面
{
    ...
    cacheType: 'mutiple',
}
```

### 执行js代码

点击菜单时执行设置的js代码，适用于左侧菜单和右上角菜单：

```javascript
{
    ...
    menuType: 'jsCode',
    code: 'globalObj.this.$modal.messageSuccess("Test Message Show");'
},
```

**注1：globalObj.this变量指向当前页面的this上下文变量**

**注2：如果要执行多个js语句，通过js语言的 ; 结束符间隔多个语句即可**

### 执行内部集成动作

点击菜单时执行内部集成动作（embed）函数，适用于左侧菜单和右上角菜单：

```javascript
{
    ...
    menuType: 'embed',
    embedAction: 'showHideLayoutSettings',
    embedPara: { show: true }
},
```

支持的内部集成动作见[内嵌的默认集成动作](/sys-portal/Development/Embed)

### 右上角菜单设置下拉列表

右上角菜单支持设置下拉列表，其中menuType必须设置为main，下拉菜单项设置在children中：

```javascript
// 鼠标移到菜单项上自动弹出下拉列表
{
    ...
    menuType: 'main',
    dropDownTrigger: 'hover',
    children: [
       // 下拉列表菜单项设置
       ...
    ]
},
```

## 右上角菜单显示组件支持

右上角菜单除了可以简单地使用图标或链接来实现以外，也可以自行封装组件来实现，自行封装组件在显示样式、逻辑处理等灵活性上更好。

### 开发自定义右上角菜单组件

对菜单组件的开发没有特殊要求，只是需要注意两个点：

1、组件显示效果应与右上角菜单匹配，例如使用标准字体颜色，图标大小等；

2、组件要全局注册，或在 src/components/view/layout/components/RightMenu/RightMenuShowItem.vue 组件中进行引入。

### 默认支持的右上角菜单组件

- HeaderSearch ：菜单搜索栏，因为可以展开，建议放在右上角菜单的第一个位置

- LangSelect ：多国语言切换

- Screenfull ：页面全屏切换

- SizeSelect ：组件样式大小切换，例如按钮、字体等

- Avatar ：头像显示组件
