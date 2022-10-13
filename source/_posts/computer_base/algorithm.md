---
title: 【计算机基础】常见数据结构与算法
date: 2020-05-22 10:35:29
categories:
  - 计算机基础
tags:
  - 数据结构与算法
toc: true # 是否启用内容索引
comments: true
copyright: false
---
# 常用的数据结构

## 字符串

### 1、最长不含重复字符的子字符串

请从字符串中找出一个最长的不包含重复字符的子字符串，计算该最长子字符串的长度。

```javascript
输入: "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

#### 题解：

```javascript
// 1、创建一个空数组arr，存放不重复的子字符串
// 2、遍历字符串，如果字符串的某个值在arr中存在，则删除arr中的重复字符；
//    若字符串中的字符在arr中不存在，则push进去；
// 3、arr数组中保存的一直是以s[i]为结尾的最大不重复的字符串。
var lengthOfLongestSubstring = function(s) {
   var arr = [], maxLength = 0;
   for(let i = 0; i < s.length; i++){
       let index = arr.indexOf(s[i]);
       if(index != -1){
           arr.splice(0, index + 1);
       }
       arr.push(s[i]);
       maxLength = Math.max(maxLength, arr.length);
   }
   return maxLength;
};
```

### 2、字符串相加

给定两个字符串形式的非负整数 num1 和num2 ，计算它们的和并同样以字符串形式返回。不能使用任何內建的用于处理大整数的库（比如 BigInteger）， 也不能直接将输入的字符串转换为整数形式。

```javascript
输入：num1 = "11", num2 = "123"
输出："134"

输入：num1 = "456", num2 = "77"
输出："533"
```

#### 题解：

```javascript
// 创建指针 i 指向 nums1 末位数字，j 指向 nums2 末位数字。
// i, j 数字相加，用进位就用 carry 来记录进位值，无则为 0。
// 若产生进位，则当前数字为 (i+j) % 10 的值。
// 若遍历过程中，nums1 或 nums2 当前已无数字，则用 0 补位来计算。
var addStrings = function(num1, num2) {
    let i = num1.length - 1,
        j = num2.length - 1,
        carry = 0,  // 记录进位值
        ans = []; // 保存结果
    while(i >= 0 || j >= 0 || carry !== 0){
        // 两字符串相减，得number
        let c1 = i >= 0 ? num1[i] - '0' : 0, 
            c2 = j >= 0 ? num2[j] - '0' : 0;
        let t = c1 + c2 + carry;
        carry = Math.floor(t / 10);
        ans.push(t % 10);
        i--;
        j--;
    }
    return ans.reverse().join('');
};
```

### 3、大数相加

JavaScript Number的精度丢失问题：因为 `JavaScript`的 `Number`类型是遵循IEEE 754规范表示的，这就意味着 `JavaScript`能精确表示的数字是有限的，`JavaScript`可以精确到个位的最大整数是9007199254740992，也就是2的53次方，超过这个范围就会精度丢失，造成 `JavaScript`无法判断大小，从而会出现下面的现象：

```javascript
Math.pow(2, 53);    // 9007199254740992
Math.pow(2, 53) === Math.pow(2, 53) + 1000;    // true
9007199254740992 === 9007199254740992 + 1000;    // true
```

那当两个数据相加时，其中一个或者两个数据都超过了这个精度范围，直接相加结果就会不准了，解决方案是将 `Number`转为 `String进行相加`

#### 实现代码：

```javascript
// 两个大数相加
var addStrings1 = function(num1, num2) {
    let maxlength = Math.max(num1.length, num2.length);
    num1 = num1.padStart(maxlength, 0);
    num2 = num2.padStart(maxlength, 0);
    let t = 0, carry = 0, sum = "";
    for(let i = maxlength - 1; i >= 0; i--){
        t = parseInt(num1[i]) + parseInt(num2[i]) + carry;
        carry = Math.floor(t / 10);
        sum = t % 10 + sum ;
    }
    // 进位不等于零  拼到字符串前面
    // if(carry !== 0){
    //     sum = "" + carry + sum;
    // }
    if(carry == 1){
        sum = "1"+ sum;
    }
    return sum;
}
```

### 4、删除字符串中的所有相邻重复项

给出由小写字母组成的字符串 `S`，**重复项删除操作**会选择两个相邻且相同的字母，并删除它们。在 S 上反复执行重复项删除操作，直到无法继续删除。

```javascript
输入："abbaca", 输出："ca"
解释：例如，在 "abbaca" 中，我们可以删除 "bb" 由于两字母相邻且相同，这是此时唯一可以执行删除操作的重复项。
之后我们得到字符串 "aaca"，其中又只有 "aa" 可以执行重复项删除操作，所以最后的字符串为 "ca"。
```

#### 题解：

```javascript
//  思路
// 为什么维护一个栈。因为扫描过的字符还不知道要不要删，要保留对它的记忆，入栈暂存
// 遍历字符串，如果当前字符和栈顶字符相同，则栈顶出栈（删字符），否则入栈
// 最后将栈中剩下的字符转成字符串即可。
var removeDuplicates = function (S) {
    const stack = [];
    for (let i = 0; i < S.length; i++) {
        if (stack.length > 0 && stack[stack.length - 1] == S[i]) {
            stack.pop();
        } else {
            stack.push(S[i]);
        }
    }
    return stack.join('');
};
```

### 5、回文数

给你一个整数 x ，如果 x 是一个回文整数，返回 true ；否则，返回 false 。回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。例如，121 是回文，而 123 不是。

```javascript
输入：x = 121, 输出：true
输入：x = -121, 输出：false, 解释：从左向右读, 为 -121 。 从右向左读, 为 121- 。因此它不是一个回文数。
```

#### 题解：

```javascript
var isPalindrome = function(x) {
    // !(x % 10) && x 是 10的整数倍, 排除零, 负数，00，1010 的倍数，都不可能是回文数。
    if(x < 0 || (!(x % 10) && x)) return false;
    x = x + '';
    let left = 0, right = x.length - 1;
    while(left < right){
        if(x[left] != x[right]){
            return false;
        }else{
            right--;
            left++
        }
    }
    return true;
};
```

### 6、最长回文子串

给你一个字符串 `s`，找到 `s` 中最长的回文子串。

```javascript
输入：s = "babad", 输出："bab"
输入：s = "cbbd", 输出："bb"
```

#### 题解：

```javascript
var longestPalindrome = function(s) {
    if( s.length <= 1){
        return s;
    }
    // 开始长度
    let start = 0;
    // 最长回文长度
    let maxLength = 1;
    // 找出 start和 maxlength 的方法
    function seek(left, right) {
        // 下标不越界，且 s[left] 等于s[right]
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            let newMax = right - left + 1;
            if ( newMax > maxLength) {
                // 更新 start和 maxLength 
                maxLength = newMax;
                start = left;
            }
            //  向两边散开
            left--;
            right++;
        }
    }
    for (let i = 0; i < s.length; i++) {
        // 情况1：BAB 以A为中心
        seek(i - 1, i + 1);
        // 情况2：AA 以AA的中间为 中心
        seek(i, i + 1);
    }
    return s.slice(start, start + maxLength);
};
```

### 7、Z字形变换

将一个给定字符串 s 根据给定的行数 numRows ，以从上往下、从左到右进行 Z 字形排列。比如输入字符串为 "PAYPALISHIRING" 行数为 3 时，排列如下：

```javascript
P   A   H   N
A P L S I I G
Y   I   R
输出需要从左往右逐行读取，产生出一个新的字符串，比如："PAHNAPLSIIGYIR"。

