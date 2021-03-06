---
title: 二叉树
date: 2021-01-27 22:12:36
permalink: /algorithm/leetcode/binary-tree
categories:
  - LeetCode
tags:
  - 算法
  - 二叉树
---
# 二叉树

## 二叉树的特性

- 一个二叉树的第 i 层的最大节点树为：2^(i-1)，i >= 1；
- 深度为 k 的二叉树的最大节点总数为：2^k - 1 ，k >= 1；
- 对任何非空二叉树，若 n0 表示叶子节点的个数，n2表示度为 2 的非叶子节点个数，那么两者满足关系：n0 = n2 + 1；

## 1、二叉树的最大深度

给定一个二叉树，找出其最大深度，叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

```javascript
给定二叉树 [3,9,20,null,null,15,7], 返回它的最大深度 3 。
    3
   / \
  9  20
    /  \
   15   7
```

### 题解：递归或者迭代(BFS)

```javascript
// 递归写法
var maxDepth = function(root) {
    if(!root){
        return 0;
    }
    return Math.max(maxDepth(root.left),maxDepth(root.right)) +  1;
};
// 迭代写法，广度优先遍历BFS
var maxDepth = function(root) {
    if(!root){
        return 0;
    }
    let count = 0;
    let res = [root];
    while(res.length){
        let len = res.length;
        while(len > 0){
            const item = res.shift();
            if(item.left){
                res.push(item.left)
            }
            if(item.right){
                res.push(item.right)
            }
            len--;
        }
        count++;
    }
    return count;
};
```

## 2、对称的二叉树

请实现一个函数，用来判断一棵二叉树是不是对称的。如果一棵二叉树和它的镜像一样，那么它是对称的。

```javascript
例如，二叉树 [1,2,2,3,4,4,3] 是对称的。

    1
   / \
  2   2
 / \ / \
3  4 4  3
```

### 题解：

```javascript
// 节点值相等
// node1的左子树和node2的右子树是镜像
// node1的右子树和node2的左子树是镜像
var isSymmetric = root => {
    if (!root) return true;
    // 判断两个二叉树是否镜像
    const check = (node1, node2) => {
        // 两个空树，true
        if (!node1 && !node2) return true;
        // 只有一个空树，false
        if (!node1 || !node2) return false;
        // 左右子树同时存在 但值不同 也不为镜像
        if (node1.val !== node2.val) return false 
        // 镜像的条件：
        // 1. 节点值相等
        // 2. node1的左子树和node2的右子树是镜像
        // 3. node1的右子树和node2的左子树是镜像
        return check(node1.left, node2.right) && check(node1.right, node2.left);
  
    };
    // 判断树的两个子树是否镜像即可
    return check(root.left, root.right);
};

// 迭代
// 利用层序遍历的思想，一层一层判断，是否对称
var isSymmetric = root => {
    if (!root) return true;
    // 根节点的左右节点入队
    const queue = [root.left, root.right];
    while (queue.length) {
        // 当前队列的长度
        const len = queue.length;
        // 每次对比两个节点，所以i=i+2
        for (let i = 0; i < len; i += 2) {
            // 两个节点出队
            const left = queue.shift();
            const right = queue.shift();
            // 有一个为空，另一个不为空，直接返回false
            if ((left && !right) || (!left && right)) return false;
            // 两节点都不为空
            if (left && right) {
                // 值不相等，返回false
                if (left.val !== right.val) return false;
                // 将两个节点的左右节点，按照对应关系入队
                queue.push(left.left, right.right, left.right, right.left);
            }
        }
    }
    // 遍历结束返回true
    return true;
};
```

## 3、二叉树的镜像

请完成一个函数，输入一个二叉树，该函数输出它的镜像。

```javascript
例如输入：

     4
   /   \
  2     7
 / \   / \
1   3 6   9
镜像输出：

     4
   /   \
  7     2
 / \   / \
9   6 3   1

输入：root = [4,2,7,1,3,6,9]
输出：[4,7,2,9,6,3,1]
```

