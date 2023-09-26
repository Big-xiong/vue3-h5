<template>
  <div class="big-wrap">
    <div class="big-wrap-title">
      <h5 class="bold">{{ $t('大小球') }}</h5>
      <span>{{ $t('全场90分钟（含伤停补时）两队进球数的总和') }}</span>
    </div>
    <div class="big-wrap-main">
      <div class="big-wrap-main-top">
        <div>
          <span class="bold">{{ $t('主队') }}</span>
          <SvgIcon name="sport-home" />
        </div>
        <span>VS</span>
        <div>
          <SvgIcon name="sport-away" />
          <span class="bold">{{ $t('客队') }}</span>
        </div>
      </div>
      <Item
        v-for="(item, index) in arr"
        :key="index"
        :item="item"
      />
      <van-button @click="$router.push('/')">{{ $t('实战来一注') }}</van-button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import Item from './Item.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const { t } = useI18n();
const arr = [
  {
    left: {
      top: t('大2.5'),
      bottom: t('全赢'),
      coin: 'large',
    },
    right: {
      top: t('小2.5'),
      bottom: t('全输'),
    },
  },
  {
    left: {
      top: t('大2.5/3'),
      bottom: t('赢一半'),
      coin: 'small',
    },
    right: {
      top: t('小2.5'),
      bottom: t('输一半'),
    },
  },
  {
    left: {
      top: t('大2.5/3'),
      bottom: t('赢一半'),
      coin: 'small',
    },
    right: {
      top: t('小2.5/3'),
      bottom: t('输一半'),
    },
  },
  {
    left: {
      top: t('大2.5/3'),
      bottom: t('赢一半'),
      coin: 'small',
    },
    right: {
      top: t('小2.5/3'),
      bottom: t('输一半'),
    },
  },
];

</script>

<style lang="less" scoped>
.big-wrap {
  &-title {
    border-bottom: 2px solid var(--dark-4E4C5D, var(--border-color-eee));
    display: flex;
    align-items: center;
    line-height: 40px;
    padding: 38px 0 26px;

    h5 {
      color: var(--dark-fff);
      font-size: 28px;
      margin: 0 14px 0 20px;
      position: relative;

      &::before {
        content: "";
        display: block;
        width: 8px;
        height: 28px;
        background-color: var(--theme-color);
        border-radius: 4px;
        position: absolute;
        top: 6px;
        left: -20px;
      }
    }

    span {
      color: var(--font-color-848A9A);
      font-size: 24px;
    }
  }

  &-main {
    &-top {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 48px;

      >div {
        display: flex;
        align-items: center;
        color: var(--dark-fff);
        font-size: 24px;

        .svg-icon-wrap {
          width: 38px;
          height: 44px;

          &.sport-home {
            margin: 0 98px 0 44px;
          }

          &.sport-away {
            margin: 0 44px 0 98px;
          }
        }
      }

      >span {
        font-size: 24px;
        color: var(--dark-fff, var(--font-color-0A0A0A));
      }
    }

    :deep(.van-button) {
      background: var(--gradient-bg-color);
      width: 100%;
      height: 88px;
      margin-top: 40px;

      .van-button__text {
        color: var(--font-color-fff);
      }
    }
  }
}
</style>
