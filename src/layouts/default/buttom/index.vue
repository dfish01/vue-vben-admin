<template>
  <div>
    <div class="bottom-menu" :class="getHeaderClass">
      <a-menu mode="horizontal" :selectedKeys="[selected]" @click="handleClick" class="flex-menu">
        <a-menu-item key="mj" @click="toDetail('/mmj/index')" class="flex-item">
          <div class="menu-content">
            <div
              ><Icon class="vel-icon icon" icon="pepicons-pencil:paint-pallet" size="16" />
              绘画</div
            >
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
        <!-- <a-menu-item key="public" @click="toDetail('/public')" class="flex-item">
          <div class="menu-content">
            <div><Icon class="vel-icon icon" icon="gis:earth-north" size="16" /> 广场</div>
          </div>
        </a-menu-item> -->
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
        <!-- 添加更多的 a-menu-item -->
      </a-menu>
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
</script>

<style>
  .bottom-menu {
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  .flex-menu {
    display: flex;
    justify-content: space-around;
    height: 45px;
  }

  .flex-item {
    flex-grow: 1;
    text-align: center;
  }

  .menu-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .emoji {
    font-size: 1.5em;
  }
</style>
