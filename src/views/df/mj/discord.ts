import { message } from 'ant-design-vue';
import { ref } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { discordList, channelList, guildList } from '/@/api/df/discord';

const { createMessage } = useMessage();

let discordApiInstance: any | null = null;
export const loadingRef = ref(false);

//查询相关API
export function discordApi() {
  if (discordApiInstance) {
    return discordApiInstance;
  }
  const importFormRef = ref();
  const importForm = ref({
    viewFlag: false,
    loading: false,
    numExecute: 50,
    accountName: null,
    guildId: null,
    channelId: null,
    discordUserId: null,
    discordUserIds: null,
    discordUserOptions: [] as { label: string; value: string }[],
    guildOptions: [] as { label: string; value: string }[],
    channelOptions: [] as { label: string; value: string }[],
    accountOptions: [] as { label: string; value: string }[],
  });

  const showImportView = () => {
    importForm.value.accountName = null;
    importForm.value.numExecute = 50;
    importForm.value.guildId = null;
    importForm.value.channelId = null;
    importForm.value.discordUserId = null;
    importForm.value.viewFlag = true;
    importForm.value.discordUserIds = null;
  };

  const handleSelectAccount = async (value, option) => {
    if (value === '') {
      importForm.value.channelOptions = [{ label: '请选择', value: '' }];
      importForm.value.channelId = value;
      return;
    }
    try {
      loadingRef.value = true;
      const resp = await channelList({ id: value });
      // 使用 map 方法转换数组
      const transformedList = resp.map((item) => ({
        label: item.title,
        value: item.channelId,
      }));
      // 如果您想在转换后的数组前面添加一个特定的对象，可以使用以下方法：
      const finalList = [{ label: '请选择频道', value: '' }, ...transformedList];
      importForm.value.channelOptions = finalList;
    } finally {
      loadingRef.value = false;
    }
  };

  const onSelectDiscordUser = async (value, option) => {
    if (value === '') {
      importForm.value.channelOptions = [{ label: '请选择导入的服务器', value: '' }];
      importForm.value.channelId = null;
      importForm.value.guildOptions = [{ label: '请选择导入的频道', value: '' }];
      importForm.value.guildId = null;
      return;
    }
    importForm.value.channelOptions = [{ label: '请选择导入的频道', value: '' }];
    importForm.value.channelId = null;
    importForm.value.guildOptions = [{ label: '请选择导入的服务器', value: '' }];
    importForm.value.guildId = null;

    queryGuildList(value);
  };
  const onSelectGuild = (value, option) => {
    console.log('onSelectGuild');
    if (value === '') {
      importForm.value.channelOptions = [];
      importForm.value.channelId = null;
      return;
    }
    importForm.value.channelOptions = [];
    importForm.value.channelId = null;
    queryChannelList(value);
  };
  const queryDiscordList = async (param) => {
    // accountForm.value.loading = true;
    try {
      const response = await discordList(param);
      // 使用 map 方法转换数组
      const transformedList = response.map((item) => ({
        label: item.globalName,
        value: item.id,
      }));
      // 如果您想在转换后的数组前面添加一个特定的对象，可以使用以下方法：
      const finalList = [...transformedList];
      importForm.value.discordUserOptions = finalList;
    } finally {
      // accountForm.value.loading = false;
    }
  };
  const queryGuildList = async (discordUserId) => {
    importForm.value.loading = true;
    try {
      const response = await guildList({ id: discordUserId });
      // 使用 map 方法转换数组
      const transformedList = response.map((item) => ({
        label: item.title,
        value: item.id,
      }));
      // 如果您想在转换后的数组前面添加一个特定的对象，可以使用以下方法：
      const finalList = [...transformedList];
      importForm.value.guildOptions = finalList;
    } finally {
      importForm.value.loading = false;
    }
  };
  const queryChannelList = async (guildId) => {
    importForm.value.loading = true;
    try {
      const response = await channelList({ id: guildId });
      // 使用 map 方法转换数组
      const transformedList = response.map((item) => ({
        label: item.title,
        value: item.id,
      }));
      // 如果您想在转换后的数组前面添加一个特定的对象，可以使用以下方法：
      const finalList = [...transformedList];
      importForm.value.channelOptions = finalList;
    } finally {
      importForm.value.loading = false;
    }
  };

  const api = {
    importFormRef,
    importForm,
    showImportView,
    onSelectDiscordUser,
    onSelectGuild,
    queryDiscordList,
  };

  discordApiInstance = api;
  return discordApiInstance;
}
