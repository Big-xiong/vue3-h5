<template>
  <div class="vip-wrap">
    <img
      class="logo"
      :src="$getSrc(`/src/assets/images/vip-banner.png`)"
    />
    <div class="vip-wrap-content">
      <div class="vip-wrap-content-table">
        <table>
          <thead>
            <tr>
              <th
                colspan="2"
                class="value"
              >{{ $t(`VIP内容`) }}</th>
              <th
                v-for="(item,index) in dicts?.memberlevellist ?? []"
                class="value"
                :key="index"
              >{{ item.name }}</th>

              <!-- <th class="remarks">{{ $t(`备注`) }}</th> -->
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                rowspan="2"
                class="column-title"
              >{{ $t(`要求`) }}</td>
              <td>{{ $t(`月存款量`) }}</td>
              <td
                v-for="(item,index) in dicts?.memberlevellist"
                :key="index"
                class="value"
              >{{ priceFormat(item.valid_bet_money) }}</td>
              <!--              <td rowspan="2" class="remarks">{{ $t(`会员需维持该水准以保持会员等级`) }}</td>-->
              <!-- <td rowspan="2" class="remarks"> -->
              <!--   {{ $t('VIP会员：') }} -->
              <!--   <br /> -->
              <!--   - {{ $t('会员需维持对应水准以保持会员等级。') }} -->
              <!--   <br /> -->
              <!--   - {{ $t('VVIP在满足条件的情况下，将以特殊邀请的方式来升级。') }} -->
              <!--   <br /> -->
              <!--   - {{ $t('获取VIP红利前，需验证账户信息。') }} -->
              <!-- </td> -->
            </tr>
            <tr>
              <td class="column-title">{{ $t(`月有效投注`) }}</td>
              <td
                v-for="(item,index) in dicts?.memberlevellist"
                :key="index"
                class="value"
              >{{ priceFormat(item.deposit_money) }}</td>
            </tr>
            <tr>
              <td
                :rowspan="allActivityBenefit.length + 2 + tipsData?.week_deposit?.length ?? 0"
                class="column"
              >{{ $t(`福利`) }}</td>
              <td class="column-title">{{ allActivityBenefit?.[0]?.name }}{{ $t(`日返水`) }}</td>
              <td
                v-for="(child,cindex) in allActivityBenefit?.[0]?.list ?? []"
                :key="cindex"
                class="value"
              >{{ child.proportion }}%</td>
              <!-- <td :rowspan="allActivityBenefit02.length + 1" class="remarks"> -->
              <!--   {{ $t('VIP反水：') }} -->
              <!--   <br /> -->
              <!--   - {{ $t('有效投注将被记入返水红利。') }} -->
              <!--   <br /> -->
              <!--   - {{ $t('完成红利的1倍有效投注流水后即可提款。') }} -->
              <!-- </td> -->
              <!--              <td-->
              <!--                :rowspan="allActivityBenefit.length"-->
              <!--                class="remarks"-->
              <!--              >{{ $t(`与返水一起，VIP会员将享有周周再存红利25-50%根据市场活动安排而定`) }}</td>-->
            </tr>
            <tr
              v-for="(item,index) in allActivityBenefit02"
              :key="index"
            >
              <td class="column-title">{{ item.name }}{{ $t(`日返水`) }}</td>

              <td
                v-for="(child,cindex) in item.list"
                :key="cindex"
                class="value"
              >{{ child.proportion }}%</td>
            </tr>

            <tr
              v-for="(item,index) in tipsData?.week_deposit || []"
              :key="index"
            >
              <td class="value">{{ item.name }}</td>

              <td
                v-for="(child,cindex) in item.benefit_setting?.level_conf ?? dicts?.memberlevellist"
                :key="cindex"
                class="value"
              >
                <span v-if="child.bonus_rate">{{ child.bonus_rate }}% up to {{ priceFormat(child.bonus_max) }}</span>
                <span v-else>-</span>
              </td>
            </tr>
            <tr>
              <td class="column-title">{{ $t(`VIP欢迎红利`) }}</td>
              <td
                v-for="item in dicts?.memberlevellist"
                :key="item"
                class="value"
              >
                {{ getBirthDayMoney(item.level, 'upgrade_money') || '-'}}
              </td>

              <!-- <template v-if="tipsData && !tipsData?.birthday?.length"> -->
              <!--   <td v-for="item in dicts?.memberlevellist" :key="item" class="value">-</td> -->
              <!-- </template> -->
              <!-- <td>-</td> -->
              <!-- <td class="value">-</td> -->
            </tr>

            <tr>
              <td class="column-title">{{ $t(`生日红利`) }}</td>
              <!-- <td v-for="(item,index) in tipsData.birthday" :key="index" class="value"> -->
              <!--   {{ priceFormat(item.birthday_money) }} -->
              <!-- </td> -->
              <td
                v-for="item in dicts?.memberlevellist"
                :key="item"
                class="value"
              >{{ getBirthDayMoney(item.level, 'birthday_money') || '-' }}</td>
              <!-- <td class="value">-</td> -->
              <!-- <td class="remarks"> -->
              <!--   {{ $t('VIP生日红利：') }} -->
              <!--   <br /> -->
              <!--   - {{ $t('适用于所有产品。') }} -->
              <!--   <br /> -->
              <!--   - {{ $t('需完成红利的1倍有效流水后提款。') }} -->
              <!-- </td> -->
            </tr>
            <!-- <tr> -->
            <!--   <td class="column-title no-bottom" rowspan="6">VIP{{ $t(`活动条款与条规`) }}</td> -->
            <!-- </tr> -->
            <!-- <tr> -->
            <!--   <td colspan="6"> -->
            <!--     {{ $t('VIP会员：') }}<br/> -->
            <!--     - {{ $t('会员需维持对应水准以保持会员等级。') }}<br/> -->
            <!--     - {{ $t('VVIP在满足条件的情况下，将以特殊邀请的方式来升级。') }}<br /> -->
            <!--     - {{ $t('获取VIP红利前，需验证账户信息。') }} -->
            <!--   </td> -->
            <!-- </tr> -->
            <!-- <tr> -->
            <!--   <td colspan="6"> -->
            <!--     {{ $t('VIP反水：') }}<br/> -->
            <!--     - {{ $t('有效投注将被记入返水红利。') }}<br/> -->
            <!--     - {{ $t('完成红利的1倍有效投注流水后即可提款。') }} -->
            <!--   </td> -->
            <!-- </tr> -->
            <!-- <tr> -->
            <!--   <td colspan="6"> -->
            <!--     {{ $t('VIP周周再存红利：') }}<br/> -->
            <!--     - {{ $t('每周仅可申请一种产品的VIP周周再存红利，且不与其他再存红利共享。') }}<br/> -->
            <!--     - {{ $t('需最低存款500 THB。') }} -->
            <!--     - {{ $t('需完成（存款+红利）x10倍有效投注流水后即可提款。') }} -->
            <!--   </td> -->
            <!-- </tr> -->
            <!-- <tr> -->
            <!--   <td colspan="6"> -->
            <!--     {{ $t('VIP欢迎红利：') }}<br/> -->
            <!--     - {{ $t('适用于体育产品。') }}<br/> -->
            <!--     - {{ $t('需完成红利的5倍有效流水后提款。') }} -->
            <!--   </td> -->
            <!-- </tr> -->
            <!-- <tr> -->
            <!--   <td colspan="6"> -->
            <!--     {{ $t('VIP生日红利：') }}<br/> -->
            <!--     - {{ $t('适用于所有产品。') }}<br/> -->
            <!--     - {{ $t('需完成红利的1倍有效流水后提款。') }} -->
            <!--   </td> -->
            <!-- </tr> -->
          </tbody>
        </table>
      </div>
      <div class="vip-wrap-tips">
        <div v-html="tipsContent"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, watch,
  onMounted, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { allactivitybenefit, viptips, activitybenefit } from '@/api/vip';
