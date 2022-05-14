---
title: SQL笔记（一）
date: 2021-04-26 21:03:45
permalink: /engineering/sql/sql-basics
categories:
  - 后端
tags:
  - 后端
  - SQL
---
# SQL笔记

mysql是关系型数据库

### DDL：Data Definition Language

DDL允许用户定义数据，也就是创建表、删除表、修改表结构这些操作。通常，DDL由数据库管理员执行。

### DML：Data Manipulation Language

DML为用户提供添加、删除、更新数据的能力，这些是应用程序对数据库的日常操作。

### DQL：Data Query Language

DQL允许用户查询数据，这也是通常最频繁的数据库日常操作。

### 主键和联合主键

主键的一个基本原则是，不使用任何业务相关的字段作为主键，联合主键，允许一列有重复，只要不是所有主键列都重复即可。

### 基本查询方法

```sql
# SELECT 结果集 FROM <表名>
# 结果集可以显示 列名称
SELECT * FROM <表名>

# 表别名
SELECT * FROM students s

# 条件查询
SELECT * FROM <表名> WHERE <条件表达式>

# <条件1> AND <条件2>表达满足条件1并且满足条件2
SELECT * FROM <表名> WHERE <条件表达式1> AND <条件表达式2>

# <条件1> OR <条件2>表示满足条件1或者满足条件2
SELECT * FROM <表名> WHERE <条件表达式1> OR <条件表达式2>

# NOT <条件>，表示“不符合该条件”的记录

# 要组合三个或者更多的条件，就需要用小括号()表示如何进行条件运算，如果不加括号，条件运算按照NOT、AND、OR的优先级进行，即NOT优先级最高，其次是AND，最后是OR。加上括号可以改变优先级。

# 只希望返回某些列的数据，而不是所有列的数据
SELECT 列1, 列2, 列3 FROM <表名>

# 列的别名
SELECT 列1 别名1, 列2 别名2, 列3 别名3 FROM  <表名>

# 排序 ORDER BY
# 默认的排序规则是ASC：“升序”，即从小到大。ASC可以省略，即ORDER BY score ASC和ORDER BY score效果一样。DESC：“降序”，
# 如果有WHERE子句，那么ORDER BY子句要放到WHERE子句后面

# 如果score列有相同的数据，要进一步排序，可以继续添加列名。例如，
# 表示先按score列倒序，如果有相同分数的，再按gender列排序：
ORDER BY score DESC, gender

# 分页查询 通过 LIMIT <M> OFFSET <N> 子句实现
LIMIT 3 OFFSET 0
# 表示，对结果集从0号记录开始，最多取3条。注意SQL记录集的索引从0开始
# OFFSET超过了查询的最大数量并不会报错，而是得到一个空的结果集。
# OFFSET是可选的，如果只写LIMIT 15，那么相当于LIMIT 15 OFFSET 0。
# 在MySQL中，LIMIT 15 OFFSET 30还可以简写成LIMIT 30, 15。

# 聚合查询
# 使用聚合查询时，我们应该给列名设置一个别名，便于处理结果: num
SELECT COUNT(*) num FROM <表名>

# 函数	说明
# SUM	计算某一列的合计值，该列必须为数值类型
# AVG	计算某一列的平均值，该列必须为数值类型
# MAX	计算某一列的最大值
# MIN	计算某一列的最小值
# 查询所有学生的平均成绩
SELECT AVG(score) average FROM students

# 要特别注意：如果聚合查询的WHERE条件没有匹配到任何行，COUNT()会返回0，而SUM()、AVG()、MAX()和MIN()会返回NULL：

# 多表查询 SELECT * FROM <表1>, <表2>
# 多表查询时，要使用 表名.列名 这样的方式来引用列和设置别名，这样就避免了结果集的列名重复问题。
```

### 连接查询

[廖雪峰sql教程-连接查询](https://www.bookstack.cn/read/liaoxuefeng-sql/bf30f02838d0e30e.md)

### 修改数据

```sql
# 插入数据
INSERT INTO <表名> (字段1, 字段2, ...) VALUES (值1, 值2, ...);

# 更新数据
UPDATE <表名> SET 字段1=值1, 字段2=值2, ... WHERE ...;

# UPDATE语句可以没有WHERE条件，这时，整个表的所有记录都会被更新
UPDATE students SET score=60;

# 删除数据，WHERE条件也是用来筛选需要删除的行
DELETE FROM <表名> WHERE ...;
# 删除id=1的数据
delete from students where id=1;
```

### 管理MySQL

[管理MySQL](https://www.bookstack.cn/read/liaoxuefeng-sql/567d44abee253c21.md)

### 实用SQL语句

[实用SQL语句](https://www.bookstack.cn/read/liaoxuefeng-sql/e3bf4632fad8f0be.md)

### 参考

[廖雪峰SQL教程(MySQL)](https://www.bookstack.cn/read/liaoxuefeng-sql/b2bc7f8dbfe267a8.md)
