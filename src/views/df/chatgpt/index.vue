<template>
  <ChatgptMobile v-if="getIsMobile" />
  <ChatgptPc v-else />
</template>

<script lang="ts" setup>
import ChatgptMobile from './chatgpt_mobile.vue';
import ChatgptPc from './chatgpt_pc.vue';
import { useAppInject } from '/@/hooks/web/useAppInject';

const { getIsMobile } = useAppInject();
</script>

<style scoped></style>
