<template>
  <div class="loanTreasure">
    <van-nav-bar
      :title="title"
      v-if="route.query.source !== 'app'"
      left-arrow
      @click-left="router.go(-1)"
    ></van-nav-bar>
    <div
      class="content"
    >
      <div>
        <div class="top"></div>
        <div class="center">
          <!-- 借贷规则 -->
          <div class="lendingRules">
            <div>
              <div class="top">
                <div>{{$t('借贷规则')}}</div>
              </div>
              <div class="content">
                <table>
                  <tr class="rules-title">
                    <th>{{$t('会员等级')}}</th>
                    <th>{{$t('借贷金额区间')}}</th>
                    <th>{{$t('分期天数')}}</th>
                    <th>{{$t('存款比例')}}</th>
                    <th>{{$t('流水倍数')}}</th>
                  </tr>
                  <tr
                    v-for="(item, index) in condition_setting"
                    :key="index"
                  >
                    <td>{{ dicts?.memberlevellist[index]?.name }}</td>
                    <td>
                      {{ item.condition.borrow_money?.min }}-{{
                        item.condition.borrow_money?.max
                      }}
                    </td>
                    <td>
                      {{ item?.condition?.stages_days?.min }}-{{
                        item?.condition?.stages_days?.max
                      }}
                    </td>
                    <td>
                      {{ item.condition.deposite_scale?.min }}:{{
                        item.condition.deposite_scale?.max
                      }}
                    </td>
                    <td>{{ item.condition.flow }}</td>
                  </tr>
                </table>

                <p>{{$t('备注')}}</p>
              </div>
              <div class="look">
                <img
                  :src="$getSrc(`/src/assets/images/activity/zh-CN/loanTreasure/jiedaibao_list_arrow.png`)"
                  alt
                />
                <span>{{$t('滑动手指查看完整内容')}}</span>
              </div>
            </div>
          </div>

          <!-- 活动申请 -->
          <div class="activity">
            <div class="top">{{$t('活动申请')}}</div>
            <div class="list">
              <div>
                <div
                  class="pic"
                  :class="step >= 1 ? 'active' : ''"
                >
                  <img
                    :src="$getSrc(`/src/assets/images/activity/zh-CN/loanTreasure/jiedaibao_borrow_ic.png`)"
                    alt
                  />
                </div>
                <p>{{$t('借贷金额')}}</p>
              </div>
              <img
                :src="$getSrc(`/src/assets/images/activity/zh-CN/loanTreasure/jeidaibao_arrow.png`)"
                alt
              />
              <div>
                <div
                  class="pic"
                  :class="step >= 2 ? 'active' : ''"
                >
                  <img
                    :src="$getSrc(`/src/assets/images/activity/zh-CN/loanTreasure/jiedaibao_money_ic.png`)"
                    alt
                  />
                </div>
                <p>{{$t('存款金额')}}</p>
              </div>
              <img
                :src="$getSrc(`/src/assets/images/activity/zh-CN/loanTreasure/jeidaibao_arrow.png`)"
                alt
              />
              <div>
                <div
                  class="pic"
                  :class="step >= 3 ? 'active' : ''"
                >
                  <img
                    :src="$getSrc(`/src/assets/images/activity/zh-CN/loanTreasure/jiedaibao_day_ic.png`)"
                    alt
                  />
                </div>
                <p>{{$t('分期天数')}}</p>
              </div>
              <img
                :src="$getSrc(`/src/assets/images/activity/zh-CN/loanTreasure/jeidaibao_arrow.png`)"
                alt
              />
              <div>
                <div
                  class="pic"
                  :class="step >= 4 ? 'active' : ''"
                >
                  <img
                    :src="$getSrc(`/src/assets/images/activity/zh-CN/loanTreasure/jiedaibao_application_ic.png`)"
                    alt
                  />
                </div>
                <p>{{$t('活动申请')}}</p>
              </div>
            </div>
            <!-- 借贷金额 -->
            <div class="lendingAmount">
              <div v-if="step === 1">
                <div class="form-item">
                  <label class="form-item-label">{{$t('借贷金额')}}</label>
                  <div class="form-item-content">
                    <input
                      type="number"
                      :placeholder="ph1"
                      :disabled="isDisabled"
                      v-model="num1"
                      @change="changeMoney"
                    />
                  </div>
                </div>
              </div>
              <div v-if="step === 2">
                <div class="form-item">
                  <label class="form-item-label">{{$t('存款金额')}}</label>
                  <div class="form-item-content">
                    <input
                      type="number disabled"
                      :placeholder="$t('请填写存款金额')"
                      v-model="num2"
                      disabled
                      style="background-color: #ddd"
                    />
                  </div>
                </div>
              </div>
              <div v-if="step === 3">
                <div class="form-item">
                  <label class="form-item-label">{{$t('分期天数')}}</label>
                  <div class="form-item-content">
                    <input
                      type="number"
                      :placeholder="ph2"
                      v-model="num3"
                      @change="changeDay"
                    />
                  </div>
                </div>
              </div>
              <div v-if="step === 4">
                <p>{{$t('借贷金额：')}}{{ num1 }}元</p>
                <p>{{$t('存款金额：')}}{{ num2 }}元</p>
                <p>
                  {{$t('分期天数：')}}{{ num3 }}天
                  <span>{{$t('每日还款')}}{{ num }}元</span>
                </p>
              </div>
              <div v-if="step === 5">
                <p>{{$t('距离申请结束时间')}}</p>
                <p>{{ timeRemaining }}</p>
                <p>{{$t('您已经申请活动')}}</p>
              </div>
              <div v-if="step === 6">
                <p>{{$t('借贷金额：')}}{{ active.money }}元</p>
                <p>{{$t('分期天数：')}}{{ active.day }}天</p>
                <p>{{$t('已还款金额：')}}{{ history[0]?.borrow_money }}</p>
              </div>
              <div
                @click="doLogin"
                class="btn"
                v-if="!user?.isLogin"
              >{{$t('登录/注册')}}</div>
              <div
                class="btn"
                @click="next"
                v-if="user?.isLogin && btnShow"
              >
                {{ btnText }}
              </div>
            </div>
          </div>

          <!-- 活动细则 -->
          <div class="rulesActivities">
            <div class="rules">
              <div>{{$t('活动细则')}}</div>
              <p>1.{{$t('本活动无法与返水等其他活动共享')}}</p>
              <p>2.{{subConfig.title}}{{$t('所有二星及以上会员均可享受，每周可以参与一次。')}}</p>
              <p>
                3.
                {{$t('会员如果申请500元借贷，根据会员等级如果是二星会员需要存款500元，到账一共1000元。如果是钻石会员只需要存款400元，一共到账900元。')}}
              </p>
              <p>
                4.
                {{$t('分期天数指的如果会员选择1天内还款，系统会在申请活动的24小时后收回贷款金额。如果会员选择3天内还款，那么系统会在申请活动的每24小时收回贷款金额的1/3，分三次全额收回。')}}
              </p>
              <p>
                5. {{$t('会员参与活动期间无法发起提现，直到系统自动收回贷款金额或者玩家成功申请破产。')}}
              </p>
              <p>
                6.
                {{$t('贷款期间不影响存款，但是系统还是会按照贷款金额和还款天数来计算每日还款金额并自动扣减。')}}
              </p>
              <p>
                7.
                {{$t('如果客户账户余额不足参与本金的')}}{{activeData.rule_setting ? activeData.rule_setting.money_noenough*1 : 0}}%{{$t('可以去活动页面申请破产保护，即可免除一切还款。如果会员完成活动时为盈利状态，公司将抽取盈利部分的')}}{{activeData.rule_setting ? activeData.rule_setting.profite_rate*1 : 0}}%{{$t('作为借贷佣金。')}}
              </p>
              <p>
                8.
                {{$t('本优惠活动只限娱乐性质的会员参加，如发现用户拥有超过一个账户，包括同一姓名，同一邮箱，同一/相似IP地址，同一住址，同一银行卡，同一电脑，禁止多开窗口进行投注，软件投注和套免费游戏等其他任何不正常投注行为，一经发现我们将保留冻结帐户以及没收所有余额的权利')}}
              </p>
              <p>9. {{subConfig.title}}{{$t('拥有最终解析权。')}}</p>
            </div>
          </div>
        </div>
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
import { Dialog, Toast } from 'vant';
import { getParams } from '@/utils';
import {
 specialdetail, joinborrow, borrowjoinrecord, brokeapply,
} from '@/api/active';

