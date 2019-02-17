/* eslint-disable valid-jsdoc */
/* eslint-disable radix */
var querydb = require('../utils/querydb');
var crypto = require('crypto'); // 加载crypto库
/**
 * 用户添加
 */
exports.add = function (req, res) {
    res.render('user/user_add');
};

/**
 * 异步检查用户名是否已经存在 AJAX
 */
exports.checkUser = async function (req, res, next) {
    var username = req.body.username;

    var sql = 'SELECT count(*) AS count  FROM user WHERE username = ?';
    var data = await querydb(sql, [username]);
    var num = data[0].count;
    // 判断用户名是否存在
    if (num !== 0) {
        res.send({
            code: 1,
            msg: '用户名已经存在 !',
        });
    } else {
        res.send({
            code: 0,
        });
    }
};

/**
 * 注册用户提交
 */
exports.enroll = async function (req, res, next) {
    var userName = req.body.clientname;
    var passWord = req.body.password;
    var phone = req.body.phone;
    var email = req.body.email;
    // md5加密password
    var md5 = crypto.createHash('md5');
    md5.update(passWord); // 加密
    var psw = md5.digest('hex');
    try {
        var sql = 'INSERT INTO user (username,password,headerurl,phone,email)VALUES (?,?,?,?,?)';
        var paramers = [userName, psw, req.session.headerimg, phone, email];
        await querydb(sql, paramers);
        res.redirect('/');
    } catch (error) {
        next(error);
    }
};

/**
 * 添加用户提交
 * 头像上传使用 upload.single('headerimg')
 */
exports.addSubmit = async function (req, res, next) {
    var userName = req.body.clientname;
    var passWord = req.body.password;
    // md5加密password
    var md5 = crypto.createHash('md5'); // 定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
    md5.update(passWord);// 加密
    var psw = md5.digest('hex');
    try {
        var sql = 'INSERT INTO user (username,password,headerurl)VALUES (?,?,?)';
        var paramers = [userName, psw, req.session.headerimg];

        await querydb(sql, paramers);
        res.redirect('/list.do');
    } catch (error) {
        next(error);
    }
};

/**
 * 用户列表
 * 分页实现
 */
exports.list = async function (req, res, next) {
    var pageCount = 0; // 总页数
    var pageSize = 5; // 每页5条记录
    var currentPage = 1; // 当前页
    if (req.query.pageNo) {
        currentPage = req.query.pageNo;
    }
    try {
        var sqlCount = 'SELECT count(*) AS count FROM user';
        var totalCount = await querydb(sqlCount);
        var total = totalCount[0].count;

        if (total % pageSize === 0) {
            pageCount = parseInt(total / pageSize);
        } else {
            pageCount = parseInt(total / pageSize) + 1;
        }

        var startIndex = (currentPage - 1) * pageSize; // 计算偏移量
        var sql = 'SELECT id,username,password,headerurl FROM user limit ?, ?';
        var paramers = [startIndex, pageSize];
        var userList = await querydb(sql, paramers);

        res.render('user/user_list', {
            'userLists': userList,
            'currentPage': currentPage,
            'pageCount': pageCount,
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

/**
 * 删除用户
 */
exports.delete = async function (req, res, next) {
    // 接收get请求参数
    var id = req.query.uid;
    var sql = 'DELETE FROM user WHERE id = ?';
    var parameters = [id];
    try {
        await querydb(sql, parameters);
    } catch (err) {
        next(err);
    }

    res.redirect('/list.do');
};

/**
 * 根据ID查询用户
 */
exports.find = async function (req, res, next) {
    // 接收get请求参数
    // var id = req.params.uid;
    var id = req.query.uid;
    var sql = 'SELECT id,username,password,headerurl FROM user WHERE id = ?';
    var parameters = [id];

    try {
        // 可能发生异常
        var data = await querydb(sql, parameters);
        res.render('user/user_update', data[0]);

    } catch (err) {
        // 处理异常
        next(err);
    }
};

/**
 * 修改用户提交
 */
exports.update = async function (req, res, next) {
    var username = req.body.clientname;
    var password = req.body.password;
    var id = req.body.uid;
    var parametes = [username, password, req.session.headerimg, id];
    var sql = 'UPDATE user SET username = ?, password = ?,headerurl = ? WHERE id = ?';
    try {
        await querydb(sql, parametes);
        res.redirect('/list.do');
    } catch (err) {
        next(err);
    }
};

