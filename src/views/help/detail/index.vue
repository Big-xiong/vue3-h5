<template>
  <div class="help-detail-wrap">
    <van-nav-bar left-arrow @click-left="router.go(-1)" :title="title" v-if="$store.state.app.source !== 'app'" />

    <div class="main" v-html="content" />
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { aqdetail, gamemanualdetail } from '@/api/help';

const global = inject('global');
const { app } = global.$store.state;

const content = ref('');
const title = ref('');
const route = useRoute();
const router = useRouter();

useRequest(
  () => {
    const requests = [aqdetail, gamemanualdetail];

    const { query, params } = route;

    return requests[params.type]({
      id: query.id,
    });
  },
  {
    onSuccess(result) {
      title.value = result.title;
      content.value = result.content;
    },
  },
);
</script>

<style lang="less" scoped>
.help-detail-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;

  :deep(.van-nav-bar__title) {
    color: var(--font-color-ffffff);
  }

  :deep(.van-icon) {
    color: var(--font-color-ffffff) !important;
  }
}

.main {
  flex: 1;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 30px 30px;
  font-size: 32px;
  font-weight: 400;
  line-height: 44px;
  color: var(--dark-fff, var(--font-color-222930));

  :deep(p) {
    text-align: justify;
    font-size: 22px;
    margin-bottom: 20px;
  }

  :deep(img) {
    width: 100%;
  }

  :deep(ul) {
    margin-bottom: 20px;

    li {
      text-align: justify;
      font-size: 22px;
    }
  }

  :deep(ol) {
    margin-bottom: 20px;

    li {
      text-align: justify;
      font-size: 22px;
    }
  }

  img {
    width: 400px;
    display: block;
    margin: 0 auto;
    margin-top: 180px;
    margin-bottom: 108px;
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    border: 2px solid var(--border-color-353435);

    td,
    th {
      padding: 10px;
      border: 2px solid var(--border-color-353435);
    }
  }
}
</style>
