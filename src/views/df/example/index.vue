<template>
  <ExampleMobile v-if="getIsMobile" />
  <ExamplePc v-else />
</template>

<script lang="ts" setup>
  import ExampleMobile from './example_mobile.vue';
  import ExamplePc from './example_pc.vue';
  import { useAppInject } from '/@/hooks/web/useAppInject';

  const { getIsMobile } = useAppInject();
</script>

<style scoped></style>
