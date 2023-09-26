<template>
  <main class="chat-room-wrap">
    <VSNavBar :data="props.data" class="nav-bar" />

    <div class="chat-header">
      <span>{{ $t('聊天室') }}</span>
      <img
        :src="$getSrc('/src/assets/native-sports/images/info.png')"
        alt
        @click="Toast($t('任何联系均非官方，联系造成的任何经济损失平台概不负责！'))"
      />
      <SvgIcon @click="emit('close')" name="sport-close" />
    </div>
    <div class="message-body">
      <div class="message" v-for="(item, index) in messageData?.data" :key="index">
        <span class="user-name">{{ item.username.slice(0, 2) + '***' + item.username.slice(-2) }}:</span>
        <span class="text">{{ item.barrage }}</span>
      </div>
      <div class="bottom"></div>
    </div>
    <ChatAction @send="onSend" />
  </main>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useRequest } from 'ahooks-vue';
import { Toast } from 'vant';
import VSNavBar from '../../../components/VSNavBar.vue';
import SvgIcon from '../../../../src/components/SvgIcon.vue';
import ChatAction from './ChatAction.vue';
import { getMessage } from '../../../api/home';

const route = useRoute();

const emit = defineEmits(['close']);

const { data: messageData, run: getData } = useRequest(() => getMessage({
  merchant_no: '19001',
  page: 1,
  pagesize: 20,
  match_id: route.query.id,
  LOADING: true,
}), {
  manual: false,
});

function onSend() {
  getData();
}

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

</script>

<style lang="less">
.chat-header {
  display: flex;
  color: var(--dark-fff, var(--font-color-0A0A0A));
  padding-left: 32px;
  padding-right: 32px;
  align-items: center;
  justify-content: start;
  width: 100%;
  background: var(--card-bg-color, var(--bg-color-fff));
  height: 100px;

  img {
    width: 24px;
    height: 24px;
    margin-left: 10px;
  }

  .svg-icon-wrap {
    fill: var(--dark-fff, var(--font-color-0A0A0A));
    width: 25px;
    margin-left: auto;
    height: 25px;
  }
}

.chat-room-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;

  .message-body {
    flex: 1;
    width: 100%;
    overflow-y: auto;
    padding: 18px 32px 0 32px;
    font-size: 24px;

    .message {
      margin-bottom: 16px;
    }

    .user-name {
      color: var(--font-color-848A9B);
    }

    .text {
      margin-left: 24px;
      color: var(--dark-fff, var(--font-color-0A0A0A));
    }

    .bottom {
      height: 18px;
      width: 100%;
    }
  }

  .nav-bar {
    width: 100%;
    background: var(--gradient-bg-color);
  }
}
</style>
