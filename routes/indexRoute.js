var express = require('express');
var indexRouter = express.Router();

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
 * 退出
 */
indexRouter.get('/logout.do', control.logout);

module.exports = indexRouter;