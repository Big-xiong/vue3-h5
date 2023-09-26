<template>
      <deposit type="center"/>
</template>

<script setup>
import { inject } from 'vue';
import Deposit from '@/components/Deposit.vue';

const global = inject('global');
</script>
