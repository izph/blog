---
title: JavaScript树形结构转化（笔记）
date: 2022-02-16 11:38:51
permalink: /前端/JavaScript/JavaScript树形结构转化
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
# JavaScript树形结构转化
## 1、列表转成树形结构
数据集如下：
```javascript
const data = [
    { id: 1, name: "广东", pid: 0 },
    { id: 2, name: "广州", pid: 1 },
    { id: 3, name: "深圳", pid: 1 },
    { id: 4, name: "天河区", pid: 2 },
    { id: 5, name: "海珠区", pid: 2 },
    { id: 6, name: "南山区", pid: 3 },
    { id: 7, name: "福田区", pid: 3 },
    { id: 8, name: "山东", pid: 0 },
    { id: 9, name: "青岛", pid: 8 },
    { id: 10, name: "济南", pid: 8 },
    { id: 11, name: "市北区", pid: 9 },
    { id: 12, name: "崂山区", pid: 9 },
    { id: 13, name: "历下区", pid: 10 },
    { id: 14, name: "高新区", pid: 10 },
];
```
需要将以上数据转化成树形结构：
- 广东
  - 广州
    - 天河区
    - 海珠区
  - 深圳
    - 南山区
    - 福田区
- 山东
  - 青岛
    - 市北区
    - 崂山区
  - 济南
    - 历下区
    - 高新区
id与pid之间的对应关系，当pid不存在或pid:0的时候，这一项，应该为树的顶端。
```javascript
function toTree(data) {
   // 将数据存储为 以 id 为 KEY 的 map 索引数据列
   const map = {};
   data.forEach(function (item) {
       map[item.id] = item;
   });
   const res = [];
   data.forEach(function (item) {
       // 以当前遍历项的pid,  去map对象中找到索引的id
       var parent = map[item.pid];
       // 如果找到索引，那么说明此项不在顶级当中, 那么需要把此项添加到，他对应的父级中
        if (parent) {
            (parent.children || (parent.children = [])).push(item);
        } else {
            //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
            res.push(item);
        }
    });
    return res;
}
console.log(toTree(data))
```
结果如下：
```javascript
[
    {
        "id": 1,
        "name": "广东",
        "pid": 0,
        "children": [
            {
                "id": 2,
                "name": "广州",
                "pid": 1,
                "children": [
                    {
                        "id": 4,
                        "name": "天河区",
                        "pid": 2
                    },
                    {
                        "id": 5,
                        "name": "海珠区",
                        "pid": 2
                    }
                ]
            },
            {
                "id": 3,
                "name": "深圳",
                "pid": 1,
                "children": [
                    {
                        "id": 6,
                        "name": "南山区",
                        "pid": 3
                    },
                    {
                        "id": 7,
                        "name": "福田区",
                        "pid": 3
                    }
                ]
            }
        ]
    },
    {
        "id": 8,
        "name": "山东",
        "pid": 0,
        "children": [
            {
                "id": 9,
                "name": "青岛",
                "pid": 8,
                "children": [
                    {
                        "id": 11,
                        "name": "市北区",
                        "pid": 9
                    },
                    {
                        "id": 12,
                        "name": "崂山区",
                        "pid": 9
                    }
                ]
            },
            {
                "id": 10,
                "name": "济南",
                "pid": 8,
                "children": [
                    {
                        "id": 13,
                        "name": "历下区",
                        "pid": 10
                    },
                    {
                        "id": 14,
                        "name": "高新区",
                        "pid": 10
                    }
                ]
            }
        ]
    }
]
```
### 列表转成树形结构的通用方法（支持无限层级）
```javascript
/**
 * treeData: []，列表的数据源
 * id: 当前项目的id
 * pid: 指向父元素
 * children: 父级存储子元素的容器
*/
function listToTree(treeData, id, pid, children){
    // 深拷贝数据源
    let cloneData = JSON.parse(JSON.stringify(treeData));
    // 遍历所有项，添加children属性
    return cloneData.filter((fatherItem)=>{
        // 返回每一项的子级数组
        let branchArr = cloneData.filter((childItem) => fatherItem[id] == childItem[pid]);
      	// 给父级添加一个children属性，并赋值
        branchArr.length > 0 ? fatherItem[children] = branchArr : '';
      // 如果第一层不是pid=0，请自行修改
        return fatherItem[pid] === 0;     
    })
}
 
// 调用时，字段名以字符串的形式传参
listToTree(treeData, 'id', 'pid', 'children');
```

## 2、树形结构转成列表
参照以上省市的例子，代码如下
```javascript
function treeToList(data) {
  let res = [];
  const dfs = (tree) => {
    tree.forEach((item) => {
      if (item.children) {
        dfs(item.children);
        delete item.children;
      }
      res.push(item);
    });
  };
  dfs(data);
  return res;
}
```
## 3、获取树形结构所有的key值
数据如下：
```javascript
let data = [{
    key: '1',
    children: [{
        key: '11',
        children: [
            {
                key: '111'
            },
            {
                key: '112'
            }
        ]
    },
    {
        key: '12',
        children: [
            {
                key: '121'
            },
            {
                key: '122'
            }
        ]
    }]
}];

// 获取所有的key
function getTreeKey(arr, newArr = []) {
    arr.forEach(item => {
        // 先判断当前项是否是对象，当前项是否存在你想要的数据，都符合，把数据push到新数组里
        typeof item === 'object' && item.key && newArr.push(item.key);
        // 当前项是否还有子节点，子元素是否是数组，如果是继续递归
        item.children && item.children instanceof Array && getTreeKey(item.children, newArr);
    })
    return newArr;
}

getTreeKey(data);
// ['1','11','12','111','112','121','122']
```