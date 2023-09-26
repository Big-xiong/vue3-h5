<template>
  <svg viewBox="0 0 30 27" xmlns="http://www.w3.org/2000/svg" :class="{animate: clicked}" @click="clicked = true">
    <line x1="18.6843087" y1="13" x2="24.5945557" y2="13" id="recharge-inner" stroke="#000" stroke-width="2.8"
          stroke-linecap="round"></line>
    <path
        d="M26,1 C26.8284271,1 27.5784271,1.33578644 28.1213203,1.87867966 C28.6642136,2.42157288 29,3.17157288 29,4 L29,4 L29,22 C29,22.8284271 28.6642136,23.5784271 28.1213203,24.1213203 C27.5784271,24.6642136 26.8284271,25 26,25 L26,25 L4,25 C3.17157288,25 2.42157288,24.6642136 1.87867966,24.1213203 C1.33578644,23.5784271 1,22.8284271 1,22 L1,22 L1,4 C1,3.17157288 1.33578644,2.42157288 1.87867966,1.87867966 C2.42157288,1.33578644 3.17157288,1 4,1 L4,1 Z"
        fill="none"
        id="recharge-outer" stroke-width="2"></path>
    <line x1="1.7878202" y1="7.48960426" x2="28.2300904" y2="7.48960426" stroke="#000"
          id="recharge-line"
          stroke-width="2"></line>
  </svg>
</template>

<script setup>
import {ref} from "vue";

const clicked = ref(false)
</script>

<style lang="less" scoped>

svg {
  width: 54px;
  height: 60px;
  #recharge-inner, #recharge-inner, #recharge-line {
    stroke-dasharray: 0;
    stroke-dashoffset: 0;
  }

  &.animate {
    #recharge-outer {
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
    }

    #recharge-line {
      stroke-dasharray: 40;
      stroke-dashoffset: 40;
    }

    #recharge-inner {
      stroke-dasharray: 10;
      stroke-dashoffset: 10;
    }

    #recharge-inner, #recharge-outer, #recharge-line {
      animation: outer linear 490ms 1 forwards;
    }

  }
}

#recharge-outer {
  stroke: var(--bg-color-000000);
}

#recharge-line {
  stroke: var(--bg-color-000000);
}

#recharge-inner {
  stroke: var(--svg-color, var(--theme-color));
}


@keyframes outer {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
