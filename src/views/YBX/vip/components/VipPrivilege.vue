<template>
  <div class="privilege">
    <div class="head">
      <div class="info">
        <div class="info-photo">
          <img :src="$getSrc(`/src/current_project/assets/images/vip/login-out.png`)" alt="login-out" />
        </div>
        <div class="styles__user">
          <div class="styles__ft">
            <div class="styles__ftUserName">
              <p class="styles__usernameText">{{ user?.userInfo?.username }}</p>
              <!-- todo 缺少背景图 -->
              <!-- <span class="level" v-if="user?.isLogin">
                <span class="level-num">{{ basicInfo?.level }}</span>
              </span>-->
            </div>
            <p class="styles__ftRank">
              {{ $t('这是您成为') }} {{ subConfig.title }}{{ $t('会员的第') }}
              <span>{{ dayjs(new Date()).diff(user?.userInfo?.created_at, 'day') }}</span>
              {{ $t('天') }}
            </p>
          </div>
        </div>
        <div class="styles__logo">
          <van-image
            :src="$getSrc(`/src/current_project/assets/images/vip/grade_normal${user?.userInfo?.level + 1}@2x.png`)" />
        </div>
      </div>
      <div class="vip-progeress">
        <span class="vip-progeress1">VIP{{ user?.userInfo?.level }}</span>
        <van-progress :percentage="percentage" />
        <span class="vip-progeress2">VIP{{ user?.userInfo?.level + 1 }}</span>
      </div>
      <p class="vip-ck">
        · 当前存款(元)：
        <span>{{ basicInfo?.deposit_money }}</span>
        / {{ basicInfo?.next_benefit_money }}
      </p>
      <p class="vip-ck">
        · 当前流水(元)：
        <span>{{ basicInfo?.all_valid_bet }}</span>
        / {{ basicInfo?.need_valid_bet }}
      </p>
    </div>
    <div class="newvip-level">
      <van-tabs v-model:active="levelActived" @click="levelChange" animated>
        <van-tab v-for="(item, index) in dicts?.memberlevellist" :key="index" :title="`Lv${index}`" />
      </van-tabs>

      <div class="swiper-container" v-if="dicts?.memberlevellist?.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in dicts?.memberlevellist" :key="index">
            <!-- 当前等级 -->
            <div :class="['newvip-level-info', { 'newvip-level-info-active': index === user?.userInfo?.level }]">
              <!-- :style="{
                backgroundImage:
                  index === userInfo.level
                    ? $bImgs['vip/newLevel/vip_card1@2x']
                    : $bImgs['vip/newLevel/vip_card2@2x'],
              }"-->
              <!-- <div class="newvip-level-info"> -->
              <img v-if="index === user?.userInfo?.level"
                :src="$getSrc(`/src/current_project/assets/images/vip/grade_normal${index + 1}@2x.png`)"
                class="newvip-level-icon" alt />
              <img v-else :src="$getSrc(`/src/current_project/assets/images/vip/grade_gray${index + 1}@2x.png`)"
                class="newvip-level-icon" alt />
              <p class="newvip-level-tit">VIP{{ index }}</p>

              <div class="newvip-level-con">
                <div>
                  <p>{{ item.deposit_money }}</p>
                  <p>{{$t('累计存款')}}</p>
                </div>
                <div>
                  <p>{{ item.money_condition }}</p>
                  <p>{{$t('流水要求')}}</p>
                </div>
                <div>
                  <p>{{ item.valid_bet_money }}</p>
                  <p>{{$t('有效投注')}}</p>
                </div>
            </div>
            </div>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </div>

    <div class="vip0zx" v-if="dicts?.memberlevellist?.length">
      <h2>
        <i></i>
        <span>VIP{{ levelActived }}尊享</span>
      </h2>
      <ul>
        <li>
          <img :src="$getSrc(`/src/current_project/assets/images/vip/vip_icon_yinhangqia@2x.png`)" alt />
          <p>
            <span>
              {{
                dicts?.memberlevellist[levelActived]?.withdraw_times_limit
                  ? dicts?.memberlevellist[levelActived]?.withdraw_times_limit
                  : "-"
              }}
              <i>{{ $t('次') }}</i>
            </span>
            <i>{{ $t('每日提款次数') }}</i>
          </p>
        </li>
        <li>
          <img :src="$getSrc(`/src/current_project/assets/images/vip/vip_icon_qianbi@2x.png`)" alt />
          <p>
            <span>
              {{
                dicts?.memberlevellist[levelActived]?.withdraw_money_limit
                  ? dicts?.memberlevellist[levelActived]?.withdraw_money_limit / 10000
                  : "-"
              }}万
              <i>{{ '/日' }}</i>
            </span>
            <i>{{ $t('每日提款额度') }}</i>
          </p>
        </li>
        <li>
          <img :src="$getSrc(`/src/current_project/assets/images/vip/vip_icon_shangsheng@2x.png`)" alt />
          <p>
            <span>
              {{ farewareData[levelActived] ? farewareData[levelActived]?.upgrade_money : '-' }}
              <i>{{ $t('元') }}</i>
            </span>
            <i>{{ $t('晋级礼金') }}</i>
          </p>
        </li>
        <li>
          <img :src="$getSrc(`/src/current_project/assets/images/vip/vip_icon_cake@2x.png`)" alt />
          <p>
            <span>
              {{ farewareData[levelActived] ? farewareData[levelActived]?.birthday_money : '-' }}
              <i>{{ $t('元') }}</i>
            </span>
            <i>{{ $t('生日礼金') }}</i>
          </p>
        </li>
        <li>
          <img :src="$getSrc(`/src/current_project/assets/images/vip/vip_icon_hongbao@2x.png`)" alt />
          <p>
            <span>{{ farewareData[levelActived] ? farewareData[levelActived]?.gift : '-' }}</span>
            <i>{{ $t('佳节礼品') }}</i>
          </p>
        </li>
        <li>
          <img :src="$getSrc(`/src/current_project/assets/images/vip/vip_icon_fanshui@2x.png`)" alt />
          <p>
            <span>
              {{
                maxBack[levelActived] ? `${maxBack[levelActived]}` : '0'
              }}
              <i>%</i>
            </span>
            <i>{{ $t('最高返水') }}</i>
          </p>
        </li>
      </ul>
    </div>

    <div class="vip0zx">
      <h2>
        <i></i>
        <span>{{ $t('VIP优惠') }}</span>
      </h2>
      <div class="newvip-fs">
        <div v-for="(item, i) in benefitData" :key="i">
          <template v-for="(list, l_i) in item?.list" :key="l_i">
            <p v-if="levelActived === list.level">{{ list?.proportion || 0 }}%</p>
            <p v-if="levelActived === list.level">{{ item.name }}返水</p>
          </template>
        </div>
      </div>
    </div>

    <div class="to-vipdet">
      <span @click="global.$router.push({ name: 'VipIntro' })">{{ $t('查看') }}</span>
      <!-- <img :src="$imgs['vip/newLevel/arrow@2x']" alt /> -->
      <img :src="$getSrc(`/src/current_project/assets/images/vip/arrow@2x.png`)" alt />
    </div>
  </div>