import { priceFormat } from '@/utils/index';

const global = inject('global');
const subConfig = inject('subConfig');

const $store = inject('store');
$store.dispatch('app/getDict', ['memberlevellist']);
const {
  app: { dicts },
  user,
} = $store.state;

const allActivityBenefit = ref([]);
const allActivityBenefit02 = ref([]);
const { run: vipRun } = useRequest(allactivitybenefit, {
  onSuccess(res) {
    allActivityBenefit.value = res;
    allActivityBenefit02.value = res.slice(1);
  },
});

const tipsData = ref({});
const { run: tipsRun } = useRequest(viptips, {
  onSuccess(res) {
    tipsData.value = res;
  },
});

function getBirthDayMoney(level, name) {
  const taregetBirth = tipsData.value?.birthday?.find((item) => item.level === level) ?? null;
  if (taregetBirth) {
    return priceFormat(taregetBirth[name]);
  }

  return '';
}

const tipsContent = computed(() => {
  let tips = '';
  if (Array.isArray(tipsData.value.wash_activity)) {
    tipsData.value.wash_activity.forEach((item) => tips += (item.washcode_content ?? ''));
  }
  return tips;
});

onMounted(() => {
  watch(() => user.userInfo, () => {
    if (user?.userInfo?.id) {
      tipsRun();
    }
  }, { immediate: true });
});

