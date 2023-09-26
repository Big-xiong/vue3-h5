<template>
  <div class="welfare">
    <van-nav-bar :title="title" v-if="route.query.source !== 'app'" left-arrow @click-left="$router.go(-1)">
    </van-nav-bar>
    <div class="content" :class="{ 'no-header': !!route.query.source }">
      <div class="banner">
        <img :src="$getSrc(`/src/assets/images/activity/zh-CN/sixGift/banner@2x.png`)" alt />
        <img class="caijin" :src="$getSrc(`/src/assets/images/activity/zh-CN/sixGift/songcaijin@2x.png`)" alt />
        <div class="detail">
          <div class="top">
            <span>{{ $t('优惠力度') }}</span>
            <img :src="$getSrc(`/src/assets/images/activity/zh-CN/sixGift/up@2x.png`)" alt />
            <span>300%</span>
            &nbsp;
            <span>{{ $t('到账时间') }}</span>
            <img :src="$getSrc(`/src/assets/images/activity/zh-CN/sixGift/up@2x.png`)" alt />
            <span>90%</span>
          </div>
          <span class="bottom-line"></span>
          <div class="bottom">
            <label>{{ $t('已送出奖金') }}</label>
            <span>{{ sixInfo?.money }}</span>
            <i>{{ $t('元') }}</i>
          </div>
          <div class="bottom">
            <label>{{ $t('领取人数') }}</label>
            <span>{{ sixInfo?.user }}</span>
            <i>{{ $t('人') }}</i>
          </div>
        </div>
      </div>
      <div class="finish-time">
        <div class="top">
          <img :src="$getSrc(`/src/assets/images/activity/zh-CN/sixGift/clock@2x.png`)" alt />
          <span>{{ $t('距离活动结束时间') }}</span>
        </div>
        <div class="bottom">
          <div v-if="!user?.isLogin">{{ $t(`请您登录后查看活动剩余时间！您的优惠正在慢慢流失啦！`) }}</div>
          <div v-else>
            <van-count-down v-if="finishTime > 0" :time="finishTime" format="DD 天 HH 时 mm 分 ss 秒" />
            <p v-else>{{ $t('七天倒计时新手活动已结束，感谢您的参与！') }}</p>
          </div>
        </div>
      </div>
      <div class="chongzhi" @click="handlerProfit">{{ user?.isLogin ? global.$t('立即存款') : $t('登录/注册') }}</div>
      <div class="mfcaijin">
        <div class="card" v-for="(item, index) in profit_arr" :key="index">
          <p class="money">
            {{ item.benefit_money }}
            <span>{{ $t('元') }}</span>
          </p>
          <p class="freemoney">{{ $t(`免费彩金`) }} {{ item.flow }}{{ $t(`倍流水`) }}</p>
          <p class="depositmoney">
            {{ $t(`单笔存款`) }}
            <span>{{ item.recharge_money }}</span>{{ $t(`元`) }}
          </p>
          <p class="paifa">{{ $t('以上即可派发') }}</p>
          <div class="get-btn">
            <div v-if="item.haveReceive">
              <img :src="$getSrc(`/src/assets/images/activity/zh-CN/sixGift/check@2x.png`)" alt />
              <p>{{ $t('已领取') }}</p>
            </div>
            <button :class="{ disabled: !item.recharge_money }" @click="handleClickGetRedPacket(index)" v-else>{{
              $t('领取')
            }}</button>
          </div>
        </div>
      </div>
      <div class="miaobian">
        <img :src="$getSrc(`/src/assets/images/activity/zh-CN/sixGift/sawtooth_bg@2x.png`)" alt />
      </div>
      <div class="lingqujilu">
        <img :src="$getSrc(`/src/assets/images/activity/zh-CN/sixGift/lqjl@2x.png`)" alt />
        <table>
          <tr>
            <td>{{ $t('领取时间') }}</td>
            <td>{{ $t('游戏账号') }}</td>
            <td>{{ $t('领取状态') }}</td>
            <td>{{ $t('领取金额') }}</td>
          </tr>
          <tr v-for="(item, index) in tableData" :key="index">
            <td>{{ item.created_at }}</td>
            <td>{{ item.username }}</td>
            <td>{{ item.status == 1 ? '成功领取' : '领取失败' }}</td>
            <td :class="{ red: item.money * 1 > 1000 }">{{ item.money }}</td>
          </tr>
        </table>

        <div class="paging">
          <van-pagination @change="handleCurrentChange" v-model="page" :total-items="total" :show-page-size="10"
            force-ellipses />
        </div>
      </div>
      <div class="miaobian miaobian2">
        <img :src="$getSrc(`/src/assets/images/activity/zh-CN/sixGift/sawtooth_bg@2x.png`)" alt />
      </div>
      <div class="mingze">
        <img :src="$getSrc(`/src/assets/images/activity/zh-CN/sixGift/mingze@2x.png`)" alt />
        <div>
          <p>1. {{ subConfig.title }}{{ $t(`所有新手会员均可享受。`) }}</p>
          <p>2. {{ $t(`会员需要达成每次存款最低要求即可获得存款礼金。`) }}</p>
          <p>3. {{ $t(`如果单次存款金额达到多个层级，按照最高可以领取层级领取。流水倍数公式：（本金+礼金）*当前层级流水倍数=提款所需流水。`) }}</p>
          <p>4. {{ $t(`新手任务从会员注册日起，只保留7天。`) }}</p>
          <p>5. {{ $t(`每个层级礼金均只能领取一次。`) }}</p>
          <p>6. {{ $t(`本活动不与返水活动共享。`) }}</p>
          <p>
            7.{{ $t(`本优惠活动只限娱乐性质的会员参加，如发现用户拥有超过一个账户，包括同一姓名，同一邮箱，同一/相似IP地址，同一住址，同一银行卡，同一电脑，禁止多开窗口进行投注，软件投注和套免费游戏等其他任何不正常投注行为，一经发现我们将保留冻结账户以及没收所有余额的权利。`) }}
          </p>
          <p>8. {{ subConfig.title }}{{ $t(`拥有最终解析权。`) }}</p>
        </div>
      </div>
      <div class="miaobian-bottom">
        <img :src="$getSrc(`/src/assets/images/activity/zh-CN/sixGift/sawtooth_bg@2x.png`)" alt />
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  computed, inject, reactive, ref, onBeforeUnmount,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRoute, useRouter } from 'vue-router';

