import JSEncrypt from 'jsencrypt/bin/jsencrypt.min';

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC3h12/mAP3GL7uHFLhCauip9L3' +
  'RjrlMZhcI0HzSjc8QPTpJVexjMAE6GuMkRxPdRlnBIAAgmBdW7is/yUXPiZsY+lz' +
  'SWvFplqQM80+7WG9tKPL+B+TeRlZyiNESbMS4OKyRarDtgy/qKD/hMmKnUPSTbTW' +
  'FiSrMk3LNFFDGePkyQIDAQAB';

const a = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtNyPMNhnMybgMKsa65jd' +
'LlX1uKP1B4fqgatnb0lZ4RveZq9uRAQmkr8gXV64KwtTQki/rzQbUtlSel485BYz' +
'MXhtk1SjZcyGqdSH8TJP8kLyWlWFFoWSIWkz4qqt4edyStrfnYbuRnU5RGqvckH/' +
't50aaK6mlDp8YoUL7Vkd6YZdii3IULN4TafMEZjDdY3p2AzsKhUNxgLgQTN3l+Us' +
'POYZJ/fgymL73yVs4/73eHM2rZDA0uTUY8UxE1IWpS19/+cP5L0YMnrkhZKrUV+z' +
'O6L6U5spl6bbZf0shENLCrkZVHTOa8RNQCTQmjVXRX1Xyk+bS9yOeHhNPqm1aPFs' +
'VQIDAQAB';

const privateKey = 'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBALeHXb+YA/cYvu4c' +
  'UuEJq6Kn0vdGOuUxmFwjQfNKNzxA9OklV7GMwAToa4yRHE91GWcEgACCYF1buKz/' +
  'JRc+Jmxj6XNJa8WmWpAzzT7tYb20o8v4H5N5GVnKI0RJsxLg4rJFqsO2DL+ooP+E' +
  'yYqdQ9JNtNYWJKsyTcs0UUMZ4+TJAgMBAAECgYAXC1s9JHRTAXtv4ISTlyhC+zml' +
  'LN9WSfzsjMzKJKZ83VcjMzoopBi0RQ7EDrB0VarD4a/E4JoC/vJYXo0ktvwR50mL' +
  'nOuC/xeq06TU3Xv2s15Tyopw4SPwsHyjgtw1enAh6ZPYAWdXaTKlt6YicidZCIWo' +
  'BpWziOAOWv1i+vLhAQJBAPNNdqYgICkWHpV03FONo99z2E8DcSyqlmIMcCnrBfjq' +
  'gMBmOeBBs8Bh803UT0CZHRoeQSFp//PMGw1tfQlcpKkCQQDBG1I0opmeKRnhTbLi' +
  'eXkkVDhyoUT/qPl2K+vAeH4v0DzqaYpjLMxdZx6PYC7wuSr8cNQ5pSsmAUrDwHch' +
  'HTMhAkEA3BALqjTSgfcU0J/zjMtHFpyEYOs/GWRuQt73MKL4Mu2AaQXNgW5L9E1k' +
  'MNhAmrAi53XH+T4UGOJa8ak/eBFIiQJBAILkB/aReFrSNS6YQfZsrAZJ5/EbCu/Y' +
  'Ey9cWfIeOjoihgfF/f13MhblfLtmUKrueAqgV9my8OpT2d+Rp64UYsECQGpjdIzT' +
  'rQu13HufAKoUiLb82CmfWFHVyRk5nhcXntPIMXaTxTYQNXzKgWvMwxbKdnadX4+2' +
  'agKPkAhTM8h4gSE=';

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt); // 对数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt();
  encryptor.setPrivateKey(privateKey); // 设置私钥
  return encryptor.decrypt(txt); // 对数据进行解密
}

