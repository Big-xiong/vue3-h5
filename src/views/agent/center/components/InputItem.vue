<template>
  <div class="input-item-wrap">
    <div class="item-body-wrap">
      <div class="text-wrap">
        <SvgIcon
          class="icon"
          :name="icon"
        />
        <span class="text">{{ title }}</span>
      </div>
      <div class="right-wrap">
        <span
          class="act value"
          v-if="value"
        >{{ value }}</span>
        <span
          class="act placeholder"
          v-else
        >{{ placeholder }}</span>
        <van-icon
          name="arrow"
          v-if="!readonly"
        ></van-icon>
        <!-- <span class="iconfont icon-dayuhao" v-if="!readonly"></span> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, inject, reactive } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');

defineProps({
  icon: String,
  title: String,
  placeholder: String,
  readonly: Boolean,
  value: String,
});
</script>

<style lang="less" scoped>
.input-item-wrap {
  padding: 0 30px;
}
.item-body-wrap {
  display: flex;
  padding: 30px 0;
  justify-content: space-between;
  align-items: center;
  color: var(--font-color-999999);
  font-size: 33px;
  background: var(--bg-color-191919);
  border-bottom: 2px solid var(--dark-333, var(--border-color-e7e7e7));

  .text-wrap {
    display: flex;
    color: var(--dark-fff, var(--font-color-999999));
  }

  .text {
    font-size: 30px;
    vertical-align: middle;
    margin-right: 18.75px;
    color: var(--cur-font-color-fff);
  }

  .icon {
    width: 40px;
    height: 40px;
    margin-right: 26px;
  }

  .act {
    font-size: 27.25px;
    color: var(--dark-fff, var(--font-color-222930));
    &:not(:last-of-type) {
      margin-right: 22.5px;
    }
  }

  .value {
    color: var(--dark-fff, var(--font-color-515151));
  }

  .placeholder {
    color: var(--cur-font-color-fff, var(--font-color-999999));
  }

  .right-wrap {
    display: flex;
    align-items: center;
  }
}
</style>
