<template>
  <div class="duty">
    <div class="everyday-entrance" v-if="user?.isLogin && everylist?.length" @click="showEveryday">
      <img class="entrance-bg" :src="$getSrc('/src/assets/images/daliy-duty/everyday-bg@3x.png')" />
      <img class="entrance-btn" :src="$getSrc('/src/assets/images/daliy-duty/everyday-btn@3x.png')" />
    </div>
    <div v-if="time !== 'off' && !haslimit" class="redpack" @click="handleGo">
      <img :src="$getSrc(`/src/assets/images/activity/${lang}/redpack.gif`)" ß />
      <div class="info">
        <template v-if="time > 0">
          <countdown
            class="tickTime"
            :time="time"
            :transform="transformSlotProps"
            @progress="handleCountdownProgress"
            @end="handleCountdownEnd"
          >
            <template v-slot="props">
              <span v-show="props?.days">
                {{ props?.days }}
                <small>{{ $t('天') }}</small>
              </span>
              <span v-show="props?.hours">
                {{ props?.hours }}
                <small>{{ $t('时') }}</small>
              </span>
              <span>
                {{ props?.minutes }}
                <small>{{ $t('分') }}</small>
              </span>
              <span>
                {{ props?.seconds }}
                <small>{{ $t('秒') }}</small>
              </span>
            </template>
          </countdown>
        </template>
        <template v-else>
          <p v-lang:vi|th|en="`line-height: 70px;`">{{ time == "on" ? $t('活动进行中') : $t('活动已结束') }}</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, ref, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import { useRouter } from 'vue-router';
import { getRedRainInfo } from '@/api/activity';
import { dateFormat } from '@/utils';
import { dailytasks } from '@/api/home';

const $store = inject('store');
const $global = inject('global');
const { user } = $store.state;
const { lang } = $store.state.app;
const $router = useRouter();
const time = ref('off');
const haslimit = ref(false);
const startTime = ref();
onMounted(() => {
  getBasicInfo();
});
const { data: everylist, loading: listLoading } = useRequest(dailytasks, {
    manual: !user?.isLogin,
});
function transformSlotProps(props) {
  const formattedProps = {};

  Object.entries(props).forEach(([key, value]) => {
    if (key === 'seconds') formattedProps[key] = value < 10 ? `0${value}` : String(value);
    else formattedProps[key] = value;
  });

  return formattedProps;
}
function handleCountdownProgress(data) {
  if (!data.totalSeconds) {
    time.value = 'on';
  }
}
function handleCountdownEnd() {
  time.value = 'on';
}
async function getBasicInfo() {
  let endTime = null;
  const currTime = (new Date()).getTime();
  let timeType = null;
  let actEndTime = null;
  let activityInfo = null;
  getRedRainInfo().then((data) => {
    if (!data || JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]') return;
    haslimit.value = data?.username?.includes(user?.userInfo?.username) || (data?.agent_line && data?.agent_line.includes(user?.userInfo?.agent_name));

    activityInfo = data?.benefit_setting;
    timeType = data?.benefit_setting?.time_limit_type;
    if (timeType * 1 === 1) { // 固定时间
      startTime.value = (new Date((data.start_time).replace(/-/g, '/'))).getTime();
      endTime = (new Date((data.end_time).replace(/-/g, '/'))).getTime();
    } else if (timeType * 1 === 2) { // 每日固定时间
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const date = new Date().getDate();
      startTime.value = (new Date((`${year}-${month}-${date} ${activityInfo.fixed_time_setting.start}`).replace(/-/g, '/'))).getTime();
      endTime = (new Date((`${year}-${month}-${date} ${activityInfo.fixed_time_setting.start}`).replace(/-/g, '/'))).getTime() + activityInfo.fixed_time_setting.time_duration * [60, 1][activityInfo.fixed_time_setting.time_duration_type * 1 - 1] * 60 * 1000;
    } else if (timeType * 1 === 3) { // 间隔时间
      const firstTime = (new Date(`${activityInfo.interval_time_setting.start[0]}`)).getTime();
      const subTime = currTime - firstTime;
      const per = activityInfo.interval_time_setting.interval * [60, 1][activityInfo.interval_time_setting.interval_time_type * 1 - 1] * 60 * 1000;
      const count = Math.ceil(subTime / per) * 1;
      startTime.value = firstTime + (count - 1) * per;
      endTime = firstTime + (count - 1) * per + activityInfo.interval_time_setting.time_duration * [60, 1][activityInfo.interval_time_setting.time_duration_type * 1 - 1] * 60 * 1000;
      actEndTime = (new Date(`${activityInfo.interval_time_setting.start[1]}`)).getTime();
    }
    // debugger
    if (startTime.value - currTime > 0) {
      const subTime = startTime.value - currTime;
      if (subTime > activityInfo.remind * 60 * 1000) {
        time.value = 'off';
      } else {
        time.value = subTime;
      }
    } else if (currTime - startTime.value > 0 && currTime - endTime < 0) {
      time.value = 'on';
    } else if (currTime - endTime > 0) {
      time.value = 'off';
      if (currTime - actEndTime > 0) {
        return;
      }
      if (timeType * 1 === 3) { // 处理活动状态
        startTime.value += activityInfo.interval_time_setting.interval * [60, 1][activityInfo.interval_time_setting.interval_time_type * 1 - 1] * 60 * 1000;
        endTime = startTime.value + activityInfo.interval_time_setting.time_duration * [60, 1][activityInfo.interval_time_setting.time_duration_type * 1 - 1] * 60 * 1000;
        const subTime = startTime.value - currTime;
        if (activityInfo.remind) { // 设置提醒时间
          if (subTime > activityInfo.remind * 60 * 1000) {
            time.value = 'off';
          } else {
            time.value = subTime;
          }
        } else {
          time.value = subTime;
        }
      }
    }
  });
}
function handleGo() {
  if (user?.isLogin) {
    if (time.value > 0) {
      Toast.success(`${global.$t(`红包雨将在`)} ${dateFormat('YYYY-MM-DD HH:mm', startTime.value)} ${global.$t(`开启`)}`);
      return;
    }
    $router.push('/activity/redEnvelopeRain');
  } else {
    $router.push('/login');
  }
}

