---
title: 写出高质量的JS代码
date: 2020-12-20 11:28:51
permalink: /front-end/javascript/high-quality-code
categories:
  - 前端
  - JavaScript
tags:
  - 前端
  - JavaScript
---
- 尽量少用全局变量，带来的第三方的 JavaScript 库、不同js文件同名变量的冲突。
- 尽量使用 === ，减少==的隐式转化
- 构造函数和组件首字母要大写，其他一般采取小驼峰命名。
- 使用空格分开所有的操作符和操作对象，在+，-，*，=，<，>，<=，>=，===，!==，&&，||，+=等前后都需要空格。
- ......

### 一 、注释代码

```javascript
//1、一个函数解决一个问题的注释
const fun = () => {}

//2、多个函数实现某个功能
  //当按钮点击时——begin
  const fun_01 = () => {}
  const fun_02 = () => {}
  const fun_03 = () => {}
  //当按钮点击时——end
```

### 二、你更习惯哪种写法读取属性值？推荐——解构赋值

#### 1、代码冗余、不高效、不直观代

```javascript
handleResizerMove = (event) => {
    if (this.props.visible) {
        let newmoveX = this.state.moveX + (event.clientX - this.state.x);
        if (this.props.defaultwidth + newmoveX < this.props.minwidth) {
            newmoveX = this.props.minwidth - this.props.defaultwidth;
            this.setState({
                left: this.props.left + newmoveX,
                x: event.clientX,
                moveX: newmoveX
            });
            this.props.onChange && this.props.onChange(event, this.props.moveX, this.props.dataSource);
            Event.stopPropagation(event);
        }
    }
}
```

#### 2、推荐写法：解构赋值读取属性值

```javascript
handleResizerMove = (event) => {
    const { visible, left, dataSource, onChange, defaultwidth, minwidth } = this.props;
    const { x, moveX } = this.state;
    if (visible) {
        //计算出移动的距离，向左移动则值小于0，右右移动则值大于0
        let newmoveX = moveX + (event.clientX - x);
        if (defaultwidth + newmoveX < minwidth) {
            //超过最小宽度则使用最小宽度
            newmoveX = minwidth - defaultWidth;
        }
        this.setState({ left: left + newmoveX, x: event.clientX, moveX: newmoveX });
        onChange && onChange(event, moveX, dataSource);
        Event.stopPropagation(event);
    }
}
```

### 三、if多条件简化写法

```javascript
  // 不推荐这样写：
  let test;
  if (x > 10) {
     test = true;
  } else {
     test = false;
  }

  // 推荐做法：
  let test = (x > 10) ? true : false;
  // 或者
  let test = x > 10;

  // 不推荐:
  if (x === 'a' || x === 'b' || x === 'c' || x ==='d') {
     //do something
  }

  // 推荐做法：
  if(['a', 'b', 'c', 'd'].includes(x)) {
     //do something
  }

```

### 四、方法调用简化写法

```javascript
// 不推荐：
var test = 1;
if (test === 1) {
   helper1();
} else {
   helper2();
}

// 推荐做法：
test === 1 ? helper1() : helper2();
// 或者
(test === 1 ? helper1 : helper2)();

// 不推荐:
if (condition) {
   callMethod(); 
}
// 推荐做法：
condition && callMethod();
```

### 五、默认属性写法

```javascript
let test1 = 0;
let test2 = 'value';
let test3 = {};
// 优化写法:
let [test1, test2, test3] = [0, 'value', {}];


if (test === undefined){
 test = 1;
}
// 推荐写法:
test = test || 1;
```

### 六、属性排除写法

排除某些对象的属性，不需要使用第三方库，可以直接使用解构赋值。

```javascript
import omit from 'omit.js'; // 引入第三方库
// 场景：去掉props对象的某些属性，把剩余属性放到other对象中。
let props={
  'inputIcon':'a',
  'removeIcon','b',
  'clearIcon':'c',
  'switcherIcon':'d',
  'type':1,
  'status':2,
  info:{},
  visible:true
}
// 不太推荐的做法：
const others= omit(props, ['inputIcon', 'removeIcon', 'clearIcon', 'switcherIcon']);

// 推荐做法：利用解构赋值，把pros其他属性放到 other 中
const {inputIcon, removeIcon, clearIcon, switcherIcon, ...others} = props;
```