import dayjs from 'dayjs';
import { Toast } from 'vant';
import {
  specialdetail,
  sixinforecord,
  sixinfo,
  getsixinfoReward,
} from '@/api/activity';
import { member } from '@/api/user';
import { useDiscount } from '@/utils/hooks.js';
import { getParams } from '@/utils';

const global = inject('global');
const {
  user,
  app,
} = global.$store.state;
const router = useRouter();
const route = useRoute();
const subConfig = inject('subConfig');
const title = ref(route?.meta?.title || '');
const profit_arr = ref([]);
const tableData = ref([]);
const page = ref(1);
const total = ref(0);
const totalPage = ref(1);
const timer = ref(null);
const id = ref(getParams('id') || '');
const detail = ref([]);
const finishTime = ref(0);
const type = computed(() => (subConfig.isCurrency ? 'blizzwin' : 'app'));

useRequest(() => sixinforecord(), {
  onSuccess(res) {
    tableData.value = res.list;
    total.value = res.total;
    totalPage.value = Math.floor(res.total / 10);
  },
});
const {
  signedText,
} = useDiscount();
const { run: init, data: sixInfo } = useRequest(
  () => sixinfo(),
  {
    manual: false,
    onSuccess() {
      getDetail();
    },
  },
);
// 获取优惠详情
function getDetail() {
  useRequest(() => specialdetail({ id: id.value }), {
    onSuccess(res) {
      title.value = res?.name;
      detail.value = res.condition_setting;
      const { get_status } = sixInfo.value;
      profit_arr.value = res.condition_setting.condition.map(
        (item, index) => {
          let haveReceive = false;
          if (get_status && get_status[index + 1]) {
            haveReceive = true;
          }
          return {
            ...item,
            haveReceive,
          };
        },
      );
      handleMember();
    },
  });
}
function handleMember() {
  const { data: userInfo } = useRequest(
    () => member(),
    {
      onSuccess(res) {
        const { created_at } = res;
        if (created_at) {
          // 活动到期时间
          const endDay = dayjs(created_at).add(detail.value?.save_days, 'day');
          timer.value = setInterval(() => {
            // 当前时间
            const newDay = dayjs(new Date());
            // 活动到期时间-当前时间
            const leftTime = endDay - newDay;

            if (leftTime < 0) {
              finishTime.value = -1;
            } else {
              finishTime.value = leftTime;
            }
          }, 1000);
        }
      },
    },
  );
}
async function handleCurrentChange(val) {
  useRequest(() => sixinforecord({ page: val }), {
    onSuccess(res) {
      tableData.value = res.list;
      total.value = res.total;
    },
  });
}
function handlerProfit() {
  if (!user?.isLogin) {
    app.source === 'app' ? window.location.href = `app://login` : router.push({ name: 'login' });
  } else {
    app.source === 'app' ? window.location.href = `app://pay` : router.push('/center/fund-management/deposit');
  }
}
// 领取新手六重礼
function handleClickGetRedPacket(index) {
  if (user?.isLogin) {
    useRequest(() => getsixinfoReward({ step: index + 1 }), {
      onSuccess(res) {
        Toast.success(`领取第${index + 1}重礼成功`);
        init();
      },
    });
  }
}
onBeforeUnmount(() => {
  clearInterval(timer.value);
});
</script>

