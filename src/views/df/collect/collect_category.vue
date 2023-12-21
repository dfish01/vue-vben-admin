<template>
  <div>
    <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      style="width: 256px"
      mode="inline"
    >
      <!-- <a-menu-item key="" icon="MailOutlined" title="默认分类">
        <span> 默认分类 </span>
      </a-menu-item> -->

      <div v-for="categoryItem in categoryList" :key="categoryItem.key">
        <a-sub-menu v-if="categoryItem.children" :key="categoryItem.key" icon="AppstoreOutlined">
          <template #title>
            <div class="menu-item-content">
              <span>{{ categoryItem.title }}</span>
              <a-dropdown :placement="placement">
                <a-button type="text"><SvgIcon name="menu2" /></a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                        删除分类
                      </a>
                    </a-menu-item>
                    <a-menu-item>
                      <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                        修改分类
                      </a>
                    </a-menu-item>
                    <a-menu-item>
                      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                        新增子分类
                      </a>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </template>
          <a-menu-item
            v-for="childItem in categoryItem.children"
            :key="childItem.key"
            icon="MailOutlined"
            title="Navigation One"
          >
            <div class="menu-item-content">
              <span>{{ childItem.title }}</span>
              <a-dropdown :placement="placement">
                <a-button type="text"> <SvgIcon name="menu2" /></a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                        删除分类
                      </a>
                    </a-menu-item>
                    <a-menu-item>
                      <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                        修改分类
                      </a>
                    </a-menu-item>
                    <!-- <a-menu-item v-if="childItem.parentId === 0">
                      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                        新增子分类
                      </a>
                    </a-menu-item> -->
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item v-else :key="categoryItem.key" icon="MailOutlined" title="Navigation One">
          <div class="menu-item-content">
            <span>{{ categoryItem.title }}</span>
            <a-dropdown :placement="placement">
              <a-button type="text"> <SvgIcon name="menu2" /></a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                      删除分类
                    </a>
                  </a-menu-item>
                  <a-menu-item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                      修改分类
                    </a>
                  </a-menu-item>
                  <a-menu-item v-if="childItem.parentId === 0">
                    <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                      新增子分类
                    </a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </a-menu-item>
      </div>
    </a-menu>
  </div>
</template>

<script lang="ts" setup>
  import { h, ref } from 'vue';
  import {
    MailOutlined,
    CalendarOutlined,
    AppstoreOutlined,
    SettingOutlined,
  } from '@ant-design/icons-vue';
  import type { MenuTheme } from 'ant-design-vue';
  import { SvgIcon } from '/@/components/Icon';
  import Icon from '/@/components/Icon/Icon.vue';

  const theme = ref<MenuTheme>('dark');
  const selectedKeys = ref(['1']);
  const openKeys = ref(['sub1']);
  const categoryList = ref([
    {
      key: '1',
      icon: () => h(MailOutlined),
      label: 'Navigation One',
      title: 'Navigation One',
    },
    {
      key: '2',
      icon: () => h(CalendarOutlined),
      label: 'Navigation Two',
      title: 'Navigation Two',
    },
    {
      key: 'sub1',
      icon: () => h(AppstoreOutlined),
      label: 'Navigation Three',
      title: 'Navigation Three',
      children: [
        {
          key: '3',
          label: 'Option 3',
          title: 'Option 3',
        },
        {
          key: '4',
          label: 'Option 4',
          title: 'Option 4',
        },
        {
          key: 'sub1-2',
          label: 'Submenu',
          title: 'Submenu',
          children: [
            {
              key: '5',
              label: 'Option 5',
              title: 'Option 5',
            },
            {
              key: '6',
              label: 'Option 6',
              title: 'Option 6',
            },
          ],
        },
      ],
    },
    {
      key: 'sub2',
      icon: () => h(SettingOutlined),
      label: 'Navigation Four',
      title: 'Navigation Four',
      children: [
        {
          key: '7',
          label: 'Option 7',
          title: 'Option 7',
        },
        {
          key: '8',
          label: 'Option 8',
          title: 'Option 8',
        },
        {
          key: '9',
          label: 'Option 9',
          title: 'Option 9',
        },
        {
          key: '10',
          label: 'Option 10',
          title: 'Option 10',
        },
      ],
    },
  ]);
  const changeTheme = (checked: boolean) => {
    theme.value = checked ? 'dark' : 'light';
  };
</script>

<style scoped>
  .menu-item-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
</style>
