<template>
  <ShopMobile v-if="getIsMobile" />
  <ShopPc v-else />
</template>

<script lang="ts" setup>
  import ShopMobile from './shop_mobile.vue';
  import ShopPc from './shop_pc.vue';
  import { useAppInject } from '/@/hooks/web/useAppInject';

  const { getIsMobile } = useAppInject();
</script>

<style scoped></style>
