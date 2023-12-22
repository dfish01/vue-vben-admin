<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    style="width: 100%; height: 100vh"
    mode="inline"
    :items="items"
    @click="handleClick"
  >
    <template #item="{ item }">
      <a-menu-item :key="item.key">
        <!-- 菜单项的内容 -->
        <template #title>
          <span>
            <a-icon :component="item.icon" />
            {{ item.label }}
          </span>
          <!-- 在这里添加按钮 -->
          <a-button @click="handleButton1(item)">按钮1</a-button>
          <a-button @click="handleButton2(item)">按钮2</a-button>
        </template>
      </a-menu-item>
    </template>
  </a-menu>
</template>

<script>
  export default {
    props: {
      menuItems: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        selectedKeys: [], // Track selected keys if needed
      };
    },
    methods: {
      addItem(item) {
        // Implement add logic
        console.log('Add item for', item);
      },
      removeItem(item) {
        // Implement remove logic
        console.log('Remove item', item);
      },
      editItem(item) {
        // Implement edit logic
        console.log('Edit item', item);
      },
      viewItem(item) {
        // Implement view logic
        console.log('View item', item);
      },
    },
  };
</script>

<style scoped>
  .menu-item-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px; /* Add padding as needed */
  }

  .menu-item-buttons {
    display: flex;
    gap: 8px; /* Adjust the gap as needed */
    align-items: center; /* Align buttons vertically centered */
  }

  /* Additional Styles to Adjust Menu Item Styles */
  a-menu-item {
    margin: 0; /* Remove any default margin */
    padding: 0; /* Reset padding to 0 */
    border-bottom: 1px solid #e8e8e8; /* Add a border for separation, adjust color as needed */
  }

  /* Adjust other styles as needed */
</style>