输入：s = "PAYPALISHIRING", numRows = 4
输出："PINALSIGYAHRPI"
解释：
P     I    N
A   L S  I G
Y A   H R
P     I
```

#### 题解：

```javascript
//  1.行数是固定的
//  2.写入顺序是固定的，下上下上下上。。。。
//  3.可不可以遍历s的同时，控制上下顺序，写入对应的行，最后合并
//  4.当字符串长度没有行数多市，为一列，或者行数为1的情况，不需要计算
var convert = function(s, numRows) {  // s = "PAYPALISHIRING", numRows = 3
    // 可能存在字符串长度没有行数多的情况，和一行的情况，就直接返回
    if(s.length <= numRows || numRows === 1){ return s }
    // 创建一个数组，个数为行数
    // ["","",""], ["PAHN","APLSIIG","YIR"]
    // const arr = new Array(numRows).fill('');
    const arr = Array.from({length: numRows}, () => "");
    // 当前字母对应的行
    let num = 0;
    // true 表示向下+ ，false 为向上-
    let flag = true;
    for(let i = 0; i < s.length; i++){
        // 每次项当前行里添加字符串
        arr[num] = arr[num] + s[i];
        if(flag){ // 向下行+1
            num = num + 1;
        }else{ // 向上行-1
            num = num - 1;
        }
        // 再次到 0 说明到顶了要向下了，为true
        if(num === 0){ 
            flag = true;
        }
        // 再次到 底部 说明要向上了，为false
        if(num === numRows - 1){ 
            flag = false;
        }
    }
    return arr.join('');
};


var convert = function(s, numRows) {
    if( s.length <= numRows || numRows == 1){
        return s;
    }
    let arr = new Array(numRows).fill('');
    let direction = "down";
    let index = 0;
    for(let i = 0; i < s.length; i++){
        arr[index] = arr[index] + s[i]
        if(direction === "down"){
            index = index + 1
        }else{
            index = index - 1
        }
        // 再次到 底部 说明要向上了，direction = "up"
        if(index === numRows - 1){ 
            direction = "up"
        }
        // 再次到 顶部 说明要向下了，direction = "down"
        if(index === 0){
            direction = "down"
        }

    }
    return arr.join("")
}
```

### 8、比较版本号

给你两个版本号 version1 和 version2 ，请你比较它们。

版本号由一个或多个修订号组成，各修订号由一个 '.' 连接。每个修订号由 多位数字 组成，可能包含 前导零 。每个版本号至少包含一个字符。修订号从左到右编号，下标从 0 开始，最左边的修订号下标为 0 ，下一个修订号下标为 1 ，以此类推。例如，2.5.33 和 0.1 都是有效的版本号。

比较版本号时，请按从左到右的顺序依次比较它们的修订号。比较修订号时，只需比较 忽略任何前导零后的整数值 。也就是说，修订号 1 和修订号 001 相等 。如果版本号没有指定某个下标处的修订号，则该修订号视为 0 。例如，版本 1.0 小于版本 1.1 ，因为它们下标为 0 的修订号相同，而下标为 1 的修订号分别为 0 和 1 ，0 < 1 。

返回规则如下：

如果 version1 > version2 返回 1，
如果 version1 < version2 返回 -1，
除此之外返回 0。

```javascript
输入：version1 = "1.01", version2 = "1.001", 输出：0
解释：忽略前导零，"01" 和 "001" 都表示相同的整数 "1"

输入：version1 = "0.1", version2 = "1.1", 输出：-1
解释：version1 中下标为 0 的修订号是 "0"，version2 中下标为 0 的修订号是 "1" 。0 < 1，所以 version1 < version2
```

#### 题解：

```javascript
// 对比版本号
var compareVersion = function(version1, version2) {
    const v1 = version1.split('.');
    const v2 = version2.split('.');
    for (let i = 0; i < v1.length || i < v2.length; i++) {
        // let x = 0, y = 0;
        // if (i < v1.length) {
        //     x = parseInt(v1[i]);  
        // }
        // if (i < v2.length) {
        //     y = parseInt(v2[i]);  
        // }
        // if (x > y) {
        //     return 1;
        // }
        // if (x < y) {
        //     return -1;
        // }
        let x = i < v1.length ? parseInt(v1[i]) : 0;
        let y = i < v2.length ? parseInt(v2[i]) : 0;
        if (x > y) {
            return 1;
        }
        if (x < y) {
            return -1;
        }
    }
    return 0;
};

var compareVersion = (version1, version2) => {
    // 使用'.'将版本号分割成为数组
    const [v1, v2] = [version1.split('.'), version2.split('.')];
    // 取两者长度的最大值
    const len = Math.max(v1.length, v2.length);
    for (let i = 0; i < len; i++) {
        // 数组元素逐个转换成数字，比较大小
        // 数组若越界，则定义为0
        const num1 = v1[i] ? parseInt(v1[i]) : 0;
        const num2 = v2[i] ? parseInt(v2[i]) : 0;
        if (num1 > num2) {
            return 1;
        } else if (num1 < num2) {
            return -1;
        }
    }
    // 还没有返回，说明两者相等
    return 0;
};
```

### 9、有效的字母异位词

给定两个字符串 s 和 t ，编写一个函数来判断 t 是否是 s 的字母异位词。注意：若 s 和 t 中每个字符出现的次数都相同，则称 s 和 t 互为字母异位词。

```javascript
输入: s = "anagram", t = "nagaram", 输出: true
输入: s = "rat",     t = "car",     输出: false
```

#### 题解：

```javascript
var isAnagram = function(s, t) {
    let s1 = [...s].sort().join('');
    let t1 = [...t].sort().join('');
    return s.length == t.length && s1 === t1
};
// 哈希表存每个字符出现次数。初始字符出现次数都为0
// 遍历s和t字符串，s中遇字符，对应次数+1，t中-1
// 字母异位词，最终每个字符出现次数，即哈希表的每个键值都是0
// 特殊情况：a与ab，如果只遍历a，哈希表的每个键值也是0
// 解决方法1：遍历a与ab较长者
// 解决方法2：比较长度，长度不同，无需继续
var isAnagram = function(s, t) {
    let len = Math.max(s.length, t.length);
    let h = Object.create(null);
    // for循环的判断条件 只要为真 就会继续循环下去， i-- 为true，就会循环下去
    for(var i = len; i--; ){  
        h[s[i]] = (h[s[i]] || 0) + 1;
        h[t[i]] = (h[t[i]] || 0) - 1;
    }
    // [0, 0, 0, 0, 0....]
    return Object.values(h).every(item => item === 0)  // 
};
```

### 10、Excel表列序号

给你一个字符串 `columnTitle` ，表示 Excel 表格中的列名称。返回 *该列名称对应的列序号* 。

```javascript
A -> 1
B -> 2
C -> 3
...
Z -> 26
AA -> 27
AB -> 28 
...
输入: columnTitle = "A", 输出: 1
输入: columnTitle = "AB", 输出: 28
输入: columnTitle = "ZY", 输出: 701
```

#### 题解：

```javascript
var titleToNumber = function(columnTitle) {
    let ans = 0;
    for (const c of columnTitle) {
        // charCodeAt() 方法可返回指定位置的字符的 Unicode 编码
        // A~Z 65~90  a~z 97~122
        ans = ans * 26 + (c.charCodeAt() - 64);
    }
    return ans;
};