const global = inject('global');
const router = useRouter();
const route = useRoute();
const {
  user,
  app: { dicts },
} = global.$store.state;
global.$store.dispatch('app/getDict', ['memberlevellist']);

const subConfig = inject('subConfig');
const title = ref(route?.meta?.title || '');
const num1 = ref(''); // 贷款金额
const num2 = ref(''); // 存款金额
const num3 = ref(''); // 分期天数
const num = ref(0); // 每日还款
const ph1 = ref(global.$t('您尚未达到本活动的参与要求')); // 第一个占位input
const ph2 = ref(global.$t('您尚未达到本活动的参与要求')); // 第一个占位input
const isDisabled = ref(true); // 每日还款
const step = ref(1);
const active = ref({}); // 进行中借款对象
const id = ref(getParams('id') || '');
const condition = ref(null);// 当前用户等级规则
const condition_setting = ref([]); // 借贷规则
const history = ref([]);
const btnText = ref(global.$t('下一步'));
const btnShow = ref(true); // 是否隐藏按钮
const timeRemaining = ref(''); // 剩余时间
const status = ref(0); // 0: 未申请, 1: 进行中, 2: 申请成功, 3: 申请失败, 4: 成功还贷, 5: 已破产
const timer = ref(null);
const activeData = ref({});

