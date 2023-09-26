<template>
  <main class="chat-action-wrap">
    <section class="send-msg-wrap">
      <SvgIcon
        name="sport-talk"
        @click="emit('chat')"
        class="talk"
      />
      <input
        :placeholder="$t('我来说两句')"
        v-model="message"
        type="text"
      />
      <SvgIcon
        @click="sendMessage"
        v-if="message.length"
        name="sport-send"
        class="send"
      />
    </section>
  </main>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { Toast } from 'vant';
import { ref } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';
import { postMessage } from '../../../api/home';

const route = useRoute();
const message = ref('');

const emit = defineEmits(['chat', 'send']);

const sendMessage = async () => {
  await postMessage({
    barrage: message.value,
    merchant_no: '19001',
    match_id: route.query.id,
    LOADING: true,
  });
  Toast('发送成功');
  emit('send');
  message.value = '';
};

</script>

<style lang="less" scoped>
.chat-action-wrap {
  height: 120px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--card-bg-color, var(--bg-color-ffffff));
  border-top: solid 2px var(--dark-4E4C5D, var(--bg-color-eee));
  padding: 0 32px;

  .send-msg-wrap {
    height: 64px;
    flex: 1;
    background: var(--dark-chat-input-141319, var(--bg-color-F9FAFB));
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;

    input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 24px;
      font-weight: 400;
      color: var(--font-color-848A9B);
      background-color: transparent;
      line-height: 34px;
    }
  }
}

.talk {
  width: 34px;
  height: 32px;
  margin-right: 18px;
}

.send {
  width: 28px;
  height: 24px;
}
</style>
