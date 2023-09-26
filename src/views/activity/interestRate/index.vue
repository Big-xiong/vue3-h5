<template>
  <div id="interestRate">
     <van-nav-bar
      :title="title"
      v-if="route.query.source !== 'app'"
      left-arrow
      @click-left="router.go(-1)"
    ></van-nav-bar>

     <div class="container" :class="{ 'no-header': !!$route.query.source }">
      <div>
        <van-image src="/src/assets/images/activity/zh-CN/interestRate/bg1.jpg" alt="" class="bg1" />
        <van-image src="/src/assets/images/activity/zh-CN/interestRate/bg2.jpg" alt="" class="bg2" />
        <van-image src="/src/assets/images/activity/zh-CN/interestRate/bg3.jpg" alt="" class="bg3" />
        <div class="bg4">
          <table v-if="condition_setting?.length">
            <tr>
              <td>{{$t('会员等级')}}</td>
              <td>{{$t('七日年化')}}</td>
              <td>{{$t('最大保持')}}</td>
              <td>{{$t('转入金额上限')}}</td>
            </tr>
            <tr v-for="(item, index) in condition_setting" :key="index">
              <td>
                <!-- <span></span>  -->
                {{ dicts?.memberlevellist[index]?.name }}
              </td>
              <td>{{ item?.condition?.rate }}%</td>
              <td>{{ item?.condition?.day }}天</td>
              <td>{{ item?.condition?.up_money }}万</td>
            </tr>
          </table>
        </div>
        <div class="bg5">
          <div class="form">
            <div class="item">
              <span>{{$t('转入金额')}}</span>
              <input
                type="number"
                v-model="money"
                @input="changeNum"
                :placeholder="'请输入100或以上的金额'"
              />
            </div>
            <div class="item">
              <span>{{$t('转入日期')}}</span>
              <p @click="showThen(1)">{{ value1 }}</p>
            </div>
            <div class="item">
              <span>{{$t('转出日期')}}</span>
              <p @click="showThen(2)">{{ value2 }}</p>
            </div>
            <div class="pic"></div>
            <div class="item">
              <span>{{$t('转入收益')}}</span>
              <input type="text" v-model="num" disabled />
            </div>
            <div class="note">
              <p>*收益金额以最高年利率13%计算</p>
            </div>
            <div
              class="btn"
              v-if="!user?.isLogin"
              @click="doLogin"
              >{{$t('登录/注册')}}</div
            >
            <router-link :to="{ path: '/wallet' }" tag="div" class="btn" v-else
              >{{$t('立即转入')}}</router-link
            >
          </div>
        </div>
        <div class="bg6">
          <div class="title">
            <p @click="activeTab = 0">{{$t('什么是聚宝盆')}}</p>
            <p @click="activeTab = 1">{{$t('参与规则')}}</p>
            <p @click="activeTab = 2">{{$t('服务条款')}}</p>
          </div>
          <div class="content">
            <div v-if="activeTab === 0">
              聚宝盆是{{subConfig.title}}娱乐打造的一种理财服务，
              把您存款进入游戏账号的钱转入{{subConfig.title}}所提供的过夜利息钱包满足12小时；存入的资金越高，获得的利润会更高，最高可获得利率13%。
            </div>
            <div v-if="activeTab === 1">
              <p>1. {{subConfig.title}}所有一星及以上会员均可享受。</p>
              <p>
                2. 聚宝盆金额无法直接投注，但是可以直接转入其它游戏进行投注。
              </p>
              <p>
                3.
                聚宝盆所产生优惠只需要1倍流水即可提款，优惠额100元以内无流水要求可以直接提款。
              </p>
              <p>
                4.
                聚宝盆会在转入资金的12小时后开始计算利息，每日计算一次。发放时间为每日下午6点。
              </p>
              <p>
                5.
                聚宝盆在根据不同的VIP等级存满7~9天之后，必须取出来一次才能继续计算利息。否则聚宝盆在存满天数达到后将不会继续为您提供利息。
              </p>
            </div>
            <div v-if="activeTab === 2">
              <p>
                1.
                本优惠活动只限娱乐性质的会员参加，如发现用户拥有超过一个账户，包括同一姓名，同一邮箱，同一/相似IP地址，同一住址，同一银行卡，同一电脑，禁止多开窗口进行投注，软件投注和套免费游戏等其他任何不正常投注行为，一经发现我们将保留冻结帐户以及没收所有余额的权利。
              </p>
              <p>2. {{subConfig.title}}拥有最终解析权。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-datetime-picker
      v-if="showTime"
      v-model="value"
      :min-date="minTime"
      type="date"
      @cancel="showTime = false"
      @confirm="changeNum"
    />
  </div>
