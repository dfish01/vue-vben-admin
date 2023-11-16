<template>
  <CollectMobile v-if="getIsMobile" />
  <CollectPc v-else />
</template>

<script lang="ts" setup>
  import CollectMobile from './collect_mobile.vue';
  import CollectPc from './collect_pc.vue';
  import { useAppInject } from '/@/hooks/web/useAppInject';

  const { getIsMobile } = useAppInject();
</script>

<style scoped></style>
