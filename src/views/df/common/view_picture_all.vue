<template>
 <div v-if="card.state === 'QUEUED'" class="mask-queued label-front">
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              "
            >
              <span>
                <Icon icon="line-md:coffee-loop" size="70" color="#91C8E4" />
              </span>
              <span> 正在排队中... </span>
            </div>
          </div>
          <div v-if="card.state === 'RUNNING'" class="mask-queued label-front">
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              "
            >
              <span>
                <Icon icon="line-md:coffee-half-empty-twotone-loop" size="70" color="#749BC2" />
              </span>
              <span> {{ card.mjExecute === 'N' ? '正在执行中...' : card.process ? 'MJ正在绘画中(' + card.process + ')...' : 'MJ正在绘画中...'  }}  </span>
            </div>
          </div>
          <div v-if="card.state === 'FAILED'" class="mask-queued label-front">
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              "
              class="error-text"
            >
              <span>
                <Icon icon="carbon:face-dizzy-filled" size="60" color="#FF6969" />
              </span>
              <span v-if="card.failMsg" style="margin-top: 10px"> {{ card.failMsg }} </span>
              <span v-else> 执行失败</span>
            </div>
          </div>
          <!--定义图片宽度与高度-->
          <div v-if="card.state === 'SUCCESS'" class="card-image-square" style="">
            <div v-if="userSetting.cardShow === 'MULTI'">
              <!-- 4图展示场景 -->
              <div
                :bodyStyle="{ padding: '0px' }"
                class="my-transparent-card card-image-square-content"
                style=" display:flex; flex-wrap: wrap;width: 100%; height: 100%;border: none; background: transparent; "
                v-if="card.taskImage.infoImageList.length > 1"
                :bordered="false"
                :hoverable="false"
              >
                <div
                  v-for="infoImage in card.taskImage.infoImageList"
                  :key="infoImage.url"
                  :bordered="false"
                  :hoverable="false"
                  style="
                    position: relative;
                    width: 50%;
                    height:50%;
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                    border-radius: 9px;
                    text-align: center;
                  "
                >
                  <img
                    @mouseenter="moveIn(infoImage)"
                    @mouseleave="moveOut(infoImage)"
                    @click="showInfoImage(getImageList(card), infoImage.url)"
                    v-lazy.container="infoImage.mediaUrl"
                    style="max-width: 100%;height:100%;object-fit: cover; transition: transform 0.3s ease; border-radius: 9px"
                    alt=""
                    @load="imageLoaded(infoImage)"
                    :class="{ 'item-selected': infoImage && infoImage.enterFlag }"
                  />
                </div>
              </div>
              <div
                :bodyStyle="{ padding: '0px' }"
                style="width: 100%; height:100%"
                :bordered="false"
                :hoverable="false"
                class="my-transparent-card card-image-square-content"
                v-else
                >
                <div
                    v-for="infoImage in card.taskImage.infoImageList"
                    :key="infoImage.url"
                    :bordered="false"
                    :hoverable="false"
                    style="
                        position: relative; /* 添加相对定位 */
                        width: 100%;
                        height: 100%;
                        padding: 0;
                        overflow: hidden;
                        border-radius: 9px;
                        text-align: center;
                    "
                >
                    <img
                        @mouseenter="moveIn(infoImage)"
                        @mouseleave="moveOut(infoImage)"
                        @click="showInfoImage(getImageList(card), infoImage.url)"
                        v-lazy.container="infoImage.mediaUrl"
                        style="
                            position: absolute; /* 设置绝对定位 */
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            transition: transform 0.3s ease;
                            border-radius: 9px;
                            object-fit: cover; /* 图片按比例填充容器 */
                        "
                        alt=""
                        @load="imageLoaded(card)"
                        :class="{ 'item-selected': infoImage && infoImage.enterFlag }"
                    />
                </div>
              </div>
            </div>
            <!-- 使用discord 图片地址场景 -->
            <div v-else>
              <div
                class="my-transparent-card card-image-square-content"
                style="width: 100%; overflow: hidden; border: none; background: transparent"
              >
                <img
                  @mouseenter="card.taskImage.enterFlag = true"
                  @mouseleave="card.taskImage.enterFlag = false"
                  @click="showInfoImage([card.taskImage.imageUrl], card.taskImage.imageUrl)"
                  v-lazy.container="card.taskImage.mediaImageUrl"
                  fallback=""
                  alt=""
                  style="min-width: 100%; min-height: 100%; object-fit: cover; transition: transform 0.3s ease; border-radius: 9px"
                  @load="imageLoaded(card)"
                  :class="{ 'item-selected': card.taskImage && card.taskImage.enterFlag }"
                />
              </div>
            </div>
          </div>
</template>

<script lang="ts" setup>
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { defineProps, toRefs } from 'vue';
  import VueLazyload from 'vue-lazyload';
  import { api as viewerApi } from 'v-viewer';

  // 定义子组件的props
  const props = defineProps({
    card: {
      type: Object ,
      required: true
    },
    userSetting:{
      type: Object ,
      required: true
    }
  });
  const { card, userSetting } = toRefs(props);
  const imageLoaded = async (card) => {
    card.loaded = true;
  };

  
  function showInfoImage(infoImageList, showUrl) {
    // 检查数组中是否存在 showUrl
    const showUrlIndex = infoImageList.findIndex((url) => url === showUrl);
    let imageList = infoImageList;
    // 如果存在，则创建一个新数组，将 showUrl 放在第一个位置，其余元素按原顺序添加
    if (showUrlIndex !== -1) {
      imageList = [
        showUrl,
        ...infoImageList.slice(showUrlIndex + 1),
        ...infoImageList.slice(0, showUrlIndex),
      ];
    }

    // 如果不存在 showUrl，则返回原数组
    viewerApi({ images: imageList });
  }
  const getImageList = (card) => {
    return card.taskImage.infoImageList.map((item) => item.url);
  };
  const moveIn = (imageInfo) => {
    imageInfo.enterFlag = true;
  };
  const moveOut = (imageInfo) => {
    imageInfo.enterFlag = false;
  };
</script>

<style scoped>
  .mask-queued {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 250px;
  border-radius: 7%;
  font-size: 12px; /* 保留被使用到的字体大小 */
}

.error-text {
  max-width: 80%;
  font-size: 12px;
  white-space: normal;
}

.card-image img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 7%;
}

.card-image-square {
  position: relative;
  width: 100%;
  padding-top: 100%;
}

.card-image-square-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.item-selected {
  transform: scale(1.1);
}
</style>