### 题解：

```javascript
// 递归解法
var mirrorTree = function(root) {
    if(root){
        const temp = root.right; // 临时变量
        root.right = root.left; // 交换
        root.left = temp;  // 交换
        mirrorTree(root.right);
        mirrorTree(root.left);
    }
    return root;
};
// 迭代解法
var mirrorTree = function(root) {
    if (root == null) return null;
    let queue = [root];
    while(queue.length) {
        let node = queue.shift();
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
        let tmp = node.left;
        node.left = node.right;
        node.right = tmp;
    }
    return root;
};
```

## 4、二叉树的最小深度

给定一个二叉树，找出其最小深度。最小深度是从根节点到最近叶子节点的最短路径上的节点数量。

![img](./images/algorithm/111.png)

```javascript
输入：root = [3,9,20,null,null,15,7]
输出：2
```

### 题解:

```javascript
// 左右子树都不为空：左子树深度和右子树最小深度的最小值 + 1
// 左树为空：右子树最小深度的最小值 + 1
// 右树为空：左子树最小深度 + 1
var minDepth = function(root) {
    if (!root) {
        return 0;
      }
      if (!root.left) {
        return 1 + minDepth(root.right);
      }
      if (!root.right) {
        return 1 + minDepth(root.left);
      }
      return Math.min(minDepth(root.left), minDepth(root.right)) + 1;
};

var minDepth = function (root) {
  if (root == null) return 0;
  // 根节点入列
  const queue = [root];
  // root本身就是一层，将depth初始化为1
  let depth = 1;
  // 直到清空队列
  while (queue.length) {
    let size = queue.length;
    // 将当前队列中的所有节点向四周扩散
    for (let i = 0; i < size; i++) {
      let cur = queue.shift();
      // 判断是否到达终点 如果没有孩子，直接返回所在层数
      if (cur.left == null && cur.right == null) {
        return depth;
      }
      // 将cur的相邻节点加入队列
      if (cur.left != null) {
        queue.push(cur.left);
      }
      if (cur.right != null) {
        queue.push(cur.right);
      }
    }
    // 在这里增加步数
    depth++;
  }
  return depth;
};
```

## 5、从上到下打印二叉树

从上到下打印出二叉树的每个节点，同一层的节点按照从左到右的顺序打印。

```javascript
例如:
给定二叉树: [3,9,20,null,null,15,7], 返回[3,9,20,15,7]
    3
   / \
  9  20
    /  \
   15   7
```

### 题解：BFS广度优先遍历

```javascript
var levelOrder = function(root) {
    if(!root) return [];
    let res = [];
    let queue = [root];
    while(queue.length){
        let root = queue.shift();
        res.push(root.val);
        if(root.left){
            queue.push(root.left);
        }
        if(root.right){
            queue.push(root.right);
        }
    }
    return res;
};
```

## 6、二叉树的中序遍历

给定一个二叉树的根节点 `root` ，返回它的 **中序** 遍历

### 题解：中序遍历：左、中、右

```javascript
// 二叉树的中序遍历
 // 中序遍历：左、中、右
var inorderTraversal = function(root) {
    if(!root){
        return [];
    }
    let res = [];
    const inorder = function(root){
        if(root){
            inorder(root.left);
            res.push(root.val);
            inorder(root.right);
        }
    }
    inorder(root);
    return res
};
```

## 7、二叉树的前序遍历

给你二叉树的根节点 `root` ，返回它节点值的 **前序** 遍历

### 题解：前序遍历：根、左、右

