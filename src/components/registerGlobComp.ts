import type { App } from 'vue';
import { Button } from './Button';
import antd from 'ant-design-vue';
import VXETable from 'vxe-table';
import VueViewer from 'v-viewer';
import VueLazyload from 'vue-lazyload';
import loadimage from '../assets/images/loading.svg';
import errorimage from '../assets/images/failed.svg';

export function registerGlobComp(app: App) {
  app
    .use(Button)
    .use(antd)
    .use(VueViewer)
    .use(VueLazyload, {
      preLoad: 1.3,
      error: errorimage,
      loading: loadimage,
      attempt: 1,
      lazyComponent: true,
      observer: true,

      // optional
      observerOptions: {
        rootMargin: '0px',
        threshold: 0.1,
      },
    });
}
