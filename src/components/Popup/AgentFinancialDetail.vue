<template>
  <Popup
    v-model:show="isShow"
    :showConfirmBtn="false"
    @onClose="isShow = false"
    @clickCloseIcon="isShow = false"
    position="center"
    :title="$t('转账详情')"
  >
    <div class="agent-financial-detail-wrap">
      <div class="item">
        <span class="itemText">{{ $t("转入会员帐号") }}：</span>
        {{ detailData.username }}
      </div>
      <div class="item">
        <span class="itemText">{{ $t("转账金额") }}：</span>
        <i v-money="detailData.money"></i>
      </div>
      <div class="item">
        <span class="itemText">{{ $t("注册时间") }}：</span>
        {{ detailData.register_time }}
      </div>
      <div class="item">
        <span class="itemText">{{ $t("转账时间") }}：</span>
        {{ detailData.updated_at }}
      </div>
    </div>
  </Popup>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import Popup from './index.vue';

const isShow = ref(true);

defineProps({
  detailData: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<style scoped lang="less">
.agent-financial-detail-wrap {
  padding: 37.5px 0;
  color: var(--dark-fff, var(--font-color-222930));
  position: relative;
  margin: 0 auto;

  :deep(.van-popup) {
    width: 600px;
    padding-bottom: 20px;
  }

  .itemText {
    color: var(--font-color-606060);
  }

  .item {
    margin: 30px 0;
    padding: 0 42.5px;
    font-size: 28px;
    display: flex;
    justify-content: flex-start;
  }

  .flex {
    display: flex;
    justify-content: space-between;
  }
}
</style>
