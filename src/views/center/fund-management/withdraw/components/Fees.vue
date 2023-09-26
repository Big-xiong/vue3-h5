<template>
  <div class="fees-wrapper">
    <header>
      <SvgIcon name="bulb" />
      {{ $t('扣除费用提醒') }}
    </header>
    <ol>
      <li>
        1.{{ $t('取款手续费') }}:
        <span v-money="Number(fee).toFixed(2)"></span>
      </li>
      <li>
        2.{{ $t('流水未完成行政费') }}:
        <span v-money="admin"></span>
      </li>
      <li>
        3.{{ $t('优惠流水未完成扣除费') }}:
        <span v-money="profit"></span>
      </li>
    </ol>
  </div>
</template>

<script setup>
import SvgIcon from '@/components/SvgIcon.vue';

defineProps({
  fee: {
    type: Number,
    default: 0,
  },
  admin: {
    type: Number,
    default: 0,
  },
  profit: {
    type: Number,
    default: 0,
  },
});
</script>

<style lang="less" scoped>
.fees-wrapper {
  margin-top: 37px;

  header {
    color: var(--dark-999, var(--font-color-666666));
    font-size: 24px;
  }

  ol {
    margin-top: 20px;
    font-size: 24px;
    li {
      color: var(--dark-666, var(--font-color-999999));
    }
  }
}

.svg-icon-wrap {
  width: 28px;
  height: 28px;
}
</style>
