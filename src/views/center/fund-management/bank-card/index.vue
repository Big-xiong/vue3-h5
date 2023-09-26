<template>
  <div class="bankCard-wrap">
    <div class="card-management-body">
      <div
        :class="['bank-list', item.icon_code]"
        v-for="(item, index) in myBankCards"
        :key="index"
        :style="{
          backgroundImage: `url(${$getSrc(`/src/assets/images/bank/bank_${item.icon_code?.toLowerCase()}_bg.png`, '/src/assets/images/bank/bank_ty_bg.png')})`
        }"
      >
        <div class="icon-wrap">
          <BankIcon :bankCode="item.icon_code?.toLowerCase()" />
          <div class="bank-name">{{ item.bank_name }}</div>
        </div>
        <p class="bank-account">{{ formatCardNo(item.card_no) }}</p>
      </div>
      <van-button
        type="primary"
        icon="add-o"
        @click="agentAddBank"
        v-if="myBankCards.length < 4"
      >{{ $t('新增银行卡') }}</van-button>
      <div class="tips">
        {{ $t('温馨提示') }}：
        <br />
        {{ $t('您最多可绑定4张银行卡，如需修改绑定信息请联系在线客服') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  computed, ref, inject, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRouter } from 'vue-router';
import { bankcardlist } from '@/api/agent';
import { bankCodeData, formatCardNo } from '@/utils';
import BankIcon from '@/components/BankIcon.vue';

const global = inject('global');

const $store = inject('store');

const { user } = $store.state;
const max = 4;

const myBankCards = computed(() => user?.userInfo?.user_bank ?? []);

const router = useRouter();

function agentAddBank() {
  router.push({
    name: 'centerBankCardAdd',
    query: {
      name: user.userInfo.realname ?? '',
    },
  });
}

onMounted(() => {
  $store.dispatch('user/getUserInfo');
});

</script>

<style lang="less" scoped>
:deep(.van-button--primary) {
  background-color: var(--bg-color-24c29a);
  border: none;
}

.bankCard-wrap {
  display: flex;
  flex-direction: column;
  // background-color: var(--bg-color-191919);

  .card-management-body {
    box-sizing: border-box;
    padding: 0 30px 30px 30px;
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
    padding: 50px;
    color: var(--font-color-ffffff);
    background-size: 100% 100%;
    overflow: hidden;
    margin-top: 30px;

    .icon-wrap {
      display: flex;
      margin-bottom: 10px;
      position: relative;
      top: -20px;
      // left: -20px;
      align-items: center;
      .bank-name {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 32px;
        font-weight: 500;
        // margin-bottom: 10px;
        height: 40px;
        // margin-top: 20px;
        // margin-left: 80px;
      }
    }

    .bank-account {
      font-size: 48px;
      margin: 0;
      font-weight: 500;
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
    color: var(--dark-fff, var(--font-color-222930));
    line-height: 48px;
  }

  .van-button {
    margin-top: 60px;
    width: 100%;
  }
}
</style>
