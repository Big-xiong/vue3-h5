<template>
  <div class="contact-wrap">
    <div class="contact-wrap-title">
      <p class="title-top">{{ $t('业内最顶尖的手机投注APP') }}</p>
      <p class="title">{{ $t('一体化纯原生态APP，尽显流畅') }}</p>
    </div>
    <div class="contact-wrap-equipment">
      <div class="contact-wrap-equipment-item" v-for="(item, index) in equipmentList" :key="item">
        <van-image
          :src="$getSrc(`/src/assets/images/agent/affiliate/join_us_icon${++index}@2x.png`)"
        />
        <div class="name">{{ $t(item) }}</div>
      </div>
    </div>
    <div class="contact-wrap-item">
      <div class="item" v-for="(i, index) in contracts" :key="index">
        <van-image :src="$getSrc(`/src/assets/images/agent/affiliate/${i.icon}.png`)" alt="‘2’" />
        <div class="info_detail">
          <div class="name">{{ i.name }}</div>
          <div class="desc">{{ i.desc }}</div>
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

const equipmentList = ['PC', 'H5', 'APP', '高转化', '高留存', '行业第一'];
const contracts = [
  {
    name: '更安全',
    desc: '每天为您提供近千场精彩体育赛事，更有真人、彩票、电子游戏等多种娱乐方式选择，让您拥有完美游戏体验。',
    icon: 'anquan',
  },
  {
    name: '更稳定',
    desc: '独家开发，采用128位加密技术和严格的安全管理体系，客户资金得到最完善的保障，让您全情尽享娱乐、赛事投注，无后顾之忧！',
    icon: 'wending',
  },
  {
    name: '更丰富',
    desc: '引领市场的卓越技术，自主研发了全套终端应用，让您畅享Web、H5，更有iOS、Android原生App，让您随时随地，娱乐投注随心所欲！7×24小时在线客服提供最贴心、最优质的服务。',
    icon: 'fengfu',
  },
  {
    name: '更快速',
    desc: '最新技术自主研发的财务处理系统，真正做到极速存、取、转。独家网络优化技术，为您提供一流的游戏体验，最大优化网络延迟。',
    icon: 'kuai',
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
  &-equipment {
    display: flex;
    padding: 0 28px;
    font-size: 24px;
    &-item {
      flex: 1 0 56px;
      .van-image {
        width: 100%;
        height: 112px;
      }
      .name {
        color: var(--font-color-999);
        text-align: center;
      }
    }
  }
  &-item {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    .item {
      width: 100%;
      padding: 15px 28px;
      box-sizing: border-box;
      background: var(--bg-color-white);
      margin-bottom: 20px;
      border-radius: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 3px 1px 0 rgb(0 34 80 / 5%);
      .van-image {
        width: 64px;
        height: 64px;
        position: relative;
        &::after {
          content: "";
          position: absolute;
          width: 1px;
          height: 64px;
          right: -20px;
          top: 0;
          background: var(--border-color-51-01);
        }
      }
      .info_detail {
        flex: 1;
        padding-left: 40px;
        font-size: 24px;

        .name {
          font-weight: bold;
          color: var(--font-color-414655);
        }
        .desc {
          margin-top: 5px;
          color: var(--cur-color-999);
        }
      }
    }
  }
}
</style>
