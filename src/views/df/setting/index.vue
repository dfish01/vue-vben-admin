<template>
  <SettingMobile v-if="getIsMobile" />
  <SettingPc v-else />
</template>

<script lang="ts" setup>
  import SettingMobile from './setting_mobile.vue';
  import SettingPc from './settings_pc.vue';
  import { useAppInject } from '/@/hooks/web/useAppInject';

  const { getIsMobile } = useAppInject();
</script>

<style scoped></style>
