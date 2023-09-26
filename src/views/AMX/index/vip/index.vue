<template>
  <div class="vip-wrap">
    <van-nav-bar class="m-header" :title="$t('尊贵VIP')" left-arrow @click-left="$router.go(-1)"
      v-if="$store.state.app.source !== 'app'" />
    <div class="vip-wrap-banner">
      <van-swipe class="my-swipe" :autoplay="3000">
        <van-swipe-item v-for="item in 5" :key="item">
          <van-image :src="$getSrc(`/src/current_project/assets/images/vip/img${item}@3x.png`)"></van-image>
        </van-swipe-item>
      </van-swipe>
      <img :src="$getSrc(`/src/assets/images/vip/banner-bg1.png`)" alt class="bot" />
      <img :src="$getSrc(`/src/assets/images/vip/btn.png`)" alt class="btn" />
    </div>
    <div class="title-fl">
      <img :src="$getSrc(`/src/assets/images/vip/img_fl@3x.png`)" alt />
    </div>
    <div class="vip-level">
      <img v-for="(item, index) in dicts?.memberlevellist" :key="index"
        :src="$getSrc(`/src/current_project/assets/images/vip/LV${index}.png`)" alt
        :class="{ 'active': levelActive === index }" @click="levelActive = index" />
    </div>
    <div class="inner-wrap">
      <table>
        <tr>
          <th colspan="2">{{ $t('当前存款') }}</th>
        </tr>
        <tr>
          <td>{{ $t('当前存款') }}</td>
          <td>{{ user?.userInfo?.user_wallet?.money ?? '-' }}</td>
        </tr>
        <tr>
          <td>{{ $t('当前流水') }}</td>
          <td>{{ user?.userInfo?.user_wallet?.undone_flow ?? '-' }}</td>
        </tr>
      </table>
      <table v-if="dicts?.memberlevellist?.length">
        <tr>
          <th colspan="2">{{ 'VIP' + levelActive + $t('尊享') }}</th>
        </tr>
        <tr>
          <td>{{ $t('每日提款次数') }}</td>
          <td>{{ dicts?.memberlevellist[levelActive]?.withdraw_times_limit ?? '-' }}</td>
        </tr>
        <tr>
          <td>{{ $t('每日提款额度') }}</td>
          <td>{{ dicts?.memberlevellist[levelActive]?.withdraw_money_limit ?? '-' }}</td>
        </tr>
        <tr>
          <td>{{ $t('晋级礼金') }}</td>
          <td>{{ activityData[levelActive]?.upgrade_money ?? '-' }}</td>
        </tr>
        <tr>
          <td>{{ $t('生日礼金') }}</td>
          <td>{{ activityData[levelActive]?.birthday_money ?? '-' }}</td>
        </tr>
        <tr>
          <td>{{ $t('佳节礼品') }}</td>
          <td>{{ activityData[levelActive]?.gift ?? '-' }}</td>
        </tr>
        <tr>
          <td>{{ $t('最高返水') }}</td>
          <td>{{ maxBack[levelActive] ? `${maxBack[levelActive]}%` : '-' }}</td>
        </tr>
      </table>
      <img :src="$getSrc(`/src/assets/images/vip/img_fs@3x.png`)" alt class="title-fs" />
      <table class="washcode-table">
        <tr>
          <th>{{ $t('VIP等级') }}</th>
          <th v-for="(item, index) in allActivityBenefit" :key="index">{{ $t(item.name) }}</th>
        </tr>
        <tr v-for="(item, index) in dicts?.memberlevellist" :key="index">
          <td>{{ `VIP${item.level}` }}</td>
          <td v-for="(child, cidx) in allActivityBenefit" :key="cidx">{{ child.list[index] ?
              `${child.list[index].proportion}%` : '-'
          }}</td>
        </tr>
      </table>
      <img :src="$getSrc(`/src/assets/images/vip/img_wenxintis@3x.png`)" alt class="title-tip" />
      <div class="tips">
        <div v-for="(item, index) in questionList" :key="index" class="layout-flex-center">
          <span>{{ index + 1 }}</span>
          <div>
            <p>{{ item.title }}</p>
            <p>{{ item.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, ref, watchEffect,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { allactivitybenefit, activitylist } from '@/api/vip';

const global = inject('global');
const $store = inject('store');
const subConfig = inject('subConfig');

$store.dispatch('app/getDict', ['memberlevellist']);
const { app: { dicts }, user } = $store.state;

const levelActive = ref(0);
const maxBack = ref([]);

const allActivityBenefit = ref([]);
const { run: vipRun } = useRequest(allactivitybenefit, {
  onSuccess(res) {
    allActivityBenefit.value = res;
  },
});

const activityData = ref([]);
const { run: activityRun } = useRequest(() => activitylist({ type: 10 }), {
  onSuccess(res) {
    console.log(res);
    activityData.value = res.data.length ? res.data[0]?.benefit_setting ?? [] : [];
  },
});

const questionList = [
  {
    num: '01',
    title: `${global.$t('晋升标准：')}`,
    content: global.$t('会员的累计有效投注会得到相应的VIP成长值。达到相应级别的要求，即可在次日晋级相应VIP等级，数据统计时间从VIP系统上线当日0点开始。'),
  },
  {
    num: '02',
    title: `${global.$t('VIP成长值：')}`,
    content: global.$t('根据不同平台产生的有效流水会获得相应的VP成长值，具体对应数值请查看VIP专题页。'),
  },
  {
    num: '03',
    title: `${global.$t('晋升顺序：')}`,
    content: global.$t('VIP成长值达到相应的要求可每天晋升一级，但VIP等级不可越级晋升。'),
  },
  {
    num: '04',
    title: `${global.$t('保级要求：')}`,
    content: global.$t('会员在“VIP等级变更”后的30天内，需完成相应等级的有效投注要求方可继续保级30天。'),
  },
  {
    num: '05',
    title: `${global.$t('降级标准：')}`,
    content: global.$t('如果会员在30天内没有完成相应的保级要求有效投注，系统会自动降级一个等级，福利也会随之调整至降级后的等级。'),
  },
  {
    num: '06',
    title: `${global.$t('晋级礼金：')}`,
    content: global.$t('会员晋升到该级别后可自助领取对应的礼金。礼金需要在发放后30天内领取，过期作废。每个级别的升级礼金代金券每位会员仅能获得1次 (3倍流水即可提款）。'),
  },
  {
    num: '07',
    title: `${global.$t('生日礼金：')}`,
    content: global.$t('会员会在生日当天收到礼金，礼金需要在发放后30天内领取，过期作废。以领取当天VIP等级为准，每年可领取一次，如末设置生日则视为自动放弃（3倍流水即可提款）。'),
  },
  {
    num: '08',
    title: `${global.$t('每月红包：')}`,
    content: global.$t('会员可在每个自然月的第二天收到每月红包，礼金需要在发放后30天内领取，过期作废。每月红包代金券金额以当月第二天当天VIP等级为准（3倍流水即可提款）。'),
  },
  {
    num: '09',
    title: `${global.$t('佳节礼品：')}`,
    content: global.$t('平台会开展相应活动，敬请期待。'),
  },
  {
    num: '10',
    title: `${global.$t('客户经理：')}`,
    content: global.$t('您专属的客户经理，7X24小时X365天为您解答疑问，满足一切合理需求。'),
  },
  {
    num: '11',
    title: `${global.$t('游戏通道：')}`,
    content: global.$t('您个人专属的域名和网络线路，更快更稳定，杜绝风险隐患。'),
  },
  {
    num: '12',
    title: `${global.$t('有效投注：')}`,
    content: global.$t('相应类型游戏投注，任何对押、和局、无效的、投注失败的、未产生输赢结果的投注不计算为有效投注（体育类港赔0.75欧赔1.75以下的投注、真人类和局投注、电子美内的棋牌游戏如百家乐/21点等的投注、彩票类注单，棋牌美退回等注单不计算为有效投法）。'),
  },
  {
    num: '13',
    title: '',
    content: subConfig.title + global.$t('平台有权对该活动进行修改、暂停，取消等，无需特别通知，井保留对该活动的最终解释权。'),
  },
];
watchEffect(() => {
  const temp = [];
  dicts?.memberlevellist?.map((n) => {
    let max = 0;
    allActivityBenefit.value.map((m) => {
      if (m.list[n.level]?.proportion > max) {
        max = m.list[n.level].proportion;
      }
    });
    temp.push(max);
  });
  maxBack.value = temp;
});

</script>

<style lang='less' scoped>
.vip-wrap {
  .m-header {
    position: fixed;
    width: 100%;
    z-index: 100;
  }

  .vip-wrap-banner {
    position: relative;
    padding-top: 158px;

    .bot {
      position: absolute;
      bottom: 70px;
      left: 0;
      z-index: 2;
      width: 100%;
    }

    .btn {
      position: absolute;
      bottom: 42px;
      left: 50%;
      z-index: 3;
      width: 356px;
      transform: translateX(-50%);
    }
  }

  .my-swipe {
    padding-bottom: 70px;

    .van-image {
      width: 660px;
      margin: 0 auto;
      height: 422px;
      display: block;

      :deep(.van-image__img) {
        width: auto;
        margin: 0 auto;
      }
    }

    :deep(.van-swipe__indicators) {
      bottom: 0;

      i {
        width: 16px;
        height: 16px;
        background-color: var(--cur-color-203858);

        &.van-swipe__indicator--active {
          background-color: var(--theme-color);
        }
      }
    }
  }

  .title-fl img {
    display: block;
    width: 356px;
    margin: 70px auto 46px;
  }

  .vip-level {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;

    img {
      width: 98px;
      margin: 0 9px 30px;
      transition: all 0.3s linear;

      &.active {
        transform: scale(1.3);
      }
    }
  }

  .inner-wrap {
    padding: 0 32px;
  }

  table {
    table-layout: fixed;
    // border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    border-radius: 28px 28px 0 0;
    overflow: hidden;
    background: var(--bg-color-ffffff);
    margin-bottom: 46px;

    th {
      background-color: var(--theme-color);
      color: var(--font-color-fff);
      font-size: 28px;
      height: 78px;
    }

    td {
      height: 78px;
      font-size: 24px;
      text-align: center;
      color: var(--font-color-000-4);
      border-bottom: 2px solid var(--border-color-ececec);
      border-left: 2px solid var(--border-color-ececec);

      &:first-child {
        color: var(--font-color-000);
      }
    }

    tr {
      td:last-child {
        border-right: 2px solid var(--border-color-ececec);
      }
    }

    tr:last-child {
      td {
        &:last-child {
          border-radius: 0 0 28px 0;
        }

        &:first-child {
          border-radius: 0 0 0 28px;
        }
      }
    }

    &.washcode-table {

      th,
      td {
        font-size: 20px;
      }

      td:first-child {
        color: var(--font-color-ffffff);
      }
    }
  }

  .title-fs {
    display: block;
    width: 582px;
    margin: 0 auto 28px;
  }

  .title-tip {
    display: block;
    width: 552px;
    margin: 0 auto 28px;
  }

  .tips {
    span {
      width: 40px;
      height: 40px;
      background: var(--theme-color);
      border-radius: 50%;
      text-align: center;
      line-height: 40px;
      font-size: 28px;
      color: var(--font-color-fff);
      margin-right: 16px;
    }

    >div {
      align-items: flex-start;
      margin-bottom: 28px;

      div {
        flex: 1;
      }
    }

    p:first-child {
      color: var(--font-color-000);
      font-size: 24px;
      margin: 0;
    }

    p:last-child {
      color: var(--font-color-000);
      font-size: 24px;
      margin: 0;
    }
  }
}
</style>
