var express = require('express');
var indexRouter = express.Router();
var svgCaptcha = require('svg-captcha');

var control = require('../controller/indexController');

/**
 * 统一登录认证-拦截器
 */
indexRouter.all('/*', control.all);

/**
 * 登录界面
 */
indexRouter.get('/', control.login);

/*
 * 登录提交
 */
indexRouter.post('/login.do', control.loginsubmit);

/**
 * 主界面
 */
indexRouter.get('/main.do', control.main);

/**
 * 验证码
 */
indexRouter.get('/codeImg.do', control.codeImg)
// indexRouter.get('/codeImg.do', function(req,res,next){
//     var codeConfig = {
//         size: 5,// 验证码长度
//         ignoreChars: '0o1i', // 验证码字符中排除 0o1i
//         noise: 2, // 干扰线条的数量
//         height: 44 
//     }
//     var captcha = svgCaptcha.create(codeConfig);
//     req.session.captcha = captcha.text.toLowerCase(); //存session用于验证接口获取文字码
//     res.setHeader('Content-Type', 'image/svg+xml');
//     res.write(String(captcha.data));
//     res.end();
// });

/**
 * 退出
 */
indexRouter.get('/logout.do', control.logout);

module.exports = indexRouter;