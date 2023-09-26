<template>
  <SvgIcon v-if="isSvg" :name="'sport-' + props.type" :class="[props.type]" />
  <div class="card" :class="[props.type === 'yellow' ? 'yellow' : 'red']" v-else></div>
</template>

<script setup>
import { computed } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
});

const isSvg = computed(() => ['startup', 'corner_ball', 'halftime', 'goal'].includes(props.type));
</script>

<style lang="less" scoped>
.goal {
  width: 18px;
  height: 18px;
}

.startup,
.halftime {
  width: 22px;
  height: 24px;
}

.corner_ball {
  width: 18px;
  height: 20px;
}

.yellow {
  background: #f7b500;
}

.red {
  background: #e1243b;
}

.card {
  width: 16px;
  height: 20px;
}

.svg-icon-wrap,
.card {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
}
</style>
