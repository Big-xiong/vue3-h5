<template>
  <div id="welfare">
    <van-nav-bar
      :title="title"
      v-if="route.query.source !== 'app'"
      left-arrow
      @click-left="router.go(-1)"
    ></van-nav-bar>
    <div class="welfare-content">
      <div class="content">
      <van-button
        class="join"
        @click="handlerProfit"
        >{{ user?.isLogin ? $t("立即参与") : $t("登录/注册") }}</van-button
      >
      <p class="tip01">{{ $t("还没有用过数字货币吗") }}</p>
      <img class="line-img" :src="$getSrc(`/src/assets/images/activity/zh-CN/usdtDetail/XQ_line@2x.png`)" />
      <p class="tip02">{{ $t("数字货币是现代社会中最有价值的发明之一，对世界经济产生了深刻影响。其主要优势之一是保证交易安全的同时 还能快速稳定地转移资金。") }}</p>
    </div>
    <div class="item-box">
      <img :src="$getSrc(`/src/assets/images/activity/zh-CN/usdtDetail/XQ6_img1@2x.png`)" />
      <div class="item-txt">
        <h3>{{ $t("安全有保障") }}</h3>
        <p>{{ $t("与银行卡等传统支付方式相比，玩家不需要给出自己的姓名或卡号即可完成数字货币交易，避免了敏感信息泄漏。") }}</p>
      </div>
    </div>
    <div class="item-box">
      <img :src="$getSrc(`/src/assets/images/activity/zh-CN/usdtDetail/XQ6_img2@2x.png`)" />
      <div class="item-txt">
        <h3>{{ $t("交易速度快") }}</h3>
        <p>{{ $t("数字货币所采用的区块链技术具有去中心化特点，不需要清算中心机构来处理数据，交易时间将被缩短") }}</p>
      </div>
    </div>
    <div class="item-box">
      <img style="margin-right: 50px" :src="$getSrc(`/src/assets/images/activity/zh-CN/usdtDetail/XQ6_img3@2x.png`)" />
      <div class="item-txt">
        <h3>{{ $t("高度匿名性") }}</h3>
        <p>{{ $t("不由央行或当局发行，不受银行监管，玩家可以随心所欲地使用存放在自己数字钱包里的资金") }}</p>
      </div>
    </div>
    <p class="tip01" style="margin-top: 30px">{{ $t("USDT泰达币优势") }}</p>
    <img class="line-img" :src="$getSrc(`/src/assets/images/activity/zh-CN/usdtDetail/XQ_line@2x.png`)" />
    <p class="tip02">{{ $t("泰达币（Tether）也被称为USDT，其价值与美元对等，1USDT=1美元。作为最稳定且保值的币种，在数字货币中 独占鳌头") }}</p>
    <div class="item-box item-box02">
      <div class="item-txt">
        <h3>{{ $t("安稳") }}</h3>
        <p><i></i>{{ $t("匿名购买") }}</p>
        <p><i></i>{{ $t("不受银行监管") }}</p>
        <p><i></i>{{ $t("价格稳定") }}</p>
      </div>
      <img :src="$getSrc(`/src/assets/images/activity/zh-CN/usdtDetail/XQ6_img4@2x.png`)" />
    </div>
    <div class="item-box item-box02">
      <div class="item-txt">
        <h3>{{ $t("易用") }}</h3>
        <p><i></i>{{ $t("交易快速到账") }}</p>
        <p><i></i>24小时随时交易</p>
        <p><i></i>{{ $t("交易额度无上限") }}</p>
      </div>
      <img :src="$getSrc(`/src/assets/images/activity/zh-CN/usdtDetail/XQ6_img5@2x.png`)" />
    </div>
    <div class="quick-desc">
      <div class="quick-desc-tit">
        <p class="tip01">{{ $t("知名虚拟交易平台列示") }}</p>
        <img class="line-img" :src="$getSrc(`/src/assets/images/activity/zh-CN/usdtDetail/XQ_line@2x.png`)" />
      </div>
      <div class="platform-info">
        <div class="info-header">
          <img class="huobi-icon" :src="$getSrc(`/src/assets/images/activity/zh-CN/usdtDetail/huobi-icon.png`)" />
          <span>{{$t('火币')}}</span>
          </div>
        <div class="info-desc">
          {{$t('火币提供全快捷的USDT泰达币交易服务,以及实时价格行情，上百种数字货币的交易及投资，是稳定高效的数字货币交易平台。')}}
        </div>
        <div class="info-enter">
          <van-button @click="
            $router.push({
              name: 'huobiInfo',
              query: {platform: 'wanqu'}
            })
          " class="enter-btn">{{ $t("查看教程") }}</van-button>
        </div>
      </div>
      <div class="platform-info m-t">
        <div class="info-header">
          <img class="bian-icon" :src="$getSrc(`/src/assets/images/activity/zh-CN/usdtDetail/bian-icon.png`)" />
          <span>{{$t('币安')}}</span>
        </div>
        <div class="info-desc">
          {{$t('币安是全球领先的数字货币交易平台，提供比特币、莱特币、以太坊、BNB、USDT等主流数字货币交易。')}}
        </div>
        <div class="info-enter">
          <van-button @click="
            $router.push({
              name: 'bianInfo',
              query: {platform: 'wanqu'}
            })
          " class="enter-btn">{{ $t("查看教程") }}</van-button>
        </div>
      </div>
    </div>
    <div class="active-items">
      <div class="quick-desc-tit">
        <p class="tip01">优惠活动</p>
        <img class="line-img" :src="$getSrc(`/src/assets/images/activity/zh-CN/usdtDetail/XQ_line@2x.png`)" />
      </div>
      <div class="active-items-wrap">
        <div
          @click="
            $router.push({
              name: 'usdt',
              query: $route.query.source ? { source: $route.query.source } : {},
            })
          "
        >
          <img :src="$getSrc(`/src/assets/images/activity/zh-CN/usdtDetail/usdt.png`)" />
          <p>USDT40%大让利</p>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, ref,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getParams } from '@/utils';

