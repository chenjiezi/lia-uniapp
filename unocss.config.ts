import {
  defineConfig,
  presetAttributify,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

import {
  presetApplet,
  presetRemRpx,
  transformerApplet,
  transformerAttributify,
} from 'unocss-applet'

import { presetAno } from 'ano-ui'

export default defineConfig({
  shortcuts: {
    btn: 'block bg-gradient-to-r from-indigo-500 to-pink-500 border-none mb-24rpx',
  },
  presets: [
    presetIcons({
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetApplet(),
    presetRemRpx(),
    presetAttributify(),
    presetAno(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
    transformerAttributify(),
    transformerApplet(),
  ],
})