var titleToNumber = function(s) {
    const map = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var res = 0;
    var len = s.length;
    for(let c of s) {
        if(len > 1) {
            res += map.indexOf(c) * Math.pow(26, len - 1);
            len--;
        } else {
            res += map.indexOf(c);
        }
    }
    return res;
};
```

### 11、判断子序列

给定字符串 s 和 t ，判断 s 是否为 t 的子序列。字符串的一个子序列是原始字符串删除一些（也可以不删除）字符而不改变剩余字符相对位置形成的新字符串。（例如，"ace"是"abcde"的一个子序列，而"aec"不是）。

```javascript
输入：s = "abc", t = "ahbgdc", 输出：true
输入：s = "axc", t = "ahbgdc", 输出：false
```

#### 题解：

```javascript
// 双指针
// 两个指针分别扫描长串和短串，目标是为短串中的字符在长串中找到匹配
// 如果指向的字符相同，两个指针都移动考察下一个字符
// 如果不相同，短串的指针不动，长串的指针移动考察下一个字符
// 如果短串走完了，说明短串的字符在长串中都找到匹配
// 如果短串没有走完，长串走完了，说明考察了整个长串也没能找齐短串的所有字符

var isSubsequence = (s, t) => {  
    if (s.length == 0) {
        return true;
    }
    let tindex = 0;
    let sindex = 0;
    // 当 tindex < t.length 不满足时，长串走完
    while (tindex < t.length) {
        if (s[sindex] == t[tindex]) {
            // sindex 自加1 到下一个索引
            sindex++;
            //  如果短串走完了，说明短串的字符在长串中都找到匹配
            if (sindex > s.length - 1) {
                return true;
            }
        }
        tindex++;
    }
    // 如果短串没有走完，长串走完了，说明考察了整个长串也没能找齐短串的所有字符
    return false;
};
```

### 12、验证回文串

给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，可以忽略字母的大小写。

```javascript
输入: "A man, a plan, a canal: Panama", 输出: true
解释："amanaplanacanalpanama" 是回文串
```

#### 题解：

```javascript
// 解题思路
// g :执行全局匹配（查找所有匹配而非在找到第一个匹配后停止）
// [0-9]:查找任何从 0 至 9 的数字;
// [a-z]: 查找任何从小写 a 到小写 z 的字符。
// [A-Z]:查找任何从大写 A 到大写 Z 的字符。
// [A-z]:查找任何从大写 A 到小写 z 的字符。
// match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
var isPalindrome = function(s) {
    //[ 'a', 'man', 'a', 'plan', 'a', 'canal', 'panama' ]
    var arr = s.toLowerCase().match(/[a-z0-9]+/g); 
    if(!arr) {
        return true;
    }
    let slong = arr.join("");  // anaplanacanalpanama
    let left = 0;
    let right = slong.length - 1;
    // 当 left = right 时 跳出while循环  s是回文串
    while(left < right){
        if(slong[left] == slong[right]){
            left++;
            right--;
        }else{
            return false;
        }
    }
    return true;
};

```

### 13、把数字翻译成字符串

给定一个数字，我们按照如下规则把它翻译为字符串：0 翻译成 “a” ，1 翻译成 “b”，……，11 翻译成 “l”，……，25 翻译成 “z”。一个数字可能有多个翻译。请编程实现一个函数，用来计算一个数字有多少种不同的翻译方法。

```javascript
输入: 12258, 输出: 5
解释: 12258有5种不同的翻译，分别是"bccfi", "bwfi", "bczi", "mcfi"和"mzi"
```

#### 题解：

```javascript
// a-z  97 -122  charCodeAt();
// 定义递归函数
// dfs 函数求：「当前指针位置到末尾的数字」的翻译方法数。
// 节点的状态用指针表示，dfs 入口传 0。
// 如果 指针 和 指针+1 对应的两位数在[10,25]内，则可以直译，有两种选择：
// 翻译 1 个数，指针走一步，递归调用 dfs，返回出剩余数字的翻译方法数。
// 翻译 2 个数，指针走两步，递归调用 dfs，返回出剩余数字的翻译方法数。
// 二者相加，就是当前数字串的翻译方法数。
// 如果 指针 和 指针+1 对应的两位数不在[10, 25]内，则无法直译，只有一个选择：
// 翻译 1 个数，指针走一步，递归调用 dfs，返回出剩余子串的翻译方法数。

var translateNum = (num) => {
  const str = num.toString();
  const dfs = (str, pointer) => {     // 随着dfs向下，pointer右移
    if (pointer >= str.length - 1) return 1; // 指针抵达边界和超出边界都返回1
    const temp = Number(str[pointer] + str[pointer + 1]);   // 考察该2位数
    if (temp >= 10 && temp <= 25) {  
      return dfs(str, pointer + 1) + dfs(str, pointer + 2); // 2个分支的结果相加
    } else {  
      return dfs(str, pointer + 1);    // 返回1个分支的结果
    }
  }
  return dfs(str, 0);
}

