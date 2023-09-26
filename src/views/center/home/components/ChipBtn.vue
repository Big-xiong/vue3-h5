<template>
  <svg viewBox="0 0 29 31" xmlns="http://www.w3.org/2000/svg" :class="{animate: clicked}" @click="clicked = true">
		 M14.4,29.4C6.4,29.4,0,22.9,0,15.1S6.4,0.8,14.4,0.8s14.4,6.4,14.4,14.3S22.3,29.4,14.4,29.4" fill="none"/>
    <circle id="椭圆形" class="st1" cx="14.5" cy="15" r="13.5" fill="none"/>
    <path class="st3" d="M11,20c0.6,1,1.9,1.7,3.3,1.7c2,0,3.7-1.4,3.7-3.1c0-1.7-1.6-3.1-3.7-3.1h0.2c-2,0-3.7-1.4-3.7-3.1
	s1.6-3.1,3.7-3.1c1.3,0,2.4,0.5,3.1,1.4" fill="none" />
    <line class="st3" x1="14.3" y1="21.4" x2="14.3" y2="24.6"/>
    <line class="st3" x1="14.3" y1="6.4" x2="14.3" y2="9.6"/>
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

  circle, line, path {
    stroke-dasharray: 0;
    stroke-dashoffset: 0;
  }

  &.animate {
    circle, path {
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
      animation: outer linear 490ms 1 forwards;
    }
    line {
      stroke-dasharray: 10;
      stroke-dashoffset: 10;
      animation: outer linear 490ms 1 forwards;
    }
  }
}

circle {
  stroke: var(--svg-color, var(--bg-color-000000));
  stroke-width: 2;
}

line, path {
  stroke: var(--svg-color, var(--theme-color));
  stroke-width: 2;
}


@keyframes outer {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
