<template>
  <div class="container container-wrap">
    <div class="main">
      <img src="@img/error/403_logo@2x.png" class="error-logo" alt />
      <div class="errorImg"></div>
      <div class="text">
        <p class="code">{{ $t('您的IP存在异常') }}</p>
        <div class="chinese">
          您访问的页面已丢失，导致您所尝试的页面无法打开。
          由此给你带来的不便{{ subConfig.title }}深表歉意。
        </div>
        <p class="code">Dear Customers</p>
        <div class="english">
          The current website is under maintenance,we are temporarily
          unable to provide services for you.We apologize for the
          inconvenience caused.
        </div>
        <div class="aagames-button-box">
          <van-button type="primary" @click="$openKefu">联系专属客服</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { inject } from 'vue';

const subConfig = inject('subConfig');
</script>
<style scoped lang="less">
.container {
  position: relative;
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
  background: var(--bg-color-white);
  .main {
    // margin-top: @main-margin-top;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 50%;
    top: 32%;
    transform: translateX(-50%) translateY(-50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 32px;
    box-sizing: border-box;
    .text {
      position: absolute;
      bottom: -200px;
      color: var(--font-color-666);
      text-align: left !important;
      padding: 0 40px;
      .code {
        margin: 10px 0;
        height: 44px;
        font-size: 32px;
        font-weight: 600;
        color: var(--error-code-color) !important;
        line-height: 44px;
      }
      .aagames-button-box {
        margin: 75px auto;
      }
      .chinese {
        height: 88px;
        margin: 0;
        font-size: 24px;
        font-weight: 400;
        color: var(--cur-color-999) !important;
        line-height: 44px;
      }
      .english {
        margin: 0;
        font-size: 24px;
        font-weight: 400;
        color: var(--cur-color-999) !important;
        line-height: 40px;
      }
      .error_text {
        font-size: 150px;
        color: var(--error-text-color);
        font-weight: bold;
      }
    }
  }
}
</style>
