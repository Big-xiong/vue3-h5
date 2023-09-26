<template>
  <!-- <div class="kfPage" :style="{ backgroundImage: $bImgs['common/blue-headbg@2x'] }"> -->
  <div class="kfPage">
    <p class="title">{{ $t('客服') }}</p>
    <!-- <div class="kf-wel" :style="{ backgroundImage: $bImgs['newKf/service_bg2@2x'] }"> -->
    <div class="kf-wel">
      <div class="kf-wel-con">
        <img src="@img/kefu/avatar.png" alt />
        <p>
          <span>Hi，尊敬的用户</span>
          <span>{{ $t('欢迎来到客服中心') }}</span>
        </p>
      </div>
    </div>
    <div class="zbkf-item">
      <!-- <div
        class="zbkf-item-child"
        :style="{ backgroundImage: $bImgs['newKf/bet_service_top_bg3@2x'] }"
        @click="callService"
      >-->
      <div class="zbkf-item-child" @click="$openKefu">
        <div class>
          <p>
            <img src="@img/kefu/servic_icon_servic@2x.png" alt />
            <span>{{ $t('主线客服') }}</span>
          </p>
          <p>Main Customer Support</p>
          <p>7*24小时专线服务 贴心至上</p>
        </div>
        <van-icon name="arrow" />
      </div>
      <!-- <div
        class="zbkf-item-child"
        :style="{ backgroundImage: $bImgs['newKf/bet_service_top_bg4@2x'] }"
        @click="callbackCk"
      >-->
      <div class="zbkf-item-child" @click="callbackCk">
        <div class>
          <p>
            <img src="@img/kefu/servic_icon_call@2x.png" alt />
            <span>{{ $t('请求回电') }}</span>
          </p>
          <p>Reserve Customer Support</p>
          <p>7*24小时专线服务 贴心至上</p>
        </div>
        <van-icon name="arrow" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject,
  ref,
} from 'vue';

const global = inject('global');
function callbackCk() {
  global.$dialog({ tpl: 'HeaderCall' });
}
</script>
<style scoped lang="less">
.kfPage {
  background-position: center -90px;
  background-repeat: no-repeat;
  background-size: 100% auto;
  padding-top: 20px;
  padding-bottom: 140px;
  background-image: url("@img/kefu/blue-headbg@2x.png");
  .title {
    text-align: center;
    font-size: 36px;
    color: var(--font-color-fff);
  }
  .kf-wel {
    width: 710px;
    height: 200px;
    background-position: center top;
    background-repeat: no-repeat;
    background-size: 100% auto;
    padding: 38px 0 0 40px;
    box-sizing: border-box;
    margin: 12px auto 0;
    background-image: url("@img/kefu/service_bg2@2x.png");
  }
  .kf-wel-con {
    display: flex;
    align-items: center;
    img {
      width: 120px;
    }
    p {
      margin-left: 24px;
      font-size: 36px;
      color: var(--font-color-333);
      span:last-child {
        font-size: 24px;
        color: var(--cur-color-bbb);
        display: block;
        margin-top: 10px;
      }
    }
  }
}
.zbkf-item {
  padding: 0 10px;
  margin-top: 22px;
  .zbkf-item-child {
    height: 240px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 50px 0 60px;
    background-size: 100% auto;
    background-repeat: no-repeat;
    color: var(--font-color-fff);
    font-size: 28px;
    &:first-child {
      background-image: url("@img/kefu/bet_service_top_bg3@2x.png");
    }
    &:last-child {
      background-image: url("@img/kefu/bet_service_top_bg4@2x.png");
    }
    > div {
      position: relative;
      top: -20px;
    }
    .van-icon {
      color: var(--font-color-fff);
      font-size: 48px;
    }
    p:first-child {
      display: flex;
      align-items: center;
      font-size: 40px;
      img {
        width: 46px;
        margin-right: 4px;
      }
    }
    p:nth-child(2) {
      color: var(--cur-color-fff-36);
      margin: 4px 0 24px 0;
    }
  }
}
</style>
