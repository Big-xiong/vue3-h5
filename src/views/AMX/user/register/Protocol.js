import { Dialog } from 'vant';

export default () => {
  let subConfig = import.meta.globEager('/src/current_project/config/index.js');
  subConfig = Object.values(subConfig)?.[0]?.default;
  const html = '<ol class="protocol">'
    + `<li>${window.$t(
      '用户在进行游戏前应核实其所在地区进行线上游戏是否符合当地法律。',
    )}</li>`
    + `<li>${window.$t(
      '为避免任何争议，各用户在参与本网站所有游戏过程中，或在结束参与本网站所提供的游戏前，必须检查会员帐户内的资料是否正确。若发现有错误，请即时与所属的代理商联络。客户若不能提供充份的数据，其帐户内之一切数据或历史数据，以本公司资料库中的资料为准，用户不得异议。',
    )}</li>`
    + `<li>${window.$t(
      '本网站只向符合法定年龄的用户提供服务，用户须注意其居住地区的法律年龄限制，在不违反年龄限制之下才可使用本网站服务。',
    )}</li>`
    + `<li>${window.$t(
      '本公司将不承担任何用户因违反当地相关法律而引起之任何责任。',
    )}</li>`
    + `<li>${window.$t(
      '任何用户在参与本公司所有游戏而引起导致违反当地法律之任何责任，本公司概不负责。',
    )}</li>`
    + `<li>${window.$t(
      '用户有义务保障本身的用户名称和密码的隐私安全，并且不应允许任何第三方以任何形式，通过该用户名称和密码使用本网站之所有游戏，否则，一切责任需由该用户全部承担。',
    )}</li>`
    + `<li>${window.$t(
      '安装丶使用或参与本软件所有游戏之用户，均被视为符合该用户当地之法定年龄，以及该用户完全明白并且同意本协议之内容。',
    )}</li>`
    + `<li>${window.$t(
      '本网站有权拒绝或不接受任何用户以任何不正当方式登入或参与本网站所有游戏之权利。 各玩家请注意, 敬请各玩家以每局的真实影像的牌局结果作准, 路纸结果有时候会因为网路接收信号或各公司的数据库和伺服器维护而出现差异, 所以只供参考, 不能作准, 如有问题, 欢迎申请该局的重播。 以示公正。',
    )}</li>`
    + `<li>${window.$t(
      '因人为或系统发生不能预测因素所导致的失误，本公司管理层保留最终之决定权。',
    )}</li>`
    + `<li>${window.$t('不论在任何情况下，本公司之决定权乃最终之决定权。')}</li>`
    + `<li>${window.$t(
      '本公司不承担所有任何明确说明或者暗示的有关于该网站或者该网站上游戏的责任，所有一切都按照现在的规范提供。此外，本公司就任何有关质量，适用性，完整性或准确性的情况不向您提供任何担保或表达任何意见。本公司会尽最大能力去提供最好的服务，但是不保证游戏偶尔出现中断，发生不可预料的错误，失误及时被纠正或者系统不受病毒和蠕虫的侵袭。',
    )}</li>`
    + `<li>${window.$t(
      '无论任何情况下，本公司不赔偿任何由於使用该网站或者该网站上游戏所造成的损失。不管该损失是特殊原因做成的，直接的，间接的（包括但不仅限于，商业利润损失，意外中断损失，丢失商业信息，或者任何其他金钱上的损失），即使本公司事先知道可能会造成这些损失。',
    )}</li>`
    + `</ol>`;

  Dialog.alert({
    title: `${subConfig?.title}${window.$t('游戏条款')}`,
    message: html,
    messageAlign: 'left',
    allowHtml: true,
    className: 'protocol-wrap',
  });
};
