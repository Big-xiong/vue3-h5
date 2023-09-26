<template>
  <svg
    aria-hidden="true"
    :class="['svg-icon-wrap', name]"
    :viewbox="viewbox"
  >
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'SvgIcon',
  props: {
    viewbox: {
      type: String,
      default: '0 0 60 60',
    },
    prefix: {
      type: String,
      default: 'icon',
    },
    color: String,
    name: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`);
    return { symbolId };
  },
});
</script>

<style lang="less">
.svg-icon-wrap {
  fill: var(--svg-color, var(--theme-color));
}
</style>