```

### 14、字符串解码

给定一个经过编码的字符串，返回它解码后的字符串。编码规则为: k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 k ，例如不会出现像 3a 或 2[4] 的输入。

```javascript
输入：s = "3[a]2[bc]", 输出："aaabcbc"
输入：s = "3[a2[c]]", 输出："accaccacc"
输入：s = "2[abc]3[cd]ef", 输出："abcabccdcdcdef"
输入：s = "abc3[cd]xyz", 输出："abccdcdcdxyz"
```

#### 题解：

```javascript
var decodeString = function(s) {
    let numStack = [];        // 存倍数的栈
    let strStack = [];        // 存 待拼接的str 的栈
    let num = 0;              // 倍数的“搬运工”
    let result = '';          // 字符串的“搬运工”
    for (const char of s) {   // 逐字符扫描
        if (!isNaN(char)) {   // 遇到数字
            num = num * 10 + Number(char); // 算出倍数
        } else if (char == '[') {  // 遇到 [
            strStack.push(result); // result串入栈
            result = '';           // 入栈后清零
            numStack.push(num);    // 倍数num进入栈等待
            num = 0;               // 入栈后清零
        } else if (char == ']') {  // 遇到 ]，两个栈的栈顶出栈
            let repeatTimes = numStack.pop(); // 获取拷贝次数
            result = strStack.pop() + result.repeat(repeatTimes); // 构建子串
        } else {       
            result += char;        // 遇到字母，追加给result串
        }
    }
    return result;
};
```

### 15、RGB转换为16进制

```js
// RGB转换为16进制   
String.prototype.colorHex = function () {
    // RGB颜色值的正则
    var reg = /^(rgb|RGB)/;
    var color = this;
    if (reg.test(color)) {
        var strHex = "#";
        // 把RGB的3个数值变成数组
        var colorArr = color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        // 转成16进制
        for (var i = 0; i < colorArr.length; i++) {
            var hex = Number(colorArr[i]).toString(16);
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        return strHex;
    } else {
        return String(color);
    }
};

// str = "rgb(255,255,255)"   hex的意思是16进制
function rgbToSixteen(str) {
    let color = str;
    // RGB颜色值的正则
    let reg = /^(rgb|RGB)/;
    let regNum = /[0-9]{1,3}/g;    if (reg.test(str)) {
        let strHex = "#";
        // 把RGB的3个数值变成数组
        let colorArr = color.match(regNum)
        // 转成16进制
        for (var i = 0; i < colorArr.length; i++) {
            // 字符串转成16进制
            // var hex = Number(colorArr[i]).toString(16);
            var hex = parseInt(colorArr[i]).toString(16);
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        return strHex;
    } else {
        return String(color);
    }
}
console.log(rgbToSixteen("rgb(255,255,255)"))
```

### 16、16进制转换为RGB

```js
function sixteenToRGB(str) {
    // 16进制颜色值的正则
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 把颜色值变成小写
    var color = str.toLowerCase();
    if (reg.test(color)) {
        // 如果只有三位的值，需变成六位，如：#fff => #ffffff
        // 如果只有三位的值, color的长度为4位
        if (color.length === 4) {
            var colorNew = "#";
            for (var i = 1; i < 4; i++) {
                colorNew += color[i] + color[i];
            }
            color = colorNew;
        }
        // 处理六位的颜色值，转为RGB
        var colorChange = [];
        for (var i = 1; i < 7; i = i + 2) {
            // 以16进制解析
            colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
        }
        return "RGB(" + colorChange.join(",") + ")";
    } else {
        return color;
    }
}
console.log(sixteenToRGB("#ffffff"))
String.prototype.colorRgb = function () {
    // 16进制颜色值的正则
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 把颜色值变成小写
    var color = this.toLowerCase();
    if (reg.test(color)) {
        // 如果只有三位的值，需变成六位，如：#fff => #ffffff
        if (color.length === 4) {
            var colorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
            }
            color = colorNew;
        }
        // 处理六位的颜色值，转为RGB
        var colorChange = [];
        for (var i = 1; i < 7; i += 2) {
            colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
        }
        return "RGB(" + colorChange.join(",") + ")";
    } else {
        return color;
    }
};
```

## 数组
---
title: 数组
date: 2021-01-15 10:22:01
permalink: /algorithm/leetcode/array
categories:
  - LeetCode
tags:
  - 数组
  - 算法
---
## 数组

数组内存中是连续的，插入和删除会让后面的元素发生挪动

- 查询数组元素arr[i]，O(1)
- insert插入数据元素arr[i]，平均O(n)
- delete删除数组元素arr[i]，平均O(n)

### 1、三数之和

给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。（结果不可以包含重复的三元组）

```javascript
输入：nums = [-1, 0, 1, 2, -1, -4], 输出：[[-1, -1, 2],[-1, 0, 1]]
```

#### 题解：

```javascript
// 思路
// 外层循环：指针 i 遍历数组。
// 内层循环：用双指针，去寻找满足三数之和 == 0 的元素
// 先排序的意义
// 便于跳过重复元素，如果当前元素和前一个元素相同，跳过。
// 双指针的移动时，避免出现重复解
// 找到一个解后，左右指针同时向内收缩，为了避免指向重复的元素，需要：
// 左指针在保证left < right的前提下，一直右移，直到指向不重复的元素
// 右指针在保证left < right的前提下，一直左移，直到指向不重复的元素
// 小优化
// 排序后，如果外层遍历的数已经大于0，则另外两个数一定大于0，sum不会等于0，直接break。
var threeSum = (nums) => {
  nums.sort((a, b) => a - b); // 排序    升序
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) { // 外层遍历
    let n1 = nums[i];
    if (n1 > 0) break; // 如果已经爆0，不用做了，break
    if (i - 1 >= 0 && n1 == nums[i - 1]) continue; // 遍历到重复的数，跳过  

    let left = i + 1;            // 左指针
    let right = nums.length - 1; // 右指针
    while (left < right) {
      let n2 = nums[left], n3 = nums[right];
      if (n1 + n2 + n3 === 0) {  // 三数和=0，加入解集res
        res.push([n1, n2, n3]);
        while (left < right && nums[left] == n2) left++; // 直到指向不一样的数
        while (left < right && nums[right] == n3) right--; // 直到指向不一样的数
      } else if (n1 + n2 + n3 < 0) { // 三数和小于0，则左指针右移
        left++;
      } else {      // 三数和大于0，则右指针左移
        right--;
      }
    }
  }
  return res;
};
```

### 2、合并区间

以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间 。

```javascript
输入：intervals = [[1, 3],[2, 6],[8, 10],[15, 18]], 输出：[[1, 6],[8, 10],[15, 18]]
解释：区间 [1, 3] 和 [2, 6] 重叠, 将它们合并为 [1, 6].

输入：intervals = [[1, 4],[4, 5]], 输出：[[1, 5]]
解释：区间 [1, 4] 和 [4, 5] 可被视为重叠区间。
```

#### 题解：

```javascript
// prev 初始为第一个区间，cur 表示当前的区间，res 表示结果数组

// 开启遍历，尝试合并 prev 和 cur，合并后更新到 prev
// 合并后的新区间还可能和后面的区间重合，继续尝试合并新的 cur，更新给 prev
// 直到不能合并 —— prev[1] < cur[0]，此时将 prev 区间推入 res 数组
// 合并的策略
// 原则上要更新prev[0]和prev[1]，即左右端:
// prev[0] = min(prev[0], cur[0])
// prev[1] = max(prev[1], cur[1])
// 但如果先按区间的左端排升序，就能保证 prev[0] < cur[0]
// 所以合并只需这条：prev[1] = max(prev[1], cur[1])
// 易错点
// 我们是先合并，遇到不重合再推入 prev。
// 当考察完最后一个区间，后面没区间了，遇不到不重合区间，最后的 prev 没推入 res。
// 要单独补上。
var merge = function (intervals) {
  let res = [];
  intervals.sort((a, b) => a[0] - b[0]);
  let prev = intervals[0]; // arr
  for (let i = 1; i < intervals.length; i++) {
    let cur = intervals[i];
    if (prev[1] >= cur[0]) { // 有重合   更新 prev[1]
        prev[1] = Math.max(cur[1], prev[1]); 
    } else {       // 不重合，prev推入res数组 
        res.push(prev);
        prev = cur;  // 更新 prev
    }
  }
  res.push(prev);
  return res;
};
```

### 3、旋转图像

给定一个 n × n 的二维矩阵 matrix 表示一个图像。请你将图像顺时针旋转 90 度。你必须在 原地 旋转图像，这意味着你需要直接修改输入的二维矩阵。

```javascript
//  首页将输入
// 1 2 3
// 4 5 6
// 7 8 9

