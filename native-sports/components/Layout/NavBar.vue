<template>
  <div class="sport-nav-bar-wrap">
    <van-tabbar
      v-model="active"
    >
      <van-tabbar-item
        v-for="(item, i) in curentSportRouteMap[0].children"
        :key="i"
        @click="_router.push({ name: item.name })"
      >
        <div :class="['tabbar-wrap', { 'tabbar-wrap-active': item.name === _route.name }]">
          <SvgIcon :name="`sport-tab-${item.name}`" />
          <span>{{ $t(item.meta.title) }}</span>
        </div>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { inject, watch, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
const { routes: curentSportRouteMap } = global.$router.options;
const _router = useRouter();
const _route = useRoute();
const active = ref(0);

watch(() => _route, (val) => {
  active.value = curentSportRouteMap[0].children.findIndex((item) => val.name === item.name);
}, { deep: true, immediate: true });

</script>

<style lang="less" scoped>
.sport-nav-bar-wrap {
  box-shadow: 0px -10px 28px 0px var(--footer-shadow-color);
  z-index: 1;

  .van-tabbar {
    height: 88px;
    position: initial !important;
  }

  .tabbar-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
      color: var(--nav-bar-default-color);
      font-size: 20px;
    }

    .svg-icon-wrap {
      width: 38px;
      height: 38px;
      margin-bottom: 4px;
    }

    &-active {
      span {
        color: var(--nav-bar-active-color);
      }

      .svg-icon-wrap {
        fill: var(--theme-color);
      }
    }
  }
}
</style>
