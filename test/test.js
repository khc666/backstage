/* eslint-disable radix */
// var url = '/user/login.do?username=admin';
// // var url = 'hello,world,javascipt';

// var arr = url.split('/');

// for (var i = 0; i < arr.length; i++) {
//     console.log('>>>  ' + arr[i]);
//     arr[i] = arr[i].split('?')[0];
//     console.log('<<< ' + arr[i]);
// }

// console.log('arr ' + arr);


// var reqUrl = '/user/list/main.do?username=admin'; // 对象转字符串   /user/list/main.do?username=admin
// if (reqUrl.indexOf('?') !== -1) { // 判断reqUrl有没有?,如果没有返回-1
//     reqUrl = reqUrl.substring(0, reqUrl.lastIndexOf('?')); // /main.do
// }
// console.log('Url :' + reqUrl);

var pageCount = 0; // 总页数
var pageSize = 5;
var total = 11; // 总记录条数
if (total % pageSize === 0) {
    pageCount = total / pageSize;
} else {
    pageCount = total / pageSize + 1;
}

console.log(total % pageSize);

console.log(parseInt(total / pageSize));