// 通过交换matrix[i][j], matrix[j][i] 得到
// 1 4 7
// 2 5 8
// 3 6 9

// 最后将得到每组数组倒序排列即可
// 7 4 1
// 8 5 2
// 9 6 3
```

#### 题解：

```javascript
var rotate = function(matrix) {
    let martrixLength = matrix.length;
    for(let i = 0; i < martrixLength; i++) {
        for(let j = i; j < martrixLength; j++) {
            let temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
    return matrix.map(item => item.reverse());
};
```

### 4、把数组排成最小的数

输入一个非负整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最小的一个。

```javascript
输入: [10,2], 输出: "102"
输入: [3,30,34,5,9], 输出: "3033459"
```

#### 题解：

```javascript
var minNumber = function(nums) {
    return nums.sort((a, b) => `${a}${b}` - `${b}${a}`).join('');
};

var minNumber = function(nums) {
    nums = nums.map(item => item + ""); // 转字符串
    nums.sort((a, b) => {
        let x = a + b;
        let y = b + a;
        return x - y;
    })
    return nums.join('')
};
```

### 5、移除元素

给你一个数组 nums 和一个值 val，你需要原地移除所有数值等于 val 的元素，并返回移除后数组的新长度。不要使用额外的数组空间，必须仅使用 O(1) 额外空间并原地修改输入数组。元素的顺序可以改变，不需要考虑数组中超出新长度后面的元素。

```javascript
输入：nums = [3,2,2,3], val = 3, 输出：2, nums = [2,2]
解释：函数应该返回新的长度 2, 并且 nums 中的前两个元素均为 2。你不需要考虑数组中超出新长度后面的元素。
例如，函数返回的新长度为 2 ，而 nums = [2,2,3,3] 或 nums = [2,2,0,0]，也会被视作正确答案。
```

#### 题解：

```javascript
var removeElement = function(nums, val) {
    let res = 0;
    for(let i = 0; i < nums.length; i++){
        if(nums[i] !== val) {
            nums[res] = nums[i];
            res++;
        }
    }
    return res;
};
// res 为 2
// nums 为 [2, 2, 2, 3]  系统取前两个元素
```

### 6、滑动窗口最大值

给定一个数组 `nums` 和滑动窗口的大小 `k`，请找出所有滑动窗口里的最大值。

```javascript
输入: nums = [1,3,-1,-3,5,3,6,7], 和 k = 3, 输出: [3,3,5,5,6,7] 
  滑动窗口的位置                最大值
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7
```

#### 题解：

```javascript
 // 滑动窗口的最大值   暴力法
var maxSlidingWindow = function(nums, k) {
    // 数组长度为零
    if(nums.length === 0){
        return []
    }
    let res = []; // 存放结果
    // for循环的 循环次数
    let len = nums.length - k; 
    for(let i = 0; i <= len; i++){
        let tempArr = nums.slice(i,i + k)
        res.push(Math.max(...tempArr))
    }
    return res
};

// 暴力法
var maxSlidingWindow = function(nums, k) {
    if (k <= 1) return nums;
    const res = [];
    for (let i = 0; i < nums.length - k + 1; i++) {
        res.push(Math.max(...nums.slice(i, i + k)));
    }
    return res;
};
```

### 7、在排序数组中查找数字 I

统计一个数字在排序数组中出现的次数。

```javascript
输入: nums = [5,7,7,8,8,10], target = 8, 输出: 2
输入: nums = [5,7,7,8,8,10], target = 6, 输出: 0
```

#### 题解：

```javascript
 // 哈希
var search = function(nums, target) {
    let map = new Map();
    for(let i = 0; i < nums.length; i++){
        if(map.has(nums[i])){
            map.set(nums[i], map.get(nums[i])+1)
        }else{
            map.set(nums[i], 1);
        }
    }
    return map.get(target) || 0;
};

var search = function(nums, target) {
    let count = 0;
    for(let i = 0; i < nums.length; i++){
        if(nums[i] === target){
            count++
        }
    }
    return count;
};
```

### 8、数组中出现次数超过一半的数字在排序数组中查找数字

数组中有一个数字出现的次数超过数组长度的一半，请找出这个数字。统计一个数字在排序数组中出现的次数

```javascript
输入: [1, 2, 3, 2, 2, 2, 5, 4, 2], 输出: 2
```

#### 题解：

```javascript
 // 哈希
var majorityElement = function(nums) {
    let len = nums.length /2;
    let obj = {}
    for(let i = 0; i < nums.length; i++){
        // if(obj[`${nums[i]}`]){
        //     obj[`${nums[i]}`] = obj[`${nums[i]}`] + 1 
        // }else{
        //     obj[`${nums[i]}`] = 1;
        // }
        obj[`${nums[i]}`] = (obj[`${nums[i]}`] || 0) + 1;
    }
    for(let key in obj){
        if(obj[key] > len){
            return key;
        }
    }
};
// obj[str] = (obj[str] || 0) + 1;
```

### 9、II. 0～n-1中缺失的数字

一个长度为n-1的递增排序数组中的所有数字都是唯一的，并且每个数字都在范围0～n-1之内。在范围0～n-1内的n个数字中有且只有一个数字不在该数组中，请找出这个数字。

```javascript
输入: [0,1,3], 输出: 2
输入: [0,1,2,3,4,5,6,7,9], 输出: 8
```

#### 题解：

```javascript
//  0～n-1中缺失的数字 二分法
// 找一个中间元素，它左边没有缺失的话，就会满足 i==nums[i]
// 如果不满足，则缺失的数在右边
var missingNumber = (nums) => {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    // let mid = left + ((right - left) >>> 1);
    // 向下取整后，
    mid = Math.floor((left + right)/2)
    if (mid == nums[mid]) { // 缺失的元素在右边
      left = mid + 1;
    } else {                // 缺失的元素在左边
      right = mid - 1;
    }
  }
  return left;
};
```

### 10、打印从1到最大的n位数

输入数字 `n`，按顺序打印出从 1 到最大的 n 位十进制数。比如输入 3，则打印出 1、2、3 一直到最大的 3 位数 999。一个长度为n-1的递增排序数组中的所有数字都是唯一的，并且每个数字都在范围0～n-1之内。在范围0～n-1内的n个数字中有且只有一个数字不在该数组中，请找出这个数字

```javascript
输入: n = 1, 输出: [1,2,3,4,5,6,7,8,9]
```

#### 题解：

```javascript
var printNumbers = function (n) {
    let res = [];
    // n=1, Math.pow(10, 1) = 10
    // n=2, Math.pow(10, 2) = 100
    // n=3, Math.pow(10, 3) = 1000
    for (let i = 1; i < Math.pow(10, n); i++) {
        res.push(i);
    }
    return res;
};
```

### 11、单调数列

如果数组是单调递增或单调递减的，那么它是 单调 的。如果对于所有 i <= j，nums[i] <= nums[j]，那么数组 nums 是单调递增的。 如果对于所有 i <= j，nums[i]> = nums[j]，那么数组 nums 是单调递减的。当给定的数组 nums 是单调数组时返回 true，否则返回 false。

```javascript
输入：nums = [1,2,2,3], 输出：true
输入：nums = [6,5,4,4], 输出：true
输入：nums = [1,3,2], 输出：false
```

#### 题解：

```javascript
// 一次遍历
// 初始化 inc 单调递增 和 desc 单调递减 为 true
// 使用 inc 标记数组是否单调上升的，如果有下降，则将其置为 false
// 使用 dec 标记数组是否单调递减的，如果有上升，则将其置为 false
// 如果数列为单调 必有inc与desc 一个为true 一个为false
// 如果数列不是单调数列 则inc 与 desc均为false
var isMonotonic = function(A) {
    let [inc, dec] = [true, true];
    for (let i = 0; i < A.length - 1; i++) {
        if (A[i] > A[i + 1]) {
            inc = false;
        }
        if (A[i] < A[i + 1]) {
            dec = false;
        }
    }
    return inc || dec;
};
```

### 12、分发饼干

假设你是一位很棒的家长，想要给你的孩子们一些小饼干。但是，每个孩子最多只能给一块饼干。对每个孩子 i，都有一个胃口值 g[i]，这是能让孩子们满足胃口的饼干的最小尺寸；并且每块饼干 j，都有一个尺寸 s[j] 。如果 s[j] >= g[i]，我们可以将这个饼干 j 分配给孩子 i ，这个孩子会得到满足。你的目标是尽可能满足越多数量的孩子，并输出这个最大数值。

```javascript
输入: g = [1,2,3], s = [1,1], 输出: 1
解释: 
你有三个孩子和两块小饼干，3个孩子的胃口值分别是：1,2,3。
虽然你有两块小饼干，由于他们的尺寸都是1，你只能让胃口值是1的孩子满足。
所以你应该输出1。

输入: g = [1,2], s = [1,2,3], 输出: 2
解释: 
你有两个孩子和三块小饼干，2个孩子的胃口值分别是1,2。
你拥有的饼干数量和尺寸都足以让所有孩子满足。
所以你应该输出2.
```

#### 题解：

```javascript
// 双指针：
// 解题思路
// 1，先按从小到大排序g(胃口值)和s(饼干尺寸)；
// 2，遍历g,s，相同坐标下的s[i] >= g[i] 则max(满足的孩子) +1；
// 3，当max已经等于s.length(饼干数量)了，则直接返回max；
var findContentChildren = function (g, s) {
    g.sort((a, b) => a - b);// g孩子的胃口
    s.sort((a, b) => a - b);// s是饼干的大小
    // s[i] 大于 g[i] 才能喂饱 孩子
    let child = 0, // 能喂饱的孩子数
        cookie = 0; // 

    while (cookie < s.length && child < g.length) {
        // 发现满足条件的饼干，喂饱一个孩子
        if (s[cookie] >= g[child]) {
            child++;
        }
        // 继续找下一块饼干
        cookie++;
    }
    return child;
};
```

### 13、扑克牌中的顺子

从若干副扑克牌中随机抽 5 张牌，判断是不是一个顺子，即这5张牌是不是连续的。2～10为数字本身，A为1，J为11，Q为12，K为13，而大、小王为 0 ，可以看成任意数字。A 不能视为 14。

```javascript
输入: [1,2,3,4,5], 输出: True
输入: [0,0,1,2,5], 输出: True
```

#### 题解：

```javascript
// 解题思路
// 分治思想 五张牌构成顺子的充分条件需要满足
// 1. 不重复 使用Set去重
// 2. max - min < 5 最大牌值 减去 最小牌值 小于5 且跳过大小王

var isStraight = function(nums) {
    /* 
       分治思想 五张牌构成顺子的充分条件需要满足
       1. 不重复 使用Set去重
       2. max - min < 5 最大牌值 减去 最小牌值 小于5 且跳过大小王
    */
    const set = new Set();
    let min = 14, max = 0 //  min和max的初始值是两个边界值[0, 13]
    for(let i = 0; i < nums.length; i++){
        // 遇到大小王 跳过
        if (!nums[i]) continue;
        // 遇到重复则直接 返回false
        if (set.has(nums[i])) {
            return false;
        }
        set.add(nums[i])
        // 迭代更新 min和max 以及set
        min = Math.min(min, nums[i]);
        max = Math.max(max, nums[i]);
    }
    return max - min < 5;
};

var isStraight = function(nums) {
    //从小到大排序
    const minSort = nums.sort((a, b) => a - b);
    //记录每个数字之间大差值，反正不能大于4
    let sum = 0;
    //不能超过4
    for(let i = 0; i < 4; i++){
        //忽略0也就是王
        if(minSort[i] === 0){
            continue
        }
        //如果扑克牌（非0）重复，说明不是顺子
        else if(nums[i] === nums[i + 1]){
            return false
        }else{
            //差值记录
            sum = sum + nums[i + 1] - nums[i]
        }
    }
    //如果超过4，说明不是顺子。
    return sum < 5
};
```

### 14、矩阵中的路径

给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。如果 word 存在于网格中，返回 true ；否则，返回 false 。
单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。

![img](./images/algorithm/12.png)

```javascript
输入：
    board = [
        ["A","B","C","E"],
        ["S","F","C","S"],
        ["A","D","E","E"]
    ], 
    word = "ABCCED"
输出：true
```

#### 题解：

```javascript

// 解题思路
// 典型的dfs算法，第一步先遍历一遍board，寻找第一个符合的位置，然后再使用dfs递归，因为寻找路径，要记录一下路径，防止每次递归会回到之前的路径
var exist = function(board, word) {
    var row = board.length;
    var col = board[0].length;

    var dfs = function(i, j, board, word, index){
        // 判断不符合条件
        if(i < 0 || i >= row || j < 0 || j > col || board[i][j] !== word[index]) {
            return false; 
        }
        if(index === word.length - 1) {
             // word遍历完了
            return true; 
        }
        // 记录到board的值
        var tmp = board[i][j];  
        // 锁上，因为后续的递归是4个方向上的，无法保证上一个方向的值
        board[i][j] = '-'  
        var res =  
            dfs(i - 1, j, board, word, index + 1) || 
            dfs(i + 1, j, board, word, index + 1) || 
            dfs(i, j - 1, board, word, index + 1) || 
            dfs(i, j + 1, board, word, index + 1);
        // 恢复现场
        board[i][j] = tmp;   
        return res; 
    }

    // for循环作用 ： 遍历整个board，找到初始位置点
    for(var i = 0;i < row; i++){
        for(var j = 0; j < col; j++){
            if(dfs(i, j, board, word, 0)) {
                return true;
            }
        }
    }
    // 没找到
    return false;
};

//  思路   有点类似岛屿数量
// 先从头遍历矩阵，找到第一个符合的字符，开始深度优先遍历
// 深度优先遍历：
// 定义index代表索引，或者说已经匹配了多少个字符
// 要写递归的出口：i、j越界或者字符不匹配
// 匹配成功：index等于word.length - 1，匹配成功，直接返回true
// 为了同一个单元格内的字母不允许被重复使用，遍历到某字符后，将当前字符设置为''，防止四个方向dfs再次遍历到
// 四个方向遍历完毕后，再恢复这个字符
// 最后若一直匹配失败，返回false

// 排除法
var exist = (board, word) => {
    const [m, n] = [board.length, board[0].length];
    // index 是word的下标
    const dfs = (i, j, index) => {
        // 越界、或者字符不匹配
        if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== word[index]) {
            return false;
        }
        // 索引等于 单词长度-1，说明全匹配上了
        if (index === word.length - 1) {
            return true;
        }
        // 保存当前字符
        const temp = board[i][j];
        // 将当前字符设置为空，防止四个方向dfs再次遍历到
        board[i][j] = '';
        // 四个方向遍历  res是布尔值
        const res =
            dfs(i + 1, j, index + 1) ||
            dfs(i, j + 1, index + 1) ||
            dfs(i - 1, j, index + 1) ||
            dfs(i, j - 1, index + 1);
        // 恢复当前字符
        board[i][j] = temp;
        return res;
    };
    // 从第一个匹配的字符处开始dfs
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (dfs(i, j, 0)) {
                return true;
            }
        }
    }
    return false;
};
```

### 15、寻找两个正序数组的中位数

```javascript
输入：nums1 = [1, 3], nums2 = [2]
输出：2.00000
解释：合并数组 = [1, 2, 3]，中位数 2

