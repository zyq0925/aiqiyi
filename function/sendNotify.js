/*

 * @Author: lxk0301 https://gitee.com/lxk0301

 * @Date: 2020-08-19 16:12:40

 * @Last Modified by: whyour

 * @Last Modified time: 2021-5-1 15:00:54

 * sendNotify 推送通知功能

 * @param text 通知头

 * @param desp 通知体

 * @param params 某些推送通知方式点击弹窗可跳转, 例：{ url: 'https://abc.com' }

 * @param author 作者仓库等信息  例：`本通知 By：https://github.com/`

 */

const querystring = require('querystring');

const $ = new Env();

const timeout = 15000; //超时时间(单位毫秒)

// =======================================微信server酱通知设置区域===========================================

//此处填你申请的SCKEY.

//(环境变量名 PUSH_KEY)

let SCKEY = '';

// =======================================Bark App通知设置区域===========================================

//此处填你BarkAPP的信息(IP/设备码，例如：https://api.day.app/XXXXXXXX)

let BARK_PUSH = '';

//BARK app推送铃声,铃声列表去APP查看复制填写

let BARK_SOUND = '';

// =======================================telegram机器人通知设置区域===========================================

//此处填你telegram bot 的Token，telegram机器人通知推送必填项.例如：1077xxx4424:AAFjv0FcqxxxxxxgEMGfi22B4yh15R5uw

//(环境变量名 TG_BOT_TOKEN)

let TG_BOT_TOKEN = '';

//此处填你接收通知消息的telegram用户的id，telegram机器人通知推送必填项.例如：129xxx206

//(环境变量名 TG_USER_ID)

let TG_USER_ID = '';

//tg推送HTTP代理设置(不懂可忽略,telegram机器人通知推送功能中非必填)

let TG_PROXY_HOST = ''; //例如:127.0.0.1(环境变量名:TG_PROXY_HOST)

let TG_PROXY_PORT = ''; //例如:1080(环境变量名:TG_PROXY_PORT)

let TG_PROXY_AUTH = ''; //tg代理配置认证参数

//Telegram api自建的反向代理地址(不懂可忽略,telegram机器人通知推送功能中非必填),默认tg官方api(环境变量名:TG_API_HOST)

let TG_API_HOST = 'api.telegram.org';

// =======================================钉钉机器人通知设置区域===========================================

//此处填你钉钉 bot 的webhook，例如：5a544165465465645d0f31dca676e7bd07415asdasd

//(环境变量名 DD_BOT_TOKEN)

let DD_BOT_TOKEN = '';

//密钥，机器人安全设置页面，加签一栏下面显示的SEC开头的字符串

let DD_BOT_SECRET = '';

// =======================================企业微信机器人通知设置区域===========================================

//此处填你企业微信机器人的 webhook(详见文档 https://work.weixin.qq.com/api/doc/90000/90136/91770)，例如：693a91f6-7xxx-4bc4-97a0-0ec2sifa5aaa

//(环境变量名 QYWX_KEY)

let QYWX_KEY = '';

// =======================================企业微信应用消息通知设置区域===========================================

/*

 此处填你企业微信应用消息的值(详见文档 https://work.weixin.qq.com/api/doc/90000/90135/90236)

 环境变量名 QYWX_AM依次填入 corpid,corpsecret,touser(注:多个成员ID使用|隔开),agentid,消息类型(选填,不填默认文本消息类型)

 注意用,号隔开(英文输入法的逗号)，例如：wwcff56746d9adwers,B-791548lnzXBE6_BWfxdf3kSTMJr9vFEPKAbh6WERQ,mingcheng,1000001,2COXgjH2UIfERF2zxrtUOKgQ9XklUqMdGSWLBoW_lSDAdafat

 可选推送消息类型(推荐使用图文消息（mpnews）):

 - 文本卡片消息: 0 (数字零)

 - 文本消息: 1 (数字一)

 - 图文消息（mpnews）: 素材库图片id, 可查看此教程(http://note.youdao.com/s/HMiudGkb)或者(https://note.youdao.com/ynoteshare1/index.html?id=1a0c8aff284ad28cbd011b29b3ad0191&type=note)

 */

let QYWX_AM = '';

// =======================================iGot聚合推送通知设置区域===========================================

//此处填您iGot的信息(推送key，例如：https://push.hellyw.com/XXXXXXXX)

let IGOT_PUSH_KEY = '';

// =======================================push+设置区域=======================================

//官方文档：http://www.pushplus.plus/

