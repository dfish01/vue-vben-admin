<template>
  <LinkMobile v-if="getIsMobile" />
  <LinkMobile v-else />
</template>

<script lang="ts" setup>
  import LinkMobile from './link_mobile.vue';
  // import LinkPc from './link_pc.vue';
  import { useAppInject } from '/@/hooks/web/useAppInject';

  const { getIsMobile } = useAppInject();
</script>

<style scoped></style>
