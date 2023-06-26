/**
 * 流水号生成模块
 */
import settings from '@/settings';
import stringTools from '@/utils/base/StringTools';
import datetimeTools from '@/utils/base/DatetimeTools';
import apiCall from '@/api';

// 可用序列号队列清单
const seqQueues = {};

/**
 * 获取指定类型的自然序号
 * @param {string} type - 流水号类型, global - 统一流水号, system - 系统流水号, interface - 接口流水号
 * @returns
 */
export async function getSeqSerialNum(type) {
  seqQueues[type] = seqQueues[type] || [];
  let seqNo = seqQueues[type].shift();
  if (seqNo === undefined) {
    // 没有找到可用流水号，获取一批新的流水号
    console.debug('start getSeqSerialNum');
    await generateSeqCache(type);
    console.debug('end getSeqSerialNum');
    seqNo = seqQueues[type].shift();
  }
  return seqNo;
}

/**
 * 生成序列缓存
 * @param {string} type - 流水号类型, global - 统一流水号, system - 系统流水号, interface - 接口流水号
 */
export async function generateSeqCache(type) {
  // 获取到的序列号区间
  console.debug('start generateSeqCache');
  const resData = await apiCall(
    'getSeqCache', null,
    { params: { sysId: settings.ajaxMessage.sysId, type: type, size: 15 }}
  );
  seqQueues[type] = seqQueues[type] || [];
  for (let i = resData.start; i <= resData.end; i++) {
    seqQueues[type].push(i);
  }
  console.debug(seqQueues);
  console.debug('end generateSeqCache');
}

/**
 * 获取标准序列号
 * @param {string} type - 流水号类型, global - 统一流水号, system - 系统流水号, interface - 接口流水号
 * @param {string} targetSysId - 3位的目标系统标识
 * @returns
 */
export default async function getSeqNo(type, targetSysId) {
  const serialNum = await getSeqSerialNum(type);
  let serialNumStr;
  let dateStr;
  let tempDestSysId = '';
  if (type === 'interface') {
    // 接口流水号
    serialNumStr = stringTools.fixedLenString(
      serialNum.toString(), 10, '0'
    );
    tempDestSysId = targetSysId;
    dateStr = datetimeTools.formatToStr(
      datetimeTools.now(), 'yyyyMMddhhmmss'
    );
  } else if (type === 'system') {
    // 系统流水号
    serialNumStr = stringTools.fixedLenString(
      serialNum.toString(), 12, '0'
    );
    dateStr = datetimeTools.formatToStr(
      datetimeTools.now(), 'yyyyMMdd'
    );
  } else {
    // 统一流水号
    serialNumStr = stringTools.fixedLenString(
      serialNum.toString(), 10, '0'
    );
    dateStr = datetimeTools.formatToStr(
      datetimeTools.now(), 'yyyyMMdd'
    );
  }

  // 返回组合后的流水号
  const ajaxPara = settings.ajaxMessage;
  return ajaxPara.sysId + ajaxPara.moduleId + ajaxPara.serverId + tempDestSysId + dateStr + serialNumStr;
}
