<template>
  <div id="welfare">
     <van-nav-bar
      :title="title"
      v-if="source !== 'app'"
      left-arrow
      @click-left="router.go(-1)"
    ></van-nav-bar>
    <div class="welfare-content">
      <div
      class="content"
    >
      <img
        class="top-img"
        :src="$getSrc(`/src/assets/images/activity/zh-CN/usdt/top@2x.png`)"
      />
      <van-button
        class="join"
        @click="$openKefu()"
      >{{$t('立即参与')}}</van-button>
      <img
        class="title-img"
        :src="$getSrc(`/src/assets/images/activity/zh-CN/usdt/title.png`)"
      />
      <p class="tip01">{{$t('任意金额')}}</p>
    </div>
    <div class="table-box">
      <div class="table-top table-wrap">
        <div>{{ $t("首存款金额") }}</div>
        <div>{{ $t("红利百分比") }}</div>
        <div>{{ $t("红利上限") }}</div>
        <div>{{ $t("流水倍数") }}</div>
      </div>
      <div class="table-middle table-wrap">
        <div>≥100</div>
        <div>40%</div>
        <div>1888USDT</div>
        <div style="line-height: 20px; margin-top: 15px">（本金+红利） X25</div>
      </div>
      <p class="tip02">
        *计价单位：USDT<br />{{ $t("本活动会员可依据当前星级任选一档位参与") }}
      </p>
    </div>
    <div class="rule-box">
      <img
        class="title"
        :src="$getSrc(`/src/assets/images/activity/zh-CN/usdt/title2.png`)"
      />
      <p>
        <i>1</i>
        <span>{{
          $t("本活动每位玩家仅可参与一次，并且只有首次存款USDT可以申请礼金。")
        }}</span>
      </p>
      <p>
        <i>2</i>
        <span>{{ $t("完成存款后联系客服领取红利。") }}</span>
      </p>
      <p>
        <i>3</i>
        <span>{{
          $t(
            "此优惠仅限会员≥1级以上用户参与，如发现个人或团体合谋套利，网站有权扣除套利所得。"
          )
        }}</span>
      </p>
      <p>
        <i>4</i>
        <span>{{
          $t(
            "本优惠每位玩家，每账户信息（姓名，手机），支付方式（卡号，银行户名）及IP地址只能享有一次优惠，一旦确认为套利玩家，立即没收盈利和本金。"
          )
        }}</span>
      </p>
      <p>
        <i>5</i>
        <span>{{ $t("本活动最终解释权归本公司所有") }}</span>
      </p>
    </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, ref, computed,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const title = ref(route?.meta?.title || '');
const store = inject('store');
const source = computed(() => store.state?.app?.source);
</script>

<style lang="less" scoped>
#welfare {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #0D006E;
  .welfare-content{
    height: 100vh;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .content {
    width: 100%;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    background-image: url("/src/assets/images/activity/zh-CN/usdt/bg@2x.png");
    background-repeat: no-repeat;
    background-size: cover;

    .top-img {
      width: 668px;
      margin: 60px auto 0;
      display: block;
    }

    .join {
      width: 320px;
      height: 72px;
      border-radius: 10px;
      color: #FFFFFF;
      font-size: 32px;
      line-height: 72px;
      background: #F3753E;
      margin: 36px auto 0;
      display: block;
      border: 0;
    }

    .title-img {
      width: 324px;
      display: block;
      margin: 500px auto 0;
    }

    .tip01 {
      color: #FFFFFF;
      font-size: 28px;
      line-height: 42px;
      padding: 0 54px;
      box-sizing: border-box;
      margin-top: 30px;
    }

  }

  .table-box {
    width: 100%;
    padding: 80px 25px;
    box-sizing: border-box;
    .table-wrap{
      width: 100%;
      height: 120px;
      line-height: 120px;
      display: flex;
      div{
        width: 25%;
        text-align: center;
        color:#fff ;
        font-size: 28px;
        box-sizing: border-box;
        border-right: 2px solid #0A0B6E;
      }
    }
    .table-top {
      background: linear-gradient(90deg, #E04943 0%, #0665FE 100%);
    }
    .table-middle{
      background: #15249B;
    }
    .tip02{
      margin-top: 40px;
      color: #358BD9;
      font-size: 28px;
      text-align: center;
      line-height: 30px;
    }
  }
  .rule-box{
    width: 100%;
    padding: 95px 50px;
    background-image: url("/src/assets/images/activity/zh-CN/usdt/bg2@2x.png");
    background-repeat: no-repeat;
    background-size: cover;
    box-sizing: border-box;
    .title{
      width: 324px;
      display: block;
      margin: 0 auto 60px;
    }
    p{
      position: relative;
      width: 100%;
      margin-bottom: 30px;
      i{
        display: block;
        width: 40px;
        height: 40px;
        background-image: url("/src/assets/images/activity/zh-CN/usdt/dot.png");
        background-repeat: no-repeat;
        background-size: cover;
        text-align: center;
        line-height: 40px;
        color: #fff;
        font-size: 28px;
        position: absolute;
        top: 2px;
        left: 0;
      }
      span{
        display: block;
        padding-left: 70px;
        color: #FFFFFF;
        font-size: 28px;
        word-break: break-all;
        line-height: 40px;
      }
    }
  }
  .no-header {
    padding-top: 0;
    margin-top:0;
  }
}
</style>
