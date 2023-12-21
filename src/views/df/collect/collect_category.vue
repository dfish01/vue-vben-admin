<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    style="width: 240px"
    mode="inline"
  >
    <a-menu-item v-for="item in items" :key="item.key">
      <a-icon :type="item.icon" />
      <span>{{ item.label }}</span>
      <a-button @click="handleActions(item)">操作</a-button>
      <template #popup>
        <a-menu>
          <a-menu-item @click="handleButton1(item)">按钮1</a-menu-item>
          <a-menu-item @click="handleButton2(item)">按钮2</a-menu-item>
        </a-menu>
      </template>
    </a-menu-item>
  </a-menu>
</template>

<script lang="ts" setup>
  import { Loading } from '/@/components/Loading';
  import 'vue-easy-lightbox/external-css/vue-easy-lightbox.css';
  import VueEasyLightbox from 'vue-easy-lightbox';
  import VueLazyload from 'vue-lazyload';
  import { api as viewerApi } from 'v-viewer';
  import Icon from '/@/components/Icon/Icon.vue';
  import { SvgIcon } from '/@/components/Icon';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import { addSpaceTask, removeSpaceTask, allUserSpace } from '/@/api/df/workSpace';

  import { h, ref } from 'vue';
  import {
    MailOutlined,
    CalendarOutlined,
    AppstoreOutlined,
    SettingOutlined,
  } from '@ant-design/icons-vue';
  import type { MenuProps } from 'ant-design-vue';

  const items = ref([
    {
      key: 'idea1',
      icon: () => h(LightbulbOutlined),
      label: '创意点子',
      color: 'blue',
      children: [
        {
          key: 'idea1-1',
          icon: () => h(FileOutlined),
          label: '新产品创意',
        },
        {
          key: 'idea1-2',
          icon: () => h(ChatOutlined),
          label: '营销活动创意',
        },
        {
          key: 'idea1-3',
          icon: () => h(DocumentOutlined),
          label: 'UI/UX 设计创意',
        },
      ],
    },
    {
      key: 'idea2',
      icon: () => h(BookOutlined),
      label: '学习资料',
      color: 'green',
      children: [
        {
          key: 'idea2-1',
          icon: () => h(FileOutlined),
          label: '技术书籍',
        },
        {
          key: 'idea2-2',
          icon: () => h(ChatOutlined),
          label: '学习网站',
        },
        {
          key: 'idea2-3',
          icon: () => h(DocumentOutlined),
          label: '在线课程',
        },
      ],
    },
    {
      key: 'idea3',
      icon: () => h(HeartOutlined),
      label: '生活灵感',
      color: 'red',
      children: [
        {
          key: 'idea3-1',
          icon: () => h(FileOutlined),
          label: '旅行攻略',
        },
        {
          key: 'idea3-2',
          icon: () => h(ChatOutlined),
          label: '美食推荐',
        },
        {
          key: 'idea3-3',
          icon: () => h(DocumentOutlined),
          label: '电影影评',
        },
      ],
    },
  ]);
  const openKeys = ref(items.value.map((item) => item.key));
  const selectedKeys = ref([]);

  const handleButton1 = (item: MenuItem) => {
    console.log('点击按钮1', item);
  };

  const handleButton2 = (item: MenuItem) => {
    console.log('点击按钮2', item);
  };
</script>
<style scoped></style>
