<template>
  <div class="landing-wrap">
    <img :src="$getSrc('/src/assets/images/landing/text.png')" />
    <div class="btn-wrap">
      <div class="btn" @click="goRegister"></div>
      <div class="btn" @click="goLogin"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();

const queryParams = {
  id: 'Hj3w396b',
  utm_source: 'SEM',
  utm_campaign: 'vietnam',
};

onMounted(() => {
  console.log('getLang');
  store.commit('app/SET_LANG', 'vi');
});

const router = useRouter();

function goLogin() {
  router.push({
    name: 'login',
    query: queryParams,
  });
}

function goRegister() {
  router.push({
    name: 'register',
    query: queryParams,
  });
}

</script>

<style lang="less">
.landing-wrap {
  background: url("@/assets/images/landing/bg.png");
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;

  img {
    width: 660px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: (93px * 2) + 50px + 40px;
  }

  .btn-wrap {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 50px;
    .btn {
      width: 510px;
      height: 93px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      background-image: url("@/assets/images/landing/btn2.png");
      cursor: pointer;

      &:nth-child(1) {
        background-image: url("@/assets/images/landing/btn1.png");
        margin-bottom: 30px;
        animation: scale-animation 1s infinite ease-in-out;
      }
    }
  }
}

.app-wrap {
  padding-top: 0;
}

@keyframes scale-animation {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.3);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(1);
  }
}
</style>
