var crypto = require('crypto'); // 加载crypto库

exports.md5 = function (content) {
    // md5加密password
    var md5 = crypto.createHash('md5');
    md5.update(content); // 加密
    return md5.digest('hex');
};

var secret = 'web123key';
// 加密
exports.cipher = function (content) {
    var str = content; // 明文
    var cipher = crypto.createCipher('aes192', secret); // 定义加密方式，两个参数分别是加密算法、密码
    cipher.update(str, 'utf8', 'hex'); // 加密，编码方式从utf-8转为hex;
    var enc = cipher.final('hex'); // 编码方式重转为hex;
    return enc;
};

// 解密
exports.decipher = function (enc) {
    var str1 = enc; // 密文
    var decipher = crypto.createDecipher('aes192', secret);
    decipher.update(str1, 'hex', 'utf8'); // 编码方式从hex转为utf-8;
    var dec = decipher.final('utf8'); // 编码方式重转utf-8;
    return dec;
};