输入：nums1 = [1, 2], nums2 = [3, 4]
输出：2.50000
解释：合并数组 = [1, 2, 3, 4]，中位数(2 + 3) / 2 = 2.5
```

#### 题解：

```javascript
function findMedian(nums1, nums2) {
    //let num = nums1.concat(nums2);
    let num = [...nums1, ...nums2].sort((a, b) => a - b);
    //num = num.sort((a, b) => a - b);
    let length = num.length;
    if (length > 0 && length % 2 === 0) {
        return (num[length / 2 - 1] + num[length / 2]) / 2;
    } else {
        return num[(length - 1) / 2];
    }
};
```

### 16、矩阵的转置

给定一个矩阵 A， 返回 A 的转置矩阵。
矩阵的转置是指将矩阵的主对角线翻转，交换矩阵的行索引与列索引。

```javascript
输入：[[1,2,3],[4,5,6],[7,8,9]]
输出：[[1,4,7],[2,5,8],[3,6,9]]

输入：[[1,2,3],[4,5,6]]
输出：[[1,4],[2,5],[3,6]]
```

#### 题解：

```javascript
function transpose(A) {
    let B = [];
    for (let i = 0;i < A.length; i++) {
        for (let j = 0;j < A[i].length; j++) {
            if (!B[j]) {
                B[j] = [];
            }
            B[j][i] = A[i][j];
        }
    }
    return B;
}
```

### 17、两数之和

给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。

```javascript
输入：nums = [2,7,11,15], target = 9, 输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。

