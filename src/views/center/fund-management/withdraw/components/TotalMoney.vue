<template>
  <div class="total-money-wrap">
    {{ $t('游戏总额度') }}
    <span v-money="totalMoney" />，
    {{ $t('请先回收至中心钱包，方可取款') }}<a @click="help">{{ $t('一键回收') }}</a>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { Toast, Dialog } from 'vant';

const global = inject('global');
const $store = useStore();

const totalMoney = computed(() => {
  const { all_platform_money } = $store.state.user.walletInfo;
  return all_platform_money ?? 0;
});

function help() {
  Dialog.confirm({
    title: global.$t('温馨提示'),
    message: () => h('div', [
      h('p', `${global.$t('确定是否转回游戏内的额度至中心钱包')}?`),
    ]),
    cancelButtonText: global.$t('取消'),
    confirmButtonText: global.$t('确认'),
  }).then(async () => {
    await $store.dispatch('game/backTransAll').then(() => {
      Toast.success(global.$t('收回余额成功'));
    });
    await $store.dispatch('user/getWalletInfo');
  });
}

</script>

<style lang="less" scoped>
.total-money-wrap {
  color: var(--font-color-606060);
  text-transform: uppercase;
  font-size: 24px;

  span,
  a {
    color: var(--theme-color);
  }

  a {
    margin-left: 10px;
    text-decoration: underline;
  }
}
</style>
