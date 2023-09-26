<template>
  <p class="item-wrap-desc">{{ item?.desc }}</p>
  <div class="item-wrap">
    <div class="item-wrap-left">
      <img
        :src="$getSrc(`/src/assets/native-sports/images/${item.left.coin}-coin.png`)"
        alt
      />
      <div>
        <span>{{ $t('投注') }}{{ item.left.top }}</span>
        <span
          class="bold"
          :class="{ red: type === 'rang' && item.left.isRed }"
        >{{ item.left.bottom }}</span>
      </div>
    </div>
    <div class="item-wrap-middle">
      <span class="item-text bold">{{ type === 'rang' ? $t('赛果') : $t('进球之和') }}</span>
      <span class="item-score">{{ item?.middle?.score || 3 }}</span>
      <p class="item-wrap-res">{{ item?.middle?.desc }}</p>
    </div>
    <div class="item-wrap-right">
      <span>{{ $t('投注') }}{{ item.right.top }}</span>
      <span class="bold">{{ item.right.bottom }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    default: () => {
    },
  },
  type: {
    type: String,
    default: '',
  },
});

</script>

<style lang="less" scoped>
.item-wrap {
  width: 100%;
  height: 114px;
  background: var(--dark-rule-item, var(--rule-item));
  border-radius: 57px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;

  .red {
    color: #FF0000 !important;
  }

  &-left {
    display: flex;
    align-items: center;
    position: relative;
    margin-right: 62px;

    img {
      width: 48px;
      position: absolute;
      left: -56px;
    }

    >div {
      display: flex;
      flex-direction: column;
      align-items: center;

      .bold {
        white-space: nowrap;
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      span {
        font-size: 24px;
        white-space: nowrap;

        &:first-child {
          color: var(--font-color-848A9A);
          width: 100px;
          text-align: center;
          white-space: nowrap;
        }

        &:last-child {
          font-size: 28px;
          color: #FF0000;
        }
      }
    }
  }

  &-middle {
    width: 132px;
    height: 132px;
    border-radius: 50%;
    background-color: var(--dark-rule-middle, var(--disabled-bg-color));
    display: flex;
    text-align: center;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    span {
      font-size: 24px;

      &.item-text {
        color: var(--dark-fff, var(--font-color-0A0A0A));
      }

      &.item-score {
        color: var(--theme-color);
        font-size: 30px;
      }
    }
  }

  &-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 62px;

    .bold {
      white-space: nowrap;
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    span {
      font-size: 24px;

      &:first-child {
        color: var(--font-color-848A9A);
        width: 100px;
        text-align: center;
        white-space: nowrap;
      }

      &:last-child {
        color: var(--dark-fff, var(--font-color-0A0A0A));
        font-size: 28px;
      }
    }
  }
}
</style>