function tickTime(endDay, newDay) {
  const hours = endDay.diff(newDay, 'hour') % 24;
  const minutes = endDay.diff(newDay, 'minute') % 60;
  const seconds = endDay.diff(newDay, 'second') % 60;
  timeRemaining.value = `${(hours < 10 ? (`0${hours}`) : hours)}小时${(minutes < 10 ? (`0${minutes}`) : minutes)}分${(seconds < 10 ? (`0${seconds}`) : seconds)}秒`;
}
function doLogin() {
  app.source === 'app' ? window.location.href = `app://login` : router.push({ name: 'login' });
}
 // 下一步
function next() {
  // 判断用户是否有权限参加活动
  if (!condition.value) {
    Dialog.confirm({
      message: global.$t('尊敬的用户，当前由于您尚未达到本活动的参与要求，暂时无法进行活动申请，多游戏才能参与更多的活动哦~'),
      confirmButtonText: global.$t('确认'),
    });
    return;
  }
  const { min, max } = condition.value.deposite_scale;
  if (step.value === 1) {
    if (!num1.value) {
      Toast.fail(global.$t('尊敬的用户，请先输入贷款金额'));
      return;
    }
    if (num1.value < condition.value.borrow_money.min * 1 || num1.value > condition.value.borrow_money.max * 1) {
      Toast.fail(global.$t(`输入的金额需在${condition.value.borrow_money.min}-${condition.value.borrow_money.max}之间`));
      return;
    }
    // 计算存款金额
    num2.value = (num1.value * max).toFixed(2);
    step.value += 1;
  } else if (step.value === 2) {
    step.value += 1;
  } else if (step.value === 3) {
    if (!num3.value) {
      Toast.fail(global.$t('尊敬的用户，请先输入还款天数'));
      return;
    }
    num1.value = Number(num1.value).toFixed(2);
    num.value = (num1.value / num3.value).toFixed(2);
    step.value += 1;
    btnText.value = global.$t('申请活动');
  } else if (step.value === 4) {
     goActive();
  } else if (step.value === 5) {
    app.source === 'app' ? window.location.href = `app://pay` : router.push('/center/fund-management/deposit');
  } else if (step.value === 6) {
    goBroke();
  }
}
// 活动申请
function goActive() {
  useRequest(() => joinborrow({
    id: id.value,
    money: num1.value,
    day: num3.value,
  }), {
    onSuccess(res) {
      Toast.success(global.$t('活动申请成功'));
    },
  });
}
function goBroke() {
  useRequest(() => brokeapply({
      id: id.value,
    }), {
    onSuccess(res) {
      Toast.success(global.$t('破产申请成功'));
    },
  });
}
// 输入贷款天数
function changeDay() {
  const { min, max } = condition.value.stages_days;
  num3.value < min && (num3.value = min);
  num3.value > max && (num3.value = max);
}
useRequest(() => specialdetail({ id: id.value }), {
  onSuccess(res) {
    title.value = res?.name ?? title.value;
    activeData.value = res;
    condition_setting.value = res?.condition_setting.map((val) => {
      if (val.level === user?.userInfo.level) {
        isDisabled.value = false;
        condition.value = val?.condition;
        const { borrow_money, stages_days } = val.condition;
        ph1.value = `您的等级可以申请${borrow_money.min}~${borrow_money.max}元`;
        ph2.value = `您的会员等级可以分期${stages_days.min}-${stages_days.max}天`;
      }
      return {
        ...val,
      };
    });
    // 记录用户是否已申请活动
    if (user?.isLogin) {
      useRequest(() => borrowjoinrecord(), {
        onSuccess(result) {
          history.value = result.data;
          history.value.forEach((ele, index) => {
            const newDay = dayjs(new Date());
            const endDay = dayjs(ele.act_end_time);
            // 活动进行中
            if (newDay - endDay < 0) {
              if (ele.status === 1) {
                btnShow.value = false;
                status.value = 1;
                step.value = 5;
                timer.value = setInterval(() => {
                  const _newDay = dayjs(new Date());
                  tickTime(endDay, _newDay);
                }, 1000);
              }
              if (ele.status === 2) {
                active.value = ele;
                status.value = 2;
                step.value = 6;
                btnText.value = global.$t('申请破产');
              }
            }
          });
        },
      });
    }
  },
});
onBeforeUnmount(() => {
  clearInterval(timer.value);
});
</script>

