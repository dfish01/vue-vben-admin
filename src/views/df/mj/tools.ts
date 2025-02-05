import { message } from 'ant-design-vue';
import { unref } from 'vue';
import { copyText as doCopyText } from '/@/utils/copyTextToClipboard';
import { downloadByOnlineUrl } from '/@/utils/file/download';
import { useMessage } from '/@/hooks/web/useMessage';

const { createMessage } = useMessage();

export const handleDownloadByUrl = async (url: string) => {
  const path = url.split('?')[0];
  const segments = path.split('/');
  const fileName = segments[segments.length - 1];
  downloadByOnlineUrl(url, fileName);
  message.success('已添加下载任务~');
};

export const handleDownloadByUrls = async (urls: string[]) => {
  for (const url of urls) {
    const segments = url.split('/');
    const fileName = segments[segments.length - 1];
    downloadByOnlineUrl(url, fileName);
  }
  message.success('已添加下载任务~');
};

//下载文件
export const downloadImage = (image) => {
  const link = document.createElement('a');
  link.href = image.value;
  link.download = '';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

//复制数据
export const copyText = async (text) => {
  const value = unref(text);
  if (!value) {
    message.warning('请输入要拷贝的内容！');
    return;
  }
  doCopyText(value);
};

//图片切割下载
export function splitImage(card) {
  const imageUrl = card.resultImage;

  const image = new Image();
  image.crossOrigin = 'Anonymous'; // 设置跨域属性以允许获取图像数据

  image.onload = () => {
    const canvas = document.createElement('canvas');
    const canvasWidth = image.width / 2; // 根据需求调整分割大小
    const canvasHeight = image.height / 2;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          ctx.drawImage(
            image,
            col * canvasWidth,
            row * canvasHeight,
            canvasWidth,
            canvasHeight,
            0,
            0,
            canvasWidth,
            canvasHeight,
          );

          const dataUrl = canvas.toDataURL();
          const downloadLink = document.createElement('a');
          // 获取原始文件名
          const originalFileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
          // 设置下载链接的文件名，带有索引编号
          downloadLink.href = dataUrl;
          downloadLink.download = `split_image_${originalFileName}_${row * 2 + col + 1}.png`;
          downloadLink.click();
        }
      }
    }
  };
  image.src = imageUrl;
}

export const tagColor = (status) => {
  //状态 PENDING:排队中 EXECUTING:执行中 FINISHED:已完成 FAIL:失败 取消:CANCEL 中断：DOWN
  console.log(status);
  switch (status) {
    case 'SUCCESS':
      return '#339966';
    case 'FAILED':
      return '#cd201f';
    case 'CANCEL':
      return '#faeeef';
    case 'QUEUED':
      return '#b4b4a4';
    case 'RUNNING':
      return '#8cc0aa';
    case 'READY':
      return '#afcce0';
    case 'DOWN':
      return '#e4abb1';
    default:
      return 'default';
  }
};

export const formattedPrompt = (prompt) => {
  const parts = prompt.split('\n\n').filter((part) => part.trim() !== '');
  return parts.map((part) => `<p>${part.trim()}</p>`).join('');
};
export const splitPrompt = (prompt: string) => {
  return prompt.split(/\d️⃣/).filter(Boolean);
};

export const generateTooltipText = (card) => {
  const textArray = [] as string[];
  textArray.push(`创建时间：${card.gmtCreate}`);
  textArray.push(`更新时间：${card.gmtModified}`);
  if (card.gmtStart) {
    textArray.push(`开始时间：${card.gmtStart}`);
  }
  if (card.gmtFinished) {
    textArray.push(`完成时间：${card.gmtFinished}`);
  }

  return textArray;
};
