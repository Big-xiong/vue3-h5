<template>
  <svg viewBox="0 0 30 29" xmlns="http://www.w3.org/2000/svg" :class="{animate: clicked}" @click="clicked = true">
    <g id="首页" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g id="编组-7" transform="translate(1.000000, 1.500000)">
        <path
            d="M8.02882477,9.74872804 L13.5076489,16.601555 C13.8525265,17.0329225 14.4817974,17.1030364 14.9131649,16.7581588 C14.9710035,16.7119169 15.0235268,16.6593936 15.0697687,16.601555 L20.5485928,9.74872804 L20.5485928,9.74872804"
            id="inner"
            stroke-width="2.2" stroke-linecap="round" stroke-linejoin="bevel"></path>
        <path
            d="M14.5384615,0 L9.00572716,0 C8.09759703,1.58068527e-15 7.23834485,0.411359412 6.66887132,1.11874914 L1.50555552,7.53252676 C0.625426028,8.62580771 0.620936381,10.1831866 1.49474783,11.2815238 L11.6554024,24.0529582 C12.6869302,25.3495369 14.5742334,25.5644032 15.8708122,24.5328755 C16.0474237,24.3923674 16.2076161,24.232379 16.3483489,24.0559465 L26.596488,11.2081666 C27.4281441,10.1655446 27.4716416,8.69907416 26.7032443,7.60899243 L22.235996,1.27156042 C21.673985,0.474267278 20.7594221,4.26170202e-15 19.7839567,0 L14.5384615,0 L14.5384615,0 Z"
            id="outer"
            stroke-width="2"></path>
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