输入：nums = [3,2,4], target = 6
输出：[1,2]
```

#### 题解：

```javascript
// 数组是有序的，则用双指针
var twoSum = function(numbers, target) {
    let low = 0;
    let high = numbers.length - 1;
    while (low < high) {
        let sum = numbers[low] + numbers[high];
        if (sum == target) {
            return [low + 1, high + 1];
        } else if (sum > target) {
            high--;
        } else {
            low++;
        }
    }
    return ("No such two value!");
};

// 方法二
// 如果数组不是有序的，不能用双指针，用哈希表
var twoSum = function(arr, target) {
    let map = new Map();
    let len = arr.length;
    for(let i = 0, i < len; i++){
        let num = target - arr[i];
        if(map.has(num)){
            return [map.get(num), i];
        }else{
            map.set(nums[i], i);
        }
    }
    return [];
}
```

### 18、合并两个有序数组

给你两个按 非递减顺序 排列的整数数组 nums1 和 nums2，另有两个整数 m 和 n ，分别表示 nums1 和 nums2 中的元素数目。
请你 合并 nums2 到 nums1 中，使合并后的数组同样按 非递减顺序 排列。

```javascript
输入：nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
输出：[1,2,2,3,5,6]
解释：需要合并 [1,2,3] 和 [2,5,6] 。
合并结果是 [1,2,2,3,5,6] ，其中斜体加粗标注的为 nums1 中的元素。

输入：nums1 = [0], m = 0, nums2 = [1], n = 1
输出：[1]
解释：需要合并的数组是 [] 和 [1] 。
合并结果是 [1] 。
注意，因为 m = 0 ，所以 nums1 中没有元素。nums1 中仅存的 0 仅仅是为了确保合并结果可以顺利存放到 nums1 中。
```

#### 题解：

```javascript
// 有序非递减  后面的元素大于等于前面的
var merge = function(nums1, m, nums2, n) {
    let len1 = m - 1, len2 = n - 1, k = m + n - 1;
    while (len1 >= 0 || len2 >= 0) {
        if(len1 < 0) {
            nums1[k--] = nums2[len2--];
        }else if(len2 < 0) {
            nums1[k--] = nums1[len1--];
        }else if(nums1[len1] < nums2[len2]) {
            // 比较nums1 和 nums2 最后面的 元素大小
            nums1[k--] = nums2[len2--];
        }else {
            nums1[k--] = nums1[len1--];
        }
    }
    return nums1;
};
// 归并排序法
function mergeSort(left,right){
	let result = []
	while(left.length > 0 && right.length > 0){
		if (left[0] < right[0]) {
        result.push(left.shift())
      }else{
        result.push(right.shift())
      }
	}
	//只要left,right数组其中一个长度为0，则将另外数组剩余的元素直接添加到result数组后面
  return [...result, ...left, ...right];
}
```

### 19、和为s的连续正数序列

输入一个正整数 target ，输出所有和为 target 的连续正整数序列（至少含有两个数）。
序列内的数字由小到大排列，不同序列按照首个数字从小到大排列。

```javascript
输入：target = 9
输出：[[2,3,4],[4,5]]

输入：target = 15
输出：[[1,2,3,4,5],[4,5,6],[7,8]]
```

#### 题解：

```javascript
// 这里的题意隐藏条件 没有给定具体的数组num 我们可以通过下标关联[1,2,3,4,5,6,7....]
// 没有参照物数组 但是可以根据下标
// 滑动窗口（双指针） 
var findContinuousSequence = function(target) {
    if(target <= 2) return;
    let left = 1;
    let right = 2;
    let sum = 3;
    let res = [];
    // 滑动窗口框架 
    // 左指针小于 右指针
    while(left < right){
        if(sum === target){
            let ans = [];
            // 通过下标关联[1,2,3,4,5,6,7....]
            for(let k = left; k <= right; k++){
                ans[k - left] = k; // 下标 0,1,2
            }
            res.push(ans);
            // 等于的情况 我们可以继续窗口往右搜索 同时缩小左边的
            sum = sum - left;
            left++;
        } else if(sum > target){
            // 大于的条件 缩小窗口，缩小左边的   sum已经加过了
            sum = sum - left;
            left++;
        } else {
            // 小于的情况 滑动窗口继续扩大，不用减，往右加数字
            right++;
            sum = sum + right;
        }
    }
    // 连续正整数序列（至少含有两个数）。
    // 序列内的数字由小到大排列，不同序列按照首个数字从小到大排列。
    return res;
};
```

### 20、数组乱序（洗牌算法）

洗牌算法是将原来的数组进行打散，使原数组的某个数在打散后的数组中的每个位置上等概率的出现，即为乱序算法。

```javascript
 // Fisher - Yates