```javascript
var preorderTraversal = function(root) {
    let res = [];
    const preorderorder = function(root){
        if(root){
            res.push(root.val);
            preorderorder(root.left);
            preorderorder(root.right);
        }
    }
    preorderorder(root);
    return res;
};

var preorderTraversal = function (root) {
    if(!root)  return []; //判空 如果root是空 直接返回空
    let res = []; //存放遍历后结果
    let stack = []; //用到的栈
    stack.push(root) //先将整个root入栈
    while(stack.length){ //当栈为空时 遍历完毕
        let node = stack.pop() //出栈 这里是指针
        //可以在这里将node打印出来 更直观
        node.val ? res.push(node.val) : ''; //判断树的根 入结果数组
        node.right ? stack.push(node.right) : ''; //判断树的右子树 入栈
        node.left ? stack.push(node.left) : ''; //判断树的左子树 入栈
    }
    return res;
};
```

## 8、二叉树的路径总和

给你二叉树的根节点 root 和一个表示目标和的整数 targetSum 。判断该树中是否存在 根节点到叶子节点 的路径，这条路径上所有节点值相加等于目标和 targetSum 。如果存在，返回 true ；否则，返回 false 。

![img](./images/algorithm/112.png)

```javascript
输入：root = [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null , 1], targetSum = 22
输出：true
```

### 题解：递归，减法

```javascript
var hasPathSum = (root, sum) => {
  if (root == null) { // 遍历到null节点
    return false;
  }  
  if (root.left == null && root.right == null) { // 遍历到叶子节点
    return sum - root.val === 0;                  // 如果满足这个就返回true。否则返回false
  }
  // 不是上面的情况，则拆成两个子树的问题，其中一个true了就行
  return hasPathSum(root.left, sum - root.val) || hasPathSum(root.right, sum - root.val); 
}
```

## 9、二叉树的层序遍历

给你二叉树的根节点 `root` ，返回其节点值的 **层序遍历** ，即逐层地，从左到右访问所有节点。

![img](./images/algorithm/102.png)

```javascript
输入：root = [3,9,20,null,null,15,7], 输出：[[3],[9,20],[15,7]]
输入：root = [1], 输出：[[1]]
```

### 题解：

```javascript
// 广度度优先遍历bfs
// 思路：准备一个队列，将根节点加入队列，当队列不为空的时候循环队列，每次循环拿到当前队列的大小，
// 在循环当前层的每个元素，然后加入输出数组res中，如果这个元素存在左右节点则将左右节点加入队列
// 复杂度分析：时间复杂度 O(n)，每个点进队出队各一次，故渐进时间复杂度为 O(n)。
// 空间复杂度O(n)，队列中元素的个数不超过 n 个
var levelOrder = function (root) {
    const res = [];
    if (!root) {
        return res;
    }
    const q = [];
    q.push(root); //初始队列
    while (q.length !== 0) {
        //当前层节点的数量
        const currentLevelSize = q.length;
        //新的层推入数组
        res.push([]);  
        for (let i = 1; i <= currentLevelSize; ++i) { //循环当前层的节点
            const node = q.shift();
            //推入当前层的数组
            res[res.length - 1].push(node.val);
            if (node.left) {
                //检查左节点，存在左节点就继续加入队列
                q.push(node.left);
            }
            if (node.right) {
                //检查左右节点，存在右节点就继续加入队列
                q.push(node.right);
            }
        }
    }
    return res;
};

var levelOrder = function (root) {
  const res = [];
  function traversal(root, depth) {
    if (root !== null) {
      // 如果这一层级没有的情况下，初始化为空数组
      if (!res[depth]) res[depth] = [];
      res[depth].push(root.val);
      // 保证左子节点在右子节点前面就行，这样入队列的情况下也能保持左右顺序
      traversal(root.left, depth + 1);
      traversal(root.right, depth + 1);
    }
  }
  traversal(root, 0);
  return res;
};
```

## 10、求二叉树的根节点到叶节点数字之和

给你一个二叉树的根节点 root ，树中每个节点都存放有一个 0 到 9 之间的数字。每条从根节点到叶节点的路径都代表一个数字：例如，从根节点到叶节点的路径 1 -> 2 -> 3 表示数字 123 。计算从根节点到叶节点生成的 所有数字之和 。

![img](./images/algorithm/129.png)

