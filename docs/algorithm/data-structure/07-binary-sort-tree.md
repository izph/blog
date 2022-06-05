---
title: 二叉排序树
date: 2021-04-02 13:38:51
permalink: /algorithn/data-structure/binary-sort-tree
categories:
  - 数据结构
tags:
  - 数据结构
---
# 二叉排序树（BST）

二叉排序树（Binary Sort Tree），又称二叉查找树（Binary Search Tree），亦称二叉搜索树。

二叉排序树具有下列性质的二叉树：

1. 若左子树不空，则左子树上所有节点的值均小于它的根节点值；
2. 若右子树不空，则右子树上所有节点的值均大于它的根节点值；
   左、右子树也分别为二叉排序树；
3. 没有键值相等的节点。
4. 对于一个二叉排序树，常规操作有插入，查找，删除，找父点，求最大值，求最小值。

## 二叉排序树的封装

```js
// 使用了 ES6 的 Class 语法
class BinarySearchTree {
  constructor() {
    this.root = null
  }
  // 二叉搜索树中的节点
  Node(key) {
    let left = null
    let right = null
    return {
      key,
      left,
      right
    }
  }
  insert(key) {
    let newNode = this.Node(key)
    if (this.root === null) {
      // 如果根节点为空，那么插入的节点就为根节点
      this.root = newNode
    } else {
      // 如果根节点不为空
      this.insertNode(this.root, newNode)
    }
  }
  insertNode(node, newNode) {
    // 当新节点比父节点小，插入左边
    if (newNode.key < node.key) {
      // 左边没有内容则插入
      if (node.left === null) {
        node.left = newNode
      } else {
        // 有内容就继续递归，直到没有内容然后可以插入
        this.insertNode(node.left, newNode)
      }
    } else {
      // 右边和左边相同，不重复说明
      if (node.right === null) {
        node.right = newNode
      } else {
        this.insertNode(node.right, newNode)
      }
    }
  }
  // 中序遍历
  inOrderTraverse(callback) {
    this.inOrderTraverseNode(this.root, callback)
  }
  inOrderTraverseNode(node, callback) {
    if (node !== null) {
      this.inOrderTraverseNode(node.left, callback)
      callback(node.key)
      this.inOrderTraverseNode(node.right, callback)
    }
  }
  pretraverse(callback) {
    this.pretarversenode(this.root, callback)
  }
  pretraversenode(node, callback) {
    if (node !== null) {
      callback(node.key)
      this.pretraversenode(node.left, callback)
      this.pretraversenode(node.right, callback)
    }
  }
  // 先序遍历
  preOrderTraverse(callback) {
    this.preOrderTraverseNode(this.root, callback)
  }
  preOrderTraverseNode(node, callback) {
    if (node !== null) {
      callback(node.key)
      this.preOrderTraverseNode(node.left, callback)
      this.preOrderTraverseNode(node.right, callback)
    }
  }
  // 后序遍历
  postOrderTraverse(callback) {
    this.postOrderTraverseNode(this.root, callback)
  }
  postOrderTraverseNode(node, callback) {
    if (node !== null) {
      this.postOrderTraverseNode(node.left, callback)
      this.postOrderTraverseNode(node.right, callback)
      callback(node.key)
    }
  }
  // 搜索最小
  min() {
    return this.minNode(this.root)
  }
  minNode(node) {
    if (node) {
      // 如果节点存在，而且左边不为 null
      while (node && node.left !== null) {
        node = node.left
      }
      return node.key
    }
    // 如果树为空，则返回 null
    return null
  }
  // 搜索最大
  max() {
    return this.maxNode(this.root)
  }
  maxNode(node) {
    if (node) {
      while (node && node.right !== null) {
        node = node.right
      }
      return node.key
    }
    return null
  }
  search(key) {
    return this.searchNode(this.root, key)
  }
  searchNode(node, key) {
    console.log('node-', node, '---', node === null, '-key-', key)
    if (node === null) {
      return false
    }
    // 如果 key 比节点的值小，那么搜索左边的子节点，下面的相反
    if (key < node.key) {
      return this.searchNode(node.left, key)
    } else if (key > node.key) {
      return this.searchNode(node.right, key)
    } else {
      console.log('didi')
      return true
    }
  }
  invertTree(node = this.root) {
    if (node === null) {
      return
    }
    this.invertTree(node.left)
    this.invertTree(node.right)
    this.exchange(node)
  }
  exchange(node) {
    let temp = node.left
    node.left = node.right
    node.right = temp
  }
}
// const printNode = (value) => console.log(value);
let bst = new BinarySearchTree()
bst.insert(5)
bst.insert(4)
bst.insert(3)
bst.insert(6)
bst.insert(7)
console.log(bst)
console.log(bst.search(9))
// 传入回调函数，输出节点的值
const printNode = (value) => console.log(value);
console.log(bst.preOrderTraverse(printNode))
console.log(bst.inOrderTraverse(printNode))
console.log(bst.postOrderTraverse(printNode))
```
