---
title: 如何搭建一个通用的基础组件库
date: 2022-03-29 20:39:18
categories:
  - 工程化
tags:
  - React
toc: true
comments: true
copyright: true
---
# 前言

作为一名前端程序员，一直以来，我都只是停留在会使用各种优秀的组件库，包括开源和公司内部自研的，从来没有了解过这些组件库是如何开发的。直到现在，自己参考了多个开源组件库，由浅入深，尝试去实现一个简单的组件库，学习和探索组件库设计以及开发思路。

# 技术选择

经过查阅资料，觉得dumi非常的合适。dumi是专门为组件开发场景而生的文档工具，开箱即用，支持TypeScript 和 Markdown，可以将更多的精力集中在组件开发上，核心技术栈为：`React + TypeScript + less + dumi`

# 环境准备

## 安装

### 初始化项目

```bash
$ mkdir project-name && cd project-name # 创建空目录
```
### 组件开发脚手架

```js
$ npx @umijs/create-dumi-lib --site # 初始化一个站点模式的组件库开发脚手架
# or
$ yarn create @umijs/dumi-lib --site
```
## 目录结构说明

<img src="/images/engineering/component001.png">

## 运行
- 执行 `npm install`，安装依赖。
- 执行 `npm run start` 或 `npx dumi dev` ，开始调试组件或编写文档，预览效果如下图：

<img src="/images/engineering/project-name001.png">

# 组件的开发

## 全局样式搭建
新建`src/style`文件夹，放在全局的样式文件。其中theme文件下放通用的基础样式，`global.less`中引用`style/inde.less`的样式，dumi默认引入全局样式`global.less`。

<img src="/images/engineering/component002.png">

### 定义基础样式

- 基础色彩样式，primary、default、success、warning、danger、info；
- 字体样式，默认font-family、默认font-size(1rem)、默认font-weight(400)、字体颜色、h1-h6(h6 默认是 1rem)；
- 超链接样式(默认primary，无下划线)；
- line-height(行高默认是字体的1.5倍大小)；
- body(字体大小是1rem、背景白色、字体淡黑色)；
- border边框(宽度1px、颜色@gray-300、radius是0.25rem)；
- 盒子阴影(@box-shadow: 0 0.5rem 1rem rgba(@black, 0.15))；

## 约定单个组件的文件结构
以button组件为例，其中`src/button/style/index.less`为单个组件的内部样式文件，需要在`src/style/index.less`中引入，目录结构如下：

<img src="/images/engineering/component003.png">

## 组件的开发步骤

组件正确的开发流程：组件属性的分析 -> 组件的开发 -> (上生产环境需要组件测试) -> 组件的使用说明文档

- 组件的分析：去定义一些接口或者类型别名，接口是用来描述props，声明组件的时候通过泛型传入；
- 组件的开发：不同的组件有不同的实现方式，相似的组件可以复用，编写组件基础样式；
- 组件的使用说明：描述一些需要通过props传入组件的属性，方便定制不同场景；

# Button按钮