```javascript
输入：root = [4,9,0,5,1], 输出：1026
解释：
从根到叶子节点路径 4->9->5 代表数字 495
从根到叶子节点路径 4->9->1 代表数字 491
从根到叶子节点路径 4->0 代表数字 40
因此，数字总和 = 495 + 491 + 40 = 1026
```

### 题解：

```javascript
//  DFS，先遍历节点4，遍历到9时，就有 4 * 10 + 9，为 49，再遍历到5时，有 49 * 10 + 5，为 495。
// 一个递归分支维护一个 cur 变量，在下探的过程中计算，更新 cur。

// cur = 10 * cur + root.val;
// 当遍历到叶子节点时，当前分支计算结束，返回 cur。

// 遍历到非叶子节点时，基于当前cur，递归计算左右子分支，并把结果相加：

// if (root.left == null && root.right == null) {
//   return cur;
// }
// return helper(root.left, cur) + helper(root.right, cur);
// 注意这里默认root.left和root.right是存在的，如果不存在呢？或者，递归入口传的 root 就不存在呢？

// 设置一个递归的出口：当遍历到 null 时，不存在 root.val，直接返回 0（cur已经在叶子节点处返回了）
var sumNumbers = function(root) {
    const helper = (root, cur) => {
    if (root == null) {
      return 0;
    }
    cur = 10 * cur + root.val;
    if (root.left == null && root.right == null) {
      return cur;
    }
    return helper(root.left, cur) + helper(root.right, cur);
  };
  return helper(root, 0);

};
```

## 11、二叉树的右视图

给定一个二叉树的 **根节点** `root`，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。

![img](./images/algorithm/199.png)

```javascript
输入: [1, 2, 3, null, 5, null, 4], 输出: [1, 3, 4]
```

### 题解：

```javascript
// DFS
 var rightSideView = function(root) {
  if(!root) return [];
  let res = [];
  const dfs =  (root, step, res) => {
    if(root){
        if(res.length === step){
            // 当数组长度等于当前 深度 时, 把当前的值加入数组
            res.push(root.val);
        }
        // 先从右边开始, 当右边没了, 再轮到左边
        dfs(root.right, step + 1, res);
        dfs(root.left, step + 1, res);
    }
}
  dfs(root, 0, res);
  return res;
};

// BFS
var rightSideView = function(root) {
  if(!root) return [];
  let queue = [root];                    // 队列 把树顶加入队列
  let arr = [];                             // 用来存储每层最后个元素值
  while(queue.length > 0){
    let len = queue.length;
    while (len) {
      let node = queue.shift()               // 取出队列第一个元素
      if(len === 1) arr.push(node.val);       // 当是 当前一层的最后一个元素时，把值加入arr
      if(node.left) queue.push(node.left);    // 继续往队列添加元素
      if(node.right) queue.push(node.right);
      len--;
    }
  }
  return arr;
};
```

## 12、相同的树

给你两棵二叉树的根节点 `p` 和 `q` ，编写一个函数来检验这两棵树是否相同。如果两个树在结构上相同，并且节点具有相同的值，则认为它们是相同的。

### 题解：

```javascript
//  解题思路
// 标签：深度优先遍历
// 终止条件与返回值：
// 当两棵树的当前节点都为 null 时返回 true
// 当其中一个为 null 另一个不为 null 时返回 false
// 当两个都不为空但是值不相等时，返回 false
// 执行过程：当满足终止条件时进行返回，不满足时分别判断左子树和右子树是否相同，其中要注意代码中的短路效应
// 时间复杂度：O(n)O(n)，nn 为树的节点个数
var isSameTree = function(p, q) {
    if(p == null && q == null) return true;
    if(p == null || q == null) return false;
    if(p.val != q.val) return false;
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
};
```

## 13、二叉树的所有路径

给你一个二叉树的根节点 `root` ，按 **任意顺序** ，返回所有从根节点到叶子节点的路径。