const global = inject('global');
const store = inject('store');
const { id, source, access_token } = getParams();

const {
  user,
  app: { dicts },
} = global.$store.state;

const router = useRouter();
const route = useRoute();
const title = ref(route?.meta?.title || '');

if (source === 'app' && access_token) {
  Cookies.set('access_token', access_token);
  store.dispatch('user/getUserInfo');
}
function handlerProfit() {
  if (!user?.isLogin) {
    route.query.source === 'app' ? window.location.href = `app://login` : router.push({ name: 'login' });
  } else {
    route.query.source === 'app' ? window.location.href = `app://pay` : router.push('/center/fund-management/deposit');
  }
}
</script>

<style lang="less" scoped>
#welfare {
  background: #030C5E;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .welfare-content{
    height: 100vh;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .content {
    width: 100%;
    background-image: url("/src/assets/images/activity/zh-CN/usdtDetail/bg@2x.png");
    background-repeat: no-repeat;
    background-size: 100% auto;
    box-sizing: border-box;
    padding-top: 300px;
    &.no-header{
      .join{
        margin-top: 300px;
      }
    }
  }
  .join {
      width: 320px;
      height: 72px;
      border-radius: 10px;
      color: #FFFFFF;
      font-size: 32px;
      line-height: 72px;
      background: #06CD75;
      display: block;
      margin-left: 30px;
    }
  .tip01 {
    margin-top: 680px;
    color: #FFFFFF;
    font-size: 40px;
    padding-left: 25px;
  }

  .line-img {
    height: 6px;
    margin: 22px 0;
    padding-left: 25px;

  }

  .tip02 {
    color: #FFFFFF;
    line-height: 40px;
    font-weight: 500;
    font-size: 28px;
    padding-left: 25px;

  }

  .item-box {
    width: 690px;
    height: 268px;
    margin: 30px auto 0;
    background: url("/src/assets/images/activity/zh-CN/usdtDetail/XQ6_bgm@2x.png") center no-repeat;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    justify-content: space-around;
    align-items: center;

    div{
      width: 426px;
    }

    img {
      height: 70%;
      display: block;
      margin: 0 30px;
    }

    h3 {
      font-weight: 500;
      color: #FFFFFF;
      font-size: 40px;
      padding-left: 20px;
    }

    p {
      padding-left: 20px;
      padding-right: 10px;
      color: #C7D8FF;
      font-size: 24px;
      line-height: 30px;
    }
  }
  .item-box.item-box02{
    img {
      height: 95%;
      display: block;
      margin: 0 30px;
    }
    p{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: 8px;
      i{
        width: 8px;
        height: 14px;
        background:url("/src/assets/images/activity/zh-CN/usdtDetail/XQ6_dian@2x.png") center no-repeat ;
        background-size: cover;
        margin-right: 20px;
      }
    }
  }

  .no-header {
    padding-top: 0;
    margin-top:0;
  }

  .quick-desc{
    background: #0A1974;
    margin-top: 40px;
    padding: 58px 0;

    .quick-bar{
      display: flex;
      align-items: flex-end;
      span{
        flex: 1;
        height: 80px;
        background-color: #0F51D5;
        line-height: 80px;
        text-align: center;
        font-size: 28px;
        color: #fff;
        &:first-child{
          background-color: #06CD75;
          height: 88px;
          line-height: 88px;
        }
      }
    }
    .quick-steps-tit{
      font-size: 28px;
      color: #fff;
      border-left: 6px solid #06D178;
      padding-left: 10px;
      margin: 42px 30px 12px;
    }
    .quick-steps-desc{
      font-size: 26px;
      color: #fff;
      line-height: 36px;
      margin: 0 30px;
      padding-left: 16px;
    }
  }
  .quick-desc-tit{
    text-align: center;
    .tip01{
      margin-top: 0;
    }
  }

  .swiper-container{
    margin-top: 60px;
    img{
      width: 370px;
      display: block;
      margin: 0 auto;
    }
    .swiper-button-prev, .swiper-button-next{
      color: #1161FD;
      margin: 0 50px;
    }
  }
  .active-items{
    padding: 60px 0 80px;
  }
  .active-items-wrap{
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    div{
      flex: 1;
      background: #022078;
      border-radius: 10px;
      padding: 20px;
      margin: 0 15px;
      img{
        width: 100%;
        display: block;
        padding: 0;
        margin: 0;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 24px;
      }
      p{
        font-size: 24px;
        color: #fff;
      }
    }
  }
}
:deep(.swiper-button-next):deep(.swiper-button-prev){
  &:focus{
    outline: none;
  }
}
.platform-info {
  padding: 0 30px;
  &.m-t {
    margin-top: 40px;
  }
  .info-header {
    font-size: 33px;
    font-family: Lantinghei SC;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 52px;
    span {
      margin-left: 15px;
    }
    img {
      vertical-align: middle;
    }
    .bian-icon {
      margin-top: -8px;
      width: 42px;
      height: 42px;
    }
    .huobi-icon {
      margin-top: -16px;
      width: 30px;
      height: 45px;
    }
  }
  .info-desc {
    margin-top: 20px;
    font-size: 24px;
    font-family: Lantinghei SC;
    font-weight: 200;
    color: #FFFFFF;
    line-height: 42px;
    position: relative;
    padding-left: 20px;
    &::before {
      position: absolute;
      content: '';
      display: block;
      height: 26px;
      width: 4px;
      background-color: #06CD75;
      left: 4px;
      top: 8px;
    }
  }
  .info-enter {
    margin-top: 50px;
    text-align: center;
    .enter-btn {
      width: 320px;
      height: 72px;
      border-radius: 10px;
      color: #FFFFFF;
      font-size: 32px;
      line-height: 72px;
      background: #06CD75;
      display: inline-block;
    }
  }
}
.van-button{
  border: none !important;
}
</style>
