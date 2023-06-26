/**
 * 系统层面的mock参数
 */
import { sidebarMenusTest, rightMenusTest, fixedTagsTest } from './test-user.js';

export default {
  // 获取序列号缓存
  'S01/SeqCache': {
    // 匹配路由，key为返回值设置，value为匹配表达式数组
    matchRouter: {
      networkError: [
        'reqUrl.query.sysId === "SSS"'
      ],
      statusCodeError: [
        'reqUrl.query.sysId === "000"',
        'reqUrl.query.type === "test"'
      ]
    },
    default: {
      // 指定需要通过表达式更新值的对象, 非返回值，返回时将被删除
      scriptPath: [
        'data.sysId', 'data.type', 'data.end'
      ],

      // 是否为标准报文
      isStandard: false,

      // 响应信息
      response: {
        data: {
          sysId: 'reqUrl.query.sysId',
          type: 'reqUrl.query.type',
          start: 100,
          end: 'Number(reqUrl.query.size) + 100'
        }
      }
    },
    // 获取失败的路由
    networkError: {
      // 是否失败
      success: false,
      // 直接失败描述
      errorMessage: 'Network error'
    },
    // http返回状态码错误
    statusCodeError: {
      // 是否失败
      success: false,
      // 是否为标准报文
      isStandard: false,
      // 响应信息
      response: {
        status: 404,
        statusText: 'Resource not found',
        data: {}
      }
    }
  },

  // 获取验证码图片
  'S01/captchaImage': {
    default: {
      // 响应信息
      response: {
        data: {
          body: {
            captchaOnOff: 'y',
            img: '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',
            uuid: 'ec58298bd7de4f638d0fa7b4c2593d97'
          }
        }
      }
    }
  },

  // 获取用户验证需要的服务器参数
  'S01/authServerPara': {
    default: {
      // 响应信息
      response: {
        data: {
          body: {
            publicKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC3h12/mAP3GL7uHFLhCauip9L3' +
            'RjrlMZhcI0HzSjc8QPTpJVexjMAE6GuMkRxPdRlnBIAAgmBdW7is/yUXPiZsY+lz' +
            'SWvFplqQM80+7WG9tKPL+B+TeRlZyiNESbMS4OKyRarDtgy/qKD/hMmKnUPSTbTW' +
            'FiSrMk3LNFFDGePkyQIDAQAB',
            randomStr: 'abcdefg',
            salt: '$2a$10$.IEoIiSBL.EsuGyUfaN1mO'
          }
        }
      }
    }
  },

  // 获取菜单配置
  'S01/menusConfig': {
    default: {
      // 响应信息
      response: {
        data: {
          body: {
            sidebarMenus: sidebarMenusTest,
            rightMenus: rightMenusTest,
            fixedTags: fixedTagsTest
          }
        }
      }
    }
  }
};
