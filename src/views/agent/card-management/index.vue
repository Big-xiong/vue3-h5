<template>
  <div class="card-management-wrap">
    <van-nav-bar :title="$t('绑定银行卡')" left-arrow @click-left="$router.go(-1)" />
    <div class="card-management-body">
      <div
        :class="['bank-list', item.icon_code]"
        v-for="(item, index) in bankList"
        :key="index"
        :style="{ backgroundImage: `url(${getBankImage(item.icon_code?.toLowerCase())})` }"
      >
        <div class="icon-wrap">
          <BankIcon :bankCode="item.icon_code?.toLowerCase()" />
          <div class="bank-name">{{ item.bank_name }}</div>
        </div>
        <p class="bank-account">{{ formatCardNo(item.card_no) }}</p>
      </div>

      <van-button type="primary" @click="agentAddBank" v-if="bankList.length < 4">{{ $t('新增银行卡') }}</van-button>

      <div
        class="tips"
      >{{ $t('温馨提示') }}：{{ $t('每个会员最多可绑定4张银行卡，每张银行卡必须保持真实姓名一致，以及必须是真实独立有效的银行卡，每张银行卡只能绑定一次。如果会员绑定的银行卡和本人真实银行卡不符，那么造成的资金损失我们一律不负责。') }}</div>
    </div>
  </div>
</template>

<script setup>
import { Toast } from 'vant';
import { useRequest } from 'ahooks-vue';
import { computed, ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { bankcardlist } from '@/api/agent';
import { bankCodeData, formatCardNo } from '@/utils';

import BankIcon from '@/components/BankIcon.vue';

const global = inject('global');

const bankList = ref([]);

const {
  run: getBankList,
  loading: getBankLoading,
} = useRequest(
  () => bankcardlist(),
  {
    onSuccess(result) {
      bankList.value = result;
    },
  },
);

const router = useRouter();

function agentAddBank() {
  router.push({
    name: 'agentAddCard',
    query: {
      name: bankList.value?.[0]?.name ?? '',
    },
  });
}

function getBankImage(iconCode) {
  return global.$getSrc(`/src/assets/images/bank/bank_${iconCode}_bg.png`) || global.$getSrc('/src/assets/images/bank/bank_ty_bg.png');
}
</script>

<style lang="less" scoped>
.card-management-wrap {
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color-191919);
  height: 100%;

  .card-management-body {
    box-sizing: border-box;
    padding: 0 30px 30px 30px;
    overflow-y: auto;
    flex: 1;
  }

  .bank-card-label {
    margin-bottom: 20px;
  }

  .bank-list {
    box-sizing: border-box;
    position: relative;
    width: 690px;
    border-radius: 8px;
    height: 220px;
    padding: 30px;
    color: var(--font-color-ffffff);
    background-size: 100% 100%;
    overflow: hidden;
    margin-top: 30px;

    .icon-wrap {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .bank-name {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 32px;
        font-weight: 500;
        margin-bottom: 10px;
        height: 40px;
        margin-top: 5px;
      }
    }

    .bank-account {
      font-size: 48px;
      margin: 0;
      font-weight: 500;
      padding-left: 10px;
      height: 48px;
      line-height: 48px;
    }

    .icon-bg {
      width: 260px;
      height: 260px;
      position: absolute;
      right: -20px;
      top: -20px;
      opacity: 0.4;
    }
  }

  .tips {
    margin-top: 20px;
    font-size: 24px;
    font-weight: 400;
    color: var(--font-color-cccccc);
    line-height: 48px;
  }

  .van-button {
    margin-top: 20px;
    width: 100%;
  }
}
</style>
