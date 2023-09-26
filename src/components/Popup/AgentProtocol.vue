<template>
  <van-popup
    round
    v-model:show="isShow"
    close-on-click-overlay
    position="center"
    teleport="body"
    class="discount-popup"
  >
    <div class="popup-title-wrap">
      <span>{{ $t('代理条款') }}</span>
      <van-icon
        name="cross"
        @click="isShow = false"
      ></van-icon>
    </div>

    <div
      class="popup-body"
      v-html="textData"
    ></div>
    <!-- todo 可删除的翻译 -->
    <!-- <div>{{ $t('1.Blizzwin代理条规') }}</div>
      <div>{{ $t('1.1.这是一份由您与Blizzwin之间的合作联盟协议合同，为了保障双方共同的权益，您有义务去了解并且熟悉这份协议的内容与条规。如果您有任何不认同的条规，我们唯有终止联盟关系') }}</div>
      <div>{{ $t('2.注册条规') }}</div>
      <div>{{ $t('2.1.如果想成为Blizzwin的联盟合作伙伴，您必须先登录到“Fun88.com页面”，并且注册提交完整的资料') }}</div>
      <div>{{ $t('2.1.1为了有效防止一切不诚信联盟合作伙伴，Blizzwin风控部门将严厉的审核您的注册信息。请确保您所提供的资料属实') }}</div>
      <div>{{ $t('2.1.2.一个身份只能允许注册一个联盟账户') }}</div>
      <div>{{ $t('2.1.3Blizzwin保留最终所有的权益，在任何没解释的情况下终止联盟合作') }}</div>
      <div>{{ $t('3.联盟伙伴的义务和条规') }}</div>
      <div>{{ $t('3.1.在同意所有条规的情况下，联盟伙伴需要在不违反法律的情况下正面推广Blizzwin') }}</div>
      <div>{{ $t('3.1.1联盟伙伴必须尽起责任一致性的推广Blizzwin，相信Blizzwin。再保持商业道德的情况下把双方的利润最大化') }}</div>
      <div>{{ $t('3.1.2.联盟伙伴也必须捍卫Blizzwin的声誉，在不违法以及条规的前提下，正面的推广以及销售Blizzwin。') }}</div>
      <div>{{ $t('3.1.3联盟伙伴的所有推广素材包括网站，logo，横幅等等是绝对不能对玩家产生任何的误导或者混乱。联盟伙伴必须对推广素材附上至高的责任心，确保是专业以及正确的') }}</div>
      <div>{{ $t('3.1.4联盟伙伴也同意Blizzwin有最终的权益批准或取消您的任何推广活动。Blizzwin有权要求联盟伙伴修改，更换或者停止联盟伙伴的一切推广活动。联盟伙伴自己也不能成为自己下级代理伙伴以及下线会员') }}</div>
      <div>{{ $t('4.账户安全') }}</div>
      <div>{{ $t('4.1联盟伙伴有责任确保您的账户名不被盗用或者让第三方使用。') }}</div>
      <div>{{ $t('4.2Blizzwin将有时会抽查您的账户信息，避免您的各人信息以及账户盗用的事件发生。联盟伙伴必须与Blizzwin保持合作,提供一切需要审核的质料包括银行信息，各人信息等等') }}</div>
      <div>{{ $t('5.会员玩家数据的拥有权') }}</div>
      <div>{{ $t('5.1联盟伙伴必须对所有线下玩家的质资料保密。不能转让或者卖到别家平台上。') }}</div>
      <div>{{ $t('5.2您需要知悉，并且同意，我方从您搜集的任何数据信息都能被转移和储存在欧洲经济区（EEA）以外的地方，并且也同意将由欧洲经济区（EEA）除了我方或任何我服务供应商的员工进行操作。') }}</div>
      <div>{{ $t('6.下级代理') }}</div>
      <div>{{ $t('6.1Blizzwin也同事欢迎对下级代理的招募。上级代理也有义务发展下级代理。Blizzwin拥有追踪的批准权益') }}</div>
      <div>{{ $t('6.2您必须对您的下级代理负起最大的责任。确保下级在认同代理权益的情况下进行正面推广，将利润提到最大化。') }}</div>
      <div>{{ $t('7.Blizzwin对联盟伙伴的义务和条规') }}</div>
      <div>{{ $t('7.1Blizzwin的代理专员将会为联盟伙伴开通账户，扶持辅助，观察联盟伙伴业绩，会员转移并且提供建议等等的责任') }}</div>
      <div>{{ $t('7.2联盟伙伴有权利在不受任何的约束之下登录合营后台查询佣金，业绩，会员表现等等的报表') }}</div>
      <div>{{ $t('7.3Blizzwin保留单方面修改合作协议上的任何条规。包括修改佣金比例，付款程序，推广横幅文案，以及其他条规。如果联盟伙伴反对，联盟伙伴可以终止合作关系') }}</div>
      <div>{{ $t('8.无条件下终止') }}</div>
      <div>{{ $t('8.1任何联盟伙伴的不举行为一旦被Blizzwin发现，我们将无条件终止协议。') }}</div>
      <div>{{ $t('8.2在终止以后，一切的推广活动必须立即停止，账户冻结，无法取出佣金') }}</div>
      <div>{{ $t('8.3在终止以后，联盟伙伴所有的线下会员也将不再和联盟伙伴有任何关系，也不会有任何赔偿。') }}</div>
      <div>{{ $t('9.条款和终止声明') }}</div>
      <div>{{ $t('9.1为方便起见，任何一方均可随时终止这些条款以及您参与的方案，在书面通知后生效。') }}</div>
      <div>{{ $t('9.2任何终止通知，均应由另一方以书面形式发出。将通过电子邮件为书面的通知，并且也立即终止您的对任何方案的参与。') }}</div>
      <div>{{ $t('9.3一旦终止后，以下条款必须立即适用：') }}</div>
      <div>{{ $t('9.3.1根据条款，授予您的所有权利和许可将立即终止；') }}</div>
      <div>{{ $t('9.3.2您必须立即停止所有营销活动，并停止分发任何营销信息，同时也禁用从您到Fun88站点的任何链接；') }}</div>
      <div>{{ $t('9.3.3您必须立即返还给我们所有机密信息和/或会员信息以及您拥有保管和控制的所有机密信息；') }}</div>
      <div>{{ $t('9.3.4终止将不会免除您在终止条款前后，因违反条款而引起的任何责任。') }}</div>
      <div>{{ $t('9.4因您违反本条款以外的其他原因而终止后，您仍有权在六个月的时间内根据本文规定的条款和条件收取佣金。') }}</div>
      <div>{{ $t('9.5但如果您因违反这些条款而终止了您参与，则您无权获得自终止之日起的任何其他佣金。又如果由于任何欺诈性活动或我们认为非法或恶意的行为而终止了您的参与，我们也将保留追回先前向您支付的任何款项并要求追回所有费用的权利。除法律规定的其他权利和补救措施外，还需要调查此类活动，同时也会关闭您的帐户。') }}</div>
      <div>{{ $t('10.其他') }}</div>
      <div>{{ $t('10.1这些条款仅受马耳他(Malta)法律规范。与这些条款有关的任何诉讼都必须在马耳他(Malta)管制，您不可撤消，并须同意法院的管辖权。') }}</div>
      <div>{{ $t('10.2您必须理解，承认，确认并同意损害赔偿可不足以违反或威胁违反上述条款，并且如果违反或威胁这些条款的任何规定，，则双方的各自权利和义务将根据特定的表现，禁令，或其他公平的补救措施实行。这些条款中的任何内容均不会限制或影响我们在法律上或以其他方式违反或威胁这些条款中的任何权利。') }}</div>
      <div>{{ $t('10.3在任何情况下，这些条款的每一项规定均应按照适用法律的规定做有效解释，但如果这些条款中的任何规定在任何方面被认为是无效，非法或不可执行的，则该规定将被定义为无效。而仅在此类无效或无法执行的范围内，并不会使这些条款的其余部分或其中的任何条款无效。') }}</div> -->
  </van-popup>
