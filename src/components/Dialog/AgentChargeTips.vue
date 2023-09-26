
<template>
      <Dialog :title="$t('温馨提示')" v-model:show="isShow" @confirm="submit" closeIcon @cancel="isShow = false" :width="670" center-confirm-btn :tipsDialog="true" :confirm-btn-text="$t('确定')">
        <div class="agent-charge-tips-wrap">
          <p class="tip-text">{{$t("什么是下级代充")}}</p>
          <p class="tip-content">{{$t(`代充是一种新的存款方式，可用参与网站优惠，并且计算代理首存和活跃；仅支持代理将佣金钱包的资金转账到自身下线会员的中心钱包。`)}}</p>
          <p class="tip-text" >{{$t("钱包代充")}}</p>
          <p class="tip-content">{{$t(`当佣金钱包余额不够时，代理可通过钱包充值来对余额进行充值。钱包余额由平台管理员进行分配，额度不够时可联系在线客服进行充值。`)}}</p>
        </div>
      </Dialog>
</template>

<script setup>
import {
  inject, reactive, ref, watch,
} from 'vue';
import { Toast } from 'vant';
import Dialog from './index.vue';

const global = inject('global');

const isShow = ref(true);
function submit() {
  isShow.value = false;
}
</script>

<style lang="less" scoped>
.agent-charge-tips-wrap {
  padding: 20px 40px 0;
}

.tip-content {
  font-size: 28px;
  margin-bottom: 30px;
  margin-top: 0;
  color: var(--dark-fff, var(--font-color-222930));
  &:last-of-type {
    margin-bottom: 80px;
  }
}

p {
  margin: 0;
}

.tip-text {
  color: var(--theme-color);
  margin-top: 45px;
  font-size: 33px;
  margin-bottom: 24.75px;
  margin-top: 0;
}
</style>
