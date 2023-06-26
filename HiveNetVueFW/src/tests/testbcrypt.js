const bcryptjs = require('bcryptjs');

// 原始密码
const password = '123456';

/**
 * 加密处理 - 同步方法
 * bcryptjs.hashSync(data, salt)
 *    - data  要加密的数据
 *    - slat  用于哈希密码的盐。如果指定为数字，则将使用指定的轮数生成盐并将其使用。推荐 10
 */
const hashPassword = bcryptjs.hashSync(password, 10);

console.log(hashPassword);

/**
 * 校验 - 使用同步方法
 * bcryptjs.compareSync(data, encrypted)
 *    - data        要比较的数据, 使用登录时传递过来的密码
 *    - encrypted   要比较的数据, 使用从数据库中查询出来的加密过的密码
 */

const isOk = bcryptjs.compareSync(password, '$2a$10$P8x85FYSpm8xYTLKL/52R.6MhKtCwmiICN2A7tqLDh6rDEsrHtV1W');

console.log(isOk);

const salt = bcryptjs.genSaltSync(10);

console.log('salt', salt);

const hashPassword1 = bcryptjs.hashSync(password, salt);
const hashPassword2 = bcryptjs.hashSync(password, salt);
const hashPassword3 = bcryptjs.hashSync(password, salt);

console.log(hashPassword1);
console.log(hashPassword2);
console.log(hashPassword3);