### 七、for循环/for...in循环/for...of循环

哪个写法的效率更高——答案是：普通for循环

- forEach 遍历列表值，不能使用 break 语句或使用 return 语句结束循环
- for in 遍历对象键值(key)，或者数组下标，不推荐循环一个数组
- for of 遍历列表值，允许遍历 Arrays，Strings，Map（哈希），Set（集合）等可迭代的数据结构，for of循环出的是value值，不能循环普通的对象（Object 没有 `Symbol.iterator`属性）

```javascript
// 测试数据
let arr = [];
for(let count = 0; count < 99999; count++){
  arr[count] = count;
}
```

```javascript


// 在for循环过程中，提前获取数组长度，只检索了一次长度值。
for (let i = 0, len = arr.length; i < len; i++) {
    // do something
}

for (let key in arr) {
    // do something
}

for (let value in arr) {
    // do something
}

// for: 2.4900375016 ms
// for in: 17.1098265997 ms
// for of: 7.4388625005 ms
```

### 八、求数组最大最小值

```javascript
const arr = [1, 2, 3, 4, 5, 6];
Math.max(…arr); 
Math.min(…arr);
```

### 九、查找匹配

```javascript
const data = [
    { type: 'boy', name: 'Mark' },
    { type: 'girl', name: 'Amy' },
    { type: 'boy', name: 'Bob' }
]

function findData(type, name) {
    for (let i = 0; i < data.length; ++i) {
        if (data[i].type === type && data[i].name === name) {
            return data[i];
        }
    }
}
let result = findData('boy', 'Mark');

// 优化方法
function findData(data, type, name) {
    return data.find((item) => { return item.type === type && item.name === name });
}
let result = findData(data, 'boy', 'Mark');
```

### 十、事件代理

```html
    <ul>
        <li>test01</li>
        <li>test02</li>
        <li>test03</li>
        <li>test04</li>
        <li>test05</li>
    </ul>
```

```javascript
document.querySelectorAll('li').forEach((e) => {
   e.onclick = function() {
   //do something
   }
})

//(addEventLstener) 推荐做法: 
document.querySelector('ul').onclick = (e) => {
   if (e.target.nodeName === 'li') {
  		//do something 
   }
}
```

### 十一、DOM操作写法

##### （1）DOM写入操作写法

```javascript
// 非常不推荐：
for (let i = 0; i < 99999; i++) {
    let test = document.getElementById('test').innerHTML;
    //do something
}
//推荐写法：先获取DOM节点，再用该节点进行doSomething
var test = document.getElementById('test');
for (let i = 0; i < 99999; i++) {
    let title = test.innerHTML;
    //do something
}

// 非常不推荐：
for (let i = 0; i < 99999; i++) {
    document.getElementById('test').innerHTML = '<span>' + i + '</span>';
}
//推荐写法：
var html = '';
for (let i = 0; i < 99999; i++) {
    html += '<span>' + i + '</span>';
}
document.getElementById('test').innerHTML = html;

//document.createDocumentFragment
```

### 十二、If Else / Switch 写法

```javascript
// if-else做法：
if (type === 1) {
    return '已提交';
} else if (type === 2) {
    return '审批中';
} else if (type === 3) {
    return '审批通过';
} else if (type === 0) {
    return '审批驳回';
}
// switch做法：
switch (type) {
    case 1:
        return '已提交';
    case 2:
        return '审批中';
    case 3:
        return '审批通过';
    case 0: return '审批驳回';
}
//推荐做法:将键值存在对象中，再获取
let map = {
    1: '已提交',
    2: '审批中',
    3: '审批通过',
    0: '审批驳回'
};
let typeStr = map[type];


// if-else做法：
if (type === 'add') {
    doAdd();
} else if (type === 'delete') {
    doDelete();
} else if (type === 'edit') {
    doEdit();
} else if (type === 'view') {
    doView();
}
// switch做法：
switch (type) {
    case 'add':
        doAdd();
        break;
    case 'delete':
        doDelete();
        break;
    case 'edit':
        doEdit();
        break;
    case 'view':
        doView();
        break;
}

//推荐做法:将键值存在对象中，再获取
var map = {
    'add': doAdd,
    'delete': doDelete,
    'edit': doEdit,
    'view': doView
};
map[type] && map[type]();

```
