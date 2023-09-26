<template>
  <Popup
    :show="show"
    closeable
    close-icon-position="top-right"
    position="bottom"
    round
    :title="$t('分享邀请下级')"
    @close="emit('close')"
  >
    <div class="share-popup-wrap">
      <ul>
        <li @click="emit('download')">
          <img :src="$getSrc('/src/assets/images/agent/share-save.png')" />
          <p>{{ $t("保存二维码") }}</p>
        </li>
        <li @click="emit('save')">
          <img :src="$getSrc('/src/assets/images/agent/share-image.png')" />
          <p>{{ $t("生成推广图") }}</p>
        </li>
      </ul>
    </div>
  </Popup>
</template>

<script setup>
import { inject, defineProps, defineEmits } from 'vue';
import Popup from '@/components/Popup/index.vue';

const global = inject('global');

defineProps({
  show: Boolean,
});

const emit = defineEmits(['close', 'download', 'save']);
</script>

<style lang="less" scoped>
.share-popup-wrap {
  width: 100%;
  background-color: var(--bg-color-282828);
  height: 300px;

  h2 {
    margin: 0;
    padding: 20px 0;
    text-align: center;
    color: var(--dark-fff, var(--font-color-222930));
    border-bottom: 2px solid rgba(var(--border-color-fff), 0.06);
    font-size: 36px;
    line-height: 67.5px;
    font-weight: normal;
    height: 67.5px;
  }

  img {
    width: 120px;
    height: 120px;
  }

  ul {
    margin-top: 20px;
    color: var(--font-color-000);
    display: flex;

    li {
      width: 33%;
      text-align: center;

      &:nth-child(1) {
        span {
          color: var(--theme-color);
        }
      }

      p {
        font-size: 30px;
      }

      div {
        width: 112.5px;
        background: var(--bg-color-343434);
        height: 105px;
        margin: auto;
        line-height: 105px;
        border-radius: 9px;
        margin-bottom: 22.5px;
        font-size: 30px;

        .iconfont {
          font-size: 67px;
        }
      }
    }
  }
}
</style>
