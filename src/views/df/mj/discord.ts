import { message } from 'ant-design-vue';
import { ref } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { discordList, channelList, guildList } from '/@/api/df/discord';
import { accountAuthList, queryList, getGroupDiscords } from '/@/api/df/account';

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
    importMode: 'owner',
    spaceCode: null,
    viewFlag: false,
    loading: false,
    maxSubmit: 50,
    accountName: null,
    guildId: null,
    channelId: null,
    discordUserId: null,
    discordUserIds: null,
    discordUserOptions: [] as { label: string; value: string }[],
    guildOptions: [] as { label: string; value: string }[],
    channelOptions: [] as { label: string; value: string }[],
    accountOptions: [] as { label: string; value: string }[],
    modeOptions: [
      {
        value: 'owner',
        payload: {
          title: '当前账号',
        },
      },
      {
        value: 'other',
        payload: {
          title: '其他账号',
        },
      },
    ],
  });

  const showImportView = () => {
    importForm.value.accountName = null;
    importForm.value.maxSubmit = 300;
    importForm.value.guildId = null;
    importForm.value.channelId = null;
    importForm.value.discordUserId = null;
    importForm.value.viewFlag = true;
    importForm.value.discordUserIds = null;
  };

  const onSelectAccount = async (value, option) => {
    if (value === '') {
      importForm.value.channelOptions = [{ label: '请选择导入的服务器', value: '' }];
      importForm.value.channelId = null;
      importForm.value.guildOptions = [{ label: '请选择导入的频道', value: '' }];
      importForm.value.guildId = null;
      importForm.value.discordUserOptions = [{ label: '请选择导入的Discord账号', value: '' }];
      importForm.value.discordUserId = null;
      return;
    }
    importForm.value.channelOptions = [{ label: '请选择导入的频道', value: '' }];
    importForm.value.channelId = null;
    importForm.value.guildOptions = [{ label: '请选择导入的服务器', value: '' }];
    importForm.value.guildId = null;
    importForm.value.discordUserOptions = [{ label: '请选择导入的Discord账号', value: '' }];
    importForm.value.discordUserId = null;

    queryDiscordList(value);
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

  const queryAccountList = async () => {
    // accountForm.value.loading = true;
    try {
      const response = await queryList({ pageSize: 1000, current: 1, ownerFlag: 'Y' });
      // 使用 map 方法转换数组
      const transformedList = response.records.map((item) => ({
        label: item.accountName,
        value: item.id,
      }));
      // 如果您想在转换后的数组前面添加一个特定的对象，可以使用以下方法：
      const finalList = [...transformedList];
      importForm.value.accountOptions = finalList;
    } finally {
      // accountForm.value.loading = false;
    }
  };

  const queryDiscordList = async (id) => {
    importForm.value.loading = true;
    try {
      const response = await getGroupDiscords({ id: id });
      // 使用 map 方法转换数组
      const transformedList = response.map((item) => ({
        label: item.email,
        value: item.id,
      }));
      // 如果您想在转换后的数组前面添加一个特定的对象，可以使用以下方法：
      const finalList = [...transformedList];
      importForm.value.discordUserOptions = finalList;
    } finally {
      importForm.value.loading = false;
    }
  };
  // const queryDiscordList = async (param) => {
  //   importForm.value.loading = true;
  //   try {
  //     const response = await discordList(param);
  //     // 使用 map 方法转换数组
  //     const transformedList = response.map((item) => ({
  //       label: item.globalName,
  //       value: item.id,
  //     }));
  //     // 如果您想在转换后的数组前面添加一个特定的对象，可以使用以下方法：
  //     const finalList = [...transformedList];
  //     importForm.value.discordUserOptions = finalList;
  //   } finally {
  //     importForm.value.loading = false;
  //   }
  // };
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
    onSelectAccount,
    queryDiscordList,
    queryAccountList,
  };

  discordApiInstance = api;
  return discordApiInstance;
}
