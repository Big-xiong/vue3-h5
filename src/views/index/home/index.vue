<template>
  <div>
    <Home />
    <Notify />
    <!-- <teleport :to="$store.state.app.teleportContainer"> -->
    <DaliyDuty />
    <!-- </teleport> -->
    <SeoProtocol />
  </div>
</template>

<script setup>
import DaliyDuty from '@/components/DaliyDuty.vue';
import Home from './components/home.vue';
import Notify from './components/Notify.vue';
import SeoProtocol from './components/SeoProtocol.vue';
</script>