<style lang="less" scoped>
.welfare {
  font-size: 24px;
  height: 100vh;
  background-color: var(--font-color-white);
  display: flex;
  flex-direction: column;

  :deep(.van-pagination__item) {
    color: var(--font-color-333);
    width: 40px;
    height: 40px;
    min-width: 40px;
    font-size: 24px;
    text-align: center;
    border-radius: 50%;

    &::after {
      display: none;
    }
  }

  :deep(.van-pagination__item--active) {
    background-color: var(--bg-color-e74f38);
    color: var(--font-color-fff);
  }

  :deep(.van-pagination__prev) {
    width: auto;
  }

  :deep(.van-pagination__next) {
    width: auto;
  }

  .red {
    color: red;
  }

  .content {
    width: 100%;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .banner {
      position: relative;

      img {
        width: 100%;
      }

      .caijin {
        margin-top: -23px;
      }

      .detail {
        position: absolute;
        width: 422px;
        top: 470px;
        left: 50%;
        margin-left: -208px;
        padding: 0px 0px;

        // display: flex;
        // align-items: center;
        // justify-content: center;
        .top {
          color: var(--font-color-91570d);
          text-align: center;
          line-height: 60px;

          img {
            height: 24px;
            width: 24px;
            margin: 0 2px -5px;
          }
        }

        .bottom-line {
          width: 400px;
          height: 2px;
          background-color: var(--bg-color-edd0bc);
          display: block;
          margin: 0 auto;
        }

        .bottom {
          padding: 14px 0 0 14px;
          display: flex;
          justify-content: flex-start;

          label {
            width: 130px;
            text-align: center;
            line-height: 36px;
            color: var(--font-color-91570d);
          }

          span {
            flex: 1;
            height: 36px;
            background: rgba(233, 56, 32, 1);
            border: 1px solid;
            border-image: linear-gradient(0deg,
                rgba(218, 26, 0, 1),
                rgba(246, 97, 0, 1),
                rgba(247, 55, 0, 1)) 1 1;
            box-shadow: -10px 4px 13px 0 rgba(233, 56, 32, 0.44);
            margin-left: 14px;
            color: var(--font-color-fff);
            line-height: 36px;
            padding-left: 30px;
          }

          i {
            float: right;
            font-style: normal;
            color: var(--font-color-fff);
            line-height: 36px;
            position: relative;
            left: -50px;
          }
        }
      }
    }

    .finish-time {
      padding: 0 30px;

      .top {
        margin-top: 14px;
        margin-bottom: 40px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          height: 32px;
        }

        span {
          font-size: 30px;
          color: var(--bg-color-e64e37);
          margin-left: 10px;
        }
      }

      .bottom {
        height: 80px;
        background: var(--bg-color-e64e37);
        color: var(--font-color-fff);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: 600;

        .van-count-down {
          color: var(--font-color-fff);
          font-size: 46px;
        }
      }
    }

    .chongzhi {
      width: 600px;
      height: 100px;
      text-align: center;
      background-size: 100% 100%;
      margin: 48px auto;
      background-image: url("/src/assets/images/activity/zh-CN/sixGift/btn_bg@2x.png");
      line-height: 80px;
      font-size: 30px;
      color: var(--font-color-fff);
    }

    .mfcaijin {
      border-top: 2px dashed var(--bg-color-edd0bc);
      padding: 48px 30px;
      margin-top: -15px;

      .card {
        height: 368px;
        width: 274px;
        margin-bottom: 30px;
        background-image: url("/src/assets/images/activity/zh-CN/sixGift/hongbao_bg@2x.png");
        background-size: 100% 100%;
        padding-top: 50px;
        display: inline-block;
        text-align: center;
        color: var(--font-color-91570d);

        &:nth-child(2n) {
          margin-left: 140px;
        }

        .money {
          font-size: 40px;
          font-weight: 600;
          line-height: 50px;

          span {
            font-size: 12px;
            font-weight: normal;
          }
        }

        .freemoney {
          line-height: 50px;
        }

        .depositmoney {
          span {
            font-weight: 700;
          }
        }

        .get-btn {
          padding-top: 60px;
          overflow: hidden;

          button {
            width: 179px;
            height: 42px;
            background: linear-gradient(76deg,
                rgba(255, 210, 22, 1),
                rgba(255, 246, 122, 1));
            box-shadow: 0 8px 13px 0 rgba(145, 55, 36, 0.3);
            border-radius: 21px;
            border: 0;
            outline: none;

            &.disabled {
              pointer-events: none;
              filter: grayscale(1);
            }
          }

          >div {
            width: 140px;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;

            img {
              width: 44px;
              float: left;
            }

            p {
              line-height: 44px;
              color: var(--font-color-fff);
              float: left;
              margin-left: 10px;
            }
          }
        }
      }
    }

    .miaobian {
      height: 140px;
      background: var(--bg-color-6093ec);
      margin-top: -60px;

      img {
        width: 100%;
      }
    }

    .miaobian2 {
      margin-top: -10px;
    }

    .miaobian-bottom {
      margin-top: 30px;
      height: 200px;
      background-image: url("/src/assets/images/activity/zh-CN/sixGift/dibu_bg@2x.png");
      background-size: 100% 200%;
      background-position: bottom;

      img {
        width: 100%;
      }
    }

    .lingqujilu {
      &>img {
        width: 100%;
        margin-top: -35px;
      }

      table {
        margin-top: -20px;
        width: 100%;

        td {
          text-align: center;
          padding: 16px 0;
        }
      }

      .paging {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 25px 0;

        img {
          width: 32px;
          height: 32px;
        }

        span {
          display: inline-block;
          text-align: center;
          width: 40px;
          height: 40px;
          line-height: 40px;
          border-radius: 50%;
          background: var(--bg-color-e64e37);
          color: var(--font-color-fff);
          margin: 0 20px;
        }

        div {
          color: var(--font-color-666);
          margin-left: 20px;
        }
      }
    }

    .mingze {
      &>img {
        width: 100%;
        margin-top: -20px;
      }

      div {
        margin: 0 30px;
        background: var(--bg-color-f8f5e9);
        color: var(--font-color-79480a);
        padding: 38px 13px;
        line-height: 36px;
        border-radius: 10px;
      }
    }
  }

  .no-header {
    padding-top: 0;
    margin-top: 0;
  }
}
</style>
