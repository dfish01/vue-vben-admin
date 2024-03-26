<template>
<iframe
      src="http://192.168.3.10:1002/"
      :style="{ height: 'calc(100vh - 53px)', width: '100%' }"
      sandbox="allow-same-origin allow-scripts"
    >
    </iframe>
</template>

<script lang="ts" setup>
  import ChatgptMobile from './chatgpt_mobile.vue';
  import ChatgptPc from './chatgpt_pc.vue';
  import { useAppInject } from '/@/hooks/web/useAppInject';

  const { getIsMobile } = useAppInject();
</script>

<style scoped></style>
