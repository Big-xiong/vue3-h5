<template>
  <div class="avaswipe">
    <div id="swiper-container1">
      <div class="swiper-pagination" id="pagination">
        <ul>
          <li class="swiper-pagination-bullet" :class="{ 'swiper-pagination-bullet-active': activeIdx === index }"
            v-for="(item, index) in navListParse" :key="index" @click="setNavs(index)">
            <i :class="activeIdx === index ? 'scale-up' : 'scale-down'"
              :style="{ 'background-image': `url(${$getSrc(`/src/assets/images/home/tab-style/home_icon_${item.id}_${activeIdx === index ? 'selected' : 'normal'}@3x.png`)})` }" />
            <!-- :style="{ 'background-image': `url(${$getSrc(`/src/assets/images/home/tab-style/home_icon_${item.id}_selected@3x.png`)})` }" -->
            <span>{{
                item.name
            }}</span>
          </li>
        </ul>
      </div>
      <div id="swiper-dom" v-clickOutside|touchmove="stopBs">
        <div>
          <div v-for="(item, index) in navListParse" :ref="t => setRefs(t, index)" :key="index"
            class="swiper-container swiper-container2"
            :style="{ paddingBottom: index === navListParse.length - 1 ? `${footerTempHeight}px` : '0' }">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <List :cateId="item?.id ?? 1" :loading="!platformgameidsv3.length" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BetterScroll from '@better-scroll/core';
import { useInViewport, useTimeout, useInterval } from '@/utils/hooks';
import List from './game/List.vue';

const props = defineProps({
  nav: {
    type: Array,
    default: () => Array.from({ length: 7 }, () => ({})),
  },
});

const $store = inject('store');
const { app } = $store.state;
const activeIdx = ref(0);

const platformgameidsv3 = computed(() => $store.state?.game?.platformGameIdsv3);
const navList = computed(() => platformgameidsv3.value?.map?.((item) => ({ name: item.name, id: item.game_cate_id })));
const navListParse = computed(() => (navList.value.length ? navList.value : props.nav));

let bs = null;
const scrollY = ref(0);
const footerTempHeight = ref(0);
onMounted(() => {
  nextTick(() => {
    const homeWrapDom = document.querySelector('.home-wrap');

    const footerTemp = document.querySelector('.footer-temp');
    if (footerTemp) {
      footerTempHeight.value = footerTemp.offsetHeight;
      const selfDom = document.querySelector('.avaswipe');
      selfDom.style.height = `${selfDom.offsetHeight + footerTemp.offsetHeight}px`;
    }

    bs = new BetterScroll('#swiper-dom', {
      scrollbar: true,
      momentum: true,
      click: true,
      observeDOM: true,
      bounce: {
        top: true,
        bottom: true,
      },
      probeType: 3,
    });

    bs.on('beforeScrollStart', () => {
      bs.refresh();
    });

    bs.on('scrollEnd', () => {
      bs.refresh();
    });

    bs.on('scroll', ({ y }) => {
      scrollY.value = -y;
      homeWrapDom.scrollTo({ left: 0, top: y < 0 ? 1000 : 0 });
    });
    watch(() => navListParse.value, bsCheck, { deep: true, immediate: true });
  });
  setHeight();
});

onBeforeUnmount(() => {
  bs.destroy();
  bs = null;
});

function bsCheck() {
  const length = navListParse.value.map((item) => Object.keys(item).length).filter(Boolean).length;
  bs[length ? 'enable' : 'disable']?.();
  return length;
}

watch(() => app.showDownload, setHeight);

function setHeight() {
  nextTick(() => {
    const avaswipeHeight = document.querySelector('.avaswipe')?.offsetHeight;
    const swiperDom = document.querySelector('#swiper-dom');
    if (swiperDom.offsetHeight < avaswipeHeight) {
      swiperDom.style.height = `${avaswipeHeight}px`;
    }
    bs.refresh();
  });
}

function stopBs() {
  bs.stop();
}

const refs = ref([]);
function setRefs(target, index) {
  refs.value[index] = target;
}

const viewport = useInViewport(refs);

let isScrollLock = false;
const { run, stop } = useTimeout(() => {
  isScrollLock = false;
}, 800);

function setNavs(index) {
  if (!bsCheck()) return;
  if (isScrollLock) {
    stop();
  }
  activeIdx.value = index;
  const firstTop = refs.value[0].offsetTop;
  const difference = !firstTop || firstTop !== 10 ? 0 : firstTop;
  bs.scrollTo(0, -refs.value[index].offsetTop + difference, 500);
  isScrollLock = true;
  run();
}