![img](./images/algorithm/257.png)

```javascript
输入：root = [1,2,3,null,5]
输出：["1->2->5","1->3"]
```

### 题解：

```javascript
var binaryTreePaths = function(root) {
  const res = [];
  const helper = (root, pathStr) => {
    if (root == null) { // 遍历到null
      return;           // 结束当前递归分支
    }
    // 遍历到叶子节点
    if (root.left == null && root.right == null) { 
      pathStr += root.val; // 路径末尾了，不用加箭头
      res.push(pathStr);   // 加入解集
      return;
    }
    // 处理非叶子节点，要加箭头
    pathStr += root.val + '->'; 
    // 基于当前的pathStr，递归左子树
    helper(root.left, pathStr); 
    // 基于当前的pathStr，递归右子树
    helper(root.right, pathStr); 
  };

  helper(root, '');
  return res;
};
```

## 14、重建二叉树

输入某二叉树的前序遍历和中序遍历的结果，请构建该二叉树并返回其根节点。假设输入的前序遍历和中序遍历的结果中都不含重复的数字。

![img](./images/algorithm/07.png)

```javascript
Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
Output: [3,9,20,null,null,15,7]

Input: preorder = [-1], inorder = [-1]
Output: [-1]
```

### 题解：

```javascript
// 解题思路
// 先序遍历：[根，左，右]
// 中序遍历：[左，根，右]

// 先序遍历的第一个元素是根节点，在中序遍历中，根据根节点分出左子树和右子树节点数量
// 从先序遍历中按照找到的左右子树的节点数，分出左右子树的先序遍历结果
// 将左右子树先序遍历的结果递归，最终构建出整个树
// 优化
// 一棵树可能会有很多子树，每个子树都有根节点，如果每次都遍历中序数组，会浪费性能，我们可以用 Map 将中序数组的值和下标存起来，方便每次递归查找。

var buildTree = function(preorder, inorder) {
    // 存放中序遍历每个值的下标
  let rootMap = new Map(); // 9,0   3,1   15,2   20,3   7,4
  for(let i = 0; i < inorder.length; i++){
    rootMap.set(inorder[i], i);
  }
  return fn(0, 0, inorder.length - 1);
  //三个参数分别对应 先序中根节点位置，中序中的左边界，中序中的右边界
  function fn(root, left, right){
    if(left > right) return null;

    // 新建节点
    let node = new TreeNode(preorder[root]);
    //拿到在中序遍历中的位置
    let site = rootMap.get(preorder[root]);

    // 递归左子树
    node.left = fn(root + 1, left, site - 1);
    // 递归右子树，根节点位置：root + 左子树节点数 + 1
    node.right = fn(root + site - left + 1, site + 1, right);

    return node;
  }
};
```

## 14、二叉树的最近公共祖先

给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

![img](./images/algorithm/68.png)

```javascript
输入: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
输出: 3
解释: 节点 5 和节点 1 的最近公共祖先是节点 3。

输入: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
输出: 5
解释: 节点 5 和节点 4 的最近公共祖先是节点 5。因为根据定义最近公共祖先节点可以为节点本身。
```

### 题解：

由于lowestCommonAncestor(root, p, q)的功能是找出以root为根节点的两个节点p和q的最近公共祖先。 我们考虑：

- 如果p和q分别是root的左右节点，那么root就是我们要找的最近公共祖先
- 如果root是None，说明我们在这条寻址线路没有找到，我们返回None表示没找到
- 我们继续在左右子树执行相同的逻辑。
- 如果左子树没找到，说明在右子树，我们返回lowestCommonAncestor(root.right, p , q)
- 如果右子树没找到，说明在左子树，我们返回lowestCommonAncestor(root.left, p , q)
- 如果左子树和右子树分别找到一个，我们返回root

```javascript
var lowestCommonAncestor = function(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (!left) return right; // 左子树找不到，返回右子树
  if (!right) return left; // 右子树找不到，返回左子树
  return root;
};

```
