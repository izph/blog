---
title: 链表LinkedList的封装
date: 2021-04-05 19:32:11
permalink: /algorithn/data-structure/linkedlist
categories:
  - 数据结构
tags:
  - 数据结构
---
# 链表LinkedList的封装

```js
// 封装链表的构造函数
function LinkedList() {
    // 封装一个Node类, 用于保存每个节点信息
    function Node(element) {
        this.element = element
        this.next = null
    }
    // 链表中的属性
    this.length = 0
    this.head = null
    // 链表尾部追加元素方法
    LinkedList.prototype.append = function (element) {
        // 1.根据新元素创建节点
        var newNode = new Node(element)
        // 2.判断原来链表是否为空
        if (this.head === null) { // 链表尾空
            this.head = newNode
        } else { // 链表不为空
            // 2.1.定义变量, 保存当前找到的节点
            var current = this.head
            while (current.next) {
                current = current.next
            }
            // 2.2.找到最后一项, 将其next赋值为node
            current.next = newNode
        }
        // 3.链表长度增加1
        this.length++
    }
    // 链表的toString方法
    LinkedList.prototype.toString = function () {
        // 1.定义两个变量
        var current = this.head
        var listString = ""
        // 2.循环获取链表中所有的元素
        while (current) {
            listString += "," + current.element
            current = current.next
        }
        // 3.返回最终结果
        return listString.slice(1)
    }
    // 根据下标删除元素
    LinkedList.prototype.insert = function (position, element) {
        // 1.检测越界问题: 越界插入失败
        if (position < 0 || position > this.length) return false
        // 2.定义变量, 保存信息
        var newNode = new Node(element)
        var current = this.head
        var previous = null
        index = 0
        // 3.判断是否列表是否在第一个位置插入
        if (position == 0) {
            newNode.next = current
            this.head = newNode
        } else {
            while (index++ < position) {
                previous = current
                current = current.next
            }
            newNode.next = current
            previous.next = newNode
        }
        // 4.length+1
        this.length++
        return true
    }
    // 根据位置移除节点
    LinkedList.prototype.removeAt = function (position) {
        // 1.检测越界问题: 越界移除失败, 返回null
        if (position < 0 || position >= this.length) return null
        // 2.定义变量, 保存信息
        var current = this.head
        var previous = null
        var index = 0
        // 3.判断是否是移除第一项
        if (position === 0) {
            this.head = current.next
        } else {
            while (index++ < position) {
                previous = current
                current = current.next
            }
            previous.next = current.next
        }
        // 4.length-1
        this.length--
        // 5.返回移除的数据
        return current.element
    }
    // 根据元素获取链表中的位置
    LinkedList.prototype.indexOf = function (element) {
        // 1.定义变量, 保存信息
        var current = this.head
        index = 0
        // 2.找到元素所在的位置
        while (current) {
            if (current.element === element) {
                return index
            }
            index++
            current = current.next
        }
        // 3.来到这个位置, 说明没有找到, 则返回-1
        return -1
    }
    // 根据元素删除信息
    LinkedList.prototype.remove = function (element) {
        var index = this.indexOf(element)
        return this.removeAt(index)
    }
    // 判断链表是否为空
    LinkedList.prototype.isEmpty = function () {
        return this.length == 0
    }
    // 获取链表的长度
    LinkedList.prototype.size = function () {
        return this.length
    }
    // 获取第一个节点
    LinkedList.prototype.getFirst = function () {
        return this.head.element
    }
}
```
