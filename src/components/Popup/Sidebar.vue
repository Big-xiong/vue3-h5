<template>
  <Popup
    class="popups-wrap-side-bar"
    :round="false"
    :show="isShowPopup"
    close-icon-position="top-left"
    @click-overlay="isShowPopup = false"
    @clickCloseIcon="isShowPopup = false"
    position="left"
  >
    <div class="side-main">
      <div class="side-main-header">
        <img :src="$getSrc('/src/assets/images/sideBar/avatar.png')" alt="">
        <div class="user-info">
          <template v-if="user.isLogin">
            <img class="level-pic" :src="$getSrc(`/src/assets/images/vip/grade_normal${user?.userInfo?.level + 1}@2x.png`)" alt="">
            <span class="username">{{ user?.userInfo?.username }}</span>
            <span v-show="!user.walletLoading" class="money" v-money="user.walletInfo?.money || '0.00'" />
          </template>
          <template v-else>
            {{$t(`游客`)}} <span @click="$router.push('/login');isShowPopup = false">{{$t(`请登录`)}}</span>
          </template>
        </div>
      </div>
      <div class="side-main-list">
        <div class="side-main-item" @click="barList[i-1]?.name && barList[i-1]?.onClick();isShowPopup = false" v-for="i in 9" :key="i">
          <img v-if="barList[i-1]?.name" :src="$getSrc(`/src/assets/images/sideBar/${barList[i-1]?.icon}.png`)" alt="">
          <span v-if="barList[i-1]?.name">{{$t(barList[i-1]?.name)}}</span>
        </div>
      </div>
      <div class="side-main-access" v-if="user.isLogin">
        <div class="access-btn" @click="$router.push({name:'centerDeposit'});isShowPopup = false">{{$t(`快速存款`)}}</div>
        <div class="access-btn" @click="handleWithdraw();isShowPopup = false">{{$t(`急速取款`)}}</div>
      </div>
      <div class="side-main-access" v-else>
        <div class="access-btn" @click="$router.push('/login');isShowPopup = false">{{$t(`会员登录`)}}</div>
        <div class="access-btn" @click="$router.push('/register');isShowPopup = false">{{$t(`急速注册`)}}</div>
      </div>
      <div class="side-main-footer">
        <p>Copyright © H22 Online Game. All rights reserved.</p>
      </div>
    </div>
  </Popup>
</template>

<script setup>
import {
  inject, reactive, ref, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRoute } from 'vue-router';
import { getHeaders } from '@/api/app.js';
import { useWithdraw } from '@/utils/hooks';

import Popup from './index.vue';

const isShowPopup = ref(true);
const { handleWithdraw } = useWithdraw();

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const { isMicro } = $store.state.app;

const basicBarList = [
  {
    name: '首页',
    onClick: () => global.$router.push('/'),
    isNeedLogin: false,
    icon: 'img-icon-home',
  },
  {
    name: '优惠',
    onClick: () => global.$router.push('/promos'),
    isNeedLogin: false,
    icon: 'img-icon-benifit',
  },
  {
    name: '风采',
    onClick: () => global.$router.push('/brand'),
    isNeedLogin: false,
    icon: 'img-icon-sponsor',
  },
  {
    name: '下载中心',
    onClick: () => global.$router.push('/appDownload'),
    isNeedLogin: false,
    icon: 'img-icon-download',
  },
  {
    name: '个人中心',
    onClick: () => global.$router.push('/user'),
    isNeedLogin: false,
    icon: 'img-icon-pcenter',
  },
  {
    name: 'VIP俱乐部',
    onClick: () => global.$router.push('/vip'),
    isNeedLogin: true,
    icon: 'img-icon-vip',
  },
  {
    name: '在线客服',
    onClick: () => global.$openKefu(),
    isNeedLogin: false,
    icon: 'img-icon-service',
  },
  {
    name: '免费通话',
    onClick: () => global.$dialog({ tpl: 'HeaderCall' }),
    isNeedLogin: false,
    icon: 'img-icon-call',
  },
  {
    name: '安全退出',
    onClick: () => {
      $store.dispatch('user/logout').then(() => {
        if (isMicro) {
          window.location.pathname = '/login';
        } else {
          getHeaders($store);
          global.$router.push('/');
        }
      });
    },
    isNeedLogin: true,
    icon: 'img-icon-exit',
  },
];
const barList = computed(() => (user?.isLogin ? basicBarList : basicBarList.filter((item) => !item.isNeedLogin)));
</script>

<style lang="less" scoped>
.popups-wrap-side-bar{
  .side-main{
    width: 620px;
    height: 100vh;
    padding-top: 120px;
    background: var(--bg-color-122643);
    box-sizing: border-box;
    position: relative;
    &-header{
      img{
        width: 140px;
        height: 140px;
        display: block;
        margin: 0 auto;
      }
      div{
        font-size: 32px;
        color: var(--font-color-fff);
        text-align: center;
        margin: 20px 0 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        span{
          margin-left: 20px;
          color: var(--font-color-fdd77e);
          &.username{
            color: var(--font-color-fff);
          }
        }
        .level-pic{
          width: 48px;
          height: auto;
          margin: 0;
        }
      }
    }
    &-list{
      width: 542px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      box-sizing: border-box;
      border-right: 2px solid var(--border-color-fff-2);
      border-bottom: 2px solid var(--border-color-fff-2);
      .side-main-item{
        width: 180px;
        height: 180px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border-top: 2px solid var(--border-color-fff-2);
        border-left: 2px solid var(--border-color-fff-2);
        img{
          width: 48px;
          height: auto;
          margin-bottom: 10px;
        }
        span{
          font-size: 24px;
          color: var(--font-color-fff);
        }
      }
    }
    &-access{
      width: 540px;
      display: flex;
      justify-content: space-between;
      margin: 30px auto 0;
      .access-btn{
        width: 250px;
        height: 70px;
        font-size: 30px;
        color: var(--font-color-41beff);
        text-align: center;
        line-height: 70px;
        border-radius: 8px;
        border: 2px solid var(--border-color-fff-2);
      }
    }
    &-footer{
      width: 100%;
      position: absolute;
      bottom: 30px;
      text-align: center;
      font-size: 24px;
      color: var(--cur-color-ccc,#ccc);
    }
  }
}
</style>
