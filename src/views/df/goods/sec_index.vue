<template>
  <GoodsMobile v-if="getIsMobile" />
  <GoodsPc v-else />
</template>

<script lang="ts" setup>
  import GoodsMobile from './sec_goods_mobile.vue';
  import GoodsPc from './sec_goods_pc.vue';
  import { useAppInject } from '/@/hooks/web/useAppInject';

  const { getIsMobile } = useAppInject();
</script>

<style scoped></style>
