<template>
  <div class="question-wrap">
    <div class="list-wrap">

      <van-cell
        is-link
        v-for="(item, index) in list"
        :key="index"
        :title="$t(item.title)"
        class="item"
        @click="
          router.push({
            path: '/help/detail/0',
            query: { id: item.id, source: route.query.source || '' }
          })
        "></van-cell>
    </div>
    <div class="help-wrap-tip">
      {{ $t('没有找到解决办法') }}？联系
      <span @click="$openKefu">{{ $t('专属客服') }}</span>
    </div>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { inject, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { aplist } from '@/api/help';

const global = inject('global');

const list = ref([]);

const router = useRouter();
const route = useRoute();

const { loading: navLoading } = useRequest(() => aplist({ LOADING: true }), {
  onSuccess(result) {
    list.value = result.list;
  },
});

</script>

<style lang="less" scoped>
.list-wrap {
  background: var(--bg-color-282828);
  border-radius: 8px;
  box-sizing: border-box;
}

.item {
  height: 100px;
  font-size: 28px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: var(--dark-fff, var(--font-color-333333));
  border-bottom: 2px solid var(--dark-333, var(--border-color-00001));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0;
  &:last-child {
    border: none;
  }
}

.kefu-button {
  width: 100%;
  margin-top: 30px;
}
.help-wrap-tip {
  font-size: 28px;
  font-weight: 400;
  text-align: center;
  color: var(--dark-fff, var(--font-color-666666));
  line-height: 40px;
  text-align: center;
  margin-top: 20px;
  span {
    text-decoration: underline;
    color: var(--font-color-24c29a);
  }
}
</style>
