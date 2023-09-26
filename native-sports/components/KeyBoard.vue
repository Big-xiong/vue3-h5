<template>
  <div
    class="keyboard-wrap"
    @click="onClick"
  >
    <div class="keyboard-row">
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>
        +
        <em>¥</em>100
      </div>
    </div>
    <div class="keyboard-row">
      <div>4</div>
      <div>5</div>
      <div>6</div>
      <div>
        +
        <em>¥</em>120
      </div>
    </div>
    <div class="keyboard-row">
      <div>7</div>
      <div>8</div>
      <div>9</div>
      <div>
        +
        <em>¥</em>500
      </div>
    </div>
    <div class="keyboard-row">
      <div>0</div>
      <div></div>
      <div
        class="delete"
        @click.stop="onDelete"
      >
        <img
          :src="$getSrc('/src/assets/native-sports/images/delete.png')"
          alt=""
        >
      </div>
      <div>
        +
        <em>¥</em>1000
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import SvgIcon from '../../src/components/SvgIcon.vue';

const amount = ref('');

function onDelete() {
  if (amount.value.length) {
    amount.value = amount.value.slice(0, amount.value.length - 1);
  }
}

const emit = defineEmits(['input']);

watch(() => amount.value, () => emit('input', amount.value));

function clear() {
  amount.value = '';
}

defineExpose({
  clear,
});

function onClick(event) {
  let innerText = event.target?.innerText ?? '';
  if (/[(wrap)|(row)]/.test(event.target.className) || !innerText) {
    return;
  }

  if (innerText === '¥') {
    innerText = event.target.parentNode.innerText;
  }

  innerText = innerText.replace('+\n¥\n', '');

  if (innerText === '.') {
    return;
    // if (amount.value.includes('.') || !amount.value.length) {
    //   return;
    // }

    // if (amount.value.length && amount.value.slice(-1) !== '.') {
    //   return amount.value += '.';
    // }
  }

  innerText = Number(innerText);

  if (innerText < 10) {
    amount.value += innerText.toString();
  } else if (amount.value.slice(-1) === '.') {
    amount.value = (Number(amount.value.slice(0, amount.value.length - 1)) + innerText).toString();
  } else if (!amount.value.length) {
    amount.value = innerText.toString();
  } else {
    amount.value = (Number(amount.value) + innerText).toString();
  }
}
</script>

<style lang="less">
.keyboard-wrap {
  margin-bottom: 30px;

  .keyboard-row {
    display: flex;
    margin-top: 28px;
    justify-content: space-between;

    div {
      width: 144px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 68px;
      border-radius: 8px;
      border: 2px solid var(--dark-4E4C5D, var(--bg-color-e6ebf1));
      font-size: 32px;
      color: var(--dark-fff, var(--font-color-0A0A0A));

      img {
        width: 48px;
        height: 24px;
      }

      &:last-child {
        margin-left: 54px;

        em {
          font-size: 0.6em;
          transform: translateY(4px);
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
