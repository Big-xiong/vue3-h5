<template>
    <div class="steps-wrap">
      <van-progress color="#f2826a" :percentage="[33.33, 66.66, 100][step * 1 - 1]" :show-pivot="false"/>
      <ul>
        <li v-for="(item, index) in steps" :key="index" :class="{ active: step >= index + 1 }">
          <span class="index">
            <i>{{ index * 1 + 1 }}</i>
          </span>
          <span>{{ $t(item.title) }}</span>
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
    default: 1,
  },
});

const steps = ref([
  {
    icon: 'user',
    title: global.$t('输入您的账号'),
  },
  {
    icon: 'safety',
    title: global.$t('身份验证'),
  },
  {
    icon: 'password',
    title: global.$t('重置密码'),
  },
]);

</script>

<style lang="less" scoped>
.steps-wrap {
  margin: 62px auto 0;
  width: 690px;
  height: 100px;
  position: relative;
  padding-bottom: 44px;
  border-bottom: 2px solid var(--border-color-00001);

  :deep(.van-progress) {
    height: 8px;
    background-color: var(--dark-333, var(--border-color-00001));
    .van-progress__portion {
      background-color: var(--theme-color) !important;
    }
  }

  ul {
    display: flex;
    width: 100%;
    justify-content: space-around;
    position: absolute;
    top: -24px;

    li {
      color: var(--dark-fff, var(--font-color-222930));
      font-size: 28px;
      flex: 1;
      span {
        display: block;
        text-align: center;
        &.index {
          width: 56px;
          height: 56px;
          background-color: var(--dark-333, var(--bg-color-e5e5e5));
          margin: 0 auto;
          color: var(--font-color-ffffff);
          line-height: 56px;
          transform: rotate(45deg);
          border-radius: 8px;
          i {
            font-style: normal;
            transform: rotate(-45deg);
            display: block;
          }
        }
        &:last-child {
          margin-top: 12px;
          color: var(--dark-fff, var(--font-color-333333));
          opacity: 0.3;
        }
      }

      &.active {
        color: var(--font-color-f5f5f5);
        span {
          &.index {
            background-color: var(--theme-color);
          }
          &:last-child {
            color: var(--theme-color);
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
