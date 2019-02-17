var express = require('express');
var control = require('../controller/typeController');
var upload = require('../utils/fileupload_util');
var typeRouter = express.Router();

/**
 * 商品类型
 */
typeRouter.get('/usertype.do', control.userType);

/**
 * 商品类型添加
 */
typeRouter.post('/addUserType.do', control.addUserTypeSubmit);

/**
 * 商品类型列表
 */
typeRouter.get('/formli.do', control.userFormli);

/**
 * 删除商品类型列表
 */
typeRouter.get('/deleteli.do', control.deleteli);

/**
 * 修改商品类型界面
 * 根据ID查询商品类型
 */
typeRouter.get('/update.do', control.update);

/**
 * 修改商品类型提交
 */
typeRouter.post('/updateli.do', control.updateli);

/**
 * 添加商品
 */
typeRouter.get('/addType.do', control.addType);

/**
 * 添加商品提交
 */
typeRouter.post('/addType.do', upload.single('headerimg'), control.addTypeSub);
/**
 * 商品列表
 */
typeRouter.get('/typeli.do', control.typeli);

/**
 * 删除商品列表
 */
typeRouter.get('/deleteType.do', control.deleteType);

/**
 * 修改商品列表界面
 */
typeRouter.get('/updateType.do', control.updateType);

/**
 * 修改商品列表提交
 */
typeRouter.post('/updateType.do', upload.single('headerimg'), control.updateTypeSub);

module.exports = typeRouter;