/**
 * 最终执行的promise函数
 * @param {bool} isReject - 是否拒绝
 * @param {bool} isRaise - 是否抛出异常
 * @returns Promise
 */
function base(isReject, isRaise) {
  const is_raise = isRaise || false;
  const is_reject = isReject || false;
  return new Promise((resolve, reject) => {
    if (is_raise) {
      throw new Error('base error');
    }

    if (is_reject) {
      reject({ 'result': 'reject' });
    } else {
      resolve({ 'result': 'resolve' });
    }
  });
}

/**
 * 嵌套方式执行
 * @param {bool} isReject - 是否拒绝
 * @param {bool} isRaise - 是否抛出异常
 * @returns Promise
 */
function nesting(isReject, isRaise) {
  const is_raise = isRaise || false;
  const is_reject = isReject || false;
  return new Promise((resolve, reject) => {
    base(is_reject, is_raise).then((data) => {
      resolve(data);
    }).catch((error) => {
      reject(error);
    });
  });
}

/**
 * 嵌套方式不处理reject
 * @param {bool} isReject - 是否拒绝
 * @param {bool} isRaise - 是否抛出异常
 * @returns Promise
 */
function nestingNoCatch(isReject, isRaise) {
  const is_raise = isRaise || false;
  const is_reject = isReject || false;
  return new Promise((resolve, reject) => {
    try {
      base(is_reject, is_raise).then((data) => {
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 同步方式执行基础Promise函数
 */
function syncRunBase() {
  base(false, false).then((data) => {
    console.debug('run syncRunBase 1: ', data);
  });
  base(true, false).catch(error => {
    console.debug('run syncRunBase 2: ', error);
  });
  base(false, true).catch(error => {
    console.debug('run syncRunBase 3: ', error);
  });
}

/**
 * 异步模式执行基础Promise函数
 */
async function asyncRunBase() {
  let result = await base(false, false);
  console.debug('run asyncRunBase 1: ', result);

  try {
    result = await base(true, false);
  } catch (error) {
    console.debug('run asyncRunBase 2: ', error);
  }

  try {
    result = await base(false, true);
  } catch (error) {
    console.debug('run asyncRunBase 3: ', error);
  }
}

/**
 * 同步方式执行嵌套Promise函数
 */
function syncRunNesting() {
  nesting(false, false).then((data) => {
    console.debug('run syncRunNesting 1: ', data);
  });
  nesting(true, false).catch(error => {
    console.debug('run syncRunNesting 2: ', error);
  });
  nesting(false, true).catch(error => {
    console.debug('run syncRunNesting 3: ', error);
  });
}

/**
 * 同步方式执行嵌套Promise函数
 */
function syncRunNestingNoCatch() {
  nestingNoCatch(false, false).then((data) => {
    console.debug('run nestingNoCatch 1: ', data);
  });
  nestingNoCatch(true, false).catch(error => {
    console.debug('run nestingNoCatch 2: ', error);
  });
  nestingNoCatch(false, true).catch(error => {
    console.debug('run nestingNoCatch 3: ', error);
  });
}

// syncRunBase();
// asyncRunBase();
// syncRunNesting();
syncRunNestingNoCatch();
