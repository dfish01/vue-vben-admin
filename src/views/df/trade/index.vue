<template>
  <TradeMobile v-if="getIsMobile" />
  <TradePc v-else />
</template>

<script lang="ts" setup>
  import TradeMobile from './trade_mobile.vue';
  import TradePc from './trade_pc.vue';
  import { useAppInject } from '/@/hooks/web/useAppInject';

  const { getIsMobile } = useAppInject();
</script>

<style scoped></style>