watch([() => viewport, scrollY], () => {
  if (isScrollLock) return;
  const targetIndex = viewport.value.map((item) => item.value).lastIndexOf(true);
  if (targetIndex >= 0) activeIdx.value = scrollY.value <= 0 ? 0 : targetIndex;
}, { deep: true });

</script>

<style scoped lang="less">
.avaswipe {
  position: relative;
  display: flex;

  .swiper-container {
    margin-bottom: 4px;
  }
}

#swiper-container1 {
  flex-grow: 1;
  display: flex;
  justify-content: flex-start;

  >.swiper-pagination {
    left: 0;
    top: -14px;
    position: initial;

    ul {
      display: flex;
      flex-direction: column;

      li {
        &:last-child {
          margin-bottom: 0 !important;
        }
      }
    }

    .swiper-pagination-bullet {
      background-image: url("@img/home/tab-style/normal.png") !important;
      background-size: contain !important;
      background-color: transparent !important;
      background-repeat: no-repeat !important;
      background-position: center !important;

      &-active {
        background-image: url("@img/home/tab-style/active.png") !important;
      }

    }
  }

  #swiper-dom {
    display: flex;
    flex-direction: column;
    margin-left: var(--home-game-item-left, 16px);
    width: 100%;
    height: 668px;
    border-radius: 16px 16px 0 0;
    overflow: hidden;
  }

  .swiper-container2 {
    transform: translate3d(0, 0, 0);
    overflow: hidden;

    >.swiper-wrapper {
      transform: translate3d(0, 0, 0);
    }
  }

  :deep(.games-wrap) {
    .game-item {
      min-height: var(--home-game-item-min-height, 212px);
      background: none;
      box-shadow: none;
      width: 100%;
      position: relative;
      overflow: hidden;
    }

    .game-item.large {
      line-height: 0;
      overflow: hidden;

      &.gray-scal {
        filter: grayscale(100%);
      }

      .van-image {
        position: initial !important;
        width: 100%;
        height: inherit;
      }
    }

    .game-info {
      position: absolute;
      width: 100%;
      height: 100%;

      .flow-wrapper {
        left: 50px;
        top: 150px;
        position: absolute;

        .flow {
          width: auto;
          color: var(--font-color-9C4F12);
          border-radius: 18px;
          font-weight: 500;
          padding: 0 15px;
          font-size: 18px;
          background-size: contain;
          background-repeat: no-repeat;
          height: 38px !important;
          line-height: 38px;
        }
      }

      h3 {
        position: absolute;
        left: 50%;
        margin-left: -75px;
        top: 115px;
        font-size: 30px;
        color: var(--font-color-333333) !important;
      }
    }
  }
}

.scale-up {
  animation: scale-up linear 0.5s;
}

.scale-down {
  animation: scale-down linear 0.5s;
}

@keyframes scale-up {
  0% {
    transform: scale(0.8);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes scale-down {
  from {
    transform: scale(1.2);
  }

  to {
    transform: scale(1);
  }
}

.avaswipe {
  padding: 0 28px 0;
  box-sizing: border-box;
  flex-shrink: 0;
  flex-grow: 1;

  .swiper-container {
    width: 100%;
    box-sizing: border-box;

    &:last-child {
      margin-bottom: 20px;
    }
  }

  .swiper-container2 .swiper-slide {
    font-size: 18px;
    height: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: block;
    // line-height: 100px;
    color: var(--font-color-white);
  }

  #swiper-container1 {
    >.swiper-pagination {
      top: -9px;

      .swiper-pagination-bullet {
        width: 150px;
        height: 72px;
        position: relative;
        background-color: var(--amx-home-game-left-bg, var(--bg-color-1f2d40)) !important;
        border-radius: 8px;
        opacity: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 0 8px;
        box-sizing: border-box;

        &:focus {
          outline: none;
        }

        span {
          font-size: 26px;
          color: var(--amx-game-list-left-color, var(--font-color-877868));
        }

        &-active {
          background: var(--theme-color);

          span {
            color: var(--amx-game-list-left-active-color, var(--font-color-fff));
          }

          .svg-icon-wrap {
            fill: var(--font-color-fff);
          }
        }

        img,
        .svg-icon-wrap {
          width: 36px;
          height: 36px;
          margin-right: 12px;
          fill: var(--theme-color);
        }
      }
    }

    >.swiper-wrapper {
      width: calc(100% - 135px) !important;
    }
  }
}
</style>
