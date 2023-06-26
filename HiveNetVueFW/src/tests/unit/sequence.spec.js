import settings from '@/settings';
import { getSeqNo, getSeqSerialNum } from '@/utils/sequence';

// 先将设置修改为mock模式
settings.axios.useMock = true;

test('test sequence', async() => {
  const serialNum = await getSeqSerialNum('global');
  console.debug('serialNum', serialNum);
  const result = await getSeqNo('global');
  console.debug(result);
});
