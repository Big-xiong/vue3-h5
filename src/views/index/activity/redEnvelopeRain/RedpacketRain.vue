<template>
  <div class="redPacketRain" v-show="popShow">
    <div class="top">
     <span v-lang:vi|th|en="fontSize">{{ $t('剩余时间') }}：{{ tickTime }}{{ $t('秒') }}</span>
     <span v-lang:vi|th|en="fontSize">{{ $t('中奖金额') }}： <span class="money" v-money="totalMoney"></span> </span>
    </div>
    <div id="bag-popup"></div>
    <img class="footer" :src="$getSrc(`/src/assets/images/activity/${lang}/bag-footer.png`)" alt />
    <div class="pop" v-show="popShow">
      <div class="main">
        <img :src="$getSrc(`/src/assets/images/activity/${lang}/red_pop.png`)" alt />
        <p class="bag-money" v-money="totalMoney">
          <!-- {{ (totalMoney).toFixed(2) }}
          <span>{{ $t('元') }}</span> -->
        </p>
        <img class="icon" @click="closePop" :src="$getSrc(`/src/assets/images/activity/en/red_close.png`)" alt />
        <p v-if="!totalMoney" class="bag-tips" v-lang:vi|th|en="fontSize">{{ $t('很遗憾您未抢到红包') }}</p>
        <p v-else class="bag-success">
          <span>{{ $t('恭喜您') }}</span>
          {{ $t('获得红包将直接发放到钱包') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref, inject, onMounted, watch, onBeforeUnmount,
} from 'vue';
import { useInterval } from '@/utils/hooks';
import { claimRedRain, redMoneyRound } from '@/api/activity';

const global = inject('global');
const { lang } = global.$store.state.app;
const props = defineProps({
  activityInfo: {
    type: Object,
    default: () => ({}),
  },
  time: {
    type: String,
    default: 'off',
  },
});

const packetOption = {
  density: 500,
  speed: 30,
  coinRate: 2,
};

const flag = ref(true);
const rainArr = ref([]);
const totalMoney = ref(0);
const popShow = ref(false);
const fontSize = 'font-size:14px';
const $emit = defineEmits(['changeTime']);

const { run: startBag, stop: stopBagInterval } = useInterval(createBag, packetOption.density, { manual: true });

const tickTime = ref(0);
const { run: runCountDown, stop: stopCountDown } = useInterval(() => {
  if (tickTime.value <= 0) {
    popShow.value = true;
    stopCountDown();
    stopBag();
    clearBag();
  } else {
    tickTime.value -= 1;
  }
}, 1000, { manual: true });

function countdown(val) {
  tickTime.value = val?.time_limit ?? 0;
  runCountDown();
}

watch(() => props.time, (val) => {
  if (val === 'on') {
    startBag();
    countdown(props.activityInfo);
  }
}, { immediate: true });

watch(() => popShow.value, (val) => {
  if (val) {
    redMoneyRound();
  } else {
    totalMoney.value = 0;
  }
}, { immediate: true });

const handleClick = (e) => {
  if (e.target.className === 'redPacket') {
    clickBag(e.target);
  }
};

onMounted(() => {
  document.addEventListener('click', handleClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClick);
  stopBag();
  clearBag();
  flag.value = true;
  rainArr.value = [];
  totalMoney.value = 0;
  tickTime.value = 0;
  popShow.value = false;
});

function closePop() {
  popShow.value = false;
  $emit('changeTime');
}

function createBag() {
  const pop = document.getElementById('bag-popup');
  const nRed = document.createElement('div');
  // 随机生成金币/红包
  const type = Math.floor(Math.random() * (11 - 0) + 0);

  // 随机生成大小
  const scale = Math.floor(Math.random() * (10 - 5) + 5) / 10;

  // 随机旋转角度
  const deg = Math.floor(Math.random() * (90 - 0) + 0);

  if (type > packetOption.coinRate) {
    nRed.className = 'redPacket';
    nRed.style.cssText = `
              position: absolute;
              display: block;
              width: 54px;
              height: 77px;
              transform: rotate(${deg}deg) scale(${scale});
              background-image:url(${global.$getSrc(`/src/assets/images/activity/${lang}/redpacket.png`)});
              background-size:contain;
              background-repeat:no-repeat`;
    // nRed.src = global.$getSrc('./assets/redpacket.png')
  } else {
    nRed.className = 'coin';
    nRed.style.cssText = `
              position: absolute;
              display: block;
              width: 40px;
              height: 40px;
              transform: rotate(${deg}deg) scale(${scale});
              background-image:url(${global.$getSrc('/src/assets/images/activity/en/coin.png')});
              background-size:cover;
              background-repeat:no-repeat`;
    // nRed.src = global.$getSrc('./assets/coin.png')
  }

  nRed.style.left = `${Math.random() * (pop.clientWidth - 30)}px`;
  nRed.style.top = `${-pop.clientHeight / 10}px`;
  flag.value = true;

  pop.appendChild(nRed);
  rainArr.value.push(nRed);
  moveBag(nRed, pop);
}

function moveBag(rains, pop) {
  const diffY = Math.random() + 1; // 垂直上的轻微偏移
  const diffX = Math.random(); // 水平上的轻微偏移
  rains.timer = setInterval(() => {
    if (diffY > 1.5) {
    rains.style.left = `${parseInt(rains.style.left) + parseInt(diffX * rains.clientHeight / 30)}px`;
    } else {
    rains.style.left = `${parseInt(rains.style.left) - parseInt(diffX * rains.clientHeight / 30)}px`;
    }
    rains.style.top = `${parseInt(rains.style.top) + parseInt(diffY * rains.clientHeight / 20)}px`;
    if (pop.clientHeight < parseInt(rains.style.top)) {
          // 超出 区域过后，关闭定时器，删除红包
          clearInterval(rains.timer);
          pop.removeChild(rains);
        }
      }, packetOption.speed);
}
function stopBag() {
  stopCountDown();
  stopBagInterval();
  for (let i = 0; i < rainArr.value.length; i++) {
    clearInterval(rainArr.value[i].timer);
  }
}
function clearBag() {
  const container = document.getElementById('bag-popup');
  const redItem = container.childNodes;
  for (let i = redItem.length - 1; i >= 0; i--) {
    container.removeChild(redItem[i]);
  }
}
function clickBag(e) {
  if (flag.value === true) {
    e.className = 'redPacked';
    e.style.backgroundImage = `url(${global.$getSrc(`/src/assets/images/activity/${lang}/redpacked.png`)})`;
    claimRedRain().then(async (res) => {
      if (res.money) {
        await sumBag(res.money);
        const moneyP = document.createElement('p');
        moneyP.innerHTML = `+${res.money}`;
        moneyP.style.cssText = `
              color: #fcf358;
              font-size: 30px;
              position: absolute;
              width:100%;
              text-align:center;
              top: -10px;
              animation: move .5s both linear;`;
        e.appendChild(moneyP);
      }
    });
    flag.value = false;
  } else {
    return false;
  }
}
function sumBag(m) {
  totalMoney.value += m;
  console.log('sum', totalMoney.value);
}

</script>

<style lang="less">
.redPacketRain {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  z-index: 999;
  .footer {
    position: absolute;
    width: 100%;
    bottom: 0;
  }
  .top {
    position: absolute;
    top: 88px;
    display: flex;
    justify-content: space-between;
    color: var(--font-color-fff);
    width: 93%;
    padding: 30px;
    font-size: 34px;
  }
  #bag-popup {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
  }
  // .redPacked{
  //   background-image: url('./assets/redpacked.png') !important;
  // }

  .pop {
    width: 500px;
    height: 60%;
    position: absolute;
    top: 100px;
    display: flex;
    left: 50%;
    margin-left: -250px;
    flex-direction: column;
    text-align: center;
    font-size: 60px;
    color: #7b3200;
    .bag-money {
      position: absolute;
      z-index: 999;
      top: 230px;
      width: 100%;
      span {
        font-size: 36px;
      }
    }
    .bag-tips {
      position: absolute;
      z-index: 999;
      top: 440px;
      left: 50%;
      transform: translateX(-50%);
      width: 296px;
      font-size: 32px;
      color: var(--font-color-fff);
    }
    .bag-success {
      position: absolute;
      z-index: 999;
      top: 420px;
      width: 100%;
      font-size: 22px;
      color: var(--font-color-fff);
      span {
        font-size: 40px;
        font-weight: bold;
        display: block;
        margin-bottom: 10px;
      }
    }
    .main {
      width: 500px;
      margin-top: 230px;
      position: relative;
      img {
        width: 100%;
      }
      .icon {
        width: 60px;
        position: absolute;
        bottom: -86px;
        left: 50%;
        margin-left: -30px;
      }
      .moveMoney {
        color: #fcf358;
        font-size: 30px;
        position: absolute;
        top: -10px;
        animation: move 0.5s both linear;
      }
    }
  }
}
@keyframes move {
  from {
    top: -10px;
    opacity: 1;
  }

  to {
    top: -70px;
    opacity: 0;
  }
}
</style>