## 类型声明
类型声明在`src/button/interface.ts`文件中写入，设置不同按钮的大小、按钮的主题类型、按钮的原生类型等
```ts
// 按钮大小
export type ButtonSize = 'lg' | 'md' | 'sm';

// 按钮的主题类型
export type ButtonType = 'primary' | 'default' | 'danger' | 'link' | 'info' | 'dashed' | 'warning';

// 按钮的原生类型
export type ButtonHTMLTypes = 'submit' | 'button' | 'reset';

export interface BaseButtonProps {
  className?: string;
  /** 按钮禁用 */
  disabled?: boolean;
  /** 按钮大小 */
  size?: ButtonSize;
  /** 按钮类型 */
  type?: ButtonType;
  /** 按钮children */
  children: React.ReactNode;
  /** type为link时的url */
  href?: string;
}

// button 和 a链接 的原生属性太多了，可以直接把全部属性加上
// 从哪里可以找到button所有的props？react已经提供好的

// 合并交叉类型
type NativeButtonProps = {
  htmlType?: ButtonHTMLTypes;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLElement>, 'type'>; // ButtonHTMLAttributes<HTMLElement> 所有button属性

type AnchorButtonProps = {
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<HTMLElement>, 'type'>; // AnchorHTMLAttributes<HTMLElement> 所有a标签属性

// Partial<T> 将类型的属性变成可选，只支持处理第一层的属性
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;
```
## Button按钮实现
在`src/button/index.tsx`写入核心代码，需要考虑`padding`的大小、`lineHeight`高度、`color`颜色、`textAlien`文字居中、`box-shadow`盒子阴影，`disabled`时的特殊样式，鼠标的`cursor`的变化。
- 使用`button`标签和`a`标签实现；
- `Button Size`的大小其实就是`padding`控制，`font-size`不同、`border`的不同；
- `Button Type`是变化`background-color`、`border-color`、字体颜色`color`；
- 添加不同的状态：`hover`之后要颜色发生一定的变化，`focus`颜色变化，`disabled`颜色也发生变化(`cursor: not-allowed`和`opacity: .65`)。
```tsx
import React from 'react';
import classNames from 'classnames';
import { ButtonProps } from './interface';

const Button: React.FC<ButtonProps> = (props) => {
  // className用户自定义的
  const { type, className, disabled, size, children, href, ...restProps } = props;

  // yolo-btn yolo-btn-lg yolo-btn-primary
  // 因为我们的key是变化的，所有用[`${ }`]
  const classes = classNames('yolo-btn', className, {
    [`yolo-btn-${type}`]: type,
    [`yolo-btn-${size}`]: size,
    disabled: type === 'link' && disabled,
  });

  if (type === 'link' && href) {
    return (
      <a className={classes} href={href} {...restProps}>
        {children}
      </a>
    );
  } else {
    return (
      <button className={classes} disabled={disabled} {...restProps}>
        {children}
      </button>
    );
  }
};

Button.defaultProps = {
  disabled: false,
  type: 'default',
};

export default Button;
```
## Button使用说明
`src/button/index.md`

### 按钮的类型

按钮分为七种类型 `type`，默认是 `default`。

`default` | `primary` | `info` | `warning` | `danger` | `dashed` | `link`

```tsx
import React from 'react';
import { Button } from 'yolo-ui';

export default () => {
  return (
    <div id="button-demo-display-type">
      <Button type="default">default</Button>
      <Button type="primary">primary</Button>
      <Button type="info">info</Button>
      <Button type="warning">warning</Button>
      <Button type="danger">danger</Button>
      <Button type="dashed">dashed</Button>
      <Button type="link" href="https://github.com/izph">
        link
      </Button>
    </div>
  );
};
```

### 按钮尺寸

尺寸 `size`分为 `lg` | `md` | `sm`，即大、中、小，默认的尺寸是中。

```tsx
import React from 'react';
import { Button } from 'yolo-ui';

export default () => {
  return (
    <div id="button-demo-display-size">
      <Button size="lg" type="primary">
        Large
      </Button>
      <Button size="md" type="danger">
        Medium
      </Button>
      <Button size="sm" type="warning">
        Small
      </Button>
    </div>
  );
};
```

### 按钮的禁用状态

添加 `disabled`属性即可让按钮处于禁用状态，同时按钮样式也会改变。

```tsx
import React from 'react';
import { Button } from 'yolo-ui';

export default () => {
  return (
    <div id="button-demo-display-size">
      <Button type="primary" disabled>
        primary
      </Button>
      <Button type="danger" disabled>
        danger
      </Button>
      <Button disabled>default</Button>
      <Button type="link" disabled>
        link
      </Button>
    </div>
  );
};
```

### API

通过设置 `Button`的属性来产生不同的按钮样式，按钮的属性说明如下：

| 属性     | 说明                                                     | 类型                                                                                       | 默认值      |
| -------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------- |
| type     | 设置按钮类型                                             | `default`、`primary`、`info`、 `warning`、`danger`、`dashed`、`link` | `default` |
| size     | 设置按钮大小                                             | `lg`、`md`、`sm`，非必填                                                             | `md`      |
| disabled | 按钮禁用状态                                             | `boolean`                                                                                | `false`   |
| href     | 点击跳转的地址，指定此属性 `button`的行为和 a 链接一致 | `string`                                                                                 | -           |
| onClick  | 点击按钮时的回调                                         | `(event) => void`                                                                        | -           |

### Button文档预览
<img src="/images/engineering/component-btn-001.png">

