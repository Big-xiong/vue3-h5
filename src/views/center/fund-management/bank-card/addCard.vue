<template>
  <AddBankCard
    v-if="!subConfig.isBankAreaSelect"
    type="center"
  />
  <AddBankAreaSelectCard
    v-else
    type="center"
  />
</template>

<script setup>
import { inject } from 'vue';
import AddBankCard from '@/components/AddCard.vue';
import AddBankAreaSelectCard from '@/components/AddCardSelect.vue';

const global = inject('global');
const subConfig = inject('subConfig');
</script>
