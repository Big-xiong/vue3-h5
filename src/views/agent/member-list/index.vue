<template>
    <div class="member-wrap">
      <header class="agent-subodinate-header">
        <van-image :src="$getSrc(`/src/assets/images/agent/sub-title.png`)"/>
        <span>{{$t('下级概览')}}</span>
      </header>
      <div class="list-body">
        <Outline/>
        <MemberList/>
      </div>
    </div>
</template>

<script setup>
import { inject } from 'vue';
import Outline from './Outline.vue';
import MemberList from './MemberList.vue';

const global = inject('global');
</script>

<style lang="less" scoped>
.member-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;

  .list-body {
    flex: 1;
    overflow-y: scroll;
  }
}
</style>
