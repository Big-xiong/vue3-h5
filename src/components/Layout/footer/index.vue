<template>
  <div class="index-footer-wrap">
    <van-tabbar v-model="active" :safe-area-inset-bottom="true">
      <van-tabbar-item v-for="({ name, title }, index) in routeMap" :key="name" icon="home-o"
        @click="onChange(name, index)">
        <template #icon>
          <div class="icon-wrap">
            <div class="circle" :class="{ active: index === active }"></div>
            <template v-if="isImg">
              <van-image :class="{ active: index === active }" class="icon-img" v-show="index === active"
                :src="$getSrc(`/src/assets/images/tabBar/bet_tab_${iconList[name]}_selected.png`)" />
              <van-image :class="{ active: index === active }" class="icon-img" v-show="index !== active"
                :src="$getSrc(`/src/assets/images/tabBar/bet_tab_${iconList[name]}_normal.png`)" />
            </template>
            <SvgIcon v-else :class="{ active: index === active }" class="icon-img" :name="iconList[name]" />
          </div>
        </template>
        {{ $t(title) }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import SvgIcon from '@/components/SvgIcon.vue';

const props = defineProps({
  isImg: {
    type: Boolean,
    default: false,
  },
  iconList: {
    type: Object,
    default: () => ({
      home: 'home-tab',
      promos: 'discount-tab',
      notice: 'notice-tab',
      user: 'center-tab',
    }),
  },
});

const route = useRoute();
const router = useRouter();
const routeMap = route.matched[0]?.children.map((item) => ({
  name: item.name,
  title: item?.meta?.title ?? '',
}));

const active = ref(getRouteIndex());

watch(() => route.name, () => {
  active.value = getRouteIndex()
})

function getRouteIndex() {
  return routeMap.findIndex((item) => item.name === route.name)
}

function onChange(name, index) {
  active.value = index;
  router.push({ name });
}
</script>

<style lang="less" scoped>
.index-footer-wrap {
  width: 100%;
  order: 999;

  .van-tabbar-item--active {
    color: var(--theme-color);
    // background: var(--van-tabbar-item-active-background);
    background: var(--dark-bg-color-191919, var(--van-tabbar-background-color));
  }

  .van-tabbar {
    position: initial !important;
    background: var(--dark-bg-color-191919,
        var(--van-tabbar-background-color)) !important;

    &[class*="van-hairline"]::after {
      display: none;
    }
  }

  .icon-wrap {
    position: relative;
    width: 40px;
    height: 40px;

    .circle {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: var(--theme-color);
      opacity: 0;

      &.active {
        animation: circle-scale 0.25s linear;
      }
    }
  }

  .icon-img {
    position: absolute;
    top: 0;
    width: 42px;
    height: 42px;
    transform: scale(1);

    &.active {
      fill: var(--theme-color);
      animation: img-scale 0.4s linear;
    }
  }
}

@keyframes img-scale {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.6);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes circle-scale {
  0% {
    transform: scale(0);
    opacity: 0;
  }

  80% {
    transform: scale(1);
    opacity: 0.5;
  }

  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
