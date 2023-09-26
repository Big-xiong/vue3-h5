<template>
  <div class="quick-entry-wrap">
    <section-wrap :title="$t('快捷入口')">
      <ul class="entry-list">
        <li @click="go('/affiliate/member-list')">
          <SvgIcon
            name="member-manage"
            class="svg-icon"
          />
          <p class="name">{{$t("成员管理")}}</p>
        </li>
        <li @click="go('/affiliate/popularize-link')">
          <SvgIcon
            name="popularize-tools"
            class="svg-icon"
          />
          <p class="name">{{$t("推广工具")}}</p>
        </li>
        <li @click="go('/affiliate/commission-table')">
          <SvgIcon
            class="svg-icon"
            name="commission-table"
          />
          <p class="name">{{$t("佣金报表")}}</p>
        </li>
        <li @click="go('/affiliate/subordinate-charge')">
          <SvgIcon
            class="svg-icon"
            name="sub-charge"
          />
          <p class="name">{{$t("下级代充")}}</p>
        </li>
        <li @click="agentDeposit">
          <SvgIcon
            class="svg-icon"
            name="commission-withdraw"
          />
          <p class="name">{{$t("佣金提款")}}</p>
        </li>
        <li @click="go('/affiliate/popularize-material')">
          <SvgIcon
            class="svg-icon"
            name="popularized-material"
          />
          <p class="name">{{$t("推广素材")}}</p>
        </li>
        <li @click="go('/affiliate/omit-application')">
          <SvgIcon
            class="svg-icon"
            name="omit-apply"
          />
          <p class="name">{{$t("遗漏申请")}}</p>
        </li>
        <li @click="depositServe">
          <SvgIcon
            class="svg-icon"
            name="charge"
          />
          <p class="name">{{$t("额度充值")}}</p>
        </li>
        <li @click="go('/affiliate/financial-table')">
          <SvgIcon
            class="svg-icon"
            name="financial-table"
          />
          <p class="name">{{$t("财务报表")}}</p>
        </li>
        <li @click="go('/affiliate/member-register')">
          <SvgIcon
            class="svg-icon"
            name="vip-add"
          />
          <p class="name">{{$t("会员开户")}}</p>
        </li>
        <li
          v-if="spreadSwitch === 2"
          @click="go('/affiliate/affiliate-list')"
        >
          <SvgIcon
            class="svg-icon"
            name="agent-manage"
          />
          <p class="name">{{$t("代理管理")}}</p>
        </li>
        <li
          v-if="spreadSwitch === 2"
          @click="go('/affiliate/affiliate-register')"
        >
          <SvgIcon
            class="svg-icon"
            name="agent-add"
          />
          <p class="name">{{$t("代理开户")}}</p>
        </li>
      </ul>
    </section-wrap>
  </div>
</template>

<script setup>
import { Toast } from 'vant';
import { inject, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { bankcardlist } from '@/api/agent';
import SectionWrap from '../../components/SectionWrap.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const store = inject('store');
const { agent } = store.state;
const spreadSwitch = ref(agent.userInfo.spread_switch);
const global = inject('global');

watchEffect(() => {
  spreadSwitch.value = agent.userInfo.spread_switch;
});

const router = useRouter();
function go(url) {
  router.push(url);
}

function agentDeposit() {
  bankcardlist().then((res) => {
    if (res.length) {
      go('/affiliate/commission-withdraw');
    } else {
      Toast.fail(global.$t('请先添加银行卡'));
      go('/affiliate/add-card');
    }
  });
}

function depositServe() {
  if (agent.userInfo.deposit_switch === 2) {
    go('/affiliate/affiliate-deposit');
  } else {
    global.$dialog({ tpl: 'AgentWalletTips' });
  }
}

</script>

<style lang="less" scoped>
.quick-entry-wrap {
  margin-top: 15px;

  .entry-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 23px;

    li {
      flex: 0 0 25%;
      text-align: center;
      box-sizing: border-box;

      p {
        margin: 0;
        margin-bottom: 40px;
      }

      .svg-icon {
        width: 60px;
        height: 60px;
      }

      .icon-image {
        height: 60px;
      }

      .name {
        margin-top: 15px;
        font-size: 22px;
        color: var(--cur-font-color-fff, var(--font-color-999999));
      }
    }
  }
}
</style>