</template>

<script setup>
import {
  inject, ref, watch, defineProps, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { getProtocol } from '@/api/protocol.js';

const isShow = ref(true);

const { data: textData } = useRequest(() => getProtocol({ CACHE: true, id: 1 }), {
  formatResult: (res) => res.replaceAll('\n', '<br>'),
});

</script>

<style lang="less" scoped>
.popup-title-wrap {
  display: flex;
  flex-shrink: 0;
  padding: 0 36px 0 44px;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  box-sizing: border-box;
  justify-content: space-between;
  width: 682px;
  height: 112px;
  align-items: center;
  background: var(--theme-color);
  color: var(--font-color-ffffff);
  font-size: 28px;
  font-weight: 400;
  .van-icon {
    font-size: 40px;
    position: absolute;
    top: unset;
    left: unset;
    right: 36px;
    border: none;
  }
  overflow-y: auto;
  box-sizing: border-box;
  span {
    text-align: center;
    width: 100%;
  }
}

.popup-body {
  padding: 42px 24px 70px 24px;
  flex-grow: 1;
  overflow-y: auto;
  font-size: 26px;
  border-radius: 20px;

  div {
    margin-bottom: 15px;
    color: var(--dark-fff, var(--font-color-222930));
  }
}

.title-wrap {
  margin-top: 42px;
  margin-bottom: 24px;
  .title {
    font-size: 28px;
    font-weight: 500;
    color: var(--dark-fff, var(--font-color-222930));
    line-height: 40px;
  }
  .subtitle {
    font-size: 28px;
    padding-left: 16px;
    font-weight: 400;
    color: var(--theme-color);
    line-height: 40px;
  }
}
</style>

<style>
.discount-popup {
  width: 682px !important;
  max-height: 85% !important;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
</style>