</template>

<script setup>
import {
  ref, inject, defineProps, nextTick, watchEffect,
} from 'vue';
import 'swiper/dist/css/swiper.css';
import { Swiper } from 'vue-awesome-swiper';
import { useRequest } from 'ahooks-vue';
import dayjs from 'dayjs';
import { vipprivilegeinfo, privilegeactivity, allactivitybenefit } from '@/api/vip.js';

const store = inject('store');
const global = inject('global');
const subConfig = inject('subConfig');
const { user, app: { dicts } } = store.state;
store.dispatch('app/getDict', ['memberlevellist']);

const levelActived = ref(0);
const swiperRef = ref(null);
const basicInfo = ref({});
const percentage = ref(0);
const farewareData = ref([{
  upgrade_money: 0,
  birthday_money: 0,
  gift: 0,
}]);

const { loading: basicInfoLoading } = useRequest(vipprivilegeinfo, {
  onSuccess(res) {
    basicInfo.value = res;
    const p1 = lessThanOne(
      basicInfo.value?.all_valid_bet
      / (basicInfo.value?.need_valid_bet || 1),
    );
    const p2 = lessThanOne(
      basicInfo.value?.all_benefit_money
      / (basicInfo.value?.next_benefit_money || 1),
    );
    percentage.value = ((p1 + p2) * 100 / 2).toFixed(3);
  },
});
const { loading: farewareDataLoading } = useRequest(privilegeactivity, {
  onSuccess(res) {
    farewareData.value = res.benefit_setting;
  },
});
const { data: benefitData } = useRequest(allactivitybenefit);
const maxBack = ref([]);

