<template>
  <bank-add-card :type="'agent'" />

  <AddBankCard
    v-if="!subConfig.isBankAreaSelect"
    type="agent"
  />
  <AddBankAreaSelectCard
    v-else
    type="agent"
  />
</template>

<script setup>
import { inject } from 'vue';
import AddBankCard from '@/components/AddCard.vue';
import AddBankAreaSelectCard from '@/components/AddCardSelect.vue';

const subConfig = inject('subConfig');
</script>