const activityBenefit = ref({});
const { run: activeRun } = useRequest(activitybenefit, {
  onSuccess(res) {
    activityBenefit.value = res;
  },
});

const product = [
  {
    name: global.$t(`体育`),
    vn: 100,
    grade: 1,
  },
  {
    name: global.$t(`真人`),
    vn: 100,
    grade: 0.5,
  },
  {
    name: global.$t(`电子`),
    vn: 100,
    grade: 1,
  },
  {
    name: global.$t(`彩票`),
    vn: 100,
    grade: 1,
  },
];
const desc = global.$t(`会员的累计有效投注会得到相应的VIP成长值。达到相应级别的要求，即可在次日晋级相应VIP等级，数据统计时间从VIP系统上线当日0点开始。`);
const tips = [
  {
    title: global.$t(`晋升标准：`),
    desc,
  },
  {
    title: global.$t(`保级要求：`),
    desc,
  },
  {
    title: global.$t(`降级标准：`),
    desc,
  },
  {
    title: global.$t(`晋级礼金：`),
    desc,
  },
  {
    title: global.$t(`生日礼金：`),
    desc,
  },
  {
    title: global.$t(`每月红包：`),
    desc,
  },
  {
    title: global.$t(`佳节礼品：`),
    desc,
  },
  {
    title: global.$t(`客户经理：`),
    desc,
  },
  {
    title: global.$t(`游戏通道：`),
    desc,
  },
  {
    title: global.$t(`有效投注：`),
    desc: global.$t(`相应类型游戏投注，任何对押、和局、无效的、投注失败的、未产生输赢结果的投注不计算为有效投注（体育类港赔0.75）`),
  },
  {
    title: '',
    desc: global.$t(`{0}有权对该活动进行修改、暂停、取消等，无需特别通知，并保留对该活动的最终解释权`, [subConfig.title]),
  },
];

function getVipLevelName(level) {
  if (level === 0) {
    return global.$t('普通');
  } if (level === 4) {
    return 'VVIP';
  }
  return `VIP${level}`;
}
</script>

