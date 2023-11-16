<template>
  <PublicMobile v-if="getIsMobile" />
  <PublicPc v-else />
</template>

<script lang="ts" setup>
  import PublicMobile from './public_mobile.vue';
  import PublicPc from './public_pc.vue';
  import { useAppInject } from '/@/hooks/web/useAppInject';

  const { getIsMobile } = useAppInject();
</script>

<style scoped></style>
