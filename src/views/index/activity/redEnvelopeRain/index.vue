<template>
  <div class="redEnvelopeRain">
    <!-- <p>{{$t('红包雨')}}</p> -->
    <van-nav-bar :fixed="true" :title="$t('红包雨活动')" left-arrow @click-left="$router.go(-1)" />
    <div class="section-1">
      <img :src="$getSrc(`/src/assets/images/activity/${lang}/redbag.png`)" alt />
      <div>
        <p v-lang:vi|th|en="fontSize">{{ $t('红包活动倒计时') }}</p>
        <div class="time">
          <template v-if="time > 0">
            <countdown
              :time="time"
              :transform="transformSlotProps"
              @end="handleCountdownEnd"
              @progress="handleCountdownProgress"
            >
              <template v-slot="props">
                <span v-if="props.days">
                  {{ props.days }}
                  <small>{{ $t('天') }}</small>
                </span>
                <span v-if="props.hours">
                  {{ props.hours }}
                  <small>{{ $t('时') }}</small>
                </span>
                <span v-if="props.minutes">
                  {{ props.minutes }}
                  <small>{{ $t('分') }}</small>
                </span>
                <span>
                  {{ props.seconds }}
                  <small>{{ $t('秒') }}</small>
                </span>
              </template>
            </countdown>
          </template>
          <template v-else>
            <p v-lang:vi|th|en="fontSize">{{ time == 'on' ? $t('活动进行中') : $t('活动已结束') }}</p>
          </template>
        </div>
        <!-- <p>{{$t('距离活动开始时间')}}</p> -->
        <img
          v-if="!user?.isLogin"
          @click="$router.push('/login')"
          :src="$getSrc(`/src/assets/images/activity/${lang}/login.png`)"
          alt
        />
      </div>
    </div>
    <div class="section-2">
      <img class="title" :src="$getSrc(`/src/assets/images/activity/${lang}/reward_title.png`)" alt />
      <div class="reward">
        <h2>{{ $t('红包大奖名单') }}</h2>
        <div>
          <div class="top">
            <ul>
              <li>{{ $t('中奖账号') }}</li>
              <li>{{ $t('中奖金额') }}</li>
            </ul>
            <ul>
              <li>{{ $t('中奖账号') }}</li>
              <li>{{ $t('中奖金额') }}</li>
            </ul>
          </div>
          <div class="bottom">
            <Marquee :send-val="winlist[0]" class="my-marquee" />
            <Marquee :send-val="winlist[1]" class="my-marquee" />
          </div>
        </div>
      </div>
    </div>
    <div class="section-3">
      <img class="title" :src="$getSrc(`/src/assets/images/activity/${lang}/step_title.png`)" alt />
      <div v-for="(item, index) in step" :key="index">
        <img :src="$getSrc(`/src/assets/images/activity/en/step_${index + 1}.png`)" alt />
        <div class="content" v-lang:vi|th|en="`padding: 20px 10px;`">
          <h2 v-lang:vi|th|en="`margin-bottom: 35px;`">{{ $t('第') }}{{ index + 1 }}{{ $t('步') }}</h2>
          <p v-lang:vi|th|en="`line-height: 95px;font-size: 28px;`">{{ item }}</p>
        </div>
      </div>
    </div>
    <!-- 点击领取红包效果 -->
    <RedpacketRain
      v-show="time === 'on'"
      :time="time"
      :activityInfo="activityInfo"
      @changeTime="changeTime"
    />
  </div>
</template>

<script setup>
import {
  reactive, ref, inject, onMounted,
} from 'vue';
import Marquee from '@/components/Marquee.vue';
import {
  getRedRainInfo,
  getRedRainWinList,
} from '@/api/activity';
import RedpacketRain from './RedpacketRain.vue';

