<template>
  <IndexPc style="overflow-y: hidden" />
</template>

<script lang="ts" setup>
  import IndexMobile from './index_mobile.vue';
  import IndexPc from './index_pc.vue';
  import { useAppInject } from '/@/hooks/web/useAppInject';

  const { getIsMobile } = useAppInject();
</script>

<style scoped></style>
