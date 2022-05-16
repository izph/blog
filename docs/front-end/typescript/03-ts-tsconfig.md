---
title: tsconfig配置
date: 2022-01-02 10:15:06
permalink: /前端/TypeScript/tsconfig
categories:
  - 前端
  - TypeScript
tags:
  - 前端
  - TypeScript
---
## tsconfig.json介绍

tsconfig.json 是 TypeScript 编译的相关配置，用于描述将TS转化为JS代码的配置文件，通过更改编译配置项，我们可以让 TypeScript 编译出 ES6、ES5、node 的代码。

- 生成tsconfig.js文件：`tsc --init`
- 查看更多配置和使用说名: `tsc -h`
- 应当将tsc作为类型检查工具，而不是编译项目的工具，代码编译的工作应该交给babel、webpack等工具

## tsconfig.json 重要字段

- files - 设置需要编译的单个文件的列表；

```json
// 只编译 src下的 index.ts文件
{
  "files": ["src/index.ts"]
}
```

- include - 设置需要进行编译的文件或者目录，支持路径模式匹配；
  include和files会合并

```json
// 编译src所有的ts文件
// 支持通配符，只编译src下的一级目录的ts文件，如"src/*"，二级文件 "src/*/*"
{
  "include": ["src"]
}
```

- exclude - 排除不需要进行编译的文件，支持路径模式匹配（排除）；默认排除node_modules下的所有文件、排除所有声明文件(xxx.d.ts)，只对include字段有排除效果，对file字段无影响。

```json
// 排除src/lib的文件编译
{
  "include": ["src/lib"]
}
```

- extends，导入或者继承其他tsconfig配置

```json
// 导入当前目录下的tsconfig.base.json里的配置，但是导入的配置容易被覆盖（在tsconfig.json可以覆盖导入的配置）
{
  "extends": "./tsconfig.base.json"
}
```

- compileOnSave: true, 保存文件时自动触发tsc编译文件（VScode不支持这个配置），一般来说，代码编译过程会通过webpack等打包构建工具，并且使用热更新，因此一般不需要配置该项。
- compilerOptions - 设置与编译流程相关的选项。
- 如果ts.config文件为空，则会按照默认是编译当前目录下的所有ts文件

### compilerOptions 选项

```tsx
{
  "compilerOptions": {
    "tsBuildInfoFile": './buildFile',      // 指定编译后的文件放在哪里

    /* 基本选项 */
    "target": "es5",                       // 指定编译后ECMAScript目标版本: 要将ts编译成js哪个版本的语法，'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "commonjs",                  // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "lib": [],                             // 指定要包含在编译中的库文件
    "allowJs": true,                       // 允许编译 javascript 文件
    "checkJs": true,                       // 报告 javascript 文件中的错误
    "jsx": "preserve",                     // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "declaration": true,                   // 生成相应的 '.d.ts' 文件
    "sourceMap": true,                     // 生成相应的 '.map' 文件
    "outFile": "./",                       // 将输出文件合并为一个文件
    "outDir": "./",                        // 指定输出目录
    "rootDir": "./",                       // 用来控制只能引用当前目录下的ts文件.
    "removeComments": true,                // 删除编译后的所有的注释
    "noEmit": true,                        // 不生成输出文件
    "importHelpers": true,                 // 从 tslib 导入辅助工具函数
    "isolatedModules": true,  // 将每个文件做为单独的模块 （与 'ts.transpileModule' 类似）.

    /* 严格的类型检查选项 */
    "strict": true,                        // 启用所有严格类型检查选项
    "noImplicitAny": true,                 // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true,              // 启用严格的 null 检查
    "noImplicitThis": true,                // 当 this 表达式值为 any 类型的时候，生成一个错误
    "alwaysStrict": true,   // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

    /* 额外的检查 */
    "noUnusedLocals": true,                // 有未使用的变量时，抛出错误
    "noUnusedParameters": true,            // 有未使用的参数时，抛出错误
    "noImplicitReturns": true,             // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true, // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

    /* 模块解析选项 */
    "moduleResolution": "node", // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
    "baseUrl": "./",                       // 用于解析非相对模块名称的基目录
    "paths": {},                           // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [],                        // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "typeRoots": [],                       // 包含类型声明的文件列表
    "types": [],                           // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true,  // 允许从没有设置默认导出的模块中默认导入。

    /* Source Map Options */
    "sourceRoot": "./",                    // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./",                       // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true,               // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
    "inlineSources": true, // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

    /* 其他选项 */
    "experimentalDecorators": true,        // 启用装饰器
    "emitDecoratorMetadata": true          // 为装饰器提供元数据的支持
  }
}


```
