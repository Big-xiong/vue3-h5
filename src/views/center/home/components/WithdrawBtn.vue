<template>
  <svg viewBox="0 0 30 29" xmlns="http://www.w3.org/2000/svg" :class="{animate: clicked}" @click="clicked = true">
    <g id="首页" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g id="取款" transform="translate(0.000000, 0.500000)">
        <path
            d="M24,1 C24.8284271,1 25.5784271,1.33578644 26.1213203,1.87867966 C26.6642136,2.42157288 27,3.17157288 27,4 L27,4 L27,22 C27,22.8284271 26.6642136,23.5784271 26.1213203,24.1213203 C25.5784271,24.6642136 24.8284271,25 24,25 L24,25 L4,25 C3.17157288,25 2.42157288,24.6642136 1.87867966,24.1213203 C1.33578644,23.5784271 1,22.8284271 1,22 L1,22 L1,4 C1,3.17157288 1.33578644,2.42157288 1.87867966,1.87867966 C2.42157288,1.33578644 3.17157288,1 4,1 L4,1 Z"
            id="outer" stroke-width="2"></path>
        <path
            d="M26.0965678,9.70620428 L19.3465678,9.70620428 C17.5516424,9.70620428 16.0965678,11.1612788 16.0965678,12.9562043 C16.0965678,14.7511297 17.5516424,16.2062043 19.3465678,16.2062043 L26.0965678,16.2062043 L26.0965678,16.2062043"
            id="inner" stroke-width="2.3"></path>
      </g>
    </g>
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
    #outer {
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
    }

    #inner {
      stroke-dasharray: 50;
      stroke-dashoffset: 50;
    }

    #inner, #outer {
      animation: outer linear 490ms 1 forwards;
    }

  }
}

#outer {
  stroke: var(--bg-color-000000);
}

#inner {
  stroke: var(--svg-color, var(--theme-color));
}


@keyframes outer {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
