<template>
  <div>
    <iframe
      src="https://chat.caifree.com"
      :style="{ height: 'calc(100vh - 53px)', width: '100%' }"
      sandbox="allow-same-origin allow-scripts"
    >
    </iframe>
  </div>
</template>

<script lang="ts" setup>
  //页面高度处理
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const url = ref('');
  onMounted(async () => {
    console.log(route.query.openUrl);
    url.value = route.query.openUrl ? route.query.openUrl : 'https://chat.caifree.com';
  });
</script>

<style scoped></style>
