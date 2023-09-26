<template>
  <div :class="user.isLogin ? `center-wrap login-center-wrap-${lang}` : 'center-wrap'">
    <div class="center-wrap-header">
      <div class="center-wrap-header-user layout-flex-between">
        <div
          :class="user.isLogin ? 'center-wrap-header-user-left' : 'center-wrap-header-user-left center-wrap-header-user-left-noLogin'">
          <template v-if="user.isLogin">
            <!--              <img class="avatar" :src="$getSrc(`/src/assets/images/agent/user.png`)"/>-->
            <SvgIcon name="person-o" v-login="() => $router.push({ name: 'centerAccountSafe' })" />

            <span class="newui-user-left">
              <div class="newui-user-info">
                <span>{{ user?.userInfo?.username }}</span>
                <SvgIcon class="login-vip" :name="`login-vip-${userInfo.level}`" />
                <SvgIcon class="lang flag-national" :name="`flag-${currentLang}`" />
              </div>
              <div class="login-viplevel-container">
                <div class="login-viplevel-container-to-upgrade" v-if="isMaxLevel">{{ $t('尊敬的会员您已经是最高等级') }}</div>
                <div v-else class="login-viplevel-container-to-upgrade">{{ $t('所需存款') }} {{ toNextLevelDeposit }} {{
                    $t('和流水')
                }} {{ toNextLevelValidBetMoney }}</div>
                <div class="login-viplevel-container-bar" v-if="!isMaxLevel">
                  <div class="login-vip-bar">
                    <div class="login-vip-bar-process" :style="{ width: `${vipLevelProcessBar}%` }"></div>
                  </div>
                </div>
                <div class="login-viplevel-container-buttom" v-if="!isMaxLevel">
                  <div class="login-viplevel-container-buttom-left" v-login="() => delayPush('Vip')">
                    <span>{{ $t('升级福利') }}</span>
                    <van-icon name="arrow" />
                  </div>
                  <SvgIcon :class="lang === 'vi' ? 'login-vip login-vip-vi' : 'login-vip'"
                    :name="`login-vip-${userInfo.level + 1}`" />
                </div>
              </div>
              <!-- <div class="joined-days">{{ $t('已加入blizzwin') }} {{ joinedDays + 1 }} {{ $t('天') }}</div> -->
            </span>
          </template>
          <template v-else>
            <!--              <img class="avatar" :src="$getSrc(`/src/assets/images/agent/user.png`)"/>-->
            <SvgIcon name="person-o" />
            <van-loading class="nologin-loading" v-if="user.loginLoading" />
            <template v-else>
              <span class="login-btn" @click="$router.push({ name: 'login' })">{{ $t('登录') }}</span>
              <span class="register-btn" @click="$router.push({ name: 'register' })">{{ $t('注册') }}</span>
            </template>
          </template>
        </div>

        <div class="layout-flex-center center-wrap-header-user-right">
          <div class="layout-flex-center center-wrap-header-user-right-dot" v-if="subConfig.showUserMsgIcon"
            @click="$router.push({ name: 'notice' })">
            <SvgIcon name="login-to-inboxmsg" />
            <i v-show="isShowDot"></i>
          </div>
          <SvgIcon name="login-to-more" v-login="() => $router.push({ name: 'more' })" />
        </div>
      </div>
    </div>

    <div class="center-wrap-check-viplevel" v-if="!user.isLogin">
      <div class="no-login-viplevel-container">
        <div class="no-login-viplevel">
          <div class="no-login-viplevel-btn" @click="$router.push({ name: 'login' })">{{ $t('查看VIP等级') }}</div>
          <ul class="no-login-viplevel-list">
            <li>
              <SvgIcon name="login-gif" />
              <span>{{ $t('晋级礼金') }}</span>
            </li>
            <li>
              <SvgIcon name="login-money-bag" />
              <span>{{ $t('超高返水') }}</span>
            </li>
            <li>
              <SvgIcon name="login-birth-box" />
              <span>{{ $t('生日礼金') }}</span>
            </li>
            <li>
              <SvgIcon name="login-activity" />
              <span>{{ $t('专属活动') }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-else class="rebate-bar" @click="$router.push({ name: 'centerRebate' })"
      :style="{ background: `var(--bg-color-1fa07c) url(${$getSrc(`/src/assets/images/${lang}-rebate-title.png`)}) 20px 4px no-repeat`, backgroundSize: '19%' }">
      <span>
        <i>{{ $t('超高时时返水') }}</i>
        <van-icon name="arrow" />
      </span>
    </div>

    <WalletAction />

    <div class="center-wrap-news">
      <div @click="gotoRank">
        <div class="title">{{ $t('最新动态') }}</div>
      </div>
      <div class="notice-wrap">
        <div class="loading-wrap" v-if="withdrawListLoading || getWithdrawLoading">
          <van-loading></van-loading>
        </div>
        <div v-for="(item, index) in noticeList.slice(0, 1)" :key="index">
          <van-row justify="space-between" align="center">
            <span class="layout-flex-center">
              <SvgIcon :name="iconName"></SvgIcon>
              <span>{{ item.username }}</span>
              <span v-show="!withdrawLists.length" class="cui" v-login="() => $toast.success($t('系统已优先为您处理'))">
                {{
                    $t('催一下')
                }}
              </span>
            </span>
            <span v-money="item.money"></span>
          </van-row>
          <van-row class="countdown-wrap" justify="space-between" align="top">
            <span>{{ item.created_at.replace(/^\d.+?-/, '') }}</span>
            <span class="layout-flex-center" v-if="!withdrawLists.length">
              {{ $t('审核中') }}
              <em>
                (
                <van-count-down class="processing-time" :auto-start="true" time="900000" format="mm:ss" />)
              </em>
            </span>
            <span v-else>{{ $t('取款成功') }}</span>
          </van-row>
        </div>
      </div>
    </div>
    <div class="center-wrap-funcs">
      <div class="title">{{ $t('我的功能') }}</div>
      <div class="content">
        <div class="item" v-login="() => $router.push({ name: 'centerDepositRecord' })">
          <SvgIcon name="transaction" />
          <p>{{ $t('交易记录') }}</p>
        </div>
        <div class="item" v-login="() => $router.push({ name: 'centerBankCard' })">
          <SvgIcon name="card" />
          <p>{{ $t('银行卡绑定') }}</p>
        </div>
        <div class="item" v-login="() => $router.push({ name: 'centerAccountSafe' })">
          <SvgIcon name="account-safe" />
          <p>{{ $t('账号安全') }}</p>
        </div>
        <div class="item" @click="() => $router.push('/help')">
          <SvgIcon name="tutorial" />
          <p>{{ $t('新手教程') }}</p>
        </div>
        <div class="item" v-login="() => $router.push({ name: 'centerSubscription' })">
          <SvgIcon name="subscribe" />
          <p>{{ $t('服务订阅') }}</p>
        </div>
        <div class="item" @click="gotoAgentCenter">
          <SvgIcon name="agent-center" />
          <p>{{ $t('代理中心') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, computed, watch, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRouter } from 'vue-router';
import { useInterval, useWithdraw } from '@/utils/hooks';
import { getdepositandwithdrawlist, withdrawlistinfo, sitenotice } from '@/api/center';
import SvgIcon from '@/components/SvgIcon.vue';
import WalletAction from './components/WalletAction.vue';
import { memberlevellist } from '@/api/dicts';

const global = inject('global');
const $store = inject('store');
const {
  user,
  app: { lang },
} = $store.state;
const { userInfo, walletInfo } = user;

const subConfig = inject('subConfig');

const uploadWalletLoading = computed(() => $store.state.user.uploadWalletLoading);

const withdrawListsMy = ref([]);
const depositListsMy = ref([]);
const withdrawLists = ref([]);
const noticeList = ref([]);
const timer = ref(null);
const currentLang = ref('zh-CN');
const joinedDays = ref(0);
// const currentLevel = ref(0);
// const nextLevel = ref(0);
const toNextLevelDeposit = ref(0);
const toNextLevelValidBetMoney = ref(0);
const isMaxLevel = ref(false);
const vipLevelProcessBar = ref(0);
const isShowDot = ref(false);

// 最新动态 取款存款标识
const iconName = computed(() => (withdrawLists.value.length || withdrawListsMy.value.length || withdrawListsMy.value.length ? 'withdraw-icon' : 'deposit-icon'));

const { run, loading } = useRequest(
  () => sitenotice({
    uid: user?.userInfo?.id,
  }),
  {
    onSuccess(res) {
      const noticeList = res.data.filter((item) => item.title.toLowerCase() !== 'image-type');
      $store.dispatch('app/updateSiteNotice', noticeList);
    },
  },
);
// 根据userInfo.inte_region_id设置国旗
//  添加joined 日期
watch(
  [() => userInfo.inte_region_id, () => userInfo.created_at, () => $store.state.app.noticeList],
  ([val, created_at, noticeList]) => {
    currentLang.value = val === 2 ? 'th' : val === 3 ? 'vi' : 'zh-CN';
    noticeList.length > 0 ? (isShowDot.value = true) : (isShowDot.value = false);
  },
  { immediate: true },
);

const router = useRouter();

const { run: getLevelSetting } = useRequest(memberlevellist, {
  manual: true,
  onSuccess(levelSetting) {
    const { level } = user.userInfo;
    isMaxLevel.value = levelSetting[levelSetting.length - 1].level <= level;

    levelSetting.forEach((list) => {
      if (list.level === level + 1) {
        toNextLevelDeposit.value = list.need_deposit_money;
        toNextLevelValidBetMoney.value = list.need_valid_bet;

        const betPercent = (list.valid_bet_money - list.need_valid_bet) / list.valid_bet_money;
        const depostPercent = (list.deposit_money - list.need_deposit_money) / list.deposit_money;
        vipLevelProcessBar.value = `${(betPercent + depostPercent) / 2 * 100}`;
      }
    });
  },
});

function gotoRank() {
  if (withdrawListsMy.value.length || depositListsMy.value.length) {
    router.push({ name: 'centerDepositRecord' });
  } else {
    router.push({ name: 'transRank' });
  }
}

function gotoAgentCenter() {
  const agent = global.$router.resolve({ name: 'agentLanding' });
  window.open(agent.href, '_blank');
}

function handleWallet() {
  $store.dispatch('user/getWalletInfo');
}

const { run: getWithdrawLists, loading: withdrawListLoading } = useRequest(withdrawlistinfo, {
  manual: true,
  onSuccess(res) {
    withdrawLists.value = res.list || [];
    if (withdrawLists.value.length > 0) {
      noticeList.value = withdrawLists.value.slice(0, 1);
    }
  },
});

const getWithdrawLoading = ref(false);

async function getMyWithdraw(val) {
  const { data } = await getdepositandwithdrawlist({
    type: val,
    NO_FILTER: true,
  });

  if (val === 1) {
    withdrawListsMy.value = data || [];
  } else {
    depositListsMy.value = data || [];
  }
}

const { run: runInterval, stop: stopInterval } = useInterval(
  async () => {
    Promise.all([getMyWithdraw(2), getMyWithdraw(1)]).then(() => {
      if (!withdrawListsMy.value.length && !depositListsMy.value.length && !user.isLogin) {
        stopInterval();
      }
    });
  },
  5000,
  { manual: true },
);

async function getWithdrawData() {
  if (user?.isLogin) {
    getWithdrawLoading.value = true;
    Promise.all([getMyWithdraw(2), getMyWithdraw(1)]).then(() => {
      getWithdrawLoading.value = false;
      if (!withdrawListsMy.value.length && !depositListsMy.value.length) {
        getWithdrawLists();
      } else {
        if (withdrawListsMy.value.length > 0 && depositListsMy.value.length === 0) {
          noticeList.value = withdrawListsMy.value.slice(0, 2);
        }
        if (depositListsMy.value.length > 0 && withdrawListsMy.value.length === 0) {
          noticeList.value = depositListsMy.value.slice(0, 2);
        }
        if (depositListsMy.value.length && withdrawListsMy.value.length) {
          noticeList.value = [...depositListsMy.value.slice(0, 1), ...withdrawListsMy.value.slice(0, 1)];
        }
        withdrawLists.value = [];
        runInterval();
      }
    });
  }
}

onMounted(() => {
  if (user.isLogin) {
    getWithdrawData();
    handleWallet();
    getLevelSetting();
  } else {
    getWithdrawLists();
    stopInterval();
  }
});

function delayPush(name) {
  global.$router.push({ name });
}
</script>

<style lang="less" scoped>
:deep(.van-nav-bar) {
  background-color: var(--bg-color-24c29a);
}

.center-wrap {
  //max-height: 1240px;
  height: 100%;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 30px;
  box-sizing: border-box;
  background: linear-gradient(to bottom,
      var(--bg-color-24c29a) 328px,
      var(--dark-bg-color-000, var(--bg-color-f7f7f7)) 327px);

  &-header {
    width: 100vw;
    margin-top: 18px;

    &-user {
      padding: 6px 42px 0px 30px;

      .nologin-loading {
        margin-left: 40px;
        color: var(--user-head-bg-color);
      }

      &-right {
        color: var(--font-color-ffffff);

        svg {
          width: 36px;
          height: 36px;
        }

        &-dot {
          position: relative;
          margin-right: 36px;

          svg {
            width: 42px;
            height: 42px;
          }

          i {
            width: 18px;
            height: 18px;
            background-color: #fa5300;
            border-radius: 10px;
            position: absolute;
            top: -6px;
            right: -6px;
          }
        }
      }

      &-left {
        display: flex;
        //align-items: center;
        padding-top: 24px;

        .newui-user-left {
          text-align: left;

          .login-viplevel-container {
            &-to-upgrade {
              margin-top: 6px;
              font-size: 22px;
            }

            &-bar {
              margin-top: 12px;

              .login-vip-bar {
                width: 396px !important;
                height: 6px;
                background-color: var(--bg-color-vip-bar);
                border-radius: 16px;

                .login-vip-bar-process {
                  height: 6px;
                  background-color: var(--bg-color-vip-bar-process);
                  border-radius: 16px;
                  transition: all 0.3s;
                }
              }
            }

            &-buttom {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-top: 12px;

              &-left {
                padding: 6px 10px;
                background-color: var(--bg-color-a9ffe9);
                border-radius: 20px;
                display: flex;
                align-items: center;
                line-height: 1;

                span {
                  font-size: 18px;
                  color: var(--cur-font-color-fff, var(--theme-color));
                }

                .van-icon-arrow {
                  font-size: 16px;
                  margin-left: 0px;
                  color: var(--cur-font-color-fff, var(--theme-color));
                }
              }

              .login-vip {
                border: none;
                border-radius: 0px;
                background-color: var(--theme-color);
                margin-left: 7px;
                width: 92px;
                height: 38px;
              }

              .login-vip-vi {
                padding-right: 38px;
              }
            }
          }

          .newui-user-info {
            display: flex;
            align-items: center;

            .login-vip {
              border: none;
              border-radius: 0px;
              background-color: var(--theme-color);
              margin-left: 7px;
              width: 82px;
              height: 30px;
            }
          }

          span {
            margin-left: 0;
          }

          .joined-days {
            font-weight: 100;
            font-size: 24px;
            margin-top: 6px;
          }
        }

        >.svg-icon-wrap {
          width: 100px;
          height: 100px;
          padding: 25px;
          box-sizing: border-box;
          border-radius: 50%;
          background: var(--user-head-bg-color);
          fill: var(--user-head-person-color);
        }

        span {
          margin-left: 18px;
          font-size: 36px;
          font-family: var(--font-family-helvetica);
          font-weight: 400;
          color: var(--font-color-ffffff);

          &.login-btn {
            font-size: 32px;
          }

          &.register-btn {
            font-size: 32px;
          }
        }

        .lang {
          width: 28px;
          height: 18px;
          margin-left: 12px;
          border: none;
          border-radius: 0px;
        }
      }

      &-left-noLogin {
        align-items: center;
      }
    }
  }

  &-check-viplevel {
    margin-bottom: 28px;

    .login-viplevel-container {
      &-list {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 30px;
        width: 690px;

        &.cn-svg {
          .svg-icon-wrap {
            height: 34px;
          }
        }

        li {
          width: 164px;
          height: 48px;
          background-size: contain;
          background-repeat: no-repeat;
          font-size: 20px;
          padding-left: 52px;
          box-sizing: border-box;
          flex-shrink: 0;
          position: relative;

          div {
            display: flex;
            align-items: center;
            height: 48px;
            width: 104px;
            line-height: 18px;
            position: absolute;
            color: var(--theme-color);
            white-space: pre-wrap;
            background-repeat: no-repeat;
          }

          .en {
            width: 100px;
          }
        }

        &-able {
          background-image: url("/src/assets/icons/login-activity-able.svg");
        }

        &-disable {
          background-image: url("/src/assets/icons/login-activity-disable.svg");
        }
      }

      &-rebate-bar {
        background-repeat: no-repeat;
        background-size: cover;
        height: 66px;
        position: relative;
        z-index: 0;
        margin: 46px auto 0;
        width: 632px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }

    .no-login-viplevel-container {
      width: 92%;
      margin: auto;
      color: var(--dark-fff, var(--font-color-2b2b2b));
      background: var(--user-bg-color-191919, var(--bg-color-ffffff));
      box-shadow: 0px 2px 10px 0px rgba(0, 34, 80, 0.05);
      border-radius: 16px;
      margin-top: 24px;
      padding: 36px;
      box-sizing: border-box;

      .no-login-viplevel {
        &-btn {
          width: 180px;
          margin: auto;
          text-align: center;
          background: var(--theme-color);
          border-radius: 42px;
          padding: 18px 48px;
          color: var(--font-color-fff);
          white-space: nowrap;
        }

        &-list {
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          margin-top: 42px;

          li {
            display: flex;
            align-items: center;

            span {
              font-size: 22px;
              margin-left: 6px;
            }

            svg {
              width: 26px;
              height: 26px;
            }
          }
        }
      }
    }
  }

  &-wallet {
    width: 92%;
    background: var(--user-bg-color-191919, var(--bg-color-ffffff));
    color: var(--dark-fff, var(--font-color-2b2b2b));
    border-radius: 16px;
    box-shadow: 0px 2px 10px 0px rgba(0, 34, 80, 0.05);
    margin: auto;
    margin-top: 36px;
    padding: 36px 18px 30px 24px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    .balance {
      width: 36%;
      height: inherit;

      .item {
        display: flex;
        align-items: center;

        span {
          font-size: 24px;
          display: flex;
          align-items: center;
          white-space: nowrap;

          .svg-icon-wrap {
            margin-left: 8px;
          }
        }
      }

      h2 {
        margin-top: 12px;
        margin-bottom: 0px;
      }

      .svg-icon-wrap {
        width: 20px;
        height: 20px;
      }
    }

    .menu-wrap {
      width: 60%;
      display: flex;
      justify-content: space-between;
    }
  }

  &-login-wallet {
    margin-top: 0;
  }

  &-news {
    width: 690px;
    margin: auto;
    margin-top: 28px;
    border-radius: 8px;
    padding-top: 20px;
    background-color: var(--user-bg-color-191919, var(--bg-color-ffffff));

    >div:nth-child(1) {
      height: 44px;
      line-height: 44px;
      padding-left: 0;
      background: url("/src/assets/images/icon/right-arrow.png") no-repeat 656px center;
      background-size: 10px 18px;

      .title {
        position: relative;
        font-size: 32px;
        font-weight: 600;
        color: var(--dark-fff, var(--font-color-2b2b2b));
        padding-left: 32px;

        &:before {
          content: "";
          position: absolute;
          top: 4px;
          left: 0;
          width: 6px;
          height: 32px;
          background: var(--theme-color);
        }
      }
    }

    >div:nth-child(2) {
      padding: 26px 24px 12px 32px;

      .van-row {
        &:nth-child(1) {
          height: 50px;
          line-height: 50px;
          font-size: 36px;

          >span:nth-child(1) {
            font-size: 28px;
            color: var(--dark-fff, var(--font-color-000000));

            .cui {
              display: inline-block;
              min-width: 84px;
              height: 32px;
              font-size: 20px;
              padding: 0 10px;
              color: var(--font-color-ff3f00);
              line-height: 32px;
              text-align: center;
              border: 2px solid var(--font-color-ff3f00);
              border-radius: 22px;
              margin-left: 40px;
            }
          }

          >span:nth-child(2) {
            font-size: 36px;
            color: var(--dark-fff, var(--font-color-000000));
          }
        }

        &:nth-child(2) {
          margin-top: 6px;
          height: 34px;
          line-height: 24px;
          font-size: 24px;

          >span:nth-child(1) {
            font-family: ArialMT;
            opacity: 0.4;
            color: var(--dark-fff, var(--font-color-000000));
          }

          >span:nth-child(2) {
            height: 34px;
            line-height: 34px;
            color: var(--theme-color);

            .red {
              color: var(--font-color-ff3f00);
            }
          }
        }
      }
    }
  }

  &-funcs {
    width: 690px;
    margin: auto;
    margin-top: 28px;
    border-radius: 8px;
    padding-top: 20px;
    background-color: var(--user-bg-color-191919, var(--bg-color-ffffff));

    .title {
      position: relative;
      height: 44px;
      font-size: 32px;
      font-weight: 600;
      color: var(--dark-fff, var(--font-color-2b2b2b));
      line-height: 44px;
      padding-left: 26px;

      &:before {
        content: "";
        position: absolute;
        top: 5px;
        left: 0;
        width: 6px;
        height: 32px;
        background: var(--theme-color);
      }
    }

    .content {
      display: flex;
      flex-flow: row wrap;
      padding-bottom: 40px;

      .item {
        width: 229px;
        padding-top: 20px;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        align-items: center;

        .svg-icon-wrap {
          width: 88px;
          flex-shrink: 0;
          height: 88px;
          margin: 0 auto;
        }

        p {
          text-align: center;
          margin-top: 4px;
          font-size: 28px;
          min-height: 40px;
          line-height: 40px;
          color: var(--dark-fff, var(--font-color-000000));
        }
      }
    }
  }

  .van-cell {
    background-color: var(--dark-bg-color-191919, var(--bg-color-ffffff));
  }

  .notice-wrap {
    height: 140px;
    box-sizing: border-box;
    position: relative;

    .loading-wrap {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      :deep(svg) {
        color: var(--theme-color);
      }
    }

    em {
      display: flex;
      align-items: center;
      font-style: normal;
      color: var(--font-color-ff3f00);

      :deep(.van-count-down) {
        color: var(--font-color-ff3f00);
      }
    }

    .countdown-wrap {
      span {
        display: flex;
        align-items: center;
      }
    }

    .svg-icon-wrap {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
  }
}

.login-center-wrap-zh-CN,
.login-center-wrap-en,
.login-center-wrap-th {
  background: linear-gradient(to bottom,
      var(--bg-color-24c29a) 390px,
      var(--dark-bg-color-000, var(--bg-color-f7f7f7)) 327px);
}

.login-center-wrap-vi {
  background: linear-gradient(to bottom,
      var(--bg-color-24c29a) 410px,
      var(--dark-bg-color-000, var(--bg-color-f7f7f7)) 327px);
}

.login-to-more {
  color: var(--font-color-white);
}

.rebate-bar {
  border-radius: 20px 20px 0 0;
  height: 66px;
  position: relative;
  z-index: 0;
  margin: 46px auto 0;
  width: 632px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    color: var(--theme-color);
    font-size: 24px;
    margin: 0 40px 0 auto;
    background-color: var(--bg-color-4f525c);
    padding: 5px 16px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .van-icon-arrow {
    color: var(--theme-color);
    margin-left: -3px;
    font-size: 20px;
  }
}
</style>
