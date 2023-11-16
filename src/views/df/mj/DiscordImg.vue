<template>
  <div class="clearfix">
    <a-upload
      v-model:file-list="fileList"
      action="http://localhost:8093/inner/upload/base/addUploadImage"
      list-type="picture-card"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < 4">
        <plus-outlined v-if="loading" />
        <div style="margin-top: 8px">Upload</div>
      </div>
    </a-upload>

    <a-modal open="true" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
  <a-input-group compact>
    <a-input v-model:value="defualutCopyUrl" style="width: calc(80%)" />
    <a-tooltip title="复制图片链接">
      <a-button>
        <template #icon><CopyOutlined /></template>
      </a-button>
    </a-tooltip>
  </a-input-group>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { CopyOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue';

  import { message } from 'ant-design-vue';
  import type { UploadChangeParam, UploadProps } from 'ant-design-vue';

  const defualutCopyUrl = ref<string>('');
  const loading = ref<boolean>(false);
  const cdnUrls = ref({});

  function getBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const previewVisible = ref(false);
  const previewImage = ref('');
  const previewTitle = ref('');

  const fileList = ref<UploadProps['fileList']>([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ]);

  const handleCancel = () => {
    previewVisible.value = false;
    previewTitle.value = '';
    console.log(fileList);
  };

  const handlePreview = async (file: UploadProps['fileList'][number]) => {
    console.log(11111);
    console.log(fileList.value);
    console.log(cdnUrls.value);
    defualutCopyUrl.value = cdnUrls.value[file.uid];
    if (!file.url && !file.preview) {
      file.preview = (await getBase64(file.originFileObj)) as string;
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
  };

  const handleChange = (info: UploadChangeParam) => {
    // if (info.file.status === 'uploading') {
    //   loading.value = true;
    //   return;
    // }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      // const base64Url = getBase64(info.file.originFileObj);
      const response = info.file.response;
      loading.value = false;
      if (response.code == '0000') {
        cdnUrls.value[info.file.uid] = response.data;
      } else {
        message.error(response.msg);
      }
    }
    if (info.file.status === 'error') {
      loading.value = false;
      message.error('upload error');
    }
  };
</script>

<style scoped>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card i {
    color: #999;
    font-size: 32px;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
