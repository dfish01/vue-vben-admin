<template>
  <AccMobile v-if="getIsMobile" />
  <AccPc v-else />
</template>

<script lang="ts" setup>
  import AccMobile from './acc_mobile.vue';
  import AccPc from './acc_pc.vue';
  import { useAppInject } from '/@/hooks/web/useAppInject';

  const { getIsMobile } = useAppInject();
</script>

<style scoped></style>
