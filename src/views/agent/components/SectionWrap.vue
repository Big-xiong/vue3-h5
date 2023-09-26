<template>
    <div class="section-wrap">
      <div class="tip">
        <SvgIcon name="section-wrap" />
        <span>{{ title }}</span>
        <span class="right-btn">
          <slot name="rightBtn"/>
        </span>
      </div>
      <slot/>
    </div>
</template>

<script setup>
import { inject, defineProps } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');

const props = defineProps({
  title: String,
});
</script>

<style lang="less" scoped>
.section-wrap {
  .tip {
    font-size: 36px;
    height: 75px;
    position: relative;
    padding: 0 30px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    font-weight: 600;
    color: var(--dark-fff, var(--font-color-333333));

    .svg-icon-wrap {
      width: 36px;
      margin-right: 10px;
    }

    .right-btn {
      margin-left: auto;
      color: var(--font-color-999999);
    }
  }
}
</style>