<style lang="less" scoped>
.vip-wrap {
  background-color: var(--bg-color-10141f);
  padding-bottom: 40px;

  .logo {
    width: 100%;
    height: 600px;
  }

  &-content {
    width: 100vw;
    box-sizing: border-box;
    padding: 0 22px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -250px;
    flex: 1;

    &-table {
      width: 100%;
      overflow-x: auto;

      > p {
        color: var(--font-color-ffffff);
        margin-bottom: 20px;
        font-size: 28px;
      }
    }

    table {
      border-collapse: collapse;
      display: table;
      border-spacing: 0;
      width: 100%;
      border-radius: 40px 40px 0px 0px;
      background-color: var(--bg-color-1e212e);
      font-size: 22px;
      line-height: 30px;
      font-weight: 500;
      text-align: center;
      color: var(--font-color-ffffff);

      td,
      th {
        text-align: center;
        vertical-align: top;
        padding-top: 60px;
        box-sizing: border-box;
        border-collapse: collapse;
        font-size: 22px;
        white-space: nowrap;

        &:first-child {
          border-left: none;
        }
      }

      th {
        border-bottom: none;
        background-color: var(--bg-color-2A313E);

        &:first-child {
          border-top-left-radius: 40px;
        }

        &:last-child {
          border-top-right-radius: 40px;
        }
      }

      tr:first-child td {
        border-top: none;
      }

      tr:last-child td {
        border-bottom: none;
      }

      /* td:last-child {
        border-right: 0;
      } */

      .column {
        width: 108px;
        height: 309px;
        vertical-align: middle;
        padding: 0;

        &-title {
          width: 108px;
          padding: 30px;
          box-sizing: border-box;
          vertical-align: middle;
          white-space: nowrap;
          word-break: break-word;
          border-right: 2px solid var(--border-color-22501) !important;

          &.no-bottom {
            border-bottom: none;
          }
        }
      }

      .value {
        width: 88px;
        height: 160px;
        word-break: break-all;
        border-right: 2px solid var(--border-color-22501);
      }

      .remarks {
        min-width: 250px !important;
        vertical-align: middle;
        white-space: pre-wrap;
        padding: 0 25px;
        display: none;
      }

      .vip {
        height: 390px;
      }

      thead {
        tr {
          height: 148px;

          th {
            border-right: 2px solid var(--border-color-22501);
            padding: 0 20px;
            vertical-align: middle;
          }

          th:nth-last-child(1) {
            border-right: none;
          }
        }
      }

      tbody {
        tr {
          background: var(--bg-color-1e212e);
          [colspan='6'] {
            text-align: left;
            padding: 16px;
          }

          td {
            border: 2px solid var(--border-color-22501);
            padding: 0 20px;
            vertical-align: middle;
            white-space: nowrap;

            &:last-child {
              border-right: 0;
            }
          }
        }
      }
    }

    .tip-img {
      width: 90%;
      height: 100%;
      margin: 135px auto 50px auto;
    }

    .tip-text-img {
      width: 100%;
      height: 80%;
      margin: 0 auto 28px auto;
    }

    .tips-item {
      display: flex;
      justify-content: space-between;
      width: 100%;
      color: var(--font-color-ffffff);
      font-size: 24px;
      margin-bottom: 28px;

      div:nth-child(1) {
        width: 50px;
        height: 50px;
        background: var(--bg-color-d1c186);
        font-size: 28px;
        border-radius: 50%;
        margin-right: 16px;
      }

      div:nth-child(2) {
        width: 92%;

        p {
          &:first-child {
            margin-top: 10px;
          }

          font-size: 24px;
          line-height: 34px;
        }
      }
    }
  }

  .login {
    margin: 52px 0 32px 0;
  }

  &-footer {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: 500;
    color: var(--font-color-ffffff);
    line-height: 40px;
    margin: 32px 0 60px 0;

    .line {
      width: 2px;
      height: 58px;
      background: var(--bg-color-ffffff);
      margin: 0 66px 0 52px;
    }
  }

  &-tips {
    margin: 70px auto 0;
    counter-reset: count;
    box-sizing: border-box;
    overflow-x: auto;
    width: calc(100% - 44px);

    :deep(p) {
      position: relative;
      text-align: left;
      box-sizing: border-box;
      color: var(--font-color-9fbbd5);
      margin-bottom: 46px;

      span {
        display: inline !important;
        white-space: nowrap;
      }

      &::before {
        content: counter(count, decimal) '.';
        counter-increment: count;
        margin-right: 8px;
      }

      span {
        display: block;
      }
    }
  }
}
</style>
