/**
 * 测试api调用 （mock模式）
 */
import settings from '@/settings';
import apiCall from '@/api';

// 先将设置修改为mock模式
settings.axios.useMock = true;

test('test api call mock - promise - auto deal response', () => {
  // 非标准报文模式，获取序列缓存成功
  apiCall(
    'getSeqCache', null, { params: { sysId: '000', type: 'global', size: 15 }}
  ).then(data => {
    expect(data).toEqual({ start: 100, end: 115, sysId: '000', type: 'global' });
  });

  // 失败，直接返回错误
  apiCall(
    'getSeqCache', null, { params: { sysId: 'SSS', type: 'global', size: 15 }}
  ).then(data => {
    console.debug(data);
    expect(0).toBe(1); // 不应走到这个位置
  }).catch(error => {
    expect(error.message).toBe('Network error');
  });

  // 失败，包含错误信息
  apiCall(
    'getSeqCache', null, { params: { sysId: '000', type: 'test', size: 15 }}
  ).then(data => {
    console.debug(data);
    expect(0).toBe(1); // 不应走到这个位置
  }).catch(error => {
    console.debug(error);
    expect(error.response.status).toBe(404);
  });

  // 标准报文模式，获取验证码图片
  return apiCall(
    'getCaptchaImage', {}
  ).then(data => {
    expect(data.head.errCode).toBe('00000');
    expect(data.body.uuid).toBe('ec58298bd7de4f638d0fa7b4c2593d97');
  });
});

test('test api call mock - sync - auto deal response', async() => {
  // 测试同步模式
  try {
    const data = await apiCall(
      'getSeqCache', null, { params: { sysId: 'S01', type: 'global', size: 20 }}
    );
    expect(data).toEqual({ start: 100, end: 120, sysId: 'S01', type: 'global' });
  } catch (error) {
    console.debug(error);
  }
});
