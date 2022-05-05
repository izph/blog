---
title: git commit规范
date: 2022-02-25 19:18:30
permalink: /工程化/git/commitstandard
categories:
  - git
tags:
  - git
---
# git commit规范

## 格式

``<type>(<scope>): <subject>``

### type(必须)：

类型：用于说明git commit的类别，允许使用以下标识：

1. feat：新增功能（feature）。
2. fix/to：修复问题。

- fix：产生diff并自动修复此问题。适合于一次提交直接修复问题。
- to：只产生diff不自动修复此问题。适合于多次提交。最终修复问题提交时使用fix。

3. docs：修改文档（documentation）。
4. style：修改代码格式（不影响代码运行的变动）。
5. refactor：重构代码（即不是新增功能，也不是修改bug的代码变动）。
6. perf：修改提搞性能的代码。
7. test：新增、修改测试用例。
8. chore：构建过程或辅助工具的变动。
9. revert：回滚到上一个版本。
10. merge：代码合并。
11. sync：同步主线或分支的Bug。

### scope(可选)

scope：用于说明本次 commit 影响的范围

### subject(必须)

subject：本次commit 的简短描述，不超过50个字符，建议使用中文，结尾不加句号或其他标点符号。

### 示例

根据以上git commit规范，message将是如下的格式：

```
fix(DAO): 用户查询缺少username属性 
feat(Controller): 用户查询接口开发
```
