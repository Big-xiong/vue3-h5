<template>
  <Dialog
    class="contact-popup-wrap"
    title=""
    :showConfirmBtn="false"
    v-model:show="isShow"
    closeIcon
  >
    <div class="contact-details">
      <div @click="$openKefu">
        <span class="service">
          <img :src="$getSrc(`/src/assets/images/home/header/service@3x.png`)" alt="">
        </span>
        <span>{{$t(`在线客服`)}}</span>
      </div>
      <div @click="global.$dialog({ tpl: 'HeaderCall' })">
        <span class="phone">
          <img :src="$getSrc(`/src/assets/images/home/header/phone@3x.png`)" alt="">
        </span>
        <span>{{$t(`免费回拨`)}}</span>
      </div>
    </div>
  </Dialog>

</template>

<script setup>
import { inject, ref } from 'vue';
import { Toast } from 'vant';
import Dialog from './index.vue';

const isShow = ref(false);
const global = inject('global');

setTimeout(() => (isShow.value = true), 100);

</script>

<style scoped lang="less">
.contact-popup-wrap {
  .contact-details{
    display: flex;
    justify-content: center;
    padding-top: 110px;
    margin-bottom: 80px;
    div{
      display: flex;
      flex-direction: column;
      align-items: center;
      &:first-child{
        margin-right: 128px;
      }
      .service,.phone{
        display: inline-block;
        width: 124px;
        height: 124px;
        padding: 30px;
        box-sizing: border-box;
        margin-bottom: 5px;
        border-radius: 50%;
        background: var(--bg-color-F7F2F1,#F7F2F1);
        img{
          width: 100%;
        }
      }

      span{
        font-size: 28px;
        color: var(--font-color-333);
      }
    }
  }
}
</style>
