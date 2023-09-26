<template>
  <div class="sport-layout-wrap">
    <router-view
      v-slot="{ Component }"
      :key="lang"
    >
      <keep-alive :include="include">
        <component
          :is="Component"
          @routeLeave="onLeave"
          :key="route.name"
        />
      </keep-alive>
    </router-view>
  </div>
  <NavBar />
</template>

<script setup>
import NavBar from '/native-sports/components/Layout/NavBar.vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { useStore } from 'vuex';

const route = useRoute();
const store = useStore();
const lang = computed(() => store.state.app.lang);

const routeName = computed(() => route.name);
const include = ref([]);

function onLeave() {
  include.value = [];
}

onBeforeRouteLeave((to) => {
  if (to.name === 'sportDetail') {
    include.value = ['sport-home,sport-search'];
  } else {
    include.value = [];
  }
});

onDeactivated(() => {
});

onActivated(() => {
  console.log('active', route.name);
});

</script>

<style lang="less" scoped>
.sport-layout-wrap {
  flex: 1;
  transform: translateZ(0);
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}
</style>

<script>
export default {
  name: 'Layout',
};
</script>