# Progress进度条
## 类型声明
类型声明在`src/progress/interface.ts`文件中写入，设置进度条主题颜色的类型、进度条组件的类型`ProgressProps`。percent代表当前进度条的百分比，strokeHeight设置高度，showText是否显示百分比数字。
```ts
import React from 'react';

export type ProgressThemeProps =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'light'
  | 'dark';

export interface ProgressProps {
  /* 百分比 */
  percent: number;
  /* 设置高度 */
  strokeHeight?: number;
  /* 是否显示百分比文字 */
  showText?: boolean;
  /* 用户自定义样式 */
  style?: React.CSSProperties;
  /* 进度条主题颜色 */
  theme?: ProgressThemeProps;
}
```
## Progress进度条实现
在`src/progress/index.tsx`写入核心代码，根据传入的数字，来控制一个进度条长度；最外面有一个灰色progress-outer，它的高度可以配置，progress-outer内有一个子元素progress-inner，通过该元素的width来显示当前进度颜色，这个宽度是继承父元素progress-outer的，并悬浮到progress-outer上；通过在progress-inner设置flex布局，flex-end表示子项目从后往前排列，设置百分比数字显示在进度条右边，百分比数字也是支持显示和隐藏。
```tsx
// progress/index.tsx
import React, { FC } from 'react';
import { ProgressProps } from './interface';

/* 
  percent: number 百分比
  strokeHeight: number 高度
  showText: boolean 是否显示百分比数字
  theme: string 进度条主题色
  style: React.CSSProperties 用户自定义样式
*/
const Progress: FC<ProgressProps> = ({
  percent,
  strokeHeight,
  showText,
  style,
  theme,
  ...restProps
}) => {
  return (
    <div className="yolo-progress" style={style} {...restProps}>
      {/* 灰色最外层 */}
      <div className="yolo-progress-outer" style={{ height: `${strokeHeight}px` }}>
        <div className={`yolo-progress-inner color-${theme}`} style={{ width: `${percent}%` }}>
          {showText && <span className="inner-text">{`${percent}%`}</span>}
        </div>
      </div>
    </div>
  );
};

/* 
  初始化默认值
*/
Progress.defaultProps = {
  strokeHeight: 15,
  showText: true,
  theme: 'primary',
};

export default Progress;
```
## Progress进度条说明文档
`src/progress/index.md`

### 基本使用

基本样式分为 7 种，默认类型为 `primary`。

`primary` | `secondary` | `success` | `info` | `warning` | `danger` | `dark`

```tsx
import React from 'react';
import { Progress } from 'yolo-ui';

export default () => (
  <div>
    <Progress percent={20} />
    <br />
    <Progress theme="secondary" percent={30} />
    <br />
    <Progress theme="success" percent={40} />
    <br />
    <Progress theme="info" percent={50} />
    <br />
    <Progress theme="warning" percent={60} />
    <br />
    <Progress theme="danger" percent={70} />
    <br />
    <Progress theme="dark" percent={80} />
    <br />
    <Progress theme="primary" percent={100} />
  </div>
);
```

### 自定义高度

```tsx
import React from 'react';
import { Progress } from 'yolo-ui';

export default () => (
  <div>
    <Progress percent={20} strokeHeight={15} />
    <br />
    <Progress theme="success" percent={40} strokeHeight={20} />
    <br />
    <Progress theme="warning" percent={60} strokeHeight={30} />
    <br />
    <Progress theme="danger" percent={70} strokeHeight={40} />
  </div>
);
```

### 是否显示百分比文字

通过设置 `showText`属性。

```tsx
import React from 'react';
import { Progress } from 'yolo-ui';

export default () => (
  <div>
    <Progress percent={30} showText={false} />
    <br />
    <Progress theme="success" percent={40} strokeHeight={20} showText={true} />
    <br />
    <Progress theme="warning" percent={60} strokeHeight={30} showText={true} />
  </div>
);
```

### API

| 属性         | 说明               | 类型                                                                                                     | 默认值      |
| ------------ | ------------------ | -------------------------------------------------------------------------------------------------------- | ----------- |
| theme        | 主题颜色           | `primary` \| `secondary` \| `success` \| `info` \| `warning` \| `danger` \| `dark`，非必填 | `primary` |
| percent      | 百分比             | `number`                                                                                               | -           |
| strokeHeight | 进度条高度         | `number`                                                                                               | -           |
| showText     | 是否显示百分比文字 | `boolean`                                                                                              | `true`    |
| style        | 自定义样式         | `React.CSSProperties`                                                                                  | -           |

### Progress文档预览
<img src="/images/engineering/component-progress001.png">

<img src="/images/engineering/component-progress002.png">


