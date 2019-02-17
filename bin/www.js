var app = require('../app');
var http = require('http');

var port = 8081;
var server = http.createServer(app);
server.listen(port);
server.on = function () {
    console.log('服务器启动成功,监听端口' + port);
};
// ===========3 启动web服务===============
// var port = 8081;
// app.set('port', port);
// app.listen(app.get('port'), function () {
//     console.log('服务启动成功,监听8081端口');
// });