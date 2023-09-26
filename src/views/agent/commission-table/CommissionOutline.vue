<template>
  <div class="commission-outline-wrap">
    <div :title="$t('下级概览')">
      <div class="outline-body">
        <ul class="card">
          <li v-for="(item, i) in allInfo" :key="i" @click="notify(item.tips)">
            <p class="theme-text" v-money="commission[item.key]"></p>
            <p class="caption-text">
              {{ item.text }}
              <van-icon v-if="item.tips" name="question-o" />
            </p>
          </li>
        </ul>

        <div class="img">
          <SvgIcon name="commission-gotten" v-if="commission.reachable_commission === 0" />
          <SvgIcon name="commission-ungotten" v-else />
        </div>
      </div>
      <ul class="wallet-wrap">
        <li>
          <p class="theme-text" v-money="commission.money || 0"></p>
          <p class="caption-text">{{ $t('钱包余额') }}</p>
        </li>
        <li>
          <p class="theme-text" v-money="commission.commission_money || 0"></p>
          <p class="caption-text">{{ $t('佣金余额') }}</p>
        </li>
        <li>
          <p class="theme-text">{{ commission.rate || 0 }}%</p>
          <p class="caption-text">{{ $t('佣金比例') }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { Dialog } from 'vant';
import { inject, ref } from 'vue';
import { useRequest } from 'ahooks-vue';
import { commissionOverview } from '@/api/agent';
import SectionWrap from '../components/SectionWrap.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
const allInfo = ref([
  {
    key: 'reachable_commission',
    tips: global.$t('未派发佣金之和，达到指定派发时间将自动派发至佣金钱包哦！'),
    text: global.$t('未派发佣金(周)'),
  },
  {
    key: 'month_commission',
    text: global.$t('累计赚取佣金'),
  },
]);
const commission = ref({
  reachable_commission: 0,
  month_commission: 0,
  money: 0,
  rate: 0,
  commission_money: 0,
});

const { run: getOverView, loading: getOverviewLoading } = useRequest(
  (params) => commissionOverview({ ...params, LOADING: true }),
  {
    onSuccess(result) {
      commission.value = result;
    },
  },
);

function notify(tips) {
  if (tips) global.$dialog({ tpl: 'AgentTips', message: tips });
}
</script>

<style lang="less" scoped>
.commission-outline-wrap {
  :deep(.van-button) {
    width: 100%;
  }

  p {
    margin: 0;
  }

  .outline-body {
    position: relative;
    color: var(--font-color-999999);

    .img {
      position: absolute;
      right: -1px;
      top: 0;

      .svg-icon-wrap {
        width: 94px;
        height: 94px;
      }
    }
  }

  .card {
    display: flex;
    background: var(--dark-bg-color-191919, var(--bg-color-f3f3f3));
    flex-wrap: wrap;
    align-items: center;
    margin-top: 20px;
    border-radius: 8px 8px 0px 8px;

    li {
      width: 50%;
      padding: 30px 0 25px 0;

      .theme-text {
        color: var(--dark-fff, var(--font-color-2d2e2f));
        font-size: 48px;
        margin-bottom: 15px;
        text-align: left;
        padding-left: 40px;
      }

      .caption-text {
        color: var(--font-color-999999);
        text-align: left;
        padding-left: 40px;

        img {
          display: inline-block;
          transform: translateY(-5px);
        }
      }
    }
  }

  .caption-text .van-icon {
    color: var(--theme-color);
  }

  .wallet-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-color-242d33, var(--bg-color-ededed));
    padding: 0 7.5px;
    border-radius: 0 0 8px 8px;
    color: var(--font-color-999999);

    li {
      width: 50%;
      padding: 30px 0;

      .theme-text {
        color: var(--dark-fff, var(--font-color-2d2e2f));
        font-size: 32px;
        margin-bottom: 15px;
        text-align: center;
      }

      .caption-text {
        color: var(--cur-font-color-fff-4, var(--font-color-222930));
        text-align: center;
        font-size: 24px;
      }
    }
  }
}
</style>
