<template>
  <!-- <keep-alive> -->
  <!-- <router-view :key="lang" /> -->
  <!-- </keep-alive> -->

  <router-view
    v-slot="{ Component }"
    :key="lang"
  >
    <keep-alive include="Layout">
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <BetPopup />
  <ParlayBtn />
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import BetPopup from './components/BetPopup.vue';
import ParlayBtn from './components/ParlayBtn.vue';

const store = useStore();
const lang = computed(() => store.state.app.lang);
const route = useRoute();

const { mainUser } = store.state;

store.commit('app/SET_DARK_THEME', 'dark');
store.dispatch('game/getNoticeList');
store.dispatch('mainUser/getUserInfo')
  .then(() => {
    if (mainUser.userInfo.id.toString() === localStorage.getItem('sport_member_id')) {
      const storage = {
        odds: localStorage.getItem('multiple-odds'),
      };

      const odds = storage.odds ? JSON.parse(storage.odds) : [];
      store.commit('app/SET_MULTIPLE_ODDS', { odds });
    } else {
      localStorage.removeItem('multiple-odds');
    }

    localStorage.setItem('sport_member_id', mainUser.userInfo.id);
  });

</script>

  <style
    lang="less"
    scoped
  >
  .app-switch-wrap {
    position: fixed;
    bottom: 100px;
    z-index: 999;
  }
  </style>