# Switch开关
## 类型声明
类型声明在`src/switch/interface.ts`文件中写入，checked属性是最开始是否被选中，disabled是否可以被禁用，onText开启状态的文本，offText关闭状态的文本，size是组件的尺寸大小，theme组件的颜色，onChange是状态切换时执行的回调函数。
```ts
import React from 'react';
export type SwitchSize = 'default' | 'sm';

export type SwitchChangeEventHandler = (
  checked: boolean,
  event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
) => void;
export interface SwitchProps {
  /* 用户自定义样式 */
  style?: React.CSSProperties;
  /** 是否被选中 */
  checked?: boolean;
  /* 用户自定义类名 */
  className?: string;
  /** 组件的尺寸 */
  size?: SwitchSize;
  /** 是否被禁用 */
  disabled?: boolean;
  /** 开启状态的文本 */
  onText?: string;
  /** 关闭状态的文本 */
  offText?: string;
  /** 状态切换时的回调 */
  onChange?: SwitchChangeEventHandler;
}
```
## Switch开关实现
在`src/switch/index.tsx`写入核心代码，基于button标签实现的，它有两个子元素`div`和`span`。div是一个白色的滑块，使用绝对定位，通过计算left值实现左右的切换，例如点击的时候，滑块的left值是`left: calc(100% - 20px);`，通过calc计算出的，这就是左右滑动的核心。同时还需要考虑`background-color`和`background-image`的优先级问题，最后span标签用来显示文本。
```tsx
// switch/index.tsx
import React, { useState } from 'react';
import classNames from 'classnames';
import { SwitchProps } from './interface';

/**
 * switch
 * @param {checked} bool 是否被选中
 * @param {disabled} bool 是否被禁用
 * @param {onText} string 开启状态的文本
 * @param {offText} string 关闭状态的文本
 * @param {onChange} func 状态切换时的回调
 * @param {size} string Switch组件的尺寸大小
 * @param {theme} string 组件的颜色
 */
const Switch: React.FC<SwitchProps> = (props) => {
  const { size, checked, disabled, onText, offText, onChange, className, style, ...restProps } =
    props;
  /** 
   * 设置初始背景色
  */
  const defaultStyle = {
    ...style,
    backgroundColor: style?.backgroundColor || '#0099ff'
  }

  const [isChecked, setChecked] = useState<boolean>(!!checked);
  const classes = classNames('yolo-switch', className, {
    'yolo-switch-checked': !!isChecked,
    'yolo-switch-disabled': disabled,
    [`yolo-switch-${size}`]: size,
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      onChange && onChange(!isChecked, e);
      setChecked(!isChecked);
    }
  };

  return (
    <button
      type="button"
      className={classes}
      onClick={handleClick}
      style={defaultStyle}
      {...restProps}
    >
      <div className="yolo-switch-handle"></div>
      <span className="yolo-switch-inner">{isChecked ? onText : offText}</span>
    </button>
  );
};


export default Switch;
```
## Switch说明文档
`src/switch/index.md`

### 基本使用

```tsx
import React from 'react';
import { Switch } from 'yolo-ui';

export default () => {
  return (
    <>
      <Switch checked />
      <br />
      <br />
      <Switch/>
    </>
  );
};
```

### 禁止使用

```tsx
import React from 'react';
import { Switch } from 'yolo-ui';

export default () => {
  return (
    <>
      <Switch disabled />
      <br />
      <br />
      <Switch disabled checked />
    </>
  );
};
```

### 定制主题颜色

```tsx
import React from 'react';
import { Switch } from 'yolo-ui';

export default () => {
  return (
    <>
      <Switch checked style={{ backgroundColor: 'green'}}/>
      <br />
      <br />
      <Switch  checked style={{backgroundColor: 'red'}}/>
      <br />
      <br />
      <Switch  checked style={{backgroundColor: 'yellow'}}/>
      <br />
      <br />
      <Switch  checked style={{backgroundColor: 'pink'}}/>
      <br />
      <br />
      <Switch  checked style={{backgroundColor: 'blue'}}/>
    </>
  );
};
```

### 组件尺寸

```tsx
import React from 'react';
import { Switch } from 'yolo-ui';

export default () => {
  return (
    <>
      <Switch checked size="sm" />
      <br />
      <br />
      <Switch checked />
    </>
  );
};
```

### 开关内容

```tsx
import React from 'react';
import { Switch } from 'yolo-ui';

export default () => {
  return (
    <>
      <Switch
        onText={'开'}
        offText={'关'}
        onChange={(checked, e) => {
          console.log(checked, e);
        }}
        checked
      />
    </>
  );
};
```

### API