</template>

<script setup>
import {
  inject, ref, computed,
} from 'vue';
import dayjs from 'dayjs';
import { useRequest } from 'ahooks-vue';
import { useRoute, useRouter } from 'vue-router';
import { DatetimePicker, Toast } from 'vant';
import { getParams } from '@/utils';
import { specialdetail } from '@/api/activity';

const global = inject('global');
const store = inject('store');

const {
  user,
  app: { dicts },
} = global.$store.state;

const router = useRouter();
const route = useRoute();
const subConfig = inject('subConfig');
const title = ref(route?.meta?.title || '');
const activeTab = ref(0);
const value1 = ref(global.$t('请选择转入日期'));
const value2 = ref(global.$t('请选择转出日期'));
const money = ref('');
const condition_setting = ref([]);
const showTime = ref(false);
const type = ref(0);
const value = ref('');
const minTime = ref(new Date());
const id = getParams('id') || '';
global.$store.dispatch('app/getDict', ['memberlevellist']);

const num = computed(() => {
  if (typeof value1.value === 'number') {
  }
  if (
    value1.value
    && value2.value
    && money.value
    && value1.value !== global.$t('请选择转入日期')
    && value2.value !== global.$t('请选择转出日期')
  ) {
    const date1 = dayjs(value1.value);
    const date2 = dayjs(value2.value);
    const day = date2.diff(date1, 'day');
    const num = money.value ? ((Number(money.value) * 0.13) / 365) * day : 0;
    return num.toFixed(2);
  }
  return '0.0';
});
useRequest(() => specialdetail({ id }), {
  onSuccess(res) {
    title.value = res?.name;
    condition_setting.value = res?.condition_setting.map((val) => ({
        ...val,
      }));
  },
});

function changeNum() {
  showTime.value = false;
  if (!value.value) value.value = minTime.value;
  if (type.value === 1) {
    let date = '';
    if (value.value) {
      date = new Date(value.value);
    } else {
      return;
    }
    let currentDay = date.getDate();
    const currentYear = date.getFullYear();
    let currentMonth = date.getMonth() + 1;
    currentMonth < 10 ? (currentMonth = `0${currentMonth}`) : '';
    currentDay < 10 ? (currentDay = `0${currentDay}`) : '';
    value1.value = `${currentYear}-${currentMonth}-${currentDay}`;
  } else if (type.value === 2) {
    let date = '';
    if (value.value) {
      date = new Date(value.value);
    } else {
      return;
    }
    let currentDay = date.getDate();
    const currentYear = date.getFullYear();
    let currentMonth = date.getMonth() + 1;
    currentMonth < 10 ? (currentMonth = `0${currentMonth}`) : '';
    currentDay < 10 ? (currentDay = `0${currentDay}`) : '';
    value2.value = `${currentYear}-${currentMonth}-${currentDay}`;
  }
}
function doLogin() {
  app.source === 'app' ? window.location.href = `app://login` : router.push({ name: 'login' });
}
function showThen(val) {
  value.value = '';
  showTime.value = true;
  type.value = val;
}
</script>

