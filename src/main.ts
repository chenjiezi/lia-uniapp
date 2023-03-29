import { createSSRApp } from 'vue'
import App from './App.vue'

import 'uno.css'
import { setupPinia } from './modules/pinia'

export function createApp() {
  const app = createSSRApp(App)

  setupPinia(app)

  return {
    app,
  }
}
