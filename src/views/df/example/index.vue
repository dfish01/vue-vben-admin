<template>
  <MjJobMobile v-if="getIsMobile" />
  <MjJob v-else />
</template>

<script lang="ts" setup>
  // import ExampleMobile from './example_mobile.vue';
  import MjJobMobile from './mj_job_mobile.vue';
  // import ExamplePc from './example_pc.vue';
  import MjJob from './mj_job.vue';
  import { useAppInject } from '/@/hooks/web/useAppInject';

  const { getIsMobile } = useAppInject();
</script>

<style scoped></style>
