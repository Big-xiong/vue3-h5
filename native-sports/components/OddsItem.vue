<template>
  <div
    class="info-item"
    @click.stop="onClick"
  >
    <SvgIcon
      name="sport-odds_lock"
      v-if="!hasPrice || marketStatus !== 'running'"
    />
    <template v-else>
      <span>{{ title }}</span>
      <span :class="status">{{ price }}</span>
    </template>
  </div>
</template>

<script setup>
import SvgIcon from '../../src/components/SvgIcon.vue';

const props = defineProps({
  title: [String, Number],
  price: Number,
  marketStatus: String,
});

const status = ref('');

const hasPrice = computed(() => !isNaN(Number(props.price)));

const emit = defineEmits(['bet']);

function onClick() {
  if (hasPrice.value && props.marketStatus === 'running') {
    emit('bet');
  }
}

watch(() => props.price, (newVal, oldVal) => {
  status.value = newVal > oldVal ? 'up' : 'down';
});
</script>

<style lang="less" scoped>
.up {
  color: #20B892 !important;
}

.down {
  color: #FF0000 !important;
}

.svg-icon-wrap {
  width: 14px;
  height: 18px;
  fill: var(--dark-fff, var(--font-color-0A0A0A))
}
</style>
