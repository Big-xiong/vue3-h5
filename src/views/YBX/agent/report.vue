<template>
  <div class="contact-wrap">
    <div class="contact-wrap-title">
      <p class="title-top">{{ $t('智能数据领先全行业') }}</p>
      <p class="title">{{ $t('会员统计实时更新，数据一目了然') }}</p>
    </div>
    <div class="contact-wrap-box">
      <div class="contact-wrap-box-item" v-for="(item, index) in boxList" :key="index">
        <div class="item">
          <van-image
            :src="$getSrc(`/src/assets/images/agent/affiliate/join_us_image${++index}@2x.png`)"
          />
          <div class="title">{{ $t(item.title) }}</div>
          <div class="desc">{{ $t(item.desc) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  inject,
} from 'vue';

const boxList = [
  {
    title: '会员统计',
    desc: '会员统计实时更新',
  },
  {
    title: '报表明细',
    desc: '数据分析表清晰简单',
  },
  {
    title: '平台报表',
    desc: '流水/费用/输赢营收明细',
  },
  {
    title: '佣金报表',
    desc: '高佣金比例数据报表',
  },
];
</script>

<style lang='less' scoped>
.contact-wrap {
  position: relative;
  &-title {
    font-size: 48px;
    text-align: center;
    color: var(--font-color-5D6476);
    font-weight: 600;
    padding-top: 40px;
    .title {
      font-size: 28px;
      color: var(--theme-color);
    }
  }
  &-box {
    padding: 30px 28px;
    display: flex;
    flex-wrap: wrap;
    &-item {
      padding: 0 15px;
      width: 50%;
      box-sizing: border-box;
      margin-bottom: 30px;
      .item {
        padding: 30px 0 40px;
        background: var(--bg-color-white);
        box-shadow: 0 4px 3px 0 rgb(207 219 250 / 50%),
          0 6px 30px 0 rgb(0 34 80 / 10%);
        border-radius: 10px;
        font-size: 28px;
        text-align: center;
        .van-image {
          width: 175px;
          display: block;
          margin: 0 auto;
        }
        .title {
          font-weight: bold;
          margin: 40px 0 20px;
        }
        .desc {
          font-size: 24px;
          color: var(--font-color-999);
        }
      }
    }
  }
}
</style>
