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
  const accountFormRef = ref();
  const accountForm = ref({
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
    discordFilterUserOptions: [] as { label: string; value: string }[],
  });

  const onAdd = () => {
    accountForm.value.accountName = null;
    accountForm.value.numExecute = 50;
    accountForm.value.guildId = null;
    accountForm.value.channelId = null;
    accountForm.value.discordUserId = null;
    accountForm.value.viewFlag = true;
    accountForm.value.discordUserIds = null;
  };

  const onSelectDiscordUser = async (value, option) => {
    if (value === '') {
      accountForm.value.channelOptions = [{ label: '请选择执行服务器', value: '' }];
      accountForm.value.channelId = null;
      accountForm.value.guildOptions = [{ label: '请选择默认频道', value: '' }];
      accountForm.value.guildId = null;
      return;
    }
    accountForm.value.channelOptions = [{ label: '请选择默认频道', value: '' }];
    accountForm.value.channelId = null;
    accountForm.value.guildOptions = [{ label: '请选择执行服务器', value: '' }];
    accountForm.value.guildId = null;

    queryGuildList(value);
  };
  const onSelectGuild = (value, option) => {
    console.log('onSelectGuild');
    if (value === '') {
      accountForm.value.channelOptions = [];
      accountForm.value.channelId = null;
      return;
    }
    accountForm.value.channelOptions = [];
    accountForm.value.channelId = null;
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
      accountForm.value.discordUserOptions = finalList;
    } finally {
      // accountForm.value.loading = false;
    }
  };
  const queryGuildList = async (discordUserId) => {
    accountForm.value.loading = true;
    try {
      const response = await guildList({ id: discordUserId });
      // 使用 map 方法转换数组
      const transformedList = response.map((item) => ({
        label: item.title,
        value: item.id,
      }));
      // 如果您想在转换后的数组前面添加一个特定的对象，可以使用以下方法：
      const finalList = [...transformedList];
      accountForm.value.guildOptions = finalList;
    } finally {
      accountForm.value.loading = false;
    }
  };
  const queryChannelList = async (guildId) => {
    accountForm.value.loading = true;
    try {
      const response = await channelList({ id: guildId });
      // 使用 map 方法转换数组
      const transformedList = response.map((item) => ({
        label: item.title,
        value: item.id,
      }));
      // 如果您想在转换后的数组前面添加一个特定的对象，可以使用以下方法：
      const finalList = [...transformedList];
      accountForm.value.channelOptions = finalList;
    } finally {
      accountForm.value.loading = false;
    }
  };

  const api = {
    accountFormRef,
    accountForm,
    onAdd,
    onSelectDiscordUser,
    onSelectGuild,
    queryDiscordList,
  };

  discordApiInstance = api;
  return discordApiInstance;
}
