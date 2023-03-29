import { defineConfig, presetIcons } from 'unocss'
// unocss-applet https://github.com/unocss-applet/unocss-applet
import { presetApplet, presetRemRpx, transformerApplet } from 'unocss-applet'
import { presetAno } from 'ano-ui'

export default defineConfig({
  presets: [
    presetApplet(),
    presetRemRpx(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetAno(),
  ],
  transformers: [
    transformerApplet(),
  ],
})
