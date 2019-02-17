/**
 * app.js模块
 * 作用:    1. 设置默认模板引擎
 *
 *          2. 加载中间件
 *              body-parser (json解析,名称值对解析)
 *                      req.body.name      req.query.name
 *              cookie-parser
 *                       res.cookie('name',value);     value = req.cookies.name;
 *              express - session
 *                      req.session.name = value;
 *              connect-flash   参数传递
 *                   用法: req.flash('name',value); // 保存值              req.session.name = value;
 *                         var value = req.flash('name');  // 获取值       value = req.session.name;   req.session.clearsession('name');
 *              express.static('public')   指定静态资源目录
 *              加载路由
 *              http - errors 错误处理
 *
 *          3. 启动web服务
 *
 */
var userRouter = require('./routes/userRoute');
var indexRouter = require('./routes/indexRoute');
var typeRouter = require('./routes/typeRoute');
var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var createError = require('http-errors');
var cookie = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var log4js = require('log4js');
var log4jsConfig = require('./config/log4jsConfig.json');

// 创建一个express实例instance,得到Application对象
var app = express();

// ==========1 设置默认模板引擎是html===========
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.set('views', 'views'); // 模板所在的目录为views

// ===========2 加载中间件===========
log4js.configure(log4jsConfig);

app.use(express.static('public')); // 静态资源所有目录

app.use(bodyParser.json()); // 解析json类型数据
// expanded:false表示解析值类型是string|Array, true表示解析值是任意类型
app.use(bodyParser.urlencoded({
    extended: false,
}));

app.use(cookie()); // 引入coolkie中间件

// 引入session中间件
app.use(session({ // 这里的name值得是cookie的name，默认cookie的name是：connect.sid
    name: 'web1803',
    secret: 'websecret',
    cookie: ({
        maxAge: 1000 * 60 * 60 * 24,
    }),
    // 重新保存：强制会话保存即使是未修改的。默认为true但是得写上
    resave: true,
    // 强制“未初始化”的会话保存到存储。
    saveUninitialized: true,

}));

app.use(flash()); // 参数传递

app.use('/', indexRouter);
app.use('/', typeRouter);
app.use('/', userRouter); // use 加载 usreRouter

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404)); // 创建404资源找不到错误,next方法交给error handler处理
});

// error handler; 处理所有错误
app.use(function (err, req, res, next) {
    res.status(err.status || 500); // 响应状态码如果没有响应500
    // 判断状态码显示404错误页面
    if (err.status === 404) {
        res.render('error/error404');
    } else {
        res.render('error/error', {
            message: err.message,
            error: {
                status: err.status,
                stack: err.stack,
            },
        });
    }
});

module.exports = app;

