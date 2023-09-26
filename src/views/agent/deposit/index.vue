<template>
    <deposit type="agent"/>
</template>

<script setup>
import { inject } from 'vue';
import Deposit from '@/components/Deposit.vue';

const global = inject('global');
</script>