//PUSH_PLUS_TOKEN：微信扫码登录后一对一推送或一对多推送下面的token(您的Token)，不提供PUSH_PLUS_USER则默认为一对一推送

//PUSH_PLUS_USER： 一对多推送的“群组编码”（一对多推送下面->您的群组(如无则新建)->群组编码，如果您是创建群组人。也需点击“查看二维码”扫描绑定，否则不能接受群组消息推送）

let PUSH_PLUS_TOKEN = '';

let PUSH_PLUS_USER = '';

//==========================云端环境变量的判断与接收=========================

if (process.env.PUSH_KEY) {

  SCKEY = process.env.PUSH_KEY;

}

if (process.env.QQ_SKEY) {

  QQ_SKEY = process.env.QQ_SKEY;

}

if (process.env.QQ_MODE) {

  QQ_MODE = process.env.QQ_MODE;

}

if (process.env.BARK_PUSH) {

  if (

    process.env.BARK_PUSH.indexOf('https') > -1 ||

    process.env.BARK_PUSH.indexOf('http') > -1

  ) {

    //兼容BARK自建用户

    BARK_PUSH = process.env.BARK_PUSH;

  } else {

    BARK_PUSH = `https://api.day.app/${process.env.BARK_PUSH}`;

  }

  if (process.env.BARK_SOUND) {

    BARK_SOUND = process.env.BARK_SOUND;

  }

} else {

  if (

    BARK_PUSH &&

    BARK_PUSH.indexOf('https') === -1 &&

    BARK_PUSH.indexOf('http') === -1

  ) {

    //兼容BARK本地用户只填写设备码的情况

    BARK_PUSH = `https://api.day.app/${BARK_PUSH}`;

  }

}

if (process.env.TG_BOT_TOKEN) {

  TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;

}

if (process.env.TG_USER_ID) {

  TG_USER_ID = process.env.TG_USER_ID;

}

if (process.env.TG_PROXY_AUTH) TG_PROXY_AUTH = process.env.TG_PROXY_AUTH;

if (process.env.TG_PROXY_HOST) TG_PROXY_HOST = process.env.TG_PROXY_HOST;

if (process.env.TG_PROXY_PORT) TG_PROXY_PORT = process.env.TG_PROXY_PORT;

if (process.env.TG_API_HOST) TG_API_HOST = process.env.TG_API_HOST;

if (process.env.DD_BOT_TOKEN) {

  DD_BOT_TOKEN = process.env.DD_BOT_TOKEN;

  if (process.env.DD_BOT_SECRET) {

    DD_BOT_SECRET = process.env.DD_BOT_SECRET;

  }

}

if (process.env.QYWX_KEY) {

  QYWX_KEY = process.env.QYWX_KEY;

}

if (process.env.QYWX_AM) {

  QYWX_AM = process.env.QYWX_AM;

}

if (process.env.IGOT_PUSH_KEY) {

  IGOT_PUSH_KEY = process.env.IGOT_PUSH_KEY;

}

if (process.env.PUSH_PLUS_TOKEN) {

  PUSH_PLUS_TOKEN = process.env.PUSH_PLUS_TOKEN;

}

if (process.env.PUSH_PLUS_USER) {

  PUSH_PLUS_USER = process.env.PUSH_PLUS_USER;

}

//==========================云端环境变量的判断与接收=========================

/**

 * sendNotify 推送通知功能

 * @param text 通知头

 * @param desp 通知体

 * @param params 某些推送通知方式点击弹窗可跳转, 例：{ url: 'https://abc.com' }

 * @param author 作者仓库等信息  例：`本通知 By：https://github.com/whyour/qinglong`

 * @returns {Promise<unknown>}

 */

async function sendNotify(

  text,

  desp,

  params = {},

  author = '\n\n本项目 By：https://github.com/BlueSkyClouds',

) {

  //提供6种通知

  desp += author; //增加作者信息，防止被贩卖等

  await Promise.all([

    serverNotify(text, desp), //微信server酱

    pushPlusNotify(text, desp), //pushplus(推送加)

  ]);

  //由于上述两种微信通知需点击进去才能查看到详情，故text(标题内容)携带了账号序号以及昵称信息，方便不点击也可知道是哪个京东哪个活动

  text = text.match(/.*?(?=\s?-)/g) ? text.match(/.*?(?=\s?-)/g)[0] : text;

  await Promise.all([

    BarkNotify(text, desp, params), //iOS Bark APP

    tgBotNotify(text, desp), //telegram 机器人

    ddBotNotify(text, desp), //钉钉机器人

    qywxBotNotify(text, desp), //企业微信机器人

    qywxamNotify(text, desp), //企业微信应用消息推送

    iGotNotify(text, desp, params), //iGot

  ]);

}