watchEffect(() => {
  const temp = [];
  if (dicts?.memberlevellist?.length) {
    dicts?.memberlevellist?.map((n) => {
    let max = 0;
    benefitData.value?.map((m) => {
      if (m.list[n.level]?.proportion > max) {
        max = m.list[n.level].proportion;
      }
    });
    temp.push(max);
  });
  maxBack.value = temp;
  nextTick(() => {
      levelActived.value = user?.userInfo?.level;
      swiperRef.value = new Swiper('.swiper-container', {
      slidesPerView: 'auto',
      spaceBetween: 30,
      centeredSlides: true,
      allowTouchMove: true,
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction',
      },
      on: {
        slideChangeTransitionEnd(swiper, event) {
          levelActived.value = this.activeIndex;
        // 你的事件
        },
      },
    });
      swiperRef.value?.slideTo(user?.userInfo?.level, 0, false);
    });
  }
});

function levelChange(name, title) {
  swiperRef.value?.slideTo(name, 300, false);
}

function lessThanOne(num) {
  return num > 1 ? 1 : num;
}

</script>

<style lang="less" scoped>
.privilege {
  overflow-x: hidden;
  background-color: var(--cur-color-fff);

  .head {
    height: 442px;
    background-size: 100% auto;
    background-position: center bottom;
    background-image: url("/src/current_project/assets/images/vip/vip_bg@2x.png");

    .info {
      // width: 100%;
      position: relative;
      display: flex;
      padding: 56px 60px 0 40px;
    }

    .info-photo {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      z-index: 2;
      margin-right: 20px;

      img {
        width: 100%;
      }
    }

    .styles__user {
      flex: 1;

      .styles__ftRank {
        font-size: 24px;
        color: var(--cur-color-999);
      }

      .styles__ftUserName {
        font-size: 36px;
        color: var(--font-color-333);
        font-weight: bold;
        margin-bottom: 20px;

        .styles__usernameText {
          display: inline-block;
        }

        .level {
          display: inline-block;
          width: 60px;
          height: 24px;
          background-size: 100%;
          position: relative;
          margin-left: 20px;

          span {
            margin-top: 2px;
          }

          .level-num {
            position: absolute;
            left: 42px;
            top: 0;
            font-size: 20px;
            color: var(--font-color-fff);
          }

          span,
          img {
            display: inline-block;
            vertical-align: middle;
          }

          img {
            width: 44px;
            height: auto;
          }
        }
      }
    }

    .styles__logo {
      width: 106px;
      height: 138px;
      align-self: flex-start;

      .van-image {
        width: 100%;
      }
    }
  }

  .vip-progeress {
    margin-top: 80px;
    margin-bottom: 40px;
    padding: 0 60px;
    display: flex;
    align-items: center;

    .vip-progeress1,
    .vip-progeress2 {
      height: 28px;
      line-height: 30px;
      width: 64px;
      border-radius: 28px;
      color: var(--font-color-fff);
      text-align: center;
      font-size: 18px;
    }

    .vip-progeress1 {
      background: var(--bg-vip-bar,var(--theme-color));
    }

    .vip-progeress2 {
      background-color: #bbb;
    }

    :deep(.van-progress) {
      flex: 1;
      margin: 0 20px;
      height: 16px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 4px 20px 0px rgba(104, 166, 255, 0.2);
      border-radius: 8px;

      .van-progress__pivot {
        top: -50px;
        color: var(--font-color-333);
        font-size: 18px;
        background-color: transparent !important;

        &:after {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border-top: 8px solid var(--font-color-333);
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          bottom: -8px;
          left: 50%;
          margin-left: -8px;
        }

        &:before {
          content: "";
          position: absolute;
          width: 58px;
          height: 32px;
          background-image: url(/src/current_project/assets/images/vip/vip_jindu@2x.png);
          background-size: 100% auto;
          left: 0;
          bottom: -55px;
        }
      }

      .van-progress__portion {
        background: var(--theme-color) !important;
      }
    }
  }

  .vip-ck {
    font-size: 24px;
    color: var(--cur-color-999);
    padding-left: 60px;
    margin-top: 10px;

    span {
      color: var(--font-color-333);
    }
  }

  .newvip-level {
    margin-top: 56px;

    :deep(.van-tabs) {
      .van-tabs__wrap {
        border-bottom: 0 !important;
        position: relative;
        height: auto;
        padding-left: 16px;

        .van-tabs__nav--line {
          position: relative;
          padding-bottom: 0;

          .van-tabs__line {
            display: none;
          }
        }

        .van-tabs__nav {
          height: auto;
          line-height: initial;
          align-items: center;
          position: relative;
        }

        .van-tab {
          width: 60px;
          height: 28px;
          background: var(--vip-tab-bg-color,rgba(233, 233, 233, 1));
          border-radius: 16px;
          border: 2px solid var(--vip-tab-border-color,rgba(221, 221, 221, 1));
          font-size: 24px;
          line-height: 28px;
          text-align: center;
          flex-basis: auto !important;
          margin-right: 92px;
          position: relative;
          z-index: 1;

          &.van-tab--active {
            width: 82px;
            height: 40px;
            background: var(--theme-color);
            border: 4px solid var(--theme-color);
            line-height: 40px;
            color: var(--cur-color-fff);
            z-index: 9;
            position: relative;
          }

          &:after {
            content: "";
            position: absolute;
            height: 4px;
            background: var(--vip-line-color,#e3e3e3);;
            width: 98px;
            right: 105%;
            top: 50%;
            margin-top: -2px;
            z-index: 0;
          }
        }
      }
    }

    .swiper-container {
      margin-top: 92px;
      padding-bottom: 124px;
      border-bottom: 20px solid #f5f6fa;
    }

    .swiper-pagination-fraction {
      color: var(--cur-color-999);
      text-align: right;
      bottom: 30px;
      right: 66px;
      left: auto;

      :deep(.swiper-pagination-current) {
        color: var(--font-color-333);
      }
    }

    .swiper-slide {
      width: 570px;
    }

    .newvip-level-info {
      width: 570px;
      height: 276px;
      background-size: 100% auto;
      position: relative;
      background-repeat: no-repeat;
      background-image: url("/src/current_project/assets/images/vip/vip_card2@2x.png");

      &-active {
        background-image: url("/src/current_project/assets/images/vip/vip_card1@2x.png");
      }

      .newvip-level-icon {
        position: absolute;
        width: 84px;
        right: 40px;
        top: 20px;
      }

      .newvip-level-tit {
        position: absolute;
        font-size: 60px;
        font-weight: bold;
        color: var(--font-color-fff);
        top: 70px;
        left: 60px;
        font-style: italic;
      }

      .newvip-level-con {
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 34px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0;

        div {
          text-align: center;
          flex: 1;
        }

        p:first-child {
          font-size: 28px;
          color: var(--font-color-fff);
          margin-bottom: 6px;
        }

        p:last-child {
          font-size: 20px;
          color: var(--font-color-fff-6);
        }
      }

      .qb-vip-tit01 {
        position: absolute;
        top: 150px;
        left: 46px;
        font-size: 28px;
        color: var(--font-color-fff-6);
      }

      .qb-vip-tit02 {
        position: absolute;
        top: 200px;
        left: 46px;
        font-size: 24px;
        color: var(--font-color-fff-14);
      }
    }

    :deep(.van-tab__pane-wrapper) {
      width: 570px;
    }
  }

  .vip0zx {
    h2 {
      display: flex;
      align-items: center;
      font-size: 40px;
      color: var(--font-color-333);
      margin: 24px 30px 28px;

      i {
        width: 6px;
        height: 32px;
        background: var(--btn-gradient-color);
        border-radius: 3px;
        margin-right: 16px;
      }
    }

    ul {
      display: flex;
      align-items: flex-start;
      flex-wrap: wrap;
      padding-left: 54px;

      li {
        width: 40%;
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;
        margin-bottom: 46px;

        img {
          width: 60px;
          margin-right: 28px;
        }

        p {
          flex: 1;
        }

        span {
          display: block;
          font-size: 34px;
          color: var(--cur-color-666666);
        }

        i {
          font-style: normal;
          font-size: 24px;
          color: var(--cur-color-999);
        }

        &:nth-child(odd) {
          width: 55%;
        }
      }
    }
  }

  .to-vipdet {
    font-size: 28px;
    // color: @bg-gradient-color;
    text-align: center;
    background: var(--bg-color-e5e5e5);
    padding: 60px 0;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 20px;
      margin-left: 10px;
    }

    span {
      color: var(--theme-color);
    }
  }

  .newvip-fs {
    padding: 0 30px;

    >div {
      width: 33.33%;
      display: inline-block;
      text-align: center;
      margin-bottom: 40px;

      p:first-child {
        color: var(--theme-color);
        font-size: 44px;
        font-weight: bold;
      }

      p:last-child {
        color: var(--cur-color-666);
        font-size: 24px;
        margin-top: 16px;
      }
    }
  }
}
</style>
