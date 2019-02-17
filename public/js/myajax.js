// 封装原生ajax
//  {method:'post', url:'/checkuser.do', content: '发送内容'， success: function(e){ }, error: function(e){}}
function ajax(json) {
    var method = json.method;
    var url = json.url;
    var content = json.content;

    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new window.XMLHttpRequest();
    } else {
        // 兼容IE浏览器低版本
        xhr = new window.AtiveXObject('Microsoft.XMLHTTP');
    }

    if (xhr !== null) {
        xhr.open(method, url, true); // 建立连接
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); // 请求头部
        xhr.send(content);
        xhr.onreadystatechange = function (e) {
            if (e.target.readyState === 4) { // Ajax请求的状态 0, 1, 2, 3, 4:响应完成
                if (e.target.status === 200) { // 响应状态码
                    var text = e.target.responseText;
                    json.success(text);
                }
            }
        }
    }
}