| 参数     | 说明                 | 类型                                         | 默认值    |
| -------- | -------------------- | -------------------------------------------- | --------- |
| style   | 自定义样式，`backgroundColor`可自定义颜色| `string`                                   | `#09f`  |
| checked  | 是否被选中           | `boolean`                                  | `false` |
| size     | 开关大学             | `default \| sm`                             | -         |
| disabled | 是否被禁用           | `boolean`                                  | `false` |
| onText   | 开启状态的文本       | `string \| ReactNode`                       | -         |
| offText  | 关闭状态的文本       | `string \| ReactNode`                       | -         |
| onChange | 选中值发生变化时触发 | `function(checked: boolean, event: Event)` | -         |

### Switch文档预览
<img src="/images/engineering/component-switch001.png">

# 代码打包输出和发布

## 组件库的入口文件

- 组件库的入口文件为 ``src/index.ts``
- 组件库的全局样式文件为 ``src/style/index.less``或者 ``src/global.less``，两者都可以用来全局样式的提取。

## 组件的打包

### 在根目录新建tsconfig.build.json文件

```json
{
  "compilerOptions": {
    "outDir": "dist", // 编译之后的存放路径
    "module": "ESNext",
    "target": "ES5", // 指定编译之后的目标版本
    "declaration": true, // 为每一个js文件生成 .d.ts类型声明文件
    "jsx": "react",
    "moduleResolution": "node", // classic 和 Node
    "allowSyntheticDefaultImports": true //  true 支持 defalut 引入的方式
  },
  "include": ["src/"],
  "exclude": ["src/**/style", "src/**/*.md"]
}
```

### 在package.json文件中添加命令

分别安装`lessc`和`rimraf`依赖，`lessc`将`less`转化为`css`，`rimraf`用来删除`dist`目录。

```json
{ 
  "scripts": {
    "clean": "rimraf ./dist",
    "build:lib": "npm run clean && npm run build-ts && npm run build-css",
    "build-ts": "tsc -p tsconfig.build.json",
    "build-css": "lessc ./src/style/index.less ./dist/index.css",
  }
}
```

