<template>
  <div class="layout agent-bg-top">
    <div class="agent-content">
      <van-image :src="$getSrc(`/src/current_project/assets/images/agent/home/banner.png`)" />
      <div class="btn-wrap">
        <!-- <van-button
          v-if="!agent.isLogin"
          class="add"
          type="primary"
          @click="$router.push({ name: 'agentLogin' })"
        >{{ $t('登录') }}</van-button>-->
        <van-button
          class="add"
          type="primary"
          @click="onAgentClick"
        >{{ agent.isLogin ? $t('代理中心') : $t('马上加入') }}</van-button>
      </div>
      <!-- <van-button
        type="primary"
        class="add"
        @click="gotoAgentCenter"
      >
        {{ $t("代理中心") }}
      </van-button>-->
    </div>
    <!--<LoginModal :isShow="isShowLogin" @onCancel="isShowLogin = false" /> -->
  </div>
</template>

<script setup>
import { inject, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
/* import LoginModal from '../components/LoginModal.vue'; */

const isShowLogin = ref(false);

const global = inject('global');

const router = useRouter();
const store = inject('store');
const { agent } = store.state;

function onAgentClick() {
  if (agent.isLogin) {
    global.$router.push({ name: 'agentCenter' });
  } else {
    global.$router.push({ name: 'agentLogin' });
  }
}

const tipsData = reactive([
  {
    title: global.$t('高能返佣'),
    pic: '/src/current_project/assets/images/agent/home/agentHome1@3x.png',
  },
  {
    title: global.$t('最优质的品质'),
    pic: '/src/current_project/assets/images/agent/home/agentHome2@3x.png',
  },
  {
    title: global.$t('丰富的游戏支持'),
    pic: '/src/current_project/assets/images/agent/home/agentHome3@3x.png',
  },
]);

if (location.href.includes('isLogin')) {
  isShowLogin.value = true;
}
</script>

<style scoped lang="less">
.agent-bg-top {
  width: 100%;
  box-sizing: border-box;

  .agent-content {
    > .van-image {
      display: block;
      width: 100%;
      margin-top: 80px;
    }

    .add-agent {
      color: var(--theme-color);
      margin: 60px auto 0;
      width: 448px;
      height: 90px;
      font-size: 64px;
      font-weight: 500;
      line-height: 90px;
      white-space: nowrap;
    }

    .begin-success {
      color: var(--theme-color);
      margin: 20px auto 0;
      height: 56px;
      font-size: 40px;
      font-weight: 500;
      line-height: 56px;
      text-align: center;
    }

    .agent-tip {
      margin-top: 66px;
      display: flex;
      justify-content: flex-start;

      .item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .img {
          width: 132px;
          height: 132px;
          background-position: center;
          background-size: contain;
          background-repeat: no-repeat;
        }

        span {
          margin-top: 20px;
          text-align: center;
          height: 40px;
          font-size: 28px;
          font-weight: 400;
          color: var(--theme-color);
          line-height: 40px;
        }
      }
    }

    .add {
      width: 240px;
      height: 80px;
      text-align: center;
      display: block;
      border-radius: 4px;
      font-size: 32px;
      font-weight: 500;
      color: var(--font-color-ffffff);
      line-height: 80px;
      margin: 30px auto 0;
    }
  }
}
</style>
