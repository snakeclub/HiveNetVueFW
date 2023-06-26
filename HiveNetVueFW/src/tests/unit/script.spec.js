
function testFun(isOk) {
  return new Promise((resolve, reject) => {
    if (isOk) {
      resolve('ok');
    } else {
      reject('fail');
    }
  });
}

function callFun1(isOk) {
  let result;
  console.debug(0);
  async function syncCall() {
    result = await testFun(isOk);
    console.debug(1);
  }
  console.debug(2);
  syncCall();
  function checkReslut() {
    return result === undefined;
  }
  while (checkReslut()) {}
  console.debug(3);
  return result;
}

test('script', () => {
  try {
    const result = callFun1(true);
    console.debug(result);
  } catch (error) {
    console.debug(error);
  }
});