function serverNotify(text, desp, time = 2100) {

  return new Promise((resolve) => {

    if (SCKEY) {

      //微信server酱推送通知一个\n不会换行，需要两个\n才能换行，故做此替换

      desp = desp.replace(/[\n\r]/g, '\n\n');

      const options = {

        url: SCKEY.includes('SCT')

          ? `https://sctapi.ftqq.com/${SCKEY}.send`

          : `https://sc.ftqq.com/${SCKEY}.send`,

        body: `text=${text}&desp=${desp}`,

        headers: {

          'Content-Type': 'application/x-www-form-urlencoded',

        },

        timeout,

      };

      setTimeout(() => {

        $.post(options, (err, resp, data) => {

          try {

            if (err) {

              console.log('发送通知调用API失败！！\n');

              console.log(err);

            } else {

              data = JSON.parse(data);

              //server酱和Server酱·Turbo版的返回json格式不太一样

              if (data.errno === 0 || data.data.errno === 0) {

                console.log('server酱发送通知消息成功ߎ霮');

              } else if (data.errno === 1024) {

                // 一分钟内发送相同的内容会触发

                console.log(`server酱发送通知消息异常: ${data.errmsg}\n`);

              } else {

                console.log(

                  `server酱发送通知消息异常\n${JSON.stringify(data)}`,

                );

              }

            }

          } catch (e) {

            $.logErr(e, resp);

          } finally {

            resolve(data);

          }

        });

      }, time);

    } else {

      console.log('\n\n您未提供server酱的SCKEY，取消微信推送消息通知🚫\n');

      resolve()

    }

  });

}

function CoolPush(text, desp) {

  return new Promise((resolve) => {

    if (QQ_SKEY) {

      let options = {

        url: `https://push.xuthus.cc/${QQ_MODE}/${QQ_SKEY}`,

        headers: {

          'Content-Type': 'application/json',

        },

      };

      // 已知敏感词

      text = text.replace(/京豆/g, '豆豆');

      desp = desp.replace(/京豆/g, '');

      desp = desp.replace(/ߐ毧/g, '');

      desp = desp.replace(/红包/g, 'H包');

      switch (QQ_MODE) {

        case 'email':

          options.json = {

            t: text,

            c: desp,

          };

          break;

        default:

          options.body = `${text}\n\n${desp}`;

      }

      let pushMode = function (t) {

        switch (t) {

          case 'send':

            return '个人';

          case 'group':

            return 'QQ群';

          case 'wx':

            return '微信';

          case 'ww':

            return '企业微信';

          case 'email':

            return '邮件';

          default:

            return '未知方式';

        }

      };

      $.post(options, (err, resp, data) => {

        try {

          if (err) {

            console.log(`发送${pushMode(QQ_MODE)}通知调用API失败！！\n`);

            console.log(err);

          } else {

            data = JSON.parse(data);

            if (data.code === 200) {

              console.log(`酷推发送${pushMode(QQ_MODE)}通知消息成功ߎ霮`);

            } else if (data.code === 400) {

              console.log(

                `QQ酷推(Cool Push)发送${pushMode(QQ_MODE)}推送失败：${

                  data.msg

                }\n`,

              );

            } else if (data.code === 503) {

              console.log(`QQ酷推出错，${data.message}：${data.data}\n`);

            } else {

              console.log(`酷推推送异常: ${JSON.stringify(data)}`);

            }

          }

        } catch (e) {

          $.logErr(e, resp);

        } finally {

          resolve(data);

        }

      });

    } else {

      console.log('您未提供酷推的SKEY，取消QQ推送消息通知🚫\n');

      resolve();

    }

  });

}

function BarkNotify(text, desp, params = {}) {

  return new Promise((resolve) => {

    if (BARK_PUSH) {

      const options = {

        url: `${BARK_PUSH}/${encodeURIComponent(text)}/${encodeURIComponent(

          desp,

        )}?sound=${BARK_SOUND}&${querystring.stringify(params)}`,

        headers: {

          'Content-Type': 'application/x-www-form-urlencoded',

        },

        timeout,

      };

      $.get(options, (err, resp, data) => {

        try {

          if (err) {

            console.log('Bark 