const global = inject('global');
const { user } = global.$store.state;
const { lang } = global.$store.state.app;
const activityInfo = ref({});
const step = ref([
  global.$t('● 活动开始前会提前倒计时，    倒计时结束后开启红包雨 '),
  global.$t('● 每次选中到红包出现金额，    将代表中奖 '),
  global.$t('● 活动结束后将自动到账主钱包，    无需手动再次领取'),
]);
const option = reactive({
  // 滚动一个条目高度的过渡时间
  moveTime: 1000,
  // 每滚动一个条目，是否需要停顿；如果为false，restTime属性将无效；
  needRestTime: false,
  // 每滚动一个条目后的停顿时间(尽量大于100，否则效果不好)，默认2000，needRestTime为true时，才有效；
  restTime: 1000,
  // 当鼠标移入和移出时，是否需要暂停和继续滚动；
  needHover: true,
  // 当滚动列表数据更新时，等待该延迟时间后，再进行滚动；
  delayTime: 3000,
  // 速度曲线【可选值： linear、ease、ease-in、ease-out、ease-in-out、cubic-bezier(n,n,n,n)】；当needRestTime为true时，才有效；
  timingFunc: 'linear',
});
const winlist = ref([]);
const time = ref('off');
const fontSize = 'font-size:14px';
onMounted(() => {
  Promise.all([
    getData(),
    getWinlist(1),
    getWinlist(2),
    getWinlist(3),
  ]);
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
function getData() {
  let startTime = null;
  let endTime = null;
  const currTime = (new Date()).getTime();
  let timeType = null;
  let actEndTime = null;
  getRedRainInfo().then((res) => {
    const data = res;
    activityInfo.value = data.benefit_setting;
    timeType = data.benefit_setting.time_limit_type;
    if (timeType * 1 === 1) { // 固定时间
      startTime = (new Date((data.start_time).replace(/-/g, '/'))).getTime();
      endTime = (new Date((data.end_time).replace(/-/g, '/'))).getTime();
    } else if (timeType * 1 === 2) { // 每日固定时间
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const date = new Date().getDate();
      startTime = (new Date((`${year}-${month}-${date} ${activityInfo.value.fixed_time_setting.start}`).replace(/-/g, '/'))).getTime();
      endTime = (new Date((`${year}-${month}-${date} ${activityInfo.value.fixed_time_setting.start}`).replace(/-/g, '/'))).getTime() + activityInfo.value.fixed_time_setting.time_duration * [60, 1][activityInfo.value.fixed_time_setting.time_duration_type * 1 - 1] * 60 * 1000;
    } else if (timeType * 1 === 3) { // 间隔时间
      const firstTime = (new Date(`${activityInfo.value.interval_time_setting.start[0]}`)).getTime();
      const subTime = currTime - firstTime;
      const per = activityInfo.value.interval_time_setting.interval * [60, 1][activityInfo.value.interval_time_setting.interval_time_type * 1 - 1] * 60 * 1000;
      const count = Math.ceil(subTime / per) * 1;
      startTime = firstTime + (count - 1) * per;
      endTime = firstTime + (count - 1) * per + activityInfo.value.interval_time_setting.time_duration * [60, 1][activityInfo.value.interval_time_setting.time_duration_type * 1 - 1] * 60 * 1000;
      actEndTime = (new Date(`${activityInfo.value.interval_time_setting.start[1]}`)).getTime();
    }
    // debugger
    if (startTime - currTime > 0) {
      const subTime = startTime - currTime;
      if (subTime > activityInfo.value.remind * 60 * 1000) {
        time.value = 'off';
      } else {
        time.value = subTime;
      }
    } else if (currTime - startTime > 0 && currTime - endTime < 0) {
      time.value = 'on';
    } else if (currTime - endTime > 0) {
      time.value = 'off';
      if (currTime - actEndTime > 0) {
        return;
      }
      if (timeType * 1 === 3) { // 处理活动状态
        startTime += activityInfo.value.interval_time_setting.interval * [60, 1][activityInfo.value.interval_time_setting.interval_time_type * 1 - 1] * 60 * 1000;
        endTime = startTime + activityInfo.value.interval_time_setting.time_duration * [60, 1][activityInfo.value.interval_time_setting.time_duration_type * 1 - 1] * 60 * 1000;
        const subTime = startTime - currTime;
        if (activityInfo.value.remind) { // 设置提醒时间
          if (subTime > activityInfo.value.remind * 60 * 1000) {
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
function getWinlist(val) {
  getRedRainWinList({ page: val }).then((res) => {
    winlist.value.push(res.list);
    console.log(winlist.value, 88);
  });
}
function changeTime() {
  time.value = 'off';
}
</script>

<style src="./style.less" lang="less" scoped></style>
