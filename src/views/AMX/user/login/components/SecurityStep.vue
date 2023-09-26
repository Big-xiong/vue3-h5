<template>
  <div class="steps-wrap">
    <ul>
      <li
        v-for="(item, index) in steps"
        :key="index"
        :class="{ active: step === index + 1 }"
      >
        {{index > 0 ? '-' : ''}}{{ $t(item.title) }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { inject, ref, defineProps } from 'vue';

const global = inject('global');
const props = defineProps({
  step: {
    type: Number,
    default: 0,
  },
});

const steps = ref([
  {
    icon: 'user',
    title: global.$t('输入您的账号'),
  },
  {
    icon: 'safety',
    title: global.$t('>身份验证'),
  },
  {
    icon: 'password',
    title: global.$t('>重置密码'),
  },
]);
</script>

<style scoped lang="less">
.steps-wrap {
  margin: 0 auto;
  width: 640px;
  height: 100px;

  ul {
    display: flex;
    align-items: center;
    justify-content: center;

    li {
      color: var(--font-color-cccccc);
      font-size: 28px;

      &.active {
        color: var(--cur-font-color-f5f5f5);
      }
    }
  }
}
</style>
