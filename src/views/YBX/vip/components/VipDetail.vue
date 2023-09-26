<template>
  <div class="events">
    <h2 class="events-title">
      <i></i>
      <span>{{ $t('VIP返水与比例') }}</span>
    </h2>
    <ul class="newfs-wrap newfs-wrap-rate">
      <li class="newfs-wrap-tit">
        <div class="first">{{ $t('VIP等级') }}</div>
        <div v-for="(item, index) in benefitData?.length && benefitData[0]?.list" :key="index">
          <img
            :src="$getSrc(`/src/current_project/assets/images/vip/grade_normal${index + 1}@2x.png`)"
            alt
          />
          VIP{{ item?.level }}
        </div>
      </li>
      <li v-for="(item, index) in benefitData" :key="index">
        <div>{{ item?.name }}</div>
        <div v-for="(child, c_i) in item.list" :key="c_i">{{ child?.proportion }}%</div>
      </li>
    </ul>
    <h2 class="events-title">
      <i></i>
      <span>VIP 提款额度</span>
    </h2>
    <div class="rank-block">
      <ul class="newfs-wrap newfs-wrap02">
        <li class="newfs-wrap-tit" style="flex: 2">
          <div class="first">{{ $t('VIP等级') }}</div>
          <div>{{ $t('日取款次数') }}</div>
          <div>{{ $t('每日取款额度') }}</div>
        </li>
        <li
          v-for="(item, index) in levelData"
          :key="index"
          :class="index === user?.userInfo?.level ? 'on' : ''"
        >
          <div>
            <img
              :src="$getSrc(`/src/current_project/assets/images/vip/grade_normal${index + 1}@2x.png`)"
              alt
            />
            <span>VIP{{ index }}</span>
          </div>
          <div>
            <span>{{ item.withdraw_times_limit }}</span>
          </div>
          <div>
            <span>
              {{
                item.withdraw_money_limit?.split(".")[0] / 10000
              }}万
            </span>
          </div>
        </li>
      </ul>
    </div>
    <h2 class="events-title">
      <i></i>
      <span>{{ $t('条款与规则') }}</span>
    </h2>
    <div class="events-rules-item" v-for="(item, index) in rules">
      <i>{{ index + 1 }}</i>
      <div>
        <h3>{{ $t(item.title) }}</h3>
        <p>{{ item.con }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref, inject, defineProps,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { allactivitybenefit } from '@/api/vip.js';

const props = defineProps({
  levelData: {
    type: Array,
    default: () => [],
  },
});

const global = inject('global');
const store = inject('store');
const subConfig = inject('subConfig');
const { user } = store.state;
const rules = [
  {
    title: global.$t('晋级标准'),
    con:
      global.$t('会员的累计投注额达到相应级别的要求，即可晋级相应VIP等级，数据统计时间从账户注册之后立即开始；'),
  },
  {
    title: global.$t('保级标准'),
    con:
      global.$t(`会员在“VIP等级变更”后的（${props.levelData[user?.userInfo?.level]?.deposit_day}）天内需完成相应等级的有效投注额和存款要求方可继续保级(${props.levelData[user?.userInfo?.level]?.deposit_day})天；`),
  },
  {
    title: global.$t('降级标准'),
    con:
      global.$t(`如果会员在（${props.levelData[user?.userInfo?.level]?.deposit_day}）天内没有完成相应的保级要求流水，系统会自动降级一个等级，福利也会随之调整至降级后的等级; `),
  },
  {
    title: global.$t('晋级礼金'),
    con:
      global.$t('会员晋级的时候，自动获得晋级礼金，VIP等级越高，晋级的时候获得的VIP晋级礼金也越多！每个玩家每个VIP等级只能获得1次晋级礼金。VIP等级降级后，再次晋级，不能重复获得晋级礼金。'),
  },
  {
    title: global.$t('生日礼金'),
    con:
      global.$t('达到一定VIP等级的时候，平台将会在您生日的时候赠送大额的生日礼金，一定要记得设置出生日哦！ 特别说明:会员在注册后90天内过生日，今年将不能领取生日礼金。另注册后出生日期大于90天的会员会按照您填写的出生日期自动派发生日彩金。'),
  },
  {
    title: global.$t('会员日红包'),
    con:
      global.$t('会员可在每个自然月的18号找客服领取每月红包，每月红包金额以当月18号当天VIP等级为准（每月会员日红包礼金3倍流水即可取款）；'),
  },
  {
    title: global.$t('佳节礼品'),
    con:
      global.$t('达到一定的VIP等级时您可以在中国法定节假日联系在线客服小姐姐，领取对应等级礼品哦！'),
  },
  {
    title: global.$t('客户经理'),
    con: global.$t('您专属的客户经理，随时为您解答疑问，满足其它合理需求；'),
  },
  {
    title: global.$t('游戏通道'),
    con:
      global.$t(`您个人专属的域名和网络线路，更快更稳定，杜绝风险隐患；${subConfig.title}有权对该活动进行修改、暂停、取消等，无需特别通知，并保留对该活动的最终解释权。`),
  },
];

const { data: benefitData, loading } = useRequest(allactivitybenefit);

</script>

<style lang="less" scoped>
.events {
  background-color: var(--font-color-fff);
  overflow-x: hidden;
  .newfs-wrap {
    display: flex;
    li {
      flex: 1;
      &.newfs-wrap-tit {
        flex: auto;
        flex-grow: 1;
        font-size: 24px;
        color: var(--font-color-fff);
      }
      div {
        height: 80px;
        text-align: center;
        line-height: 80px;
        color: var(--vip-table-font-color,#8e9cb7);
        img {
          width: 27px;
          top: 8px;
          position: relative;
        }
        &:first-child {
          background-color: var(--vip-table-head-bg-color,#e1e5ee) !important;
          color: var(--vip-table-head-font-color,#6c7b98);
        }
        &:nth-child(odd) {
          background-color: var(--vip-table-head-bg-color,var(--font-color-fff));

        }
        &:nth-child(even) {
          background-color: var(--vip-table-head-even-bg-color,#f6f9fd);
        }

      }
      &:first-child div:first-child {
        background-color: var(--theme-color) !important;
      }
      &:first-child div:nth-child(odd) {
        background-color: var(--vip-table-head-first-bg-color,#636e82);
        color: var(--font-color-fff);
      }
      &:first-child div:nth-child(even) {
        background-color: var(--vip-table-head-bg-color,#545c70) ;
        color: var(--font-color-fff);
      }
    }
  }
  .newfs-wrap-rate li{
    &:first-child div:nth-child(odd) {
      background-color: var(--vip-table-head-first-bg-color,#636e82) !important;
      &.first{
        background-color: var(--theme-color) !important;
      }
    }
  }
  .events-title {
    display: flex;
    height: 120px;
    padding: 0 30px;
    align-items: center;
    font-size: 32px;
    font-weight: bold;
    color: var(--font-color-333);
    margin: 0;
    i {
      width: 6px;
      height: 32px;
      background: var(--btn-gradient-color);
      border-radius: 3px;
      margin-right: 16px;
      margin-right: 16px;
    }
  }
  .events-rules-item {
    display: flex;
    padding: 0 30px;
    align-items: flex-start;
    margin-bottom: 60px;
    i {
      width: 32px;
      height: 32px;
      background: var(--theme-color);
      font-size: 24px;
      color: var(--font-color-fff);
      text-align: center;
      line-height: 32px;
      border-radius: 50%;
    }
    div {
      flex: 1;
      margin-left: 16px;
      h3 {
        font-size: 28px;
        color: var(--theme-color);
        font-weight: bold;
        margin: 0;
      }
      p {
        font-size: 28px;
        color: var(--vip-rule-font-color,#566178);
        line-height: 48px;
      }
    }
  }
  .newfs-wrap02 {
    display: block;
    li {
      width: 100%;
      flex-direction: row;
      display: flex;
      div {
        flex: 1;
      }

      &:nth-child(odd) {
        div {
          background-color: var(--vip-table-head-even-bg-color,#f6f9fd);
          &:first-child {
            background-color: var(--vip-table-head-bg-color,#545c70) !important;
            color: var(--font-color-fff);
          }
        }
      }
      &:nth-child(even) {
        div {
          background-color: var(--font-color-fff);
          &:first-child {
            background-color: #636e82 !important;
            color: var(--font-color-fff);
          }
        }
      }
      &:first-child {
        div {
          background-color: var(--vip-table-head-bg-color,#e1e5ee) !important;;
          color: var(--font-color-333) !important;
          &:first-child {
            background-color: var(--theme-color) !important;
            color: var(--font-color-fff) !important;
          }
        }
      }
    }
  }
}
</style>
