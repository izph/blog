---
title: 常见排序算法
date: 2021-01-05 16:22:38
permalink: /algorithm/leetcode/sort
categories:
  - LeetCode
tags:
  - 算法
  - 排序
---
# 常见的排序

我们常说的稳定的算法是指，值相等的元素保持排序前的相对顺序不变。
举个例子，A2和A4的位置都是3。对于稳定排序来说，排序后的序列，a2一定还是在a4前面。但是对于非稳定排序来说，就不一定了，可能排完序之后，a4反而在a2的前面了。

## 冒泡排序（稳定排序）

- 时间复杂度最好O(n)，最坏O(n2)，平均时间复杂度O(n2)
- 相邻元素比较，大的往后放，每趟排完，最大元素位置已经排好

```javascript
// 常规
function bubbleSort(arr) {
  const len = arr.length;
  // 外层循环i控制比较的轮数
  for (let i = 0; i < len; i++) {
    // 里层循环控制每一轮比较的次数j，arr[i] 只用跟其余的len - i个元素比较
    for (let j = 1; j < len - i; j++) {
      // 若前一个元素"大于"后一个元素，则两者交换位置
      if (arr[j - 1] > arr[j]) {
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
      }
    }
  }
  return arr;
}
```

### 优化后的冒泡排序

遍历一圈后，如果没有将flag 置为 0，则说明已经不需要交换，完成了整个排序

```javascript
function bubble(arr) {  // [1, 3, 2, 4]
  // 需要排序n-1趟
  for (let i = 0; i < arr.length; i++) {
    let flag = i;
    for (let j = 1; j < arr.length - i; j++) {
      // 碰到前面比后面大的数，进行交换
      if (arr[j - 1] > arr[j]) {
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
        flag = 0;
      }
    }
    // 没有冒泡结束循环
    if (flag) {
      break;
    }
  }
  return arr;
}
```

## 插入排序（稳定排序）

- 最好O(n)，最坏O(n2)，平均时间复杂度O(n2)
- 从arr[1]开始，与前面元素相比，小的往前放，大的往后放
  （将左侧序列看成一个有序序列，每次将一个数字插入该有序序列。插入时，从有序序列最右侧开始比较，若比较的数较大，后移一位。）

```javascript
function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    // 将arr[i]插入到arr[i-1]，arr[i-2]，arr[i-3]……之中
    for (let j = i; j > 0; j--) {
      if (arr[j] < arr[j - 1]) {
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
      }
    }
  }
  return arr
}
```

### 优化后的插入排序

再次遍历时 arr[target] < arr[j] 不满足，并且arr[j]往前的是有序的，则说明arr[j]往前的元素不在需要比较，没有优化的排序算法是需要比较的。

```javascript
function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let target = i;
    for (let j = i - 1; j >= 0; j--) {
      if (arr[target] < arr[j]) {
        [arr[target], arr[j]] = [arr[j], arr[target]];
        // 把j赋值给 target  再次遍历时 arr[target] < arr[j] 不满足
        // 执行break 跳过此时循环(主要作用)
        target = j;
      } else {
        break;
      }
    }
  }
  return arr;
}
// test
console.log(insertSort([7, 3, 5, 9, 4, 1]))
```

## 归并排序（稳定排序）

- 平均复杂度O(nlog n)
- 一直把数组递归到单个元素成有序数组，然后合并

```javascript
function mergeSort(arr) {
  var len = arr.length;
  if (len <= 1) {
    return arr;
  }
  // var mid = parseInt(len / 2);
  var mid = Math.floor(len / 2);
  var leftArr = arr.slice(0, mid);
  var rightArr = arr.slice(mid);
  return merge(mergeSort(leftArr), mergeSort(rightArr))
}
// 合并有序数组的方法   与 合并两个有序的链表类似
function merge(leftArr, rightArr) {
  const temp = [];
  while (leftArr.length && rightArr.length) {
    if (leftArr[0] < rightArr[0]) {
      temp.push(leftArr.shift());
    } else {
      temp.push(rightArr.shift());
    }
  }
  while (leftArr.length) {
    temp.push(leftArr.shift());
  }
  while (rightArr.length) {
    temp.push(rightArr.shift());
  }
  return temp;
}


const mergeSort = function(arr) {
  if (arr.length < 2){ return arr }
  const mid = Math.floor(arr.length / 2)
  const left = arr.splice(0, mid) //用 array.splice 取代 array.slice，减少一半的空间消耗。
  const right = arr
  return mergeFn(mergeSort(left), mergeSort(right))
}

const mergeFn = function(left, right) {
  const result = []
  while (left.length > 0 && right.length > 0) {
    if (left[0] <= right[0]) {
      // left.shift()  从left数组前面删除元素据，返回shift()方法返回被删除的元素
      result.push(left.shift())
    } else {
      result.push(right.shift())
    }
  }
	//只要left,right数组其中一个长度为0，则将另外数组剩余的元素直接添加到result数组后面
  return [...result, ...left, ...right]
}
```