<style lang="less" scoped>
#interestRate {
  font-size: 28px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  > .container {
    width: 100%;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background: #fff;
    > div {
      > img {
        width: 100%;
      }
      > .bg2 {
        margin-top: 5px;
      }
      > .bg3 {
        margin-top: 5px;
      }
      > .bg4 {
        height: 700px;
        background-image: url("/src/assets/images/activity/zh-CN/interestRate/bg4.jpg");
        background-size: 100% 100%;
        margin-top: 5px;
        overflow: hidden;
        > table {
          display: block;
          width: 100%;
          margin-top: 170px;
          position: relative;
          z-index: 999;
          top:-30px;
          tr {
            width: 100%;
            display: flex;
            height: 50px;
            line-height: 50px;
            background-color: #fff;
            td {
              text-align: center;
              color: #212229;
              width: 25%;

              &:first-child {
                > span {
                  display: inline-block;
                  vertical-align: middle;
                  width: 26px;
                  height: 33px;
                  background-size: 100% 100%;
                  background-repeat: no-repeat;
                }
              }
            }
            &:nth-child(2) {
              td {
                &:first-child {
                  > span {
                    background-image: url("/src/assets/images/activity/zh-CN/interestRate/Grade1.png");
                  }
                }
              }
            }
            &:nth-child(3) {
              td {
                &:first-child {
                  > span {
                    background-image: url("/src/assets/images/activity/zh-CN/interestRate/Grade2.png");
                  }
                }
              }
            }
            &:nth-child(4) {
              td {
                &:first-child {
                  > span {
                    background-image: url("/src/assets/images/activity/zh-CN/interestRate/Grade3.png");
                  }
                }
              }
            }
            &:nth-child(5) {
              td {
                &:first-child {
                  > span {
                    background-image: url("/src/assets/images/activity/zh-CN/interestRate/Grade4.png");
                  }
                }
              }
            }
            &:nth-child(6) {
              td {
                &:first-child {
                  > span {
                    background-image: url("/src/assets/images/activity/zh-CN/interestRate/Grade5.png");
                  }
                }
              }
            }
            &:nth-child(7) {
              td {
                &:first-child {
                  > span {
                    background-image: url("/src/assets/images/activity/zh-CN/interestRate/Grade6.png");
                  }
                }
              }
            }
            &:first-child {
              font-weight: bold;
              background-color: #6257dc;
              td {
                color: #fff;
              }
            }
            &:nth-child(2),
            &:nth-child(3),
            &:nth-child(4) {
              td:first-child {
                // color: #5248c4;
              }
            }
            &:nth-child(5),
            &:nth-child(6),
            &:nth-child(7) {
              td {
                // font-weight: bold;
                // color: #ff4200;
              }
            }
          }
        }
      }
      > .bg5 {
        height: 893px;
        background-image: url("/src/assets/images/activity/zh-CN/interestRate/bg5.jpg");
        background-size: 100% 100%;
        margin-top: 5px;
        overflow: hidden;
        > .form {
          margin-top: 173px;
          padding: 0 30px;
          > .item {
            height: 64px;
            margin-bottom: 28px;
            display: flex;
            > span {
              display: inline-block;
              line-height: 64px;
              width: 120px;
              color: #fff;
              font-size: 24px;
            }
            > input,
            > p {
              width: 570px;
              background-color: #fff;
              line-height: 64px;
              border: none;
              outline: none;
              padding: 0 0 0 30px;
              caret-color: var(--font-color-000);

              &::placeholder {
                color: #abaaaa !important;
                font-size: 24px;
                line-height: 64px;
              }
            }
            > p {
              color: #6257dc;
            }
          }
          > .pic {
            margin: 40px 0;
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.49);
            border-radius: 50%;
          }
          > .note {
            margin: 40px 0;
            line-height: 1;
            color: #fff;
            font-size: 24px;
            padding-left: 120px;
          }
          > .btn {
            display: block;
            margin-top: 20px;
            line-height: 80px;
            height: 80px;
            background-color: #ff4200;
            color: #fff;
            text-align: center;
            font-size: 30px;
          }
        }
      }
      > .bg6 {
        height: 781px;
        background-image: url("/src/assets/images/activity/zh-CN/interestRate/bg6.jpg");
        background-size: 100% 100%;
        margin-top: 5px;
        overflow: hidden;
        > .title {
          margin-top: 210px;
          display: flex;
          height: 64px;
          line-height: 64px;
          > p {
            text-align: center;
            color: #fff;
            font-size: 26px;
            width: 250px;
            &:first-child {
              background-color: #6986ff;
            }
            &:nth-child(2) {
              background-color: #ffb900;
            }
            &:last-child {
              background-color: #ff4200;
            }
          }
        }
        > .content {
          min-height: 370px;
          padding: 40px 30px;
          font-size: 24px;
          line-height: 36px;
          color: #333;
          background-color: #fff;
        }
      }
    }
  }
  /deep/ .van-picker {
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  .no-header {
    padding-top: 0;
    margin-top:0;
  }
}

</style>