<style lang="less" scoped>
.loanTreasure {
  width: 100%;
  height: 100vh;
  background-color: #fef9f2;
  font-size: 24px;
  display: flex;
  flex-direction: column;
  > .content {
    width: 100%;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    > div {
      > .top {
        width: 100%;
        height: 730px;
        background-size: cover;
        background-color: #fff;
        background-image: url("/src/assets/images/activity/zh-CN/loanTreasure/jiedaibao_banner.png");
      }
      > .center {
        width: 100%;
        background-color: #fef9f2;
        // 借贷规则
        > .lendingRules {
          width: 100%;
          padding-top: 80px;
          overflow-x: auto;
          overflow-y: hidden;
          > div {
            padding: 0 28px;
            box-sizing: border-box;
            > .top {
              width: 100%;
              font-weight: bold;
              height: 76px;
              background-color: #a5b0fa;
              position: relative;
              border-radius: 30px 30px 0 0;
              > div {
                left: 135px;
                top: -20px;
                position: absolute;
                color: #d0551d;
                font-size: 40px;
                text-align: center;
                width: 430px;
                height: 70px;
                line-height: 60px;
                background-size: cover;
                margin: 0 auto;
                background-image: url("/src/assets/images/activity/zh-CN/loanTreasure/jiedaibao_rule_bg.png");
              }
            }
            .content{
              width: 100%;
              overflow-x: auto;
              table {
                display: block;
                width: 1000px;

                tr {
                  width: 100%;
                  display: flex;
                  justify-content: space-around;
                  height: 60px;
                  line-height: 60px;
                  th,
                  td {
                    color: #445df9;
                    font-size: 24px;
                    display: flex;
                    justify-content: center;
                    width: 25%;
                    text-align: center;
                    &:nth-child(2) {
                      width: 25%;
                    }
                    &:nth-child(3),
                    &:nth-child(4),
                    &:nth-child(5) {
                      width: 25%;
                    }
                  }
                }
                tr {
                  > td:first-child {
                    color: #f75e04;
                    font-size: 24px;
                    font-weight: bold;
                  }
                }

                tr:nth-child(2n + 1) {
                  background: rgba(225, 228, 255, 1);
                }
                tr:nth-child(2n) {
                  background-color: #d3d8ff;
                }
                .rules-title {
                  height: 80px;
                  line-height: 80px;
                  font-weight: bold;
                  th {
                    font-size: 26px;
                    color: rgba(0, 0, 201, 1);
                  }
                }
              }
            > p {
              color: #e97a48;
              font-size: 24px;
              width: 1000px;
              height: 94px;
              line-height: 94px;
              padding-left: 192px;
              border-radius: 0 0 30px 30px;
              background-color: #e1e4ff;
              box-sizing: border-box;
            }
            }
            .look {
              width: 100%;
              padding: 30px 0 82px 0;
              overflow: hidden;
              > img {
                width: 30px;
                height: 30px;
                float: left;
                margin: 0 16px 0 0;
              }
              > span {
                color: #6a7cf4;
                font-size: 24px;
                float: left;
                font-weight: bold;
                line-height: 30px;
              }
            }
          }
        }
        // 活动申请
        .activity {
          padding: 80px 0;
          width: 100%;
          height: 730px;
          background-size: cover;
          background-image: url("/src/assets/images/activity/zh-CN/loanTreasure/jiedaibao_application_bg_b.png");
          > .top {
            font-weight: bold;
            color: #d0551d;
            font-size: 40px;
            width: 690px;
            height: 70px;
            margin: 0 auto;
            text-align: center;
            line-height: 70px;
            background-size: cover;
            background-image: url("/src/assets/images/activity/zh-CN/loanTreasure/jiedaibao_application_bg_a.png");
          }
          > .list {
            margin-top: 54px;
            display: flex;
            justify-content: center;
            > div {
              > .pic {
                text-align: center;
                width: 120px;
                height: 120px;
                background-size: cover;
                background-image: url("/src/assets/images/activity/zh-CN/loanTreasure/jiedaibao_application_ic_bg_nor.png");
                &.active {
                  background-image: url("/src/assets/images/activity/zh-CN/loanTreasure/jiedaibao_application_ic_bg_pre.png");
                }
                > img {
                  width: 60px;
                  height: 60px;
                  margin: 30px auto 0;
                }
              }
              > p {
                color: #63697b;
                font-size: 24px;
              }
            }
            > img {
              width: 30px;
              height: 30px;
              margin: 44px 10px 0 10px;
            }
          }
          > .lendingAmount {
            margin-top: 80px;
            > div {
              > .form-item {
                display: flex;
                justify-content: center;
                > .form-item-label {
                  color: #63697b;
                  font-size: 28px;
                  line-height: 80px;
                  margin-right: 20px;
                }
                > .form-item-content {
                  width: 480px;
                  height: 80px;
                  line-height: 80px;
                  background: rgba(255, 255, 255, 1);
                  border-radius: 8px;
                  > input {
                    padding-left: 24px;
                    width: 100%;
                    height: 80px;
                    line-height: 1;
                    box-sizing: border-box;
                    caret-color: var(--font-color-000);
                    &::placeholder {
                      color: #abaaaa !important;
                      font-size: 28px;
                    }
                  }
                }
              }
              > p {
                text-align: center;
                line-height: 1.2;
                color: #63697b;
                font-size: 24px;
                font-weight: bold;
              }
            }
            > .btn {
              display: block;
              text-align: center;
              color: #e1545c;
              font-size: 32px;
              width: 320px;
              height: 78px;
              line-height: 70px;
              background-size: cover;
              font-weight: bold;
              margin: 40px auto 0;
              background-image: url("/src/assets/images/activity/zh-CN/loanTreasure/jiedaibao_application_btn_bg_nor.png");
            }
          }
        }
        // 活动细则
        .rulesActivities {
          width: 100%;
          padding: 80px 0 112.5px 0;
          height: auto;
          overflow: hidden;
          background-size: cover;
          background-image: url("/src/assets/images/activity/zh-CN/loanTreasure/rule_bg_b.png");
          > .rules {
            padding-bottom: 96px;
            width: 690px;
            margin: 0 auto;
            background-size: cover;
            background-image: url("/src/assets/images/activity/zh-CN/loanTreasure/rule_bg_a.png");
            > div {
              height: 80px;
              line-height: 1.4;
              text-align: center;
              color: #ffffff;
              font-size: 40px;
              margin-bottom: 60px;
              font-weight: bold;
            }
            > p {
              color: #5b5bc2;
              font-size: 24px;
              padding: 0 42px 0 42px;
              margin-bottom: 30px;
              line-height: 1.2;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
  footer {
    display: flex;
    justify-content: space-around;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 112px;
    background-color: #000000;
    align-items: center;
    > div {
      text-align: center;
      width: 25%;
      padding-top: 6px;
      > img {
        width: 38px;
        height: 38px;
        margin: 0 auto;
      }
      > p {
        text-align: center;
        font-size: 12px;
        color: #ffffff;
        &.active {
          color: #f9e2b2;
        }
      }
    }
  }
  input {
    border: none;
  }
  .no-header {
    padding-top: 0;
    margin-top:0;
  }
}
</style>
