var querydb = require('../utils/querydb');

/**
 * 商品类型
 */
exports.userType = function (req, res, next) {
    res.render('user/user_type');
};

// 添加商品类型//
exports.addUserTypeSubmit = async function (req, res, next) {
    var type = req.body.usertype;
    if (type == '') {
        res.send('用户名不能为空');
    } else {
        var sql = 'INSERT INTO commodity (tname)VALUES(?)';
        await querydb(sql, [type]);
        res.send('添加商品类型成功');
    }

};

/**
 * 商品类型列表
 */
exports.userFormli = async function (req, res, next) {
    var pageCount = 0; // 总页数
    var pageSize = 5; // 每页5条记录
    var currentPage = 1; // 当前页
    if (req.query.pageNo) {
        currentPage = req.query.pageNo;
    }
    try {
        var sqlCount = 'SELECT count(*) AS count FROM commodity';
        var totalCount = await querydb(sqlCount);
        var total = totalCount[0].count;

        if (total % pageSize === 0) {
            pageCount = parseInt(total / pageSize);
        } else {
            pageCount = parseInt(total / pageSize) + 1;
        }

        var startIndex = (currentPage - 1) * pageSize; // 计算偏移量
        var sql = 'SELECT tid,tname FROM commodity limit ?, ?';
        var paramers = [startIndex, pageSize];
        var userList = await querydb(sql, paramers);

        res.render('user/user_formli', {
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
 * 删除商品类型列表
 */
exports.deleteli = async function (req, res, next) {
    // 接收get请求参数
    var id = req.query.uid;
    var sql = 'DELETE FROM commodity WHERE tid = ?';
    var parameters = [id];
    try {
        await querydb(sql, parameters);
    } catch (err) {
        next(err);
    }
    res.redirect('/formli.do');
};

/**
 * 根据ID查询商品类型
 */
exports.update = async function (req, res, next) {
    // 接收get请求参数
    // var id = req.params.uid;
    var id = req.query.uid;
    var sql = 'SELECT tid,tname FROM commodity WHERE tid = ?';
    var parameters = [id];

    try {
        // 可能发生异常
        var data = await querydb(sql, parameters);
        res.render('user/user_updateli', data[0]);

    } catch (err) {
        // 处理异常
        next(err);
    }
};

/**
 * 修改商品类型提交
 */
exports.updateli = async function (req, res, next) {
    var username = req.body.usertype;
    var id = req.body.uid;
    var parametes = [username, id];
    console.log(parametes);
    var sql = 'UPDATE commodity SET tname = ? WHERE tid = ?';
    try {
        await querydb(sql, parametes);
        res.redirect('/formli.do');
    } catch (err) {
        next(err);
    }
};

/**
 * 添加商品
 */
exports.addType = async function (req, res) {
    var sql = 'SELECT id,name,city,price,number,img,picture,tid FROM product';
    var sqlb = 'SELECT tid,tname FROM commodity';
    var userTypes = await querydb(sql);
    var userTypesb = await querydb(sqlb);
    res.render('user/user_addType', {
        types: userTypes,
        typeb: userTypesb,
    });
};

/**
 * 添加商品提交
 */
exports.addTypeSub = async function (req, res, next) {
    var id = req.body.typeid;
    var name = req.body.name;
    var trait = req.body.trait;
    var current = req.body.current;
    var original = req.body.original;
    var activity = req.body.activity;
    try {
        var sql = 'INSERT INTO product (name,city,price,number,img,picture,tid)VALUES (?,?,?,?,?,?,?)';
        var paramers = [name, trait, current, original, req.session.headerimg, activity, id];
        console.log(paramers);
        await querydb(sql, paramers);
        res.redirect('/typeli.do');
    } catch (error) {
        next(error);
    }
};

/**
 * 商品列表
 */
exports.typeli = async function (req, res, next) {
    var pageCount = 0; // 总页数
    var pageSize = 5; // 每页5条记录
    var currentPage = 1; // 当前页
    if (req.query.pageNo) {
        currentPage = req.query.pageNo;
    }
    try {
        var sqlCount = 'SELECT count(*) AS count FROM product';
        var totalCount = await querydb(sqlCount);
        var total = totalCount[0].count;

        if (total % pageSize === 0) {
            pageCount = parseInt(total / pageSize);
        } else {
            pageCount = parseInt(total / pageSize) + 1;
        }

        var startIndex = (currentPage - 1) * pageSize; // 计算偏移量
        // var sql = 'SELECT id,name,city,price,number,img,picture,tid FROM product limit ?, ?';
        var sql = `SELECT  id, name, city,price,number, img,picture,tname
                     FROM product, commodity
                     WHERE product.tid = commodity.tid limit ?, ?`;

        var paramers = [startIndex, pageSize];
        var userList = await querydb(sql, paramers);
        // console.log(JSON.stringify(userList));
        res.render('user/user_typeli', {
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
 * 删除商品列表
 */
exports.deleteType = async function (req, res, next) {
    // 接收get请求参数
    var id = req.query.uid;
    var sql = 'DELETE FROM product WHERE id = ?';
    var parameters = [id];
    try {
        await querydb(sql, parameters);
    } catch (err) {
        next(err);
    }
    res.redirect('/typeli.do');
};

/**
 * 修改商品列表界面
 */
exports.updateType = async function (req, res, next) {
    // 接收get请求参数
    // var id = req.params.uid;
    var id = req.query.uid;
    var sql = `SELECT  id, name, city,price,number,img,picture,tname
                     FROM product, commodity
                     WHERE product.tid = commodity.tid and id=?`;
    var sql2 = 'SELECT tid,tname FROM commodity';
    var parameters = [id];
    console.log(parameters);
    try {
        // 可能发生异常
        var data = await querydb(sql, parameters);
        var data2 = await querydb(sql2);
        console.log(data);
        res.render('user/user_updateType', {play: data[0], typeb: data2});
    } catch (err) {
        // 处理异常
        next(err);
    }
};

/**
 * 修改商品列表提交
 */
exports.updateTypeSub = async function (req, res, next) {
    var id = req.body.uid;
    var name = req.body.name;
    var trait = req.body.trait;
    var current = req.body.current;
    var original = req.body.original;
    var activity = req.body.activity;
    var tid = req.body.typeid;
    try {
        var sql = 'UPDATE product SET  name = ?,city = ?,price = ?, number = ?,img = ?,picture = ?,tid = ? WHERE id = ?';
        var paramers = [name, trait, current, original, req.session.headerimg, activity, tid, id];
        console.log(paramers);
        await querydb(sql, paramers);
        res.redirect('/typeli.do');
    } catch (error) {
        next(error);
    }
};