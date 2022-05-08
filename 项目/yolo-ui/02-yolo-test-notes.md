---
title: 组件测试
date: 2022-03-15 10:22:34
permalink: /项目/yolo-ui/yolo-test-notes
categories:
  - 项目
tags:
---

## 组件测试用例分析和编码

代码的痛点，测试button组件好不好用，方式是创建大量的button，设置多个属性观察。
还有就是更新代码，添加新的功能的时候，需要把每一个类型的组件过一遍，看看新增的功能对原理的代码有没有影响，这无疑增加了工作量，效率太低了。
所以，组件的测试是非常有必要的。

- 测试保证代码能够运行，并且没有bug，产生高质量的代码。
- 更早的发现bug，减少成本，以免上线之后对公司造成损失。
- 让重构和升级变得更加容易和可靠。测试可以保证升级的版本是否有问题，是否可靠。
- 让开发流程更加敏捷。

### 测试金字塔

Unit -> Service -> UI -> Manual手动测试

- Unit test单元测试，是指把代码分成单独的、互相独立的部分，它们没有相互的依赖，测试每一个部分都可以良好的工作。单元测试是最多的，非常容易编写，改动比较小，容易维护，跑起来用时较短。
- Service test就是把几个unit test组合起来，可以测试它是否可以良好的工作。
- UI test（1 to 1 test），测试模拟用户真实场景，对整个应用进行测试，模拟用户的行为。

### React组件特别适合单元测试

- React是组件化开发，各个组件、单元互不影响。
- Function函数组件，纯函数最好写测试，因为它有固定的输入和输出。
- 单项数据流。

### 测试框架Jest

Jest是Facebook出品的框架
[Jest中文文档](https://www.jestjs.cn/)

#### Jest笔记

```js
// 断言库
test('test common matcher', () => {
  // 2 + 2 = 4
  // toBe 是全等
  expect( 2 + 2 ).toBe(4)
  expect(2 + 2).not.toBe(5)
})

test('test to be true or false', () => {
  // true、false
  expect(1).toBeTruthy()
  expect(0).toBeFalsy()
})

test('test number', () => {
  // 4 超过 3
  expect(4).toBeGreaterThan(3)
  expect(2).toBeLessThan(3)
})

test('test object', () => {
  // toEqual 比较值是否相等
  expect({name: 'viking'}).toEqual({name: 'viking'})
})
```

### React官方推荐的测试工具(enzyme和@testing-library/react)

``npm install --save-dev @testing-library/react``
``npm install --save-dev @testing-library/jest-dom``

@testing-library/jest-dom添加了一些针对dom的一些断言
[@testing-library/jest-dom](https://github.com/testing-library/jest-dom)

#### Filename Conventions

Jest 将查找具有以下任何流行命名约定的测试文件：

- __tests__ 文件夹中带有 `.js`或者 `.ts` 后缀的文件。
- 带有 .test.js 后缀的文件。
- 带有 .spec.js 后缀的文件。

.test.js / .spec.js 文件（或 __tests__ 文件夹）可以位于 src 顶级文件夹下的任何目录。
建议将测试文件（或 __tests__ 文件夹）放在他们正在测试的代码旁边，以便相对导入看起来更短。例如，如果 App.test.js 和 App.js 在同一个文件夹中，则测试只需要从 './App' 导入 App，而不是长的相对路径。搭配还有助于在大型项目中更快地找到测试。