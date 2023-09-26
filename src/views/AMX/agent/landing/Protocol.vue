<template>
  <div class="agent-protocol-wrap">
    <div class="title">
      <div class="top">{{ $t("合营协议") }}</div>
    </div>
    <div class="agent-protocol-list">
      <van-collapse v-model="active" accordion>
        <van-collapse-item :title="$t('一、注册规约')" :name="1">
          <div class="text">
            {{
              $t(
                `1. 为有效防止非诚信合作商滥用${subConfig.title}所提供的代理优惠制度，公司审查部门将严格审核每位代理商注册时提供的个人资料（包括姓名，邮件及电话等）若经审核发现代理商有任何不良营利企图，或与其他代理商、会员进行合谋套利等不诚信行为，${subConfig.title}将关闭该合作代理商之账户并收回该代理商的所有佣金与优惠。`
              )
            }}
          </div>
          <div class="text">
            {{
              $t(
                `2. 同一IP/同一姓名/同一收款账号的会员只能是一个合作商的下线，合作商自已不能成为自已及其他合作商的下线会员。同一IP/同一姓名/同一收款账号只能申请一个合作伙伴账号。`
              )
            }}
          </div>
        </van-collapse-item>

        <van-collapse-item :title="$t(`二、权责条款`)" :name="2">
          <div class="title">{{ $t(`1. 合作伙伴的权利和义务`) }}</div>
          <div class="text">
            {{
              $t(
                `1.1. 合作伙伴需尽其责任积极销售及推广${subConfig.title}以求双方利润最大化。合作伙伴必须在不违反法律的前提下，进行正面宣传、销售及推广${subConfig.title}。由此产生的宣传、销售及推广时所产生的费用需由合作伙伴自行承担。`
              )
            }}
          </div>
          <div class="text">
            {{
              $t(
                `1.2. 合作伙伴不得私自转载、公开、分发包括主页、域名、logo、报表、游戏画面、图文等在内的相关资料。另外，在推广时，合作伙伴要保障${subConfig.title}的利益，任何有损公司声誉的行为，一经发现立即终止合作关系。`
              )
            }}
          </div>
          <div class="title">{{ $t(`2. ${subConfig.title}对合作伙伴的权利与义务`) }}</div>
          <div class="text">
            {{
              $t(
                `2.1. ${subConfig.title}的客服代表将会协助合作伙伴给下线办理开户业务并观察其投注状况。代理商及会员皆须同意并遵守${subConfig.title}的会员条例、政策及操作程序。合作伙伴可随时登入管理后台了解其下线会员的账户报表。`
              )
            }}
          </div>
          <div class="text">
            {{
              $t(
                `2.2. ${subConfig.title}保留所有对合作代理商或会员之账户加以拒绝或冻结的权利。`
              )
            }}
          </div>
          <div class="text">
            {{
              $t(
                `2.3. 在某些情况下经过认真审查${subConfig.title}保留单方面修改合作协议上的任何条款的权利，${subConfig.title}会在网站刊登修改情况告知合作伙伴。修改内容可能包括：佣金范围、付款程序、及其它条例。如合作伙伴对于修改表示反对，合作伙伴可终止合约。修改后合作伙伴不作任何异议，便视作默认接受和对新协议表示认可。`
              )
            }}
          </div>
        </van-collapse-item>
        <van-collapse-item :title="$t(`三、协议期限和终止`)" :name="3">
          <div class="title">{{ $t(`1. 期限和终止`) }}</div>
          <div class="text">
            {{
              $t(
                `合作协议从合作伙伴申请成功后开始执行。合作伙伴在任何时间均可终止此合约，但必须以书面形式提前7日内通知对方有关合约的终止，合作伙伴可将通知以电邮形式寄致：`
              )
            }}{{ siteInfo.email }}{{
  $t(`如合作伙伴违反合作协议，`)
}}{{ $t("有权在没有通知的情况下终止合约。") }}
          </div>
          <div class="title">{{ $t(`2. 保密信息`) }}</div>
          <div class="text">
            {{
              $t(
                `在合约执行期间，合作伙伴同意不会透露相关${subConfig.title}的合作机密数据于第三方，除得到${subConfig.title}书面同意及可利用这些机密文件作为日后必要时作合约之跟进之用。合作伙伴有义务在合约终止后仍执行机密文件的保密。`
              )
            }}
          </div>
          <div class="title">{{ $t(`3. 无条件终止`) }}</div>
          <div class="text">
            {{
              $t(
                `如果合作伙伴在任何情形下，通过大批量发送垃圾电子邮件宣传${subConfig.title}的服务，我们将无条件立即终止此协议，并将合作伙伴账户重新审核及冻结其款项。合作商不可以提出任何与我们有关的要求或声明、或给出任何承诺，同时您也没有任何权力将我们约束在任何义务之下。`
              )
            }}
          </div>
          <div class="title">{{ $t(`4. 不承诺`) }}</div>
          <div class="text">
            {{
              $t(
                `有关于合作项目，我们不发表任何关于我们网站运作将会无干扰和无错误的声明，因而即便一旦出现问题我们也将对此不负任何责任。`
              )
            }}
          </div>
          <div class="title">{{ $t(`5. 管理条理`) }}</div>
          <div class="text">
            {{
              $t(
                `无论是在任何法律条例的管制下，此协议都将受制于菲律宾的法律。任何与此协议相关的法律行为必须被带到菲律宾政府。您认可并认真阅读了此协议并同意其所有的规则及条款，在任何时候您确认您已经自主评估了参与的意愿并不依赖于任何在此协议之外的言论、保证和声明。通过下载我们的宣传文章和在您的网站上创建一个链接到我们的网站上，您明确地同意被此协议的规则和条款所约制。`
              )
            }}
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, watch } from 'vue';

const subConfig = inject('subConfig');
const $store = inject('store');
$store.dispatch('app/getDict', ['siteinfo']);
const { dicts } = $store.state.app;

const siteInfo = ref({});

const active = ref('');

watch(
  () => dicts.siteinfo,
  (info) => {
    siteInfo.value = info;
  },
);
</script>

<style scoped lang="less">
.agent-protocol-wrap {
  .agent-protocol-list {
    width: 690px;
    margin: 54px auto 0;

    :deep(.van-collapse) {
      &::after {
        border: none !important;
      }

      .van-collapse-item--border::after {
        border: none;
      }

      .van-collapse-item {
        .van-cell {
          background: none;
          height: 60px;
          font-size: 28px;
          font-weight: 400;
          line-height: 60px;
          padding: 0;

          .van-cell__title {
            color: var(--font-color-000);
            text-align: left;

            span {
              display: block;
              text-align: left;
            }
          }

          .van-icon {
            top: 30%;
          }

          &:not(:last-child)::after {
            display: none;
          }
        }

        .van-collapse-item__content {
          background: none;
          font-size: 24px;
          font-weight: 400;
          // color: var(--font-color-fff-6);
          line-height: 34px;

          .text {
            text-align: justify;
          }
        }
      }
    }
  }
}
</style>