function showEveryday() {
  $global.$dialog({ tpl: 'AgentOmitApply' });

  // $global.$popup({ tpl: 'EveryDayPopup' });
}

</script>

<style lang="less" scoped>
.duty {
  position: fixed;
  right: 0;
  bottom: 350px;
  z-index: 99;
  .redpack {
    // width:80px;
    position: relative;
    img {
      width: 160px;
    }
    .info {
      position: absolute;
      top: 70px;
      left: 6px;
      width: 100%;
      text-align: center;
      p {
        color: var(--font-color-fff);
        line-height: 40px;
        font-size: 20px;
        font-weight: bold;
      }
      .tickTime {
        color: var(--font-color-fff);
        font-weight: bold;
        width: 100%;
        text-align: center;
        display: block;
      }
    }
  }
  .main {
    width: 174px;
  }
  .close {
    width: 44px;
    position: absolute;
    top: -20px;
    right: 0;
  }
  .hideDuty {
    width: 68px;
    height: 68px;
    // background-image: @bg-gradient-color;
    // background-color: @bg-gradient-color;
    border-radius: 10px 0 0 10px;
    color: var(--font-color-fff);
    text-align: center;
    padding: 10px;
    transition: all 0.5s;
    overflow: hidden;
    span {
      font-size: 22px;
      white-space: nowrap;
    }
  }
  .hideDuty-right {
    width: 0;
    span {
      display: none;
    }
    // margin-left: 68px;
  }
  .everyday-entrance {
    position: relative;
    width: 152px;
    height: 152px;

    .entrance-bg {
      width: 100%;
    }

    .entrance-btn {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      animation: scale 0.3s linear 0s infinite alternate;
    }

    img {
      width: 100%;
      display: block;
    }
  }
}
.van-popup.custom {
  display: flex;
  flex-direction: column;
  background: var(--bg-everyday);
  overflow: visible;
  .pop-head {
    text-align: center;
    h2 {
      border-bottom: none;
    }
    .van-image {
      width: 488px;
      height: 200px;
      position: relative;
      margin: 0 auto;
      /deep/ img {
        width: 100%;
        height: 274px;
        position: absolute;
        left: 0;
        bottom: 0;
        // transform: translateX(-50%);
      }
    }
  }
  .list {
    flex: 1;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    padding: 30px;
    .daliy-main {
      // background: @bg-color-2;
      background: var(--card-bg-color, var(--bg-color-fff));
      overflow: hidden;
      // height:140px;
      margin-bottom: 20px;
      padding: 20px;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .van-image {
        width: 80px;
        float: left;
        margin-right: 18px;
      }
      .middle {
        color: #6c6c6c;
        display: flex;
        flex-direction: column;
        height: 60px;
        h3 {
          margin: 0;
          margin-bottom: 10px;
          font-size: 28px;
          color: #1e1e1e;
        }
        p {
          font-size: 20px;
        }
      }
      .van-button {
        float: right;
        width: 160px;
        height: 60px;
        line-height: 60px;
        font-size: 20px;
        color: #fff !important;
        background: #ff8f26 !important;
        background-image: none !important;
        border-color: transparent !important;
        &.un-finished {
          background: #e12937 !important;
          background-image: none !important;
        }
      }
    }
  }
}
.task-logo {
  height: 60px;
}
@keyframes scale {
  0% {
    transform: scale(0.6);
  }

  100% {
    transform: scale(1);
  }
}
</style>
