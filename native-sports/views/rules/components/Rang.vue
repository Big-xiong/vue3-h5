<template>
  <div
    class="rang-wrap"
    v-for="(item, index) in arr"
    :key="index"
  >
    <div class="rang-wrap-title">
      <h5 class="bold">{{ item.title }}</h5>
    </div>
    <div class="rang-wrap-main">
      <div class="rang-wrap-main-top">
        <div>
          <span class="bold">
            {{ $t('主队') }}
            <i style="font-weight: 400;">{{ item.home }}</i>
          </span>
          <SvgIcon name="sport-home" />
        </div>
        <span>
          VS
          <i v-html="item?.rang" />
        </span>
        <div>
          <SvgIcon name="sport-away" />
          <span class="bold">
            {{ $t('客队') }}
            <i style="font-weight: 400">{{ item.away }}</i>
          </span>
        </div>
      </div>
      <Item
        v-for="(m, index) in item.data"
        type="rang"
        :key="index"
        :item="m"
      />
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
    title: t('0（平手盘）'),
    home: '0',
    away: '0',
    rang: t('主客实力相当') + t('均不让球即0（平手盘）'),
    data: [
      {
        desc: t('主客谁赢球即全赢，打平则退回本金(走水)'),
        left: {
          top: t('主队'),
          bottom: t('全赢'),
          coin: 'large',
          isRed: 1,
        },
        middle: {
          score: '1 - 0',
          desc: t('反之亦然'),
        },
        right: {
          top: t('客队'),
          bottom: t('全输'),
        },
      },
      {
        left: {
          top: t('主队'),
          bottom: t('退回本金'),
        },
        middle: {
          score: '0 - 0',
        },
        right: {
          top: t('客队'),
          bottom: t('退回本金'),
        },
      },
    ],
  },
  {
    title: t('0/0.5（平手半球盘）'),
    home: '-0/0.5',
    away: '+0/0.5',
    rang: t('主队让0/0.5球'),
    data: [
      {
        desc: t('主队赢1球或以上，投注主队全赢，投注客队全输'),
        left: {
          top: t('主队'),
          bottom: t('全赢'),
          coin: 'large',
          isRed: 1,
        },
        middle: {
          score: '1 - 0',
          desc: t('反之亦然'),
        },
        right: {
          top: t('客队'),
          bottom: t('全输'),
        },
      },
      {
        desc: t('打平，投注主队输一半，投注客队赢一半'),
        left: {
          top: t('主队'),
          bottom: t('输一半'),
        },
        middle: {
          score: '0 - 0',
        },
        right: {
          top: t('客队'),
          bottom: t('赢一半'),
        },
      },
    ],
  },
  {
    title: t('0.5（半球盘）'),
    home: '0.5',
    away: '+0.5',
    rang: t('主队让0.5球'),
    data: [
      {
        desc: t('主队赢1球或以上，投注主队全赢，投注客队全输'),
        left: {
          top: t('主队'),
          bottom: t('全赢'),
          coin: 'large',
          isRed: 1,
        },
        middle: {
          score: '1 - 0',
        },
        right: {
          top: t('客队'),
          bottom: t('全输'),
        },
      },
      {
        desc: t('打平，投注主队输一半，投注客队赢一半'),
        left: {
          top: t('主队'),
          bottom: t('全输'),
        },
        middle: {
          score: '0 - 0',
        },
        right: {
          top: t('客队'),
          bottom: t('全赢'),
        },
      },
    ],
  },
  {
    title: t('0.5/1（半球/一球盘）'),
    home: '-0.5/1',
    away: '+0.5/1',
    rang: t('主队让0.5/1球'),
    data: [
      {
        desc: t('主队赢1球，投注主队赢一半，投注客队输一半'),
        left: {
          top: t('主队'),
          bottom: t('赢一半'),
        },
        middle: {
          score: '1 - 0',
        },
        right: {
          top: t('客队'),
          bottom: t('输一半'),
        },
      },
      {
        desc: t('主队赢2球或以上，投注主队全赢，投注客队全输'),
        left: {
          top: t('主队'),
          bottom: t('全赢'),
          coin: 'large',
          isRed: 1,
        },
        middle: {
          score: '2 - 0',
        },
        right: {
          top: t('客队'),
          bottom: t('全输'),
        },
      },
      {
        desc: t('主队打平或者输球，投注主队全输，投注客队全赢'),
        left: {
          top: t('主队'),
          bottom: t('全输'),
        },
        middle: {
          score: '0 - 0',
        },
        right: {
          top: t('客队'),
          bottom: t('全赢'),
        },
      },
    ],
  },
  {
    title: t('1球（一球盘）'),
    home: '-1',
    away: '+1',
    rang: t('主队让1球'),
    data: [
      {
        desc: t('主队赢1球，投注主客均退回本金（走水）'),
        left: {
          top: t('主队'),
          bottom: t('退回本金'),
        },
        middle: {
          score: '1 - 0',
        },
        right: {
          top: t('客队'),
          bottom: t('退回本金'),
        },
      },
      {
        desc: t('主队赢2球或以上，投注主队全赢，投注客队全输'),
        left: {
          top: t('主队'),
          bottom: t('全赢'),
          coin: 'large',
          isRed: 1,
        },
        middle: {
          score: '2 - 0',
        },
        right: {
          top: t('客队'),
          bottom: t('全输'),
        },
      },
      {
        desc: t('主队打平或输球，投注主队全输，投注客队全赢'),
        left: {
          top: t('主队'),
          bottom: t('全输'),
        },
        middle: {
          score: '0 - 0',
        },
        right: {
          top: t('客队'),
          bottom: t('全赢'),
        },
      },
    ],
  },
  {
    title: t('1/1.5球（一球/球半盘）'),
    home: '-1/1.5',
    away: '+1/1.5',
    rang: t('主队让1/1.5球'),
    data: [
      {
        desc: t('主队赢1球，投注主队输一半，投注客队赢一半'),
        left: {
          top: t('主队'),
          bottom: t('输一半'),
        },
        middle: {
          score: '1 - 0',
        },
        right: {
          top: t('客队'),
          bottom: t('赢一半'),
        },
      },
      {
        desc: t('主队赢2球或以上，投注主队全赢，投注客队全输'),
        left: {
          top: t('主队'),
          bottom: t('全赢'),
          coin: 'large',
          isRed: 1,
        },
        middle: {
          score: '2 - 0',
        },
        right: {
          top: t('客队'),
          bottom: t('全输'),
        },
      },
      {
        desc: t('主队打平或输球，投注主队全输，投注客队全赢'),
        left: {
          top: t('主队'),
          bottom: t('全输'),
        },
        middle: {
          score: '0 - 0',
        },
        right: {
          top: t('客队'),
          bottom: t('全赢'),
        },
      },
    ],
  },
  {
    title: t('1.5球（球半盘）'),
    home: '-1.5',
    away: '+1.5',
    rang: t('主队让1.5球'),
    data: [
      {
        desc: t('主队赢1球，投注主队全输，投注客队全赢'),
        left: {
          top: t('主队'),
          bottom: t('全输'),
        },
        middle: {
          score: '1 - 0',
        },
        right: {
          top: t('客队'),
          bottom: t('全赢'),
        },
      },
      {
        desc: t('主队赢2球或以上，投注主队全赢，投注客队全输'),
        left: {
          top: t('主队'),
          bottom: t('全赢'),
          coin: 'large',
          isRed: 1,
        },
        middle: {
          score: '2 - 0',
        },
        right: {
          top: t('客队'),
          bottom: t('全输'),
        },
      },
      {
        desc: t('主队打平或输球，投注主队全输，投注客队全赢'),
        left: {
          top: t('主队'),
          bottom: t('全输'),
        },
        middle: {
          score: '0 - 0',
        },
        right: {
          top: t('客队'),
          bottom: t('全赢'),
        },
      },
    ],
  },
  {
    title: t('1.5/2球（球半盘）'),
    home: '-1.5/2',
    away: '+1.5/2',
    rang: t('主队让1.5/2球'),
    data: [
      {
        desc: t('主队赢1球，投注主队全输，投注客队全赢'),
        left: {
          top: t('主队'),
          bottom: t('全输'),
        },
        middle: {
          score: '1 - 0',
        },
        right: {
          top: t('客队'),
          bottom: t('全赢'),
        },
      },
      {
        desc: t('主队赢2球,投注主队赢一半，投注客队输一半'),
        left: {
          top: t('主队'),
          bottom: t('赢一半'),
        },
        middle: {
          score: '2 - 0',
        },
        right: {
          top: t('客队'),
          bottom: t('输一半'),
        },
      },
      {
        desc: t('主队赢3球或以上，投注主队全赢，投注客队全输'),
        left: {
          top: t('主队'),
          bottom: t('全输'),
        },
        middle: {
          score: '3 - 0',
        },
        right: {
          top: t('客队'),
          bottom: t('全赢'),
        },
      },
      {
        desc: t('主队打平或输球，投注主队全输，投注客队全赢'),
        left: {
          top: t('主队'),
          bottom: t('全输'),
        },
        middle: {
          score: '0 - 0',
        },
        right: {
          top: t('客队'),
          bottom: t('全赢'),
        },
      },
    ],
  },
];

</script>

<style lang="less" scoped>
.rang-wrap {
  margin-bottom: 60px;

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

        span {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 80px;
          white-space: nowrap;
        }
      }

      >span {
        font-size: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        color: var(--dark-fff, var(--font-color-0A0A0A));

        i {
          font-size: 24px;
          color: var(--theme-color);
          position: absolute;
          text-align: center;
          width: 300px;
          top: 40px;
        }
      }
    }
  }

  :deep(.item-wrap) {

    .item-wrap-left {
      >div {
        span {
          &:last-child {
            color: var(--dark-fff, var(--font-color-0A0A0A));
          }
        }
      }
    }

    .item-wrap-middle {
      position: relative;

      .item-wrap-res {
        color: var(--font-color-848A9A);
        font-size: 20px;
      }
    }
  }

  :deep(.item-wrap-desc) {
    width: 600px;
    font-size: 24px;
    color: var(--theme-color);
    text-align: center;
    margin: 80px auto 0;

    span {
      &.item-text {
        font-size: 24px !important;
        color: var(--font-color-0A0A0A);
      }
    }
  }
}
</style>
