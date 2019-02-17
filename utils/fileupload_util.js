var multer = require('multer');
var fs = require('fs');

// 指定上传文件名
var uploadFolder = './public/upload/';
var createFolder = function (folder) {
    try {
        fs.accessSync(folder); // 如果文件目录存在覆盖
    } catch (e) {
        fs.mkdirSync(folder);
    }
};
createFolder(uploadFolder); // 创建图片保存目录

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder); // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        req.session.headerimg = '/upload/' + file.fieldname + '-' + Date.now() + '.jpg';
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, file.fieldname + '-' + Date.now() + '.jpg');
    }
});
// 通过 storage 选项来对 上传行为 进行定制化
var myUpload = multer({
    storage: storage,
});

module.exports = myUpload;