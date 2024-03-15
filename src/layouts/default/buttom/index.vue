<template>
  <div>
    <div class="bottom-menu" :class="getHeaderClass">
      <!-- <a-card style="height: 56px" :bodyStyle="{ padding: '3px 1px' }">
        <a-segmented
          block
          v-model:value="tabValue"
          :options="tabOptions"
          style="width: 100%"
          @change="changeTab"
        >
          <template #label="{ payload }">
            <div style="align-items: center" @click="toDetail(payload.url)">
              <div style="height: 16px">
                <Icon :icon="payload.icon" style="margin: 0" aria-hidden="true" />
              </div>
              <div style="height: 28px">
                {{ payload.subTitle }}
              </div>
            </div>
          </template>
        </a-segmented>
      </a-card> -->

      <a-menu mode="horizontal" :selectedKeys="[selected]" @click="handleClick" class="flex-menu">
        <a-menu-item
          @click="toDetail(item.payload.url)"
          class="flex-item"
          :style="{ padding: '0 3px', width: '16.66%' }"
          v-for="item in tabOptions"
          :key="item.value"
        >
          <div class="menu-content">
            <span style="height: 18px">
              <Icon
                style="align-items: center"
                class="vel-icon icon"
                :icon="item.payload.icon"
                size="16"
              />
            </span>
            <span style="height: 20px"> {{ item.payload.subTitle }}</span>
          </div>
        </a-menu-item>
      </a-menu>

      <!-- <a-menu mode="horizontal" :selectedKeys="[selected]" @click="handleClick" class="flex-menu">
        <a-menu-item
          key="mj"
          @click="toDetail('/mmj/index')"
          class="flex-item"
          :style="{ padding: '0 3px' }"
        >
          <div class="menu-content">
            <span style="height: 18px">
              <Icon
                style="align-items: center"
                class="vel-icon icon"
                icon="pepicons-pencil:paint-pallet"
                size="16"
              />
            </span>
            <span style="height: 20px"> 绘画</span>
          </div>
        </a-menu-item>

        <a-menu-item key="collect" @click="toDetail('/collect')" class="flex-item">
          <div class="menu-content">
            <div
              ><Icon
                class="vel-icon icon"
                icon="icon-park-twotone:collect-picture"
                size="16"
              />收藏</div
            >
          </div>
        </a-menu-item>
        <a-menu-item key="chatgpt" @click="toDetail('/chatgpt')" class="flex-item">
          <div class="menu-content">
            <div><Icon class="vel-icon icon" icon="simple-icons:openai" size="16" /> 对话</div>
          </div>
        </a-menu-item>
        <a-menu-item key="public" @click="toDetail('/public')" class="flex-item">
          <div class="menu-content">
            <div><Icon class="vel-icon icon" icon="gis:earth-north" size="16" /> 广场</div>
          </div>
        </a-menu-item>
        <a-menu-item key="example" @click="toDetail('/example')" class="flex-item">
          <div class="menu-content">
            <div
              ><Icon
                class="vel-icon icon"
                icon="streamline:ecology-science-alien-extraterristerial-life-form-space-universe-head"
                size="16"
              />
              案例</div
            >
          </div>
        </a-menu-item>
        <a-menu-item key="accDiscord" @click="toDetail('/accDiscord')" class="flex-item">
          <div class="menu-content">
            <div><Icon class="vel-icon icon" icon="mdi:table-account" size="16" /> 账号</div>
          </div>
        </a-menu-item>
        <a-menu-item key="toolsLink" @click="toDetail('/tools-link')" class="flex-item">
          <div class="menu-content">
            <div><Icon class="vel-icon icon" icon="carbon:task-tools" size="16" />小红书</div>
          </div>
        </a-menu-item>
        <a-menu-item key="setting" @click="toDetail('/setting')" class="flex-item">
          <div class="menu-content">
            <div
              ><Icon class="vel-icon icon" icon="icon-park-twotone:people-safe" size="16" />
              我的</div
            >
          </div>
        </a-menu-item>
      </a-menu> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import Icon from '/@/components/Icon/Icon.vue';

  const go = useGo();
  const { prefixCls } = useDesign('layout-header');
  const { getHeaderTheme } = useHeaderSetting();

  const getHeaderClass = computed(() => {
    const theme = getHeaderTheme.value;
    return [
      prefixCls.value,
      {
        [`${prefixCls.value}--${theme}`]: theme,
      },
    ];
  });

  const selected = ref('');

  const handleClick = (e) => {
    selected.value = e.key;
  };

  const toDetail = (route) => {
    selected.value = route.split('/').pop();
    go(route);
  };

  const changeTab = (value) => {
    // const tab = tabOptions.value.find((tab) => tab.value === value);
    // let url = tab?.payload.url;
    // toDetail(url);
  };

  const tabOptions = ref([
    {
      value: 'index',
      payload: {
        icon: 'pepicons-pencil:paint-pallet',
        url: '/mmj/index',
        subTitle: '绘画',
      },
    },
    {
      value: 'collect',
      payload: {
        icon: 'icon-park-twotone:collect-picture',
        url: '/collect',
        subTitle: '收藏',
      },
    },
    {
      value: 'chatgpt',
      payload: {
        icon: 'simple-icons:openai',
        url: '/chatgpt',
        subTitle: '对话',
      },
    },
    {
      value: 'example',
      payload: {
        icon: 'logos:midjourney',
        url: '/example',
        subTitle: '画廊',
      },
    },
    {
      value: 'accDiscord',
      payload: {
        icon: 'mdi:table-account',
        url: '/accDiscord',
        subTitle: '账号',
      },
    },
    // {
    //   value: 'tools',
    //   payload: {
    //     icon: 'carbon:task-tools',
    //     url: '/tools-link',
    //     subTitle: '工具',
    //   },
    // },
    {
      value: 'setting',
      payload: {
        icon: 'icon-park-twotone:people-safe',
        url: '/setting',
        subTitle: '我的',
      },
    },
  ]);
  const tabValue = ref('index');
</script>

<style>
  .bottom-menu {
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  .flex-menu {
    display: flex;
    z-index: 9999;
    justify-content: space-around;
    height: 55px;
  }

  .flex-item {
    flex-grow: 1;
    text-align: center;
  }

  .menu-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    heigiht: 45px;
  }

  .emoji {
    font-size: 1.5em;
  }
</style>