## 选择排序（不稳定）

- 平均复杂度 O(n2)
- 每趟找到最小元素，与前面排好序的最后一位交换

```javascript
function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    [arr[minIndex], arr[i]] = [arr[i], arr[minIndex]];
  }
  return arr;
}
```

## 快速排序（不稳定）

- 平均复杂度 O(nlog n)
- 选定数组中的一个数，比如第一个或者中间那个，比它小的放在左边，比它大的放在右边，递归依次进行。

```javascript
function quickSort(arr) {
  // 出现空数组或者只有一个元素的数组就直接返回
  if (arr.length < 2) {
    return arr;
  }
  // 数组元素大于等于2的情况
  // 选取第一个数
  const num = arr[0];
  const left = [];
  const right = [];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] <= num) {
      left.push(cur);
    } else {
      right.push(cur);
    }
  }

  return [...quickSort(left), num, ...quickSort(right)];
}


// 快排写法二  快速排序原地排序
// 时间复杂度：平均O(nlogn)，最坏O(n2)，实际上大多数情况下小于O(nlogn)
// 空间复杂度: O(logn)（递归调用消耗）
// 记录一个索引l从数组最左侧开始，记录一个索引r从数组右侧开始
// 在l < r的条件下，找到右侧小于target的值arr[r]，并将其赋值到arr[l]
// 在l < r的条件下，找到左侧大于target的值arr[l]，并将其赋值到arr[r]
// 这样让l = r时，左侧的值全部小于target，右侧的值全部小于target，将target到该位置
// 不需要额外存储空间，写法思路稍复杂（有能力推荐这种写法）
function quickSort(arr, start, end) {
  if (end < start) {
    return;
  }
  const target = arr[start];
  let l = start;
  let r = end;
  while (l < r) {
    while (l < r && arr[r] >= target) {
      r--;
    }
    arr[l] = arr[r];
    while (l < r && arr[l] < target) {
      l++;
    }
    arr[r] = arr[l];
  }
  arr[l] = target;
  quickSort(arr, start, l - 1);
  quickSort(arr, l + 1, end);
  return arr;
}
console.log(`quickSort`, quickSort([7, 3, 5, 9, 4, 1], 0, 5))

/*
 * 快速排序算法，非递归实现
* 主要思想：利用栈实现
* 过程：快速排序的思想就是分治法，第一趟将序列分成两部分，每一部分都可以看一个小的序列，可以将小的序列最左最右指针下表入栈。
* @param { number[] } arr
* @param { number } left
* @param { number } right
*/
let quickSort = (arr, left, right) => {
  let stack = []; //js中用数组模拟栈
  stack.push(left); //左指针入栈
  stack.push(right); //右指针入栈
  while (stack.length > 0) {  //栈不为空时，说明还有序列没有排序好
    let right = stack.pop();//后进先出，栈顶元素出栈，是为待排序列的最右下标（指针）
    let left = stack.pop(); //栈顶元素出栈，是为待排序列的最左下标（指针）
    let index = partition(arr, left, right);  //划分，将待排序列进行一趟快速排序，最终有一个数获得最终位置，其下标为index
    if (left < index - 1) { //将index将待排序列分为两部分
      stack.push(left); //左边那部分左指针入栈
      stack.push(index - 1);//左边那部分右指针入栈
    }
    if (right > index + 1) {  //右边部分入栈
      stack.push(index + 1);
      stack.push(right);
    }
  }
  return arr;  //返回数组
}
```
