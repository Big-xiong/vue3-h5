<template>
  <div class="member-detail-wrap" v-if="memberData">
    <div class="member-info-card">
      <div class="login-status-wrap">
        <h4>{{ curMemberInfo?.username ?? memberData?.username }}</h4>
        <div class="top">
          <i :class="{ gray: !memberData.is_online }"></i>
          {{ memberData.is_online ? $t('在线') : $t('离线') }}
        </div>
      </div>
      <div class="member-info-card-warp">
        {{
          memberData.first_recharge_money !== 0
            ? $t('有效会员')
            : $t('无效会员')
        }}
        <i>|</i>
        {{
          memberData.user_bank?.length === 0
            ? $t('未绑定银行卡')
            : $t('已绑定银行卡')
        }}
        <i>|</i>
        {{ memberData.mobile ? $t('已绑定手机号') : $t('未绑定手机号') }}
      </div>
      <div class="login-info">
        <div>
          <div class="member-info-time">
            <span>{{ $t('注册时间') }}</span>
            {{ curMemberInfo?.created_at ?? memberData.created_at }}
          </div>
          <div class="member-info-time">
            <span>{{ $t('最后登录') }}</span>
            {{ curMemberInfo?.last_update_time ?? memberData.last_update_time }}
          </div>
          <div v-if="subConfig.isCurrency">
            <span>{{ $t('地区') }}</span>
            {{ memberData.region?.name }}
          </div>
          <div v-if="subConfig.isCurrency">
            <span>{{ $t('货币') }}</span>
            {{ memberData.currency?.name }}
          </div>
        </div>
        <van-button type="primary" @click="router.push({ name: 'agentWithdraw' })">{{ $t('转账') }}</van-button>
      </div>
    </div>

    <date-range type="date" @change="handleDateChange" />

    <div class="detail-list">
      <div>
        <span>{{ $t('首存金额') }}</span>
        <span v-if="memberData?.first_recharge_money" v-money:[memberData.currency.symbol]="memberData.first_recharge_money"></span>
        <span v-else>0.00</span>
      </div>
      <div>
        <span>{{ $t('纯利') }}</span>
        <span v-if="memberData?.profit" v-money:[memberData.currency.symbol]="memberData.profit"></span>
        <span v-else>0.00</span>

      </div>
      <div>
        <span>{{ $t('代充总额') }}</span>
        <span v-if="memberData?.agent_recharge_money"  v-money:[memberData.currency.symbol]="memberData.agent_recharge_money"></span>
        <span v-else>0.00</span>
      </div>
      <div>
        <span>{{ $t('充值总额') }}</span>
        <span v-if="memberData?.user_wallet_static?.deposit_money" v-money:[memberData.currency.symbol]="memberData.user_wallet_static?.deposit_money"></span>
        <span v-else>0.00</span>
      </div>
      <div>
        <span>{{ $t('提款总额') }}</span>
        <span v-if="memberData?.user_wallet_static?.draw_money" v-money:[memberData.currency.symbol]="memberData.user_wallet_static?.draw_money"></span>
        <span v-else>0.00</span>
      </div>
      <div>
        <span>{{ $t('红利总额') }}</span>
        <span v-if="memberData?.user_wallet_static?.benefit_money" v-money:[memberData.currency.symbol]="memberData.user_wallet_static?.benefit_money"></span>
        <span v-else>0.00</span>
      </div>
      <div>
        <span>{{ $t('投注总额') }}</span>
        <span v-if="memberData?.user_wallet_static?.bet" v-money:[memberData.currency.symbol]="memberData.user_wallet_static?.bet"></span>
        <span v-else>0.00</span>
      </div>
      <div>
        <span>{{ $t('派彩总额') }}</span>
        <span v-if="memberData?.user_wallet_static?.payout" v-money:[memberData.currency.symbol]="memberData.user_wallet_static?.payout"></span>
        <span v-else>0.00</span>
      </div>
      <div>
        <span>{{ $t('投注单数') }}</span>
        <!--        <span v-money:[memberData.currency.symbol]="memberData.bet_totals"></span>-->
        <span>{{ memberData?.bet_totals ?? 0}}</span>
      </div>
    </div>
    <!-- <van-empty
      v-else
      :image="$getSrc('/src/assets/images/agent/empty@2x.png')"
      :description="$t('暂无数据')"
    /> -->
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRequest } from 'ahooks-vue';
import dayjs from 'dayjs';
import DateRange from '@/components/DateRange.vue';
import { memberlist } from '@/api/agent';

