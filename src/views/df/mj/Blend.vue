<template>
  <div style="text-align: left" ref="formRef">
    <div :style="{ height: `calc(${contentHeight}px`, overflow: 'auto', width: '100%' }">
      <a-upload
        v-model:file-list="fileList"
        :before-upload="beforeUpload"
        list-type="picture-card"
        @preview="handlePreview"
        @change="handleChange"
        style="display: flex; align-items: flex-start; justify-content: flex-start"
      >
        <div v-if="fileList.length < 5">
          <plus-outlined />
          <div style="margin-top: 8px">上传图片</div>
        </div>
      </a-upload>

      <a-divider orientation="left" />

      <a-row style="margin-top: 10px">
        <a-col span="6">
          <a-tooltip title="这个属性代表最终生成图片的比例">
            <a-tag class="quality-tag tag-no-right-border" color="default">尺 寸</a-tag>
          </a-tooltip>
        </a-col>
        <a-col span="18">
          <a-select
            style="width: 100%; height: 32px"
            v-model:value="compRender.dimensionSelector.value"
            :size="compRender.dimensionSelector.size"
            :options="compRender.dimensionSelector.options"
          />
        </a-col>
      </a-row>
      <a-row style="margin-top: 10px">
        <a-col span="6">
          <a-tooltip title="niji机器人在处理二次元方面有很大的优势~">
            <a-tag class="quality-tag tag-no-right-border" color="default">机器人</a-tag>
          </a-tooltip>
        </a-col>
        <a-col span="18">
          <a-select
            style="width: 100%; height: 32px"
            v-model:value="compRender.robotSelect.value"
            :size="compRender.robotSelect.size"
            :options="compRender.robotSelect.options"
          />
        </a-col>
      </a-row>
      <a-row style="margin-top: 10px">
        <a-col span="6">
          <a-tooltip title="不指定账号的话，随机根据账号现有负载情况选择资源最空的一个账号">
            <a-tag class="quality-tag tag-no-right-border" color="default">执行账号</a-tag>
          </a-tooltip>
        </a-col>
        <a-col span="18">
          <a-select
            @change="handleSetting('userAccountId', textToImgForm.useAccountId)"
            style="width: 100%; height: 32px"
            v-model:value="textToImgForm.useAccountId"
            :size="compRender.accountSelector.size"
            :options="compRender.accountSelector.options"
          />
        </a-col>
      </a-row>
      <a-row style="margin-top: 10px">
        <a-col span="6">
          <a-tooltip title="这个基本参数我就不说了，慢->快->超快！！！">
            <a-tag class="quality-tag tag-no-right-border" color="default"
              >执行模式 <ExclamationCircleOutlined class="icon-hint" /> </a-tag
          ></a-tooltip>
        </a-col>
        <a-col span="18">
          <a-select
            @change="handleSetting('mode', textToImgForm.mode)"
            v-model:value="textToImgForm.mode"
            style="width: 100%; height: 32px"
          >
            <!-- <a-select-option value="">不设置</a-select-option> -->
            <a-select-option value="relax">休闲模式</a-select-option>
            <a-select-option value="fast">快速模式</a-select-option>
            <a-select-option value="turbo">涡轮模式</a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </div>
    <div>
      <a-button class="bottom-button" type="primary" @click="startDrawing" ref="button"
        >开始混图任务</a-button
      >
    </div>
    <!-- 上传图片预览 -->
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted, toRefs, unref } from 'vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { message, UploadProps, Upload } from 'ant-design-vue';
  import { addDrawTask } from '/@/api/df/drawTask';
  import { AddDrawTaskParams } from '/@/api/df/model/drawTaskModel';
  import type { UploadFile } from 'ant-design-vue/es/upload/interface';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import { queryList } from '/@/api/df/account';
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();
  const handleSetting = (key, value) => {
    const setting = {};
    setting[key] = value;
    userStore.syncSetting(setting);
  };

  //初始化加载
  const props = defineProps({
    spaceId: {
      type: String,
      default: '',
    },
  });

  const { spaceId } = toRefs(props);

  //页面高度处理
  const button = ref(null);
  const formRef = ref();
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 0);
  const offsetHeightRef = ref(0);
  const subtractHeightRefs = ref([button]);

  // 使用hook
  const { contentHeight } = useContentHeight(
    computed(() => true),
    formRef,
    unref(subtractHeightRefs), // 使用 unref 获取数组值
    unref(substractSpaceRefs),
    upwardSpace,
    offsetHeightRef,
  );

  const onSearchAccountList = async () => {
    const response = await queryList({
      state: 'normal',
      ownerFlag: '',
      accountName: '',
      current: 1,
      pageSize: 999,
    });

    // 使用 map 方法转换数组
    const transformedList = response.records.map((item) => ({
      label: item.discordUserName,
      value: item.id,
    }));

    // 如果您想在转换后的数组前面添加一个特定的对象，可以使用以下方法：
    const finalList = [{ label: '随机', value: '' }, ...transformedList];
    compRender.accountSelector.options = finalList;
  };

  const textToImgForm = reactive({
    invokeTimes: 1,
    useAccountId: '',
    isPublic: false,
    mode: 'relax',
  });
  onMounted(async () => {
    //查询可用账户
    onSearchAccountList();
    //初始化偏好
    const getPersonalSetting = userStore.getPersonalSetting;
    console.log('getPersonalSetting ' + getPersonalSetting);
    if (getPersonalSetting) {
      textToImgForm.mode = getPersonalSetting.mode;
      const isAvaliable = compRender.accountSelector.options.some((obj) =>
        obj.value.includes(getPersonalSetting.userAccountId),
      );
      if (isAvaliable) {
        textToImgForm.useAccountId = getPersonalSetting.userAccountId;
      } else {
        userStore.syncSetting({ userAccountId: '' });
      }
    }
  });

  const emit = defineEmits(['startLoading', 'endLoading']);
  const previewVisible = ref(false);
  const previewImage = ref('');
  const previewTitle = ref('');
  const handleCancel = () => {
    previewVisible.value = false;
    previewTitle.value = '';
  };
  const handlePreview = async (file: UploadProps['fileList'][number]) => {
    if (!file.url && !file.preview) {
      file.preview = (await getBase64(file.originFileObj)) as string;
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
  };

  const fileList = ref<UploadProps['fileList']>([]);
  const base64Images = ref<{ base64Content: string; height: number; width: number; uid: string }[]>(
    [],
  );

  const compRender = reactive({
    robotSelect: {
      value: '936929561302675456',
      size: 'default',
      options: [
        { label: 'Midjourney', value: '936929561302675456' },
        { label: 'niji・journey', value: '1022952195194359889' },
        // { label: 'insightface', value: '936929561302675456' },
      ],
    },
    accountSelector: {
      value: '',
      size: 'default',
      options: [
        { label: '随机', value: '' },
        // { label: 'niji・journey', value: 'niji・journey' },
        // { label: 'insightface', value: 'insightface' },
      ],
    },
    dimensionSelector: {
      value: 'SQUARE',
      size: 'default',
      options: [
        //PORTRAIT(2:3); SQUARE(1:1); LANDSCAPE(3:2)
        { label: 'PORTRAIT(2:3)', value: 'PORTRAIT' },
        { label: 'SQUARE(1:1)', value: 'SQUARE' },
        { label: 'LANDSCAPE(3:2)', value: 'LANDSCAPE' },
      ],
    },
  });
  // 新增函数：获取图片的宽度和高度
  async function getImageDimensions(base64: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = base64;
    });
  }
  function getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('-----------------');
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log('File successfully read as data URL'); // 日志输出
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        console.error('Error reading the file:', error); // 错误输出
        reject(error);
      };
    });
  }

  const beforeUpload = async (file: File) => {
    try {
      // 判断是否为图片
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        throw new Error('只能上传图片文件！');
      }
      // 获取图片文件的大小
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        throw new Error('图片大小不能超过5MB！');
      }

      const base64 = await getBase64(file);
      // 获取并存储图片的尺寸
      const dimensions = await getImageDimensions(base64);
      base64Images.value.push({
        base64Content: base64,
        height: dimensions.height,
        width: dimensions.width,
        uid: file.uid, // 存储文件的 uid
      });
    } catch (error) {
      console.error('Error converting to Base64:', error);
      // 弹出异常消息
      message.error(error.message);
      //移除这个文件
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handleChange = async (info: { file: UploadFile; fileList: UploadFile[] }) => {
    console.log('handleChange'); // 日志输出
    if (info.file.status === 'removed') {
      // 文件被删除
      const remainingFiles = info.fileList.map((f) => f.uid);
      base64Images.value = base64Images.value.filter((img) => remainingFiles.includes(img.uid));
    }
  };

  const startDrawing = async () => {
    try {
      emit('startLoading');
      const addTaskParam: AddDrawTaskParams = {
        spaceId: spaceId.value,
        refAccountId: textToImgForm.useAccountId,
        channel: 'MJ',
        priority: 0,
        // refTaskId: null,
        privacyMode: 'Y',
        mode: textToImgForm.mode,
        commandType: 'BLEND',
        invokeTimes: textToImgForm.invokeTimes,
        prompt: {
          base64Array: base64Images.value,
          commandType: 'BLEND',
          dimensionsStr: compRender.dimensionSelector.value,
          bootId: compRender.robotSelect.value,
        },
      };
      await addDrawTask(addTaskParam);
      message.success('混图任务已开始');
      fileList.value = [];
      base64Images.value = [];
    } catch (error) {
      message.error('混图任务启动失败');
    } finally {
      emit('endLoading');
    }
  };
</script>

<style scoped>
  /* 媒体查询 */
  @media (min-width: 600px) {
    .fixed-bottom-button {
      right: 20px;
      width: auto;
    }
  }

  .bottom-button {
    right: 8px;
    bottom: 0;
    width: 100%;

    /* background: #f0f0f0; */
    height: 53px;
  }

  .description {
    /* 这里可以添加样式来改变操作说明的外观 */
  }

  /* 这个是固定在导航栏下面，但是左右不好计算 */
  .fixed-bottom-button {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 10%;
    height: 10vh;
    text-align: left;
  }

  .form-container {
    padding-bottom: 50px; /* 为固定在底部的按钮留出空间 */
  }

  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card i {
    color: #999;
    font-size: 32px;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  .quality-tag {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 32px;
    margin-right: 0;
    font-size: 15px;
  }

  .tag-no-right-border {
    border-right: none;
  }

  .no-preview-icon >>> .ant-upload-list-item-actions .anticon-eye {
    display: none;
  }
</style>