// 先看最经典的 Fisher - Yates的洗牌算法
// 其算法思想就是从原数组中随机抽取一个元素放入新数组
// 从原数组（假如长度为n）中，随机生成一个索引 random
// 从原数组中删除第 random 个元素并将其push到新数组
// 重复第2步直到所有元素取完
// 最终得到一个新的打乱的数组
// 按步骤一步一步来就很简单的实现。
const shuffle1 = arr => {
    let res = [], random
    while (arr.length > 0) {
        random = parseInt(Math.random() * arr.length);
        // arr.splice(random, 1) 返回的是一个被删除的元素数组，我们删除多少个元素，数组里就有元素
        let el = arr.splice(random, 1)[0];
        res.push(el);
    }
    return res
}
shuffle1([2, 3, 6, 2, 6, 2]) // [6, 3, 2, 2, 2, 6]
// Knuth - Durstenfeld ShuffleFisher - Yates
// 洗牌算法的一个变种是 Knuth Shuffle
// 每次从原数组中随机取一个元素，然后把该元素跟最后个元素交换，即数组的尾部放的是已经处理过的元素
// 这是一种原地打乱的算法，不会产生新的数组，每个元随机概率也相等，时间复杂度从 Fisher 算法的 O(n2)提升了 O(n)
// 假设原数组长度为n，生成一个0～n - 1的随机random，然后将第random个元素跟数组最后一个元素交换
// 生成一个0～n - 2的随机数random，然后将第random个素跟数组倒数第二个元素交换
// 以此类推，直到交换结束为止
const shuffle2 = arr => {
    let n = arr.length,
        tmp,
        random
    while (n != 0) {
        random = parseInt(Math.random() * n)
        n-- // n减一，方便下一趟循环继续交换
        // 交换
        tmp = arr[length]
        arr[length] = arr[random]
        arr[random] = tmp
    }
    return arr;
}
shuffle2([2, 3, 6, 2, 6, 2]) // [6, 3, 2, 2, 6, 2]
```

### 21、螺旋矩阵

给你一个 m 行 n 列的矩阵 matrix ，请按照 顺时针螺旋顺序 ，返回矩阵中的所有元素。
![img.png](images/algorithm/54.png)

```javascript
输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
输出：[1,2,3,6,9,8,7,4,5]
```

#### 题解：

```javascript
var spiralOrder = function(matrix) {
    if(matrix.length === 0){
        return [];
    }
    // 四个边界
    let left = 0; // 左边界
    let top = 0; // 上边界
    let right = matrix[0].length - 1; // 右边界
    let bottom = matrix.length - 1; // 下边界

    let direction = "right";  // 初始方向
    let result = [];  // 结果
    // 执行while 的判断条件
    while(left <= right && top <= bottom){
    
        if(direction === "right"){
            for(let i = left; i <= right; i++){
                result.push(matrix[top][i])
            }
            top++;
            direction = "down";
        }else if(direction === "down"){
            for(let i = top; i <= bottom; i++){
                result.push(matrix[i][right])
            }
            right--;
            direction = "left";
        }else if(direction === "left"){
            for(let i = right; i >= left; i--){
                result.push(matrix[bottom][i]);
            }
            bottom--;
            direction = "up";
        }else if(direction === "up"){
            for(let i = bottom; i >= top; i--){
                result.push(matrix[i][left]);
            }
            left++;
            direction = "right";

        }
    }
    return result
};
```

### 22、螺旋矩阵II

给你一个正整数 n ，生成一个包含 1 到 n2 所有元素，且元素按顺时针顺序螺旋排列的 n x n 正方形矩阵 matrix 。
![img.png](images/algorithm/54.png)

```javascript
输入：n = 3
输出：[[1,2,3],[8,9,4],[7,6,5]]
```

#### 题解：

```javascript
/ 思路和代码
// 构建 n * n 的矩阵

// 确定矩阵的四个边界，它是初始遍历的边界。

// 按 上 右 下 左，一层层向内，遍历矩阵填格子

// 每遍历一个格子，填上对应的 num，num 自增

// 直到 num > n*n ，遍历结束

var generateMatrix = function (n) {
    const matrix = new Array(n);
    for (let i = 0; i < n; i++) {
        matrix[i] = new Array(n);
    }
    let num = 1;
    let left = 0, right = n - 1, top = 0, bottom = n - 1;
    while (num <= n * n) {
        for (let i = left; i <= right; i++) {
         	matrix[top][i] = num 
			num++
        }
        top++;
        for (let i = top; i <= bottom; i++) {
			matrix[i][right] = num
            num++;
        }
        right--;
        for (let i = right; i >= left; i--) {
			matrix[bottom][i] = num
            num++;
        }
        bottom--;
        for (let i = bottom; i >= top; i--) {
			matrix[i][left] = num
            num++;
        }
        left++;
    }
    return matrix;
};
```

## 队列

## 栈

## 哈希表
[哈希算法之美](https://juejin.cn/post/6874708801208254478)

## 堆

## 链表
[链表的9个基本操作](https://juejin.cn/post/6850418120755494925)

## 二叉树
[二叉树之美](https://juejin.cn/post/6890680584033533960)

# 算法

## 常见的排序算法
[梳理6大排序算法](https://juejin.cn/post/6856546833025237006)

我们常说的稳定的算法是指，值相等的元素保持排序前的相对顺序不变。
举个例子，A2和A4的位置都是3。对于稳定排序来说，排序后的序列，a2一定还是在a4前面。但是对于非稳定排序来说，就不一定了，可能排完序之后，a4反而在a2的前面了。

### 冒泡排序（稳定排序）

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

#### 优化后的冒泡排序

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

### 插入排序（稳定排序）

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

#### 优化后的插入排序

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

### 归并排序（稳定排序）

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

### 选择排序（不稳定）

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

### 快速排序（不稳定）

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


## 查找
### 二分

## 搜索算法

### 回溯算法
[带你看回溯算法之美](https://juejin.cn/post/6882394656148045838)

### 剪枝

### 递归

### DFS和BFS
[DFS和BFS算法之美](https://juejin.cn/post/6861376131615227912)

## 动态规划
[动态规划算法之美](https://juejin.cn/post/6872115031501340679)

## 动态规划

## KMP算法（模式匹配算法）
KMP算法名字的由来：3位创始人的名字。KMP算法解决的是字符串匹配的问题

# 分治思想
[分治算法之美](https://juejin.cn/post/6885104477297344525)

# 贪心思想


# 参考
- [awesome-coding-js](https://www.conardli.top)
- [前端算法与数据结构总结](https://juejin.cn/post/6900698814093459463)