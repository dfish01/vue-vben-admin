<template>
  <div>
    <!-- <iframe
      src="https://www.midjourney.com/home"
      :style="{ height: 'calc(100vh - 53px)', width: '100%' }"
      sandbox="allow-same-origin allow-scripts"
    > -->
    <!-- </iframe> -->
  </div>
</template>

<script lang="ts" setup>
  //页面高度处理
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const url = ref('');
  onMounted(async () => {
    // console.log(route.query.openUrl);
    // url.value = route.query.openUrl ? route.query.openUrl : 'https://chat.caifree.com';
    downloadVideo();
  });

  const downloadVideo = async () => {
    window.location.href = 'http://172.16.110.158:8001/file/video/hhh.mp4?t=123';
    // const videoUrl = 'http://172.16.110.158:8001/file/video/hhh.mp4?t=123'; // 视频URL
    // const fileName = 'hhh.mp4'; // 下载时的文件名

    // const a = document.createElement('a');
    // a.href = videoUrl;
    // a.download = fileName;
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
  };
</script>

<style scoped></style>
