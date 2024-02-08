import { Persistent, BasicKeys } from '/@/utils/cache/persistent';
import { CacheTypeEnum, CUSTOM_HOST_KEY } from '/@/enums/cacheEnum';
import projectSetting from '/@/settings/projectSetting';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.SESSION;

export function getCustomHost() {
  return getCustomCache(CUSTOM_HOST_KEY);
}

export function getCustomCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}

export function setCustomCache(key: BasicKeys, value) {
  console.log('key:' + key + '   value:' + JSON.stringify(value));
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value, true);
}

export function clearCustomCache(immediate = true) {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
  return fn(immediate);
}
/************************* local ******************** */

export function getCustomLocalCache<T>(key: BasicKeys) {
  const fn = Persistent.getLocal;
  return fn(key) as T;
}

export function setCustomLocalCache(key: BasicKeys, value) {
  console.log('key:' + key + '   value:' + JSON.stringify(value));
  const fn = Persistent.setLocal;
  return fn(key, value, true);
}

export function clearCustomLocalCache(immediate = true) {
  const fn = Persistent.clearLocal;
  return fn(immediate);
}