在执行`build-ts`发生了很多个报错如下，经过在[stackoverflow](https://stackoverflow.com/)上查找相关资料得知，是 `@types/react-router-dom`和 `@types/react-router`的版本太低了导致了，把这两个依赖升级到最新版本后，就可以正常打包了。

```js
xxx/node_modules/@types/react-router-dom/index.d.ts(59,34): error TS2694: Namespace '"/node_modules/history/index"' has no exported member 'LocationState'.
```

## 本地测试(npm link)

- 在`yolo-ui`的根目录下执行`npm link`命令，`npm link`的作用是可以让未发布的npm包，做本地测试，映射脚本；
- 在`yolo-ui-test`（create-react-app生成的测试项目）工程下执行`npm link yolo-ui`；
- 在`yolo-ui-test`的`package.json`中加入`yolo-ui`依赖。

```json
{ 
  "dependencies": {
    "yolo-ui": "^0.1.0"
  },
}
```

- 分别在 `App.tsx`和 `index.tsx`引入组件和组件的样式

```tsx
// App.tsx
import { Button } from 'yolo-ui';

function App() {
  return (
    <div className="App">
      <Button type="primary">Hello Yolo</Button>
    </div>
  );
}

export default App;
```

```tsx
// index.tsx
import "yolo-ui/dist/index.css";
```

- 测试结果如下，本地测试没问题。

<img src="/images/engineering/yolo-build-001.png">

## 将yolo-ui发布到npm

- 切换npm的源镜像为npm的原生源
- 在命令行工具执行npm adduser，填写username、password and email 登录(sign in)
- 在package.json添加一些必要信息

```json
{ 
  "files": [
    "dist"
  ], // 发布哪些文件到npm
  // 添加prepublish命令
  "scripts": {
    "clean": "rimraf ./dist",
    "build:lib": "npm run clean && npm run build-ts && npm run build-css",
    "build-ts": "tsc -p tsconfig.build.json",
    "build-css": "lessc ./src/style/index.less ./dist/index.css",
    "prepublish": "npm run build:lib"
  },
}
```

- 执行npm publish即可发布到npm

  <img src="/images/engineering/yolo-npm-publish.png">

- 此外，还可以在`peerDependencies`中告诉用户，要使用某某依赖需要安装什么依赖，如下：
  要使用`yolo-ui`库，需要安装`react`和`react-dom`的16.8.0版本以上。当`npm i yolo-ui`时，`peerDependencies`里面的依赖不会被安装，会有一个日志输出，`npm warning`会提示用户需要安装`react`和`react-dom`的依赖。

```json
// package.json
{ 
  "peerDependencies": {
    "react": "≥16.8.0",
    "react-dom": "≥16.8.0"
  },
}
```

# yolo-ui静态文档上传至阿里云服务器

## 购买服务器

本人买的是阿里云服务器

## 远程登录服务器桌面(windows)

- 在window桌面上按 `win + R`，输入 `mstsc`，进入远程桌面连接
- 如果没有添加windows凭据的，先在 `控制面板->凭据管理器->windows凭据里添加服务器的凭据`
- 输入账号和密码即可登录服务器远程桌面

## 安装node环境

- 将node的安装包上传到云服务器，并安装，`node -v`可以查看版本和是否安装成功

## 启动静态服务器

- 在根目录下 `npm init -y`，初始化 `package.json`文件，新建index.js文件
- 上传静态文件docs-dist（dumi 打包的产物）到根目录，docs-dist文件内容如下：

  <img src="/images/engineering/yolo-upload001.png">

- 安装 `koa`和 `koa-static`，用来启动一个静态资源服务器。
- 在index.js写入代码：

```js
const Koa = require('koa');
const path = require('path');
const static = require('koa-static');
const app = new Koa();

// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './docs-dist';

app.use(static(
    path.join(__dirname, staticPath)
))

app.listen(80, () => {
    console.log('server is running, port is 80');
})
```

- 在根目录下执行 `node index.js`，开启服务器成功
- 最后在浏览器地址输入云服务器ip地址即可访问

## 域名的注册和备案

# nginx开启静态服务，并配置二级域名访问

## 安装nginx（windows版）

- 进入nginx官网下载安装包: [nginx下载](http://nginx.org/en/download.html)
- 解压下载完成的nginx压缩包
- 打开`cmd`，进入nginx安装包根路径
- 输入命令`nginx -t`：检查nginx是否配置成功
- 输入命令`start nginx`：启动nginx服务

## nginx其他常用命令

- 修改了配置文件，如nginx.conf，要使修改生效，重启Nginx服务
```bash
nginx -s reload
```

- 关闭nginx服务
```bash
nginx -s quit
```

- 强制关闭Nginx服务
```bash
nginx -s stop
```

## nginx.conf配置文件

- nginx的配置在根目录conf文件夹下的nginx.conf文件中
- server：代理服务器，可以设定多个代理服务器（每一个server就是一个虚拟服务器），请求进来之后由server的server_name决定该请求访问哪一个服务。

- 以下是在阿里云服务器nginx配置不同域名，访问不同的静态资源的例子，比如访问home和detial，我们只需要把静态文件分别放到`C:/v1/home`和`C:/v1/detial`目录下，即可通过`http://home.xxxxx.com`和`http://detial.xxxxx.com`分别访问对应的静态资源。

- 与此同时，需要在云服务器官网添加记录，二级域名的`home`和`detial`的解析设置
```conf
server {
    # 设置监听端口
    listen      80;
    server_name  home.xxxxx.com;
    
    # 设置url编码格式，解决参数中文乱码问题
    charset utf-8;
		
    location / {
        root C:/v1/home;  # 设置 root-指定请求资源在服务器上的真实路径，可以写相对路径（相对于nginx安装目录）也可写绝对路径；
        index index.html index.htm;  # 指定访问主页，会在root设定目录下去找，后面可跟多个页面，依次查找，找到一个即返回；
    } 
}

server {
    # 设置监听端口
    listen      80;
    server_name  detial.xxxxx.com;
    
    # 设置url编码格式，解决参数中文乱码问题
    charset utf-8;
		
    location / {
        root C:/v1/detial;  
        index index.html index.htm;  
    } 
}
```
# YoloUI预览地址
[YoloUI官网](http://yolo-ui.xyz/)

# 参考
- [dumi官方网站](https://d.umijs.org/zh-CN/guide)
- [ant-design](https://ant.design/index-cn)
- [arco-design](https://arco.design/)
- [monki-ui](https://github.com/Jacky-Summer/monki-ui)
- [最详细的React组件库搭建总结](https://juejin.cn/post/6844904160568016910)
- [Nginx在windows下的安装、运行，以及配置文件讲解](https://blog.csdn.net/zorro_jin/article/details/84927408?spm=1001.2014.3001.5506)









