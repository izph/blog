---
title: 字符串
date: 2021-01-09 12:28:01
permalink: /algorithm/leetcode/string
categories:
  - LeetCode
tags:
  - 字符串
  - 算法
---
# 字符串

听过一句话，前端越往后越底层的东西就是拼接字符串，最难的就是拼接字符串。

## 1、最长不含重复字符的子字符串

请从字符串中找出一个最长的不包含重复字符的子字符串，计算该最长子字符串的长度。

```javascript
输入: "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

### 题解：

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

## 2、字符串相加

给定两个字符串形式的非负整数 num1 和num2 ，计算它们的和并同样以字符串形式返回。不能使用任何內建的用于处理大整数的库（比如 BigInteger）， 也不能直接将输入的字符串转换为整数形式。

```javascript
输入：num1 = "11", num2 = "123"
输出："134"

输入：num1 = "456", num2 = "77"
输出："533"
```

### 题解：

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

## 3、大数相加

JavaScript Number的精度丢失问题：因为 `JavaScript`的 `Number`类型是遵循IEEE 754规范表示的，这就意味着 `JavaScript`能精确表示的数字是有限的，`JavaScript`可以精确到个位的最大整数是9007199254740992，也就是2的53次方，超过这个范围就会精度丢失，造成 `JavaScript`无法判断大小，从而会出现下面的现象：

```javascript
Math.pow(2, 53);    // 9007199254740992
Math.pow(2, 53) === Math.pow(2, 53) + 1000;    // true
9007199254740992 === 9007199254740992 + 1000;    // true
```

那当两个数据相加时，其中一个或者两个数据都超过了这个精度范围，直接相加结果就会不准了，解决方案是将 `Number`转为 `String进行相加`

### 实现代码：

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

## 4、删除字符串中的所有相邻重复项

给出由小写字母组成的字符串 `S`，**重复项删除操作**会选择两个相邻且相同的字母，并删除它们。在 S 上反复执行重复项删除操作，直到无法继续删除。

```javascript
输入："abbaca", 输出："ca"
解释：例如，在 "abbaca" 中，我们可以删除 "bb" 由于两字母相邻且相同，这是此时唯一可以执行删除操作的重复项。
之后我们得到字符串 "aaca"，其中又只有 "aa" 可以执行重复项删除操作，所以最后的字符串为 "ca"。
```

### 题解：

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

## 5、回文数

给你一个整数 x ，如果 x 是一个回文整数，返回 true ；否则，返回 false 。回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。例如，121 是回文，而 123 不是。

```javascript
输入：x = 121, 输出：true
输入：x = -121, 输出：false, 解释：从左向右读, 为 -121 。 从右向左读, 为 121- 。因此它不是一个回文数。
```

### 题解：

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

## 6、最长回文子串

给你一个字符串 `s`，找到 `s` 中最长的回文子串。

```javascript
输入：s = "babad", 输出："bab"
输入：s = "cbbd", 输出："bb"
```

### 题解：

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

## 7、Z字形变换

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

### 题解：

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

## 8、比较版本号

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

### 题解：

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

## 9、有效的字母异位词

给定两个字符串 s 和 t ，编写一个函数来判断 t 是否是 s 的字母异位词。注意：若 s 和 t 中每个字符出现的次数都相同，则称 s 和 t 互为字母异位词。

```javascript
输入: s = "anagram", t = "nagaram", 输出: true
输入: s = "rat",     t = "car",     输出: false
```

### 题解：

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

## 10、Excel表列序号

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

### 题解：

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

## 11、判断子序列

给定字符串 s 和 t ，判断 s 是否为 t 的子序列。字符串的一个子序列是原始字符串删除一些（也可以不删除）字符而不改变剩余字符相对位置形成的新字符串。（例如，"ace"是"abcde"的一个子序列，而"aec"不是）。

```javascript
输入：s = "abc", t = "ahbgdc", 输出：true
输入：s = "axc", t = "ahbgdc", 输出：false
```

### 题解：

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

## 12、验证回文串

给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，可以忽略字母的大小写。

```javascript
输入: "A man, a plan, a canal: Panama", 输出: true
解释："amanaplanacanalpanama" 是回文串
```

### 题解：

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

## 13、把数字翻译成字符串

给定一个数字，我们按照如下规则把它翻译为字符串：0 翻译成 “a” ，1 翻译成 “b”，……，11 翻译成 “l”，……，25 翻译成 “z”。一个数字可能有多个翻译。请编程实现一个函数，用来计算一个数字有多少种不同的翻译方法。

```javascript
输入: 12258, 输出: 5
解释: 12258有5种不同的翻译，分别是"bccfi", "bwfi", "bczi", "mcfi"和"mzi"
```

### 题解：

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

## 14、字符串解码

给定一个经过编码的字符串，返回它解码后的字符串。编码规则为: k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 k ，例如不会出现像 3a 或 2[4] 的输入。

```javascript
输入：s = "3[a]2[bc]", 输出："aaabcbc"
输入：s = "3[a2[c]]", 输出："accaccacc"
输入：s = "2[abc]3[cd]ef", 输出："abcabccdcdcdef"
输入：s = "abc3[cd]xyz", 输出："abccdcdcdxyz"
```

### 题解：

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

## 15、RGB转换为16进制

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

## 16、16进制转换为RGB

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
