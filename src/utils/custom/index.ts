import { Persistent, BasicKeys } from '/@/utils/cache/persistent';
import { CacheTypeEnum, CUSTOM_HOST_KEY } from '/@/enums/cacheEnum';
import projectSetting from '/@/settings/projectSetting';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

export function getCustomHost() {
  return getCustomHostCache(CUSTOM_HOST_KEY);
}

export function getCustomHostCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}

export function setCustomHost(key: BasicKeys, value) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value, true);
}

export function clearCustomHostCache(immediate = true) {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
  return fn(immediate);
}
