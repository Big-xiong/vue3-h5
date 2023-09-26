<template>
  <div class="material-wrap">
    <div class="list-wrap" v-for="(item, i) in materialList" :key="i">
      <img :src="item.pic" />

      <div class="info">
        <p>{{ $t(item.title) }}</p>
        <p>
          {{ $t('图片类型：') }}
          <span>
            {{
              sourceTypes[item.pic_type]
            }}
          </span>
        </p>
        <p class="image-info">
          <span class="size">
            {{ $t("图片尺寸") }}：
            <span>{{ sizeTypes[item.size] }}</span>
          </span>

          <span class="time">{{ item.updated_at }}</span>
        </p>
      </div>
      <van-button class="create" @click="share(item.pic)">{{ $t("生成") }}</van-button>
    </div>

    <van-empty
      v-show="!materialList.length"
      class="custom-image"
      :image="$getSrc('/src/assets/images/agent/empty@2x.png')"
      :description="$t('暂无数据')"
    />
  </div>
</template>

<script setup>
import { defineProps, inject } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';

const props = defineProps({
  materialList: {
    type: Array,
    default: () => [],
  },
  sizeTypes: {
    type: Object,
    default: () => ({}),
  },
  sourceTypes: {
    type: Object,
    default: () => ({}),
  },
});

const global = inject('global');

function share(url) {
  global.$popup({ tpl: 'AgentMaterialDownload', url });
}
</script>

<style lang="less" scoped>
.material-wrap {
  margin-top: 80px;
}
.list-wrap {
  width: 100%;
  height: 150px;
  padding-bottom: 22px;
  border-bottom: 2px solid;
  padding-top: 20px;
  position: relative;
  margin-top: 30px;

  p {
    margin: 0;
    font-size: 24px;
  }

  img {
    width: 150px;
    height: 128px;
  }

  .image-info {
    display: flex;
    justify-content: space-between;
    .size span {
      color: var(--dark-fff, var(--font-color-222930));
    }
    .time {
      color: var(---dark-fff, var(--font-color-999999));
    }
  }

  .info {
    color: var(--font-color-999999);
    width: 75%;
    float: right;
    p:first-of-type {
      font-size: 32px;
      font-weight: 500;
      color: var(--dark-fff, var(--font-color-222930));
    }
    p:nth-child(2) {
      margin-top: 18px;
      span {
        color: var(--dark-fff, var(--font-color-222930));
      }
    }
  }

  .create {
    min-width: 130px;
    height: 60px;
    border-radius: 8px;
    text-align: center;
    line-height: 60px;
    border: 2px solid var(--theme-color);
    color: var(--theme-color);
    position: absolute;
    right: 0;
    top: 30px;
  }
}
</style>
