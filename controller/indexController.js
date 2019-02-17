var querydb = require('../utils/querydb');
var util = require('../utils/util');
var logger = require('log4js').getLogger(''); // 获取日志对象
/**
 * 统一登录认证-拦截器
 */

exports.all = function (req, res, next) {
    var reqUrl = req.url + ''; // 对象转字符串   /user/list/main.do?username=admin
    if (reqUrl.indexOf('?') !== -1) { // 判断reqUrl有没有?,如果没有返回-1
        reqUrl = reqUrl.substring(0, reqUrl.lastIndexOf('?')); // /user/list/main.do
    }
    // 指定请求放行
    if (reqUrl.endsWith('login.do') || reqUrl.endsWith('logout.do') || reqUrl.endsWith('/') || reqUrl === '') {
        next(); // 放行
    } else {
        if (req.session.user) { // 登录认证
            next();
        } else {
            // req.session.originalUrl = req.originalUrl; // 保存原始请求url地址到session中
            req.flash('msg', '您还没有登录,请登录!');
            res.redirect('/'); // 重定向到登录界面
        }
    }
};

/**
 * 登录界面
 */

exports.login = function (req, res) {
    var msg = req.flash('msg');
    // 判断cookie是否保存用户登录信息
    logger.debug('msg :' + msg);
    if (req.cookies.user) {
        res.render('login', {
            'message': msg,
            'username': req.cookies.user.username,
            'password': req.cookies.user.password,
        });
    } else {
        res.render('login', {
            'message': msg,
        });
    }
};

/*
 * 登录提交
 */

exports.loginsubmit = async function (req, res, next) {
    var userName = req.body.name;
    var passWord = req.body.password;
    var autoLogin = req.body.autoLogin;

    // md5加密password
    var psw = util.md5(passWord);

    var sql = 'SELECT id,username,password,headerurl FROM user WHERE username = ? AND password = ?';
    var parameters = [userName, psw];
    try {
        var data = await querydb(sql, parameters);

        // 判断登录是否成功
        if (data.length === 0) {
            res.render('login', {
                'message': '用户名或密码出错！',
            });
        } else {
            // 判断是否需要记住密码
            if (autoLogin === 'on') {
                res.cookie('user', {
                    'username': userName,
                    'password': passWord,
                }, {
                    maxAge: 1000 * 60 * 60 * 24, // cookie信息保存一天
                });
            } else {
                res.clearCookie('user'); // 清除cookie
            }

            // 保存登录状态到session-目的是登录认证,拦截器处使用
            var headerurl = data[0].headerurl;
            console.log('headerurl :' + headerurl);
            req.session.user = {
                'username': userName,
                'headerurl': headerurl,
            };

            // 重定向到主界面
            var redirectUrl = '/main.do';
            if (req.session.originalUrl) {
                redirectUrl = req.session.originalUrl;
                req.session.originalUrl = null;
            }
            res.redirect(redirectUrl);
        }
    } catch (error) {
        next(error);
    }
};

/**
 * 主界面
 */

exports.main = function (req, res, next) {
    res.render('index', {
        'title': '主界面',
        'name': '首页',
        'user': req.session.user,
    });

};

/**
 * 退出
 */

exports.logout = function (req, res, next) {
    req.session.destroy(); // 销毁session
    res.redirect('/');
};