const subConfig = inject('subConfig');
const router = useRouter();
const route = useRoute();

const memberData = ref({});
let curMemberInfo = {};
const memberId = route.query.id ? route.query.id : '';

if (sessionStorage.getItem('memberDetailData')) {
  try {
   curMemberInfo = memberData.value = JSON.parse(sessionStorage.getItem('memberDetailData'));
  } catch (e) {
    console.error('parse member detail data error');
  }
}

const {
  run: getMemberListData,
  loading: getMemberLoading,
} = useRequest(
  (params) => memberlist({
    ...params,
    LOADING: true,
  }),
  {
    manual: true,
    onSuccess(result) {
      const data = result?.data.find((item) => item.id === memberId * 1);
      data ? memberData.value = data : memberData.value = [];
    },
  },
);

function handleDateChange(data) {
  if (data.startDate && data.endDate) {
    getMemberListData({
      username: memberData.value.username,
      start_date: dayjs(data.startDate).format('YYYY-MM-DD'),
      end_date: dayjs(data.endDate).format('YYYY-MM-DD'),
    });
  }
}
</script>

<style scoped lang="less">
.member-detail-wrap {
  box-sizing: border-box;
  padding: 0 30px;

  .member-info-card {
    font-size: 22.5px;
    font-weight: 400;
    padding: 40px 30px;
    box-sizing: border-box;
    width: 100%;
    margin: 0 auto;
    background: var(--dark-bg-color-191919, var(--bg-color-f3f3f3));
    border-radius: 8px;
    margin-top: 30px;
    border-radius: 8px;
    color: var(--dark-fff, var(--font-color-999999));

    > div {
      display: flex;
      justify-content: flex-start;
      font-size: 24px;

      &:first-child {
        justify-content: space-between;
        align-items: center;
        color: var(--dark-fff, var(--font-color-222930));
      }

      &:nth-child(2) {
        margin-bottom: 30px;
      }

      span {
        margin: 0 16px;

        &:first-child {
          margin-left: 0;
        }
      }
      i {
        margin: 0 16px;
      }
      h4 {
        margin: 0;
        font-size: 32px;
        margin-bottom: 8px;
        color: var(--dark-fff, var(--font-color-333333));
      }
    }

    .top {
      display: inline-block;
      font-size: 24px;

      i {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: inline-block;
        margin-left: 30px;
        margin-right: 10px;
        background-color: var(--theme-color);
        flex-grow: 0;

        &.gray {
          background-color: var(--bg-color-d1d1d1);
        }
      }
    }

    .login-info {
      margin-top: 15px;
      display: flex;
      justify-content: space-between !important;

      div {
        margin-bottom: 8px;
        color: var(--dark-999, var(--font-color-222930));

        span {
          color: var(--dark-fff, var(--font-color-999999));
        }
      }
    }

    .right {
      height: 44px;
      font-size: 32px;
      font-weight: 600;
      color: var(--theme-color);
      line-height: 44px;
    }
  }

  :deep(.van-button) {
    width: 180px;
    font-weight: bold;
    height: 80px;

    .van-button__text {
      font-size: 24px;
      display: flex;
      align-items: center;
    }
  }

  .detail-list {
    margin: 20px auto 0;
    font-size: 24px;
    font-weight: 400;
    color: var(--dark-fff, var(--font-color-606060));

    > div {
      display: flex;
      padding: 0 0 26px;
      justify-content: space-between;
      color: var(--cur-font-color-fff, var(--font-color-606060));

      &:first-child {
        padding: 10px 0 40px;
        margin: 0;
      }

      span:last-child {
        font-size: 28px;
        color: var(--dark-fff, var(--font-color-222930));
      }
    }
  }
}
</style>
