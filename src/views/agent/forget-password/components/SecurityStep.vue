<template>
    <div class="steps-wrap">
      <ul>
        <li v-for="(item, index) in steps" :key="index" :class="{active: step === index + 1}">
          <em class="line"></em>
          <div class="content-wrap">
            <span class="square">
              <div class="inner">{{index + 1}}</div>
            </span>
            <div>{{$t(item.title)}}</div>
          </div>
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
    title: global.$t('输入您的账号'),
  },
  {
    title: global.$t('身份验证'),
  },
  {
    title: global.$t('重置密码'),
  },
]);
</script>

<style lang="less" scoped>
.steps-wrap {
  width: 690px;
  height: 100px;
  border-bottom: solid 2px var(--dark-333, var(--border-color-e7e7e7));
  padding: 74px 30px 44px;
  background-color: var(--dark-bg-color-191919);
  margin-bottom: 40px;

  ul {
    display: flex;
    align-items: center;
    justify-content: center;

    li {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      position: relative;
      .line {
        position: absolute;
        width: 100%;
        left: 0;
        top: 20px;
        background-color: var(--dark-333, var(--bg-color-e5e5e5));
        height: 8px;
        border-radius: 4px;
      }
      .content-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        span {
          transform: rotateZ(45deg);
          height: 48.5px;
          width: 48.5px;
          border-radius: 8px;
          display: block;
          background-color: var(--dark-333, var(--bg-color-e5e5e5));
          display: flex;
          align-items: center;
          justify-content: center;
          .inner {
            font-weight: 600;
            opacity: 1;
            font-size: 24px;
            margin-left: 5px;
            color: var(--font-color-ffffff);
            transform: rotateZ(-45deg);
          }
        }
        div {
          margin-top: 8px;
          font-weight: 500;
          color: var(--dark-fff, var(--font-color-333333));
          opacity: 0.4;
        }
      }

      &.active {
        .line {
          background-color: var(--theme-color);
        }
        span {
          background-color: var(--theme-color);
        }
        div {
          opacity: 1;
          color: var(--theme-color);
        }
      }
    }
  }
}
</style>
