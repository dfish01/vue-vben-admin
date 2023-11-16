import { message } from 'ant-design-vue';
import { ref } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { discordList, channelList, guildList } from '/@/api/df/discord';

const { createMessage } = useMessage();

let chatgptApiInstance: any | null = null;
export const loadingRef = ref(false);

//查询相关API
export function chatgptApi() {
  if (chatgptApiInstance) {
    return chatgptApiInstance;
  }
  const accountFormRef = ref();
  const accountForm = ref({
    accountName: '',
    id: '',
    password: '',
    mfaCode: '',
    viewFlag: false,
    loading: false,
  });

  const onAdd = () => {
    accountForm.value.accountName = null;
    accountForm.value.password = null;
    accountForm.value.mfaCode = null;
    accountForm.value.viewFlag = true;
  };

  const api = {
    accountFormRef,
    accountForm,
    onAdd,
    onSelectDiscordUser,
    onSelectGuild,
    queryDiscordList,
  };

  chatgptApiInstance = api;
  return chatgptApiInstance;
}
