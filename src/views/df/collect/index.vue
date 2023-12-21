<template>
  <CollectMobile v-if="getIsMobile" />
  <IndexPc v-else />
</template>

<script lang="ts" setup>
  import CollectMobile from './collect_mobile.vue';
  import IndexPc from './index_pc.vue';
  import CollectCategory from './collect_category.vue';
  import { useAppInject } from '/@/hooks/web/useAppInject';

  const { getIsMobile } = useAppInject();
</script>

<style scoped></style>
