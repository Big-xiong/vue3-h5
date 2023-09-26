<template>
  <div class="manual-wrap">
    <div class="item" v-for="item in list" :key="item.title">
      <div class="title">{{ item.game_cate_name }}</div>
      <div class="list">
        <div v-for="subItem in item.list" :key="subItem.id">
          <a
            @click="
              router.push({
                path: '/help/detail/1',
                query: route.query.source
                  ? { id: subItem.id, source: route.query.source }
                  : { id: subItem.id },
              })
            "
          >{{ subItem.title }}</a>
        </div>
      </div>
    </div>
    <div class="btn">
      <van-button type="success" @click="$openKefu">{{ $t('在线人工客服') }}</van-button>
    </div>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { inject, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { gamemanual } from '@/api/help';

const global = inject('global');

const list = ref([]);
const router = useRouter();
const route = useRoute();

useRequest(() => gamemanual(), {
  onSuccess(result) {
    list.value = result;
  },
});
</script>

<style lang="less" scoped>
.item {
  .title {
    line-height: 104px;
    height: 104px;
    font-weight: 500;
    font-size: 32px;
    color: var(--dark-fff, var(--font-color-000000));
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10px;

    div {
      width: 25%;
      display: flex;
      padding: 10px;
      box-sizing: border-box;
      height: 108px;

      a {
        flex: 1;
        text-align: center;
        background-color: var(--bg-color-21c199);
        border-radius: 8px;
        line-height: 88px;
        color: var(--font-color-ffffff);
        font-size: 24px;
        overflow: hidden;
      }
    }
  }
}
:deep(.van-button--success) {
  font-size: 32px;
  background-color: var(--theme-color, var(--bg-color-21c199));
  width: 100%;
  height: 90px;
}
.btn {
  width: 100%;
  margin: 100px auto 60px auto;
  text-align: center;
}
</style>
