<template>
    <router-view/>
</template>

<script setup>
import { inject, reactive } from 'vue';

const global = inject('global');
</script>

<style lang="less" scoped>
</style>
