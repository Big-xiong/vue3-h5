<template>
  <div class="landing-wrap" @scroll="onScroll">
    <div class="landing-wrap-navBar" :class="{ active: isNavActive }">
      <img @click="$router.push('/')" :src="$getSrc(`/src/assets/images/logo.png`)" />
      <div class="btn-wrap">
        <van-button
          v-if="!agent.isLogin"
          white
          type="success"
          @click="$popup({ tpl: 'AgentLogin', goRegister, goForget })"
        >{{ $t('登录') }}</van-button>
        <van-button
          plain
          type="primary"
          @click="onAgentClick"
        >{{ agent.isLogin ? $t('代理中心') : $t('马上加入') }}</van-button>
      </div>
    </div>
    <div
      class="landing-wrap-bg first-section"
      :style="`background-image: url(${isDark ? '' : $getSrc(`/src/assets/images/agent/index/bg.png`)});`"
    >
      <h2 class="main-title">{{ $t('共赢互惠，坐佣百万') }}</h2>
      <p class="main-slogan">{{ $t('快速上手，收益有方，财务自由') }}</p>
      <img class="people" :src="$getSrc(`/src/assets/images/agent/index/people.png`)" />
      <img
        class="arrow2"
        @click="scrollTo('#how-to')"
        :src="$getSrc(`/src/assets/images/agent/index/arrow2@2x.png`)"
      />
    </div>
    <div
      class="landing-wrap-bg two"
      id="how-to"
      :style="`background-image: url(${$getSrc(`/src/assets/images/agent/index/bgtwo.png`)});`"
    >
      <h2>{{ $t('为什么加入{0}', [subConfig.title]) }}</h2>
      <van-row>
        <van-col span="10">
          <img class="icon" :src="$getSrc(`/src/assets/images/agent/index/1.png`)" />
          <!--          <SvgIcon-->
          <!--            class="icon"-->
          <!--            name="agent-landing-1"-->
          <!--          />-->
        </van-col>
        <van-col span="12">
          <h3>{{ $t('信誉团队') }}</h3>
          <p>{{ $t('信誉团队-老牌专业团') }}</p>
          <p>{{ $t('队打造全新国际品牌') }}</p>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="12" class="padb">
          <h3>{{ $t('丰富多样化产品') }}</h3>
          <p>{{ $t('丰富多样化产品-产品质与') }}</p>
          <p>{{ $t('量的保障可满足国际化和本') }}</p>
          <p>{{ $t('土化市场需求') }}</p>
        </van-col>
        <van-col span="12" class="text-right">
          <img class="icon" :src="$getSrc(`/src/assets/images/agent/index/2.png`)" />
          <!--          <SvgIcon-->
          <!--            class="icon"-->
          <!--            name="agent-landing-2"-->
          <!--          />-->
        </van-col>
      </van-row>
      <van-row>
        <van-col span="10">
          <img class="icon" :src="$getSrc(`/src/assets/images/agent/index/3.png`)" />
          <!--          <SvgIcon-->
          <!--            class="icon"-->
          <!--            name="agent-landing-3"-->
          <!--          />-->
        </van-col>
        <van-col span="12">
          <h3>{{ $t('佣金丰厚') }}</h3>
          <p>{{ $t('致力于为会员和代理') }}</p>
          <p>{{ $t('提供共赢互惠的机制') }}</p>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="12" class="padb">
          <h3>{{ $t('专业协助') }}</h3>
          <p>{{ $t('24/7小时为您和会员提供专') }}</p>
          <p>{{ $t('业的服务提供方便快捷的提') }}</p>
          <p>{{ $t('款方式。') }}</p>
        </van-col>
        <van-col span="12" class="text-right">
          <img class="icon" :src="$getSrc(`/src/assets/images/agent/index/4.png`)" />
          <!--          <SvgIcon-->
          <!--            class="icon"-->
          <!--            name="agent-landing-4"-->
          <!--          />-->
        </van-col>
      </van-row>
      <van-row>
        <van-col span="10">
          <img class="icon" :src="$getSrc(`/src/assets/images/agent/index/5.png`)" />
          <!--          <SvgIcon-->
          <!--            class="icon"-->
          <!--            name="agent-landing-5"-->
          <!--          />-->
        </van-col>
        <van-col span="12">
          <h3>{{ $t('合规保障') }}</h3>
          <p>{{ $t('合法合规的操作流程') }}</p>
          <p>{{ $t('以及风控团队为您保驾护航。') }}</p>
        </van-col>
      </van-row>
      <img
        class="arrow2"
        @click="scrollTo('#how-start')"
        :src="$getSrc(`/src/assets/images/agent/index/arrow1@2x.png`)"
      />
    </div>
    <div
      class="landing-wrap-bg three"
      id="how-start"
      :class="{ lang: lang === 'vi' || lang === 'th' || lang === 'en' }"
      :style="{ 'background-image': `url(${$getSrc(`/src/assets/images/agent/index/bg3.png`)})`, 'background-size': 'cover' }"
    >
      <h2>{{ $t('如何开始') }}</h2>
      <van-grid :column-num="2" :border="false">
        <van-grid-item v-for="(item, key) in steps" :key="key">
          <!-- :style="`background-image: url(${$getSrc(`/src/assets/images/agent/index/start${key}.png`)});`" -->
          <div class="start-item">
            <img :src="$getSrc(`/src/assets/images/agent/index/icon${key + 1}.png`)" />
            <!--            <SvgIcon :name="`agent-icon${key + 1}`" />-->
            <span>{{ item.name }}</span>
          </div>
        </van-grid-item>
      </van-grid>
      <img
        class="arrow2"
        @click="scrollTo('#how-info')"
        :src="$getSrc(`/src/assets/images/agent/index/arrow2@2x.png`)"
      />
    </div>
    <div class="landing-wrap-bg four" id="how-info">
      <img class="single" :src="$getSrc(`/src/assets/images/agent/index/single.png`)" />
      <p>{{ subConfig.title }} {{ $t('2021年正式成立，致力于打造全新的安全、诚信、合规的国际一流博彩品牌。我们拥有支持中文、英文、泰语、越南多国语种365天24小时在线的最专业的团队，最优秀的技术和最雄厚的资金来实现可持续性长远发展计划') }}。</p>
      <p>{{ $t('产品的丰富性与创造性是我们满足客户对于生活与娱乐需求的核心价值观；与此同时，我们倡导健康游戏与适度博彩。{0}一直秉承用户至上的原则，期待与您一同共创美好的未来。', [subConfig.title]) }}</p>
      <img
        class="arrow2"
        @click="scrollTo('#how-table')"
        :src="$getSrc(`/src/assets/images/agent/index/arrow1@2x.png`)"
      />
    </div>
    <div class="landing-wrap-bg five" id="how-table">
      <h2>{{ $t('佣金计划') }}</h2>
      <p>{{ subConfig.title }} {{ $t('联盟佣金是按每月的活跃人数以及净盈利计算的。以下是佣金结构') }}</p>
      <table class="agent-table">
        <thead>
          <tr>
            <th class="value" colspan="2">{{ $t('级别') }}</th>
            <th class="value" colspan="2">{{ $t('阶梯盈亏要求') }}</th>
            <th class="value" colspan="2">{{ $t('佣金占比') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in agentTableData[currency]" :key="index">
            <td class="value" colspan="2">{{ index + 1 }}</td>
            <td class="value" colspan="2">{{ item.text }}</td>
            <td class="value" colspan="2">{{ item.percent }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import {
  inject, onMounted, reactive, ref, computed, watch,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { commissionsummary } from '@/api/agent.js';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
const subConfig = inject('subConfig');

const steps = ref([
  {
    name: global.$t('注册代理，把我身边任何客源立即加入{0}', [subConfig.title]),
  },
  {
    name: global.$t('审核开通-代理专员1对1指导 代理操作流程'),
  },
  {
    name: global.$t('对外推广-利用自身资源优势与平台专业信誉团队保障进行推广'),
  },
  {
    name: global.$t('赚取佣金 - 坐佣百万 指日可待'),
  },
]);
const arr = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
const store = inject('store');
const { agent } = store.state;
const { app } = store.state;
const isNavActive = ref(false);
const { lang } = store.state.app;

const currency = computed(() => {
  if (agent.isLogin) {
    return agent.userInfo?.inte_currency_id;
  }
  return app.regionData.inte_currency_id;
});

const agentTableData = ref({
  // 泰国
  3: [
    {
      text: global.$t('大于0，且有至少5个活跃会员'),
      percent: 35,
    },
    {
      text: global.$t('大于200,000,001，且有至少5个活跃会员'),
      percent: 40,
    },
    {
      text: global.$t('大于999,000,001，且有至少5个活跃会员'),
      percent: 45,
    },
    {
      text: global.$t('大于1,500,000,001，且有至少5个活跃会员'),
      percent: 50,
    },
  ],
  // 越南
  4: [
    {
      text: global.$t('大于0，且有至少5个活跃会员'),
      percent: 30,
    },
    {
      text: global.$t('大于200,001，且有至少10个活跃会员'),
      percent: 35,
    },
    {
      text: global.$t('大于900,001，且有至少15个活跃会员'),
      percent: 40,
    },
    {
      text: global.$t('大于1,500,001，且有至少20个活跃会员'),
      percent: 45,
    },
    {
      text: global.$t('大于3,000,000，且有至少25个活跃会员'),
      percent: 50,
    },
  ],
});

function onAgentClick() {
  if (agent.isLogin) {
    global.$router.push({ name: 'agentCenter' });
  } else {
    goRegister();
  }
}

function goForget() {
  global.$router.push({ name: 'agentForgetPassword' });
}
const isDark = computed(() => store.state.app?.darkTheme === 'dark');

function onScroll(event) {
  const { target } = event;
  isNavActive.value = target.scrollTop > 25;
}

function goRegister() {
  global.$popup({ tpl: 'AgentRegister' });
}

function scrollTo(name) {
  document.querySelector(name).scrollIntoView({ behavior: 'smooth' });
}
</script>

<style lang="less" scoped>
:deep(.van-nav-bar__content) {
  background: none;
  font-size: 26px;
}

:deep(.van-button) {
  border-radius: 0;
}
:deep(.van-button--success) {
  background-color: var(--bg-color-24c29a);
  height: 60px;
  margin-right: 20px;
}
:deep(.van-button--plain.van-button--primary) {
  // color: var(--font-color-ffffff);
  background: none;
  border: 2px solid var(--border-color-fff);
  height: 60px;
}
:deep(.van-nav-bar) {
  background: none;
}

.landing-wrap {
  flex-grow: 1;
  overflow-y: auto;
  background-color: var(--dark-bg-color-191919, var(--bg-color-ffffff));
  height: var(100% - 96px);

  p {
    margin: 15px 0;
  }

  &-tabs {
    width: 100%;
    margin-top: 52px;
  }
  &-navBar {
    width: 100%;
    order: -1;
    z-index: 20;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    padding: 30px;
    box-sizing: border-box;
    &.active {
      background-color: var(--theme-color);
    }
    .van-button {
      padding: 0 20px;
    }
    img {
      width: 242px;
      height: 36px;
    }
  }
  .logo {
    width: 100%;
    height: 600px;
  }
  &-bg {
    width: 100%;
    padding-top: 49px;
    box-sizing: border-box;
    height: auto;
    background-repeat: no-repeat;
    background-size: 100% auto;
    color: var(--font-color-ffffff);
    flex-shrink: 0;

    h2 {
      font-size: 64px;
      font-weight: 600;
      text-align: center;
      line-height: 0;
      margin-top: 130px;
    }
    p {
      line-height: 10px;
      margin-bottom: 120px;
      font-size: 40px;
      font-weight: 400;
    }
    &.first-section {
      padding-top: 136px;
      padding-bottom: 30px;
    }
    .main-title {
      margin: 0 0 2px 0;
      padding: 0;
      font-size: 64px;
      min-height: 96px;
      line-height: 64px;
      text-align: center;
    }
    .main-slogan {
      margin: 0;
      padding: 0;
      line-height: 64px;
      margin-bottom: 44px;
      text-align: center;
    }
    .people {
      width: 100%;
      height: auto;
    }
    .arrow2 {
      display: block;
      width: 56px;
      height: 64px;
      margin: 0 auto;
      margin-top: 20px;
      animation: move 1.5s linear infinite;
    }
    .start-item {
      width: 310px;
      height: 100%;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      padding: 104px 20px 30px 30px;
      box-sizing: border-box;
      position: relative;
      background: rgba(0, 0, 0, 0.3);
      border: 6px solid var(--border-color-fff);
      text-align: center;
      counter-reset: subsection;

      &::after {
        content: "" counter(section) "";
        counter-increment: section;
        position: absolute;
        width: 82px;
        height: 82px;
        background: var(--bg-color-ffffff);
        border-radius: 50%;
        font-size: 48px;
        font-weight: 700;
        text-align: center;
        line-height: 82px;
        color: var(--font-color-222930);
        left: 50%;
        margin-left: -41px;
        top: -41px;
      }

      img {
        width: 106px;
        height: auto;
        margin: 0 auto 46px;
      }
      span {
        line-height: 30px;
        font-size: 28px;
        display: block;
      }
    }

    .single {
      width: 100%;
      height: auto;
      margin: 46px 0 36px 0;
    }
  }
  .two {
    padding: 68px 32px 30px 42px;
    box-sizing: border-box;
    background-size: cover;
    h2 {
      text-align: center;
      font-size: 48px;
      font-weight: 800;
      color: var(--dark-fff, var(--font-color-222930));
      margin-top: 10px;
      margin: 10px 0 98px 0;
    }
    h3 {
      font-size: 40px;
      font-weight: 700;
      color: var(--dark-fff, var(--font-color-222930));
      margin-top: 10px;
      margin-bottom: 8px;
    }
    p {
      font-size: 28px;
      font-weight: 400;
      color: var(--dark-fff, var(--font-color-666666));
      line-height: 20px;
      margin-bottom: 0;
    }
  }
  .icon {
    width: 212px;
    height: 212px;
  }
  .van-row {
    width: 100%;
    align-items: center;
    margin-bottom: 44px;
    p {
      line-height: 1.2;
    }
  }
  .text-right {
    text-align: right;
  }
  .padb {
    padding-bottom: 30px;
  }
  .three {
    padding-bottom: 30px;
    counter-reset: section;
  }
  .four {
    padding: 0 40px;
    p {
      font-size: 32px;
      font-weight: 400;
      text-align: left;
      color: var(--dark-fff, var(--font-color-222930));
      line-height: 44px;
      margin-bottom: 0;

      &:nth-child(3) {
        margin-top: 40px;
      }
    }
  }
  .five {
    background: var(--dark-000, var(--bg-color-ecf0f6));
    padding-bottom: 48px;
    h2 {
      font-size: 38px;
      font-weight: 800;
      color: var(--dark-fff, var(--font-color-222930));
      margin-top: 36px;
    }
    p {
      font-size: 28px;
      font-weight: 400;
      color: var(--dark-fff, var(--font-color-929292));
      line-height: 42px;
      width: 558px;
      text-align: center;
      margin: auto;
      margin-bottom: 40px;
    }
  }
  table {
    border-collapse: collapse;
    display: table;
    border-spacing: 0;
    width: 92%;
    margin: auto;
    font-size: 22px;
    font-weight: 500;
    text-align: center;
    color: var(--dark-fff, var(--font-color-404040));
    margin-bottom: 40px;
    border: 2px solid var(--dark-666, var(--font-color-222930));
    td,
    th {
      text-align: center;
      vertical-align: middle;
      padding: 30px 0;
      box-sizing: border-box;
      font-size: 22px;
    }
    thead {
      background-color: var(--dark-bg-color-191919, var(--font-color-222930));
      color: var(--font-color-ffffff);
      tr {
        height: 100px;
        th {
          border-right: 2px solid var(--dark-666, var(--border-color-ecf0f6));
          &:last-of-type {
            border-right: none;
          }
        }
      }
    }
    tbody {
      tr {
        td:nth-child(1) {
          border-left: none;
        }
        td {
          height: 100px;
          border: 2px solid var(--dark-666, var(--font-color-222930));
          border-bottom: none;
          padding: 20px 10px;
          border-right: none;
        }
      }
    }
  }
  .agent-table {
    margin-bottom: 0 !important;
    .value {
      width: 42%;
      box-sizing: border-box;
      padding: 0 50px;
      &:nth-child(1) {
        padding: 0;
        width: 16%;
      }
    }
  }
  .commission-table {
    .value {
      width: 33.3%;
    }
  }

  :deep(.van-grid) {
    align-items: stretch;

    .van-grid-item__content {
      background: none;
    }
  }

  .first-section {
    background-color: var(--dark-1c1c1c);
  }
}

.lang {
  :deep(.van-grid-item) {
    &:nth-child(3) img {
      top: 40%;
    }
  }
}

@keyframes move {
  0% {
    transform: translateY(-15px);
  }
  50% {
    transform: translateY(15px);
  }
  100% {
    transform: translateY(-15px);
  }
}
</style>
