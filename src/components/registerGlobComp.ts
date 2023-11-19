import type { App } from 'vue';
import { h, defineComponent } from 'vue';
import { Button } from './Button';
import antd, { Spin } from 'ant-design-vue';
import VXETable from 'vxe-table';
import VueViewer from 'v-viewer';
import VueLazyload from 'vue-lazyload';
import loadimage from '../assets/images/loading.svg';
import errorimage from '../assets/images/failed.svg';
import Icon from '/@/components/Icon/Icon.vue';
import SvgSpinnersBlocksWave from '../assets/images/SvgSpinnersBlocksWave.svg';
import { SvgIcon } from '/@/components/Icon';

export function registerGlobComp(app: App) {
  // Spin.setDefaultIndicator({
  //   indicator: h(SvgIcon, {
  //     name: 'SvgSpinnersBlocksWave',
  //     style: {
  //       fontSize: '54px',
  //     },
  //   }),
  // });
  Spin.setDefaultIndicator({
    indicator: h(
      Icon,
      {
        icon: 'svg-spinners:pulse-rings-multiple',
        style: {
          fontSize: '64px',
        },
      },
      [
        h(
          'span',
          {
            style: {
              color: 'green',
            },
          },
          'Loading...',
        ),
      ],
    ),
  });